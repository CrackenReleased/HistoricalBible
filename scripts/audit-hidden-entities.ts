import fs from 'fs';
import path from 'path';

import {
  CHRONOLOGICAL_ERAS,
  BIBLICAL_ROUTES,
  ARCHAEOLOGICAL_SITES,
  BIBLICAL_CITIES,
  WORLD_EMPIRES_GEO,
  GRANULAR_TIMELINE_FILTERS
} from '../src/data/ancientMapData.ts';

console.log('====================================================');
console.log('   HISTORICAL ATLAS DEEP AUDIT: HIDDEN ENTITIES');
console.log('====================================================\n');

// 1. ROUTE AUDIT
console.log('=== 1. BIBLICAL ROUTES & ERAS ===');
const allEra = CHRONOLOGICAL_ERAS.find(e => e.id === 'all');
const allEraRouteIds = new Set(allEra?.activeRouteIds || []);

const routeToEras = new Map<string, string[]>();
for (const r of BIBLICAL_ROUTES) {
  const eras = CHRONOLOGICAL_ERAS.filter(e => e.id !== 'all' && e.activeRouteIds.includes(r.id)).map(e => e.id);
  routeToEras.set(r.id, eras);
  if (eras.length === 0) {
    console.log(`[ALERT] Route NOT in any era: ${r.id} (${r.name})`);
  }
  if (!allEraRouteIds.has(r.id)) {
    console.log(`[ALERT] Route missing from 'all' era: ${r.id}`);
  }
}

// Check obvious historical spans
if (!routeToEras.get('joshua-conquest')?.includes('judges')) {
  console.log(`[NOTICE] 'joshua-conquest' is not in 'judges' (Conquest & Judges).`);
}
if (!routeToEras.get('samuel-circuit')?.includes('judges')) {
  console.log(`[NOTICE] 'samuel-circuit' (last Judge of Israel) is not in 'judges'.`);
}
if (!routeToEras.get('jonah-prophet')?.includes('assyrian_siege')) {
  console.log(`[NOTICE] 'jonah-prophet' (prophesied to Nineveh) is not in 'assyrian_siege'.`);
}

// 2. ARCHAEOLOGICAL SITES AUDIT
console.log('\n=== 2. ARCHAEOLOGICAL SITES & ERAS ===');
const allEraSiteIds = new Set(allEra?.activeSiteIds || []);
for (const s of ARCHAEOLOGICAL_SITES) {
  const eras = CHRONOLOGICAL_ERAS.filter(e => e.id !== 'all' && e.activeSiteIds.includes(s.id)).map(e => e.id);
  if (eras.length === 0) {
    console.log(`[ALERT] Site NOT in any specific era: ${s.id} (${s.artifactName})`);
  }
  if (!allEraSiteIds.has(s.id)) {
    console.log(`[ALERT] Site missing from 'all' era: ${s.id}`);
  }
  // Check if sargon-prism is only in an era missing from UI
  if (s.id === 'sargon-prism') {
    console.log(`  sargon-prism is in eras: ${eras.join(', ')}`);
  }
}

// 3. MAP.HTML DROPDOWN AUDIT
console.log('\n=== 3. map.html <select id="atlas-era"> vs CHRONOLOGICAL_ERAS ===');
const mapHtml = fs.readFileSync('E:/HistoricalBible/map.html', 'utf8');
const optionMatches = [...mapHtml.matchAll(/<option\s+value=["']([^"']*)["'][^>]*>(.*?)<\/option>/g)].map(m => ({
  val: m[1],
  text: m[2].replace(/&amp;/g, '&')
}));
const eraIdsInHtml = new Set(optionMatches.map(o => o.val));

for (const era of CHRONOLOGICAL_ERAS) {
  if (!eraIdsInHtml.has(era.id)) {
    console.log(`[ALERT] Era in data but MISSING from map.html dropdown: ${era.id} ("${era.name}")`);
  }
}

// 4. GRANULAR TIMELINE FILTERS ALIGNMENT
console.log('\n=== 4. GRANULAR TIMELINE FILTERS ALIGNMENT ===');
const filteredRouteIds = new Set(GRANULAR_TIMELINE_FILTERS.flatMap(f => f.routeIds));
for (const r of BIBLICAL_ROUTES) {
  if (!filteredRouteIds.has(r.id)) {
    console.log(`[ALERT] Route has no GranularTimelineFilter: ${r.id}`);
  }
}

for (const f of GRANULAR_TIMELINE_FILTERS) {
  for (const rId of f.routeIds) {
    const routeEras = routeToEras.get(rId) || [];
    for (const eraId of routeEras) {
      if (!f.eraIds.includes(eraId)) {
        console.log(`[FILTER MISMATCH] Filter '${f.id}' contains route '${rId}' (in era '${eraId}'), but filter.eraIds lacks '${eraId}'`);
      }
    }
  }
}

// 5. WORLD EMPIRES AUDIT
console.log('\n=== 5. WORLD EMPIRES ERA ASSIGNMENT ===');
for (const emp of WORLD_EMPIRES_GEO) {
  const eras = CHRONOLOGICAL_ERAS.filter(e => {
    return e.rulingEmpireId === emp.id ||
      (e.additionalRegionIds && e.additionalRegionIds.includes(emp.id)) ||
      (emp.eraIds && emp.eraIds.includes(e.id));
  }).map(e => e.id);
  if (eras.length === 0) {
    console.log(`[ALERT] Empire in data but NOT attached to any era: ${emp.id} ("${emp.name}")`);
  }
}

// 6. CITIES OT/NT FILTER AUDIT
console.log('\n=== 6. CITIES FILTERING IN ANCIENTMAP.TS ===');
const ancientMapCode = fs.readFileSync('E:/HistoricalBible/src/engine/ancientMap.ts', 'utf8');
const otEraMatch = ancientMapCode.match(/const otEraIds = new Set\(\[([\s\S]*?)\]\);/);
if (otEraMatch) {
  const otEraList = [...otEraMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
  console.log('otEraIds currently contains:', otEraList);
  if (!otEraList.includes('judges')) {
    console.log(`[ALERT] 'judges' era is MISSING from otEraIds in ancientMap.ts! Greco-Roman cities are shown in Judges!`);
  }
}

console.log('\nAudit complete.');
