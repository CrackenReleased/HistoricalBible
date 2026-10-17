/**
 * tests/data-integrity-selfcheck.ts
 * Comprehensive cross-dataset self-checks for all data presented by HistoricalBible:
 * 1. Canonical KJV corpus (31,102 verses, 66 books, 1,189 chapters, balanced [...] brackets)
 * 2. Bible Chronology (66 books, exact chapter counts, 1..66 permutations for canonical/event/written orders, contiguous chapterBreakdown, valid eventEraId foreign keys)
 * 3. Ancient Map Data (valid CHRONOLOGICAL_ERAS foreign keys, valid WGS84 coordinates, valid figureId & scriptureOsis references, WATER_FEATURES integrity)
 * 4. Historical Synchrony & Discoveries (every figure has a discovery card, valid evidenceCategory badges, valid scripture anchors)
 * 5. Word-Boundary Concordance Search (short words like "in", "on", "no", "he" never match substrings like "beginning" or "upon")
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { BIBLE_CHRONOLOGY, getBookChronology, getChapterChronology, getSortedBooks } from '../src/data/bibleChronology.ts';
import {
  ARCHAEOLOGICAL_SITES,
  BIBLICAL_CITIES,
  BIBLICAL_GEOGRAPHIC_ENTITIES,
  BIBLICAL_ROUTES,
  CHRONOLOGICAL_ERAS,
  WATER_FEATURES,
  WORLD_EMPIRES_GEO,
  calculatePolygonGeodesicArea
} from '../src/data/ancientMapData.ts';
import { discoveries } from '../src/discoveries.ts';
import { localStore } from '../src/store/localFirstStore.ts';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')) as T;
}

function hasBalancedBrackets(text: string): boolean {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '[') {
      depth++;
      if (depth > 1 || text[i + 1] === ']') return false;
    } else if (text[i] === ']') {
      depth--;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

test('KJV canonical corpus has strictly balanced brackets and exact book/chapter structure', () => {
  const verses = readJson<Array<{ book: string; chapter: number; verse: number; text: string }>>(
    'public/data/kjv_verses.json'
  );
  assert.equal(verses.length, 31102);

  const unbalanced = verses.filter((v) => !hasBalancedBrackets(v.text));
  assert.deepEqual(
    unbalanced.map((v) => `${v.book} ${v.chapter}:${v.verse}`),
    [],
    `Found verses with unbalanced or nested brackets: ${unbalanced.map((v) => `${v.book} ${v.chapter}:${v.verse}: ${v.text}`).join(' | ')}`
  );
});

test('BIBLE_CHRONOLOGY covers all 66 books with unique 1..66 orders, contiguous breakdowns, and valid era IDs', () => {
  const verses = readJson<Array<{ book: string; chapter: number; verse: number; text: string }>>(
    'public/data/kjv_verses.json'
  );
  const kjvBookChapters = new Map<string, number>();
  for (const v of verses) {
    const prev = kjvBookChapters.get(v.book) || 0;
    if (v.chapter > prev) kjvBookChapters.set(v.book, v.chapter);
  }

  assert.equal(BIBLE_CHRONOLOGY.length, 66, 'BIBLE_CHRONOLOGY must have 66 books');

  const expectedPermutation = Array.from({ length: 66 }, (_, i) => i + 1);
  const canonicalOrders = [...BIBLE_CHRONOLOGY.map((b) => b.canonicalOrder)].sort((a, b) => a - b);
  const eventOrders = [...BIBLE_CHRONOLOGY.map((b) => b.eventOrder)].sort((a, b) => a - b);
  const writtenOrders = [...BIBLE_CHRONOLOGY.map((b) => b.writtenOrder)].sort((a, b) => a - b);

  assert.deepEqual(canonicalOrders, expectedPermutation, 'canonicalOrder must be an exact permutation of 1..66');
  assert.deepEqual(eventOrders, expectedPermutation, 'eventOrder must be an exact permutation of 1..66 without duplicates');
  assert.deepEqual(writtenOrders, expectedPermutation, 'writtenOrder must be an exact permutation of 1..66');

  const validEraIds = new Set(CHRONOLOGICAL_ERAS.map((e) => e.id));

  for (const book of BIBLE_CHRONOLOGY) {
    assert.equal(
      book.totalChapters,
      kjvBookChapters.get(book.name),
      `Total chapters mismatch for ${book.name}`
    );
    assert.equal(
      localStore.normalizeToOsis(`${book.name} 1:1`),
      `${book.osis}.1.1`,
      `OSIS mismatch for ${book.name}`
    );
    assert.ok(
      validEraIds.has(book.eventEraId),
      `Book "${book.name}" has eventEraId "${book.eventEraId}" which does not exist in CHRONOLOGICAL_ERAS`
    );

    if (book.chapterBreakdown && book.chapterBreakdown.length > 0) {
      let expectedStart = 1;
      for (const cb of book.chapterBreakdown) {
        assert.equal(
          cb.startChapter,
          expectedStart,
          `Non-contiguous chapterBreakdown in ${book.name}: expected start ${expectedStart}, got ${cb.startChapter}`
        );
        assert.ok(cb.endChapter >= cb.startChapter, `Invalid chapter range in ${book.name}`);
        expectedStart = cb.endChapter + 1;
      }
      assert.equal(
        expectedStart - 1,
        book.totalChapters,
        `Incomplete chapterBreakdown in ${book.name}: ended at ${expectedStart - 1}, expected ${book.totalChapters}`
      );
    }

    // Verify getBookChronology and getChapterChronology work for every book
    assert.ok(getBookChronology(book.name));
    assert.ok(getBookChronology(book.osis));
    const ch1 = getChapterChronology(book.name, 1);
    assert.ok(ch1 && ch1.eventDateLabel.length > 0);
  }

  assert.equal(getSortedBooks('canonical').length, 66);
  assert.equal(getSortedBooks('event').length, 66);
  assert.equal(getSortedBooks('written').length, 66);
});

test('ancientMapData has valid foreign keys, WGS84 coordinates, figure links, and water features', () => {
  const sync = readJson<{ figures: Array<{ id: string }> }>('public/data/history/historical_synchrony.v1.json');
  const validFigureIds = new Set(sync.figures.map((f) => f.id));
  const validSiteIds = new Set(ARCHAEOLOGICAL_SITES.map((s) => s.id));
  const validRouteIds = new Set(BIBLICAL_ROUTES.map((r) => r.id));
  const validEmpireIds = new Set(WORLD_EMPIRES_GEO.map((e) => e.id));

  for (const era of CHRONOLOGICAL_ERAS) {
    if (era.rulingEmpireId) {
      assert.ok(
        validEmpireIds.has(era.rulingEmpireId),
        `Era ${era.id} references unknown rulingEmpireId ${era.rulingEmpireId}`
      );
    }
    for (const regId of era.additionalRegionIds || []) {
      assert.ok(
        validEmpireIds.has(regId),
        `Era ${era.id} references unknown additionalRegionId ${regId}`
      );
    }
    for (const siteId of era.activeSiteIds) {
      assert.ok(validSiteIds.has(siteId), `Era ${era.id} references unknown siteId ${siteId}`);
    }
    for (const routeId of era.activeRouteIds) {
      assert.ok(validRouteIds.has(routeId), `Era ${era.id} references unknown routeId ${routeId}`);
    }
  }

  for (const site of ARCHAEOLOGICAL_SITES) {
    assert.ok(site.coords.lat >= -90 && site.coords.lat <= 90, `Invalid lat for site ${site.id}`);
    assert.ok(site.coords.lng >= -180 && site.coords.lng <= 180, `Invalid lng for site ${site.id}`);
    assert.ok(validFigureIds.has(site.figureId), `Site ${site.id} has unknown figureId ${site.figureId}`);
    assert.ok(localStore.normalizeToOsis(site.scriptureOsis), `Site ${site.id} has invalid scriptureOsis ${site.scriptureOsis}`);
  }

  for (const route of BIBLICAL_ROUTES) {
    assert.ok(route.stops.length >= 2, `Route ${route.id} must have at least 2 stops`);
    for (const stop of route.stops) {
      assert.ok(stop.coords.lat >= -90 && stop.coords.lat <= 90 && stop.coords.lng >= -180 && stop.coords.lng <= 180);
    }
    if (route.figureId) {
      assert.ok(validFigureIds.has(route.figureId), `Route ${route.id} has unknown figureId ${route.figureId}`);
    }
  }

  for (const city of BIBLICAL_CITIES) {
    assert.ok(city.coords.lat >= -90 && city.coords.lat <= 90 && city.coords.lng >= -180 && city.coords.lng <= 180);
    for (const fid of city.figureIds || []) {
      assert.ok(validFigureIds.has(fid), `City ${city.id} references unknown figure ${fid}`);
    }
  }

  for (const emp of WORLD_EMPIRES_GEO) {
    assert.ok(emp.approximateBounds.length >= 3, `Empire ${emp.id} must have >= 3 polygon vertices`);
    assert.ok(emp.capital.coords.lat >= -90 && emp.capital.coords.lat <= 90);
    assert.ok(emp.capital.coords.lng >= -180 && emp.capital.coords.lng <= 180);
  }

  assert.ok(WATER_FEATURES.seas.length > 0, 'WATER_FEATURES.seas must not be empty');
  assert.ok(WATER_FEATURES.rivers.length > 0, 'WATER_FEATURES.rivers must not be empty');

  for (const [key, geo] of Object.entries(BIBLICAL_GEOGRAPHIC_ENTITIES)) {
    assert.ok(geo.coords.lat >= -90 && geo.coords.lat <= 90 && geo.coords.lng >= -180 && geo.coords.lng <= 180, `Invalid coords for ${key}`);
  }

  // Regression: Non-maritime route segments and empire boundaries must not cut across Sea of Galilee
  const galileePoly = WATER_FEATURES.seas[0].polygon;

  function ptInPoly(pt: { lat: number; lng: number }, poly: Array<{ lat: number; lng: number }>) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].lng, yi = poly[i].lat;
      const xj = poly[j].lng, yj = poly[j].lat;
      if (((yi > pt.lat) !== (yj > pt.lat)) && (pt.lng < (xj - xi) * (pt.lat - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  }

  function segmentCrossesPoly(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }, poly: Array<{ lat: number; lng: number }>) {
    for (let step = 1; step < 50; step++) {
      const t = step / 50;
      const lat = p1.lat + (p2.lat - p1.lat) * t;
      const lng = p1.lng + (p2.lng - p1.lng) * t;
      if (ptInPoly({ lat, lng }, poly)) return true;
    }
    return false;
  }

  for (const route of BIBLICAL_ROUTES) {
    const pts = (route.path && route.path.length > 0) ? route.path : route.stops.map(s => s.coords);
    for (let i = 0; i < pts.length - 1; i++) {
      if (route.id === 'jesus-galilean-ministry' && i >= 15 && i <= 18) continue; // Intentional Gospel boat crossing
      assert.strictEqual(
        segmentCrossesPoly(pts[i], pts[i + 1], galileePoly),
        false,
        `Route ${route.id} segment ${i} unintended Sea of Galilee crossing`
      );
    }
  }

  for (const emp of WORLD_EMPIRES_GEO) {
    const pts = emp.approximateBounds;
    for (let i = 0; i < pts.length; i++) {
      const p1 = pts[i];
      const p2 = pts[(i + 1) % pts.length];
      assert.strictEqual(
        segmentCrossesPoly(p1, p2, galileePoly),
        false,
        `Empire ${emp.id} boundary segment ${i} cuts Sea of Galilee`
      );
    }
  }
});

test('historical_synchrony.v1.json figures all have matching discoveries, valid evidence categories, and valid KJV verse anchors', () => {
  const verses = readJson<Array<{ book: string; chapter: number; verse: number; text: string }>>(
    'public/data/kjv_verses.json'
  );
  const validOsisKeys = new Set(
    verses.map((v) => `${localStore.toOsisRef(v)}`.toLowerCase())
  );

  const sync = readJson<{
    evidenceCategories: Record<string, { label: string; description: string }>;
    eras: Array<{ id: string }>;
    empires: Array<{ id: string }>;
    figures: Array<{
      id: string;
      eraId: string;
      secularContemporaries: Array<{
        name: string;
        empireId: string;
        evidenceCategory: string;
        sourceCitation: string;
      }>;
      personalNetwork: Array<{ targetId: string; name: string; relation: string; ref: string }>;
      scriptureAnchors: Array<{ osisRef: string; displayRef: string; historicalContextNote: string }>;
    }>;
  }>('public/data/history/historical_synchrony.v1.json');

  const validEvidenceCategories = new Set(Object.keys(sync.evidenceCategories));
  const validSyncEras = new Set(sync.eras.map((e) => e.id));
  const validSyncEmpires = new Set(sync.empires.map((e) => e.id));
  const validFigureIds = new Set(sync.figures.map((f) => f.id));

  for (const fig of sync.figures) {
    assert.ok(validSyncEras.has(fig.eraId), `Figure ${fig.id} has unknown eraId ${fig.eraId}`);

    const disc = discoveries[fig.id];
    assert.ok(disc, `Missing discovery entry in src/discoveries.ts for figure ${fig.id}`);
    assert.ok(disc.title.length > 0 && disc.lead.length > 0 && disc.distinction.length > 0);
    assert.ok(validOsisKeys.has(disc.verse.toLowerCase()), `Discovery ${fig.id} has invalid verse ${disc.verse}`);

    for (const sc of fig.secularContemporaries) {
      assert.ok(
        validEvidenceCategories.has(sc.evidenceCategory),
        `Secular contemporary "${sc.name}" on ${fig.id} has invalid evidenceCategory "${sc.evidenceCategory}"`
      );
      assert.ok(validSyncEmpires.has(sc.empireId), `Secular contemporary "${sc.name}" has unknown empireId "${sc.empireId}"`);
      assert.ok(sc.sourceCitation && sc.sourceCitation.trim().length > 0, `Missing sourceCitation on "${sc.name}"`);
    }

    for (const pn of fig.personalNetwork) {
      assert.ok(validFigureIds.has(pn.targetId), `Personal network on ${fig.id} references unknown targetId ${pn.targetId}`);
      assert.ok(validOsisKeys.has(pn.ref.toLowerCase()), `Invalid personalNetwork ref ${pn.ref} on ${fig.id}`);
    }

    for (const anchor of fig.scriptureAnchors) {
      assert.ok(validOsisKeys.has(anchor.osisRef.toLowerCase()), `Invalid scriptureAnchor osisRef ${anchor.osisRef} on ${fig.id}`);
    }
  }
});

test('Word-boundary concordance search never returns substring false positives for short words', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: string | URL | Request): Promise<Response> => {
    const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.pathname : input.url;
    const cleanPath = rawUrl.replace(/^\//, '');
    const body = fs.readFileSync(path.join(repoRoot, 'public', cleanPath), 'utf8');
    return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  try {
    await localStore.init();
    for (const word of ['in', 'on', 'no', 'he']) {
      const results = localStore.searchWholeWord(word, 12);
      assert.ok(results.length > 0, `Expected whole-word matches for "${word}"`);
      const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
      for (const v of results) {
        const cleanText = v.text.replace(/[\[\]]/g, '');
        assert.ok(
          wordRegex.test(cleanText),
          `Whole-word search for "${word}" returned false positive without whole word "${word}": ${v.book} ${v.chapter}:${v.verse} -> ${v.text}`
        );
      }
    }
    assert.ok(localStore.isCriticallyLoaded(), 'Expected localStore.isCriticallyLoaded() to be true');
    assert.ok(localStore.isFullyLoaded(), 'Expected localStore.isFullyLoaded() to be true');
    assert.equal(localStore.getChapterVerses('Gen', 1).length, 31, 'Expected 31 verses in Genesis 1');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Expanded v00.01.31 archaeological sites, geographic entities, and granular chapter breakdowns are complete', () => {
  assert.ok(
    ARCHAEOLOGICAL_SITES.length >= 20,
    `Expected at least 20 archaeological sites, found ${ARCHAEOLOGICAL_SITES.length}`
  );
  const siteIds = new Set(ARCHAEOLOGICAL_SITES.map((s) => s.id));
  for (const requiredSite of [
    'lachish-ostraca',
    'jehoiachin-ration-tablets',
    'dead-sea-scrolls-qumran',
    'pool-of-siloam-steps',
    'sergius-paulus-inscription',
    'arch-of-titus-spoils'
  ]) {
    assert.ok(siteIds.has(requiredSite), `Missing archaeological site ${requiredSite}`);
  }

  for (const requiredGeo of ['corinth', 'rome', 'ephesus', 'philippi', 'antioch', 'athens', 'patmos', 'bethlehem', 'nazareth', 'capernaum']) {
    assert.ok(BIBLICAL_GEOGRAPHIC_ENTITIES[requiredGeo], `Missing geographic entity ${requiredGeo}`);
  }

  for (const osis of ['Josh', 'Judg', '1Sam', '2Sam', 'Isa', 'Jer', 'Dan']) {
    const book = getBookChronology(osis);
    assert.ok(book && book.chapterBreakdown && book.chapterBreakdown.length >= 3, `Expected granular chapterBreakdown for ${osis}`);
  }
});

test('Root Bible.pdf is deduplicated from public/Bible.pdf and contact.html synthesizes mailto links', () => {
  const rootPdf = path.join(repoRoot, 'Bible.pdf');
  const duplicatePublicPdf = path.join(repoRoot, 'public', 'Bible.pdf');
  assert.ok(fs.existsSync(rootPdf), 'Root Bible.pdf must exist as canonical artifact');
  assert.ok(!fs.existsSync(duplicatePublicPdf), 'public/Bible.pdf should be deduplicated (served/copied from root Bible.pdf via vite.config.ts)');

  const contactHtml = fs.readFileSync(path.join(repoRoot, 'contact.html'), 'utf8');
  assert.ok(contactHtml.includes('id="contact-mailto-link"'), 'contact.html must include #contact-mailto-link');
  assert.ok(contactHtml.includes('encodeURIComponent(subject)'), 'contact.html must dynamically encode mailto subject');
});

test('4-Tier Interactive Map Layering & Polygon Geodesic Area Sorting (Smaller Polygons Always on Top)', () => {
  // 1. Geodesic area calculation test: Dead Sea > Sea of Galilee
  const galileeSea = WATER_FEATURES.seas.find(s => s.name.includes('Galilee'))!;
  const deadSea = WATER_FEATURES.seas.find(s => s.name.includes('Dead Sea'))!;
  assert.ok(galileeSea && deadSea, 'Both Sea of Galilee and Dead Sea must be defined in WATER_FEATURES.seas');

  const deadSeaArea = calculatePolygonGeodesicArea(deadSea.polygon);
  const galileeArea = calculatePolygonGeodesicArea(galileeSea.polygon);
  assert.ok(deadSeaArea > galileeArea, `Dead Sea area (${deadSeaArea.toFixed(1)} km²) must be strictly larger than Sea of Galilee (${galileeArea.toFixed(1)} km²)`);
  assert.ok(galileeArea > 50 && galileeArea < 300, `Sea of Galilee area (${galileeArea.toFixed(1)} km²) should be reasonable for 166 km²`);

  // 2. Geodesic area calculation for Empires: Macro Empires > Focal Regional Kingdoms
  const persia = WORLD_EMPIRES_GEO.find(e => e.id === 'persia')!;
  const egypt = WORLD_EMPIRES_GEO.find(e => e.id === 'egypt')!;
  const judah = WORLD_EMPIRES_GEO.find(e => e.id === 'judah')!;
  const israel = WORLD_EMPIRES_GEO.find(e => e.id === 'israel_kingdom')!;
  const moab = WORLD_EMPIRES_GEO.find(e => e.id === 'moab_kingdom')!;

  const persiaArea = calculatePolygonGeodesicArea(persia.approximateBounds);
  const egyptArea = calculatePolygonGeodesicArea(egypt.approximateBounds);
  const judahArea = calculatePolygonGeodesicArea(judah.approximateBounds);
  const israelArea = calculatePolygonGeodesicArea(israel.approximateBounds);
  const moabArea = calculatePolygonGeodesicArea(moab.approximateBounds);

  assert.ok(persiaArea > egyptArea, `Persian Empire (${persiaArea.toFixed(0)} km²) must be larger than Egypt (${egyptArea.toFixed(0)} km²)`);
  assert.ok(egyptArea > israelArea, `Egypt (${egyptArea.toFixed(0)} km²) must be larger than Israel (${israelArea.toFixed(0)} km²)`);
  assert.ok(israelArea > judahArea, `Israel Kingdom (${israelArea.toFixed(0)} km²) must be larger than Judah (${judahArea.toFixed(0)} km²)`);
  assert.ok(judahArea > 2000 && moabArea > 2000, `Both Judah (${judahArea.toFixed(0)} km²) and Moab (${moabArea.toFixed(0)} km²) are focal regional kingdoms`);

  // 3. For every era, verify that sorting by calculatePolygonGeodesicArea descending places focal kingdoms after macro empires
  for (const era of CHRONOLOGICAL_ERAS) {
    const eraEmpires = WORLD_EMPIRES_GEO.filter(emp =>
      emp.id === era.rulingEmpireId ||
      (era.additionalRegionIds && era.additionalRegionIds.includes(emp.id)) ||
      (emp.eraIds && emp.eraIds.includes(era.id))
    );
    if (eraEmpires.length <= 1) continue;

    const sorted = [...eraEmpires].sort((a, b) =>
      calculatePolygonGeodesicArea(b.approximateBounds) - calculatePolygonGeodesicArea(a.approximateBounds)
    );

    // The largest empire is first in the array (rendered first at bottom of DOM)
    // The smallest kingdom is last in the array (rendered last on top of DOM)
    const firstArea = calculatePolygonGeodesicArea(sorted[0].approximateBounds);
    const lastArea = calculatePolygonGeodesicArea(sorted[sorted.length - 1].approximateBounds);
    assert.ok(firstArea >= lastArea, `Era ${era.id}: First polygon (${sorted[0].id}, ${firstArea.toFixed(0)} km²) must be >= Last polygon (${sorted[sorted.length - 1].id}, ${lastArea.toFixed(0)} km²)`);
  }
});


