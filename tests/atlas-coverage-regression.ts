import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { LocalFirstStore } from '../src/store/localFirstStore.ts';
import { BIBLICAL_ROUTES, ARCHAEOLOGICAL_SITES, CHRONOLOGICAL_ERAS, GRANULAR_TIMELINE_FILTERS, WORLD_EMPIRES_GEO } from '../src/data/ancientMapData.ts';
import { ATLAS_STORIES, ATLAS_STORY_PERIODS } from '../src/data/atlasStories.ts';

test('atlas Scripture search reaches all books, minor names, references and every result page', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async input => new Response(await readFile(new URL(`../public${input}`, import.meta.url), 'utf8'));
  try {
    const store = new LocalFirstStore();
    await store.initCritical();
    const source = JSON.parse(await readFile(new URL('../public/data/kjv_verses.json', import.meta.url), 'utf8'));
    assert.equal(new Set(ATLAS_STORIES.map(story => story.id)).size, ATLAS_STORIES.length);
    const periods = [...CHRONOLOGICAL_ERAS, ...ATLAS_STORY_PERIODS].map(period => period.id);
    for (const story of ATLAS_STORIES) {
      assert.ok(store.getVerseByOsis(story.ref), story.id);
      assert.ok(periods.includes(story.eraId), story.eraId);
      if (story.routeId) assert.ok(BIBLICAL_ROUTES.find(route => route.id === story.routeId)?.stops[story.stopIndex ?? 0], story.id);
    }
    for (const item of [...BIBLICAL_ROUTES.flatMap(route => [route, ...route.stops]), ...ARCHAEOLOGICAL_SITES]) {
      assert.ok(store.getVerseByOsis(item.scriptureOsis), `atlas reference resolves: ${item.scriptureOsis}`);
    }
    for (const book of new Set<string>(source.map(v => v.book))) {
      const result = store.searchScripture(`${book} 1:1`);
      assert.equal(result.total, 1, book);
      assert.equal(result.verses[0].text, source.find(v => v.book === book && v.chapter === 1 && v.verse === 1).text);
    }
    for (const query of ['Mephibosheth', 'Bezaleel', 'Onesiphorus', 'Damaris', 'Tertius', 'Noah']) {
      assert.ok(store.searchScripture(query).total > 0, query);
    }
    assert.equal(store.searchScripture('John 3:160').total, 0, 'invalid verse cannot degrade into a loose match');
    assert.equal(store.searchScripture('Gen.1.1').verses[0].verse, 1);
    assert.equal(store.searchScripture('Genesis 1').total, 31);
    assert.equal(store.searchScripture('John 3:16-18').total, 3);
    assert.equal(store.searchScripture('Noah impossibleword').total, 0, 'all words required');
    assert.equal(store.searchScripture('<img src=x onerror=alert(1)>').total, 0);
    const first = store.searchScripture('Mary', 0, 5);
    const refs = new Set<string>();
    for (let offset = 0; offset < first.total; offset += 5) {
      for (const verse of store.searchScripture('Mary', offset, 5).verses) {
        assert.match(verse.text, /\bMary\b/i);
        refs.add(store.toOsisRef(verse));
      }
    }
    assert.equal(refs.size, first.total, 'no omitted or duplicated results across pages');
    assert.ok(store.searchScripture('"Jesus wept"').total > 0);
  } finally { globalThis.fetch = originalFetch; }
});

test('atlas does not promote invented Jonah travel or a Roman identification of Babylon to Scripture', () => {
  const jonah = BIBLICAL_ROUTES.find(route => route.id === 'jonah-prophet')!;
  assert.doesNotMatch(JSON.stringify(jonah), /550|Hamath|Tiphsah|Phoenician shore/);
  const rome = BIBLICAL_ROUTES.find(route => route.id === 'peter-philip-missions')!.stops.at(-1)!;
  assert.equal(rome.evidenceClass, 'EXTERNAL_HISTORICAL_ATTESTATION');
  assert.match(rome.note, /does not identify Babylon as Rome/);
});


test('all atlas routes, sites and timeline filters remain discoverable with resolvable IDs', () => {
  const all = CHRONOLOGICAL_ERAS.find(era => era.id === 'all')!;
  for (const [entries, key] of [[BIBLICAL_ROUTES, 'activeRouteIds'], [ARCHAEOLOGICAL_SITES, 'activeSiteIds']] as const) {
    assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length, `${key}: duplicate IDs`);
    assert.deepEqual(new Set(all[key]), new Set(entries.map(entry => entry.id)), `${key}: all-era coverage`);
    for (const entry of entries) {
      assert.ok(CHRONOLOGICAL_ERAS.some(era => era.id !== 'all' && era[key].includes(entry.id)), `No period exposes ${entry.id}`);
    }
  }
  const eraIds = new Set(CHRONOLOGICAL_ERAS.map(era => era.id));
  const routeIds = new Set(BIBLICAL_ROUTES.map(route => route.id));
  assert.equal(new Set(GRANULAR_TIMELINE_FILTERS.map(filter => filter.id)).size, GRANULAR_TIMELINE_FILTERS.length);
  for (const filter of GRANULAR_TIMELINE_FILTERS) {
    for (const id of filter.eraIds) assert.ok(eraIds.has(id), `${filter.id}: unknown era ${id}`);
    for (const id of filter.routeIds) assert.ok(routeIds.has(id), `${filter.id}: unknown route ${id}`);
  }
  for (const empire of WORLD_EMPIRES_GEO) {
    for (const id of empire.eraIds ?? []) assert.ok(eraIds.has(id), `${empire.id}: unknown era ${id}`);
    assert.ok(CHRONOLOGICAL_ERAS.some(era => era.rulingEmpireId === empire.id || era.additionalRegionIds?.includes(empire.id) || empire.eraIds?.includes(era.id)), `No period exposes ${empire.id}`);
  }
});
