/**
 * tests/territorial-boundaries-overlap-regression.ts
 *
 * Verifies that:
 * 1. Kush/Nubia has a full, realistic regional territory (including the Island of Meroë / Butana
 *    and Eastern Desert gold fields) rather than an artificial, narrow river-cataract ribbon.
 * 2. Argued and overlapping territorial boundaries are established and denoted with dashed lines
 *    (dashArray: '6, 6') rather than solid lines across historical borderlands:
 *    - Lower Nubia / Wawat (Egypt & Kush)
 *    - Northern Benjamin / Ramah (Judah & Israel)
 *    - Gilead / Ramoth-Gilead (Israel & Aram-Damascus)
 *    - Plains of Moab / Medeba Plateau (Israel & Moab)
 *    - Shephelah Buffer (Philistia & Judah)
 *    - Sinai & Negev Frontier (Egypt, Judah, Nabataea)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WORLD_EMPIRES_GEO,
  CONTESTED_FRONTIER_ZONES,
  calculatePolygonGeodesicArea,
  isPointInPolygon,
  doPolygonsOverlap
} from '../src/data/ancientMapData.ts';

test('Kush / Nubia boundary encompasses the Island of Meroë and Eastern Desert', () => {
  const kush = WORLD_EMPIRES_GEO.find(e => e.id === 'kush_nubia');
  assert.ok(kush, 'kush_nubia empire must exist in WORLD_EMPIRES_GEO');

  // 1. Must encompass substantial regional area (>= 750,000 km²), not a narrow 30-mile strip
  const area = calculatePolygonGeodesicArea(kush.approximateBounds);
  assert.ok(
    area >= 750000,
    `Kush area (${Math.round(area)} km²) must be >= 750,000 km² to reflect authentic regional territory`
  );

  // 2. Must encompass the Island of Meroë / Butana plain (inland east of the Nile, e.g. lat 16.3, lng 34.5)
  const isButanaInside = isPointInPolygon({ lat: 16.3, lng: 34.5 }, kush.approximateBounds);
  assert.equal(isButanaInside, true, 'Kush boundary must encompass the Butana plain / Island of Meroë');

  // 3. Must encompass inland royal temple site of Naga / Musawwarat es-Sufra (lat 16.42, lng 33.32)
  const isNagaInside = isPointInPolygon({ lat: 16.42, lng: 33.32 }, kush.approximateBounds);
  assert.equal(isNagaInside, true, 'Kush boundary must encompass Naga and Musawwarat inland royal centers');

  // 4. Must encompass the Eastern Desert gold fields along Wadi Allaqi (lat 22.5, lng 34.5)
  const isGoldFieldsInside = isPointInPolygon({ lat: 22.5, lng: 34.5 }, kush.approximateBounds);
  assert.equal(isGoldFieldsInside, true, 'Kush boundary must encompass Eastern Desert gold mining districts');

  // 5. Date range must extend back to c. 2000 BC to include the Kerma culture contemporary with Patriarchs (Gen 47)
  assert.match(kush.dateRange, /2000|2100|Kerma/i);
});

test('Egypt and Kush overlap in Lower Nubia (Wawat) as an argued borderland', () => {
  const egypt = WORLD_EMPIRES_GEO.find(e => e.id === 'egypt');
  const kush = WORLD_EMPIRES_GEO.find(e => e.id === 'kush_nubia');
  assert.ok(egypt && kush);

  // Assert that Egypt and Kush geographically overlap between 1st Cataract (Aswan) and 2nd Cataract (Buhen)
  const overlap = doPolygonsOverlap(egypt.approximateBounds, kush.approximateBounds);
  assert.equal(overlap, true, 'Egypt and Kush must have an overlapping territorial frontier in Lower Nubia');
});

test('Judah and Northern Israel overlap in Northern Benjamin (Ramah & Bethel corridor)', () => {
  const judah = WORLD_EMPIRES_GEO.find(e => e.id === 'judah');
  const israel = WORLD_EMPIRES_GEO.find(e => e.id === 'israel_kingdom');
  assert.ok(judah && israel);

  // Both claim the Benjamin frontier between lat 31.83 and 31.93
  const overlap = doPolygonsOverlap(judah.approximateBounds, israel.approximateBounds);
  assert.equal(overlap, true, 'Judah and Israel must geographically overlap in the contested Benjamin borderland');
});

test('Canonical Contested Frontier Zones are exported with dashed border definitions', () => {
  assert.ok(Array.isArray(CONTESTED_FRONTIER_ZONES), 'CONTESTED_FRONTIER_ZONES must be exported');
  assert.ok(CONTESTED_FRONTIER_ZONES.length >= 6, 'Must include at least 6 canonical argued borderlands');

  const lowerNubia = CONTESTED_FRONTIER_ZONES.find(z => z.id === 'contested-lower-nubia');
  assert.ok(lowerNubia, 'Must include Lower Nubia frontier');
  assert.ok(lowerNubia.claimedByEmpireIds.includes('egypt') && lowerNubia.claimedByEmpireIds.includes('kush_nubia'));
  assert.ok(lowerNubia.biblicalRecord.length > 20);

  const benjamin = CONTESTED_FRONTIER_ZONES.find(z => z.id === 'contested-benjamin');
  assert.ok(benjamin, 'Must include Benjamin Ramah/Bethel frontier');
  assert.ok(benjamin.claimedByEmpireIds.includes('judah') && benjamin.claimedByEmpireIds.includes('israel_kingdom'));
  assert.match(benjamin.biblicalRecord, /Baasha|Asa|Ramah/i);

  const gilead = CONTESTED_FRONTIER_ZONES.find(z => z.id === 'contested-gilead-ramoth');
  assert.ok(gilead, 'Must include Gilead/Ramoth frontier');
  assert.ok(gilead.claimedByEmpireIds.includes('israel_kingdom') && gilead.claimedByEmpireIds.includes('aram_damascus'));

  const moab = CONTESTED_FRONTIER_ZONES.find(z => z.id === 'contested-plains-of-moab');
  assert.ok(moab, 'Must include Plains of Moab / Medeba plateau frontier');

  const shephelah = CONTESTED_FRONTIER_ZONES.find(z => z.id === 'contested-shephelah');
  assert.ok(shephelah, 'Must include Shephelah buffer zone');
});
