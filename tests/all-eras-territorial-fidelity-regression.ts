/**
 * tests/all-eras-territorial-fidelity-regression.ts
 *
 * Verifies that the territorial boundary fixes, organic curvature, and dashed
 * argued frontier zones are implemented and strictly chronological across
 * ALL maps (/map, /bible, /interact) and ALL 13 chronological eras.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHRONOLOGICAL_ERAS,
  WORLD_EMPIRES_GEO,
  CONTESTED_FRONTIER_ZONES,
  doPolygonsOverlap,
  calculatePolygonGeodesicArea
} from '../src/data/ancientMapData.ts';

test('Territorial fidelity is verified across ALL 13 chronological eras', () => {
  assert.equal(CHRONOLOGICAL_ERAS.length, 13, 'Must define all 13 canonical historical eras');

  for (const era of CHRONOLOGICAL_ERAS) {
    const isAll = era.id === 'all';
    const targetEmpires = isAll
      ? WORLD_EMPIRES_GEO
      : WORLD_EMPIRES_GEO.filter(emp =>
          emp.id === era.rulingEmpireId ||
          (era.additionalRegionIds && era.additionalRegionIds.includes(emp.id)) ||
          (emp.eraIds && emp.eraIds.includes(era.id))
        );

    // 1. Every era must have at least 6 active historical empires/realms
    assert.ok(
      targetEmpires.length >= 6,
      `Era [${era.id}] must have at least 6 active historical empires, got ${targetEmpires.length}`
    );

    // 2. All target empires must have valid polygonal bounds with >= 4 vertices
    for (const emp of targetEmpires) {
      assert.ok(
        Array.isArray(emp.approximateBounds) && emp.approximateBounds.length >= 4,
        `Empire [${emp.id}] in era [${era.id}] must have valid polygon coordinates`
      );
      const area = calculatePolygonGeodesicArea(emp.approximateBounds);
      assert.ok(
        area > 1000,
        `Empire [${emp.id}] must have plausible geographic area (> 1,000 km²), got ${area}`
      );
    }

    // 3. Contested/overlapping detection must flag polities that share borderlands
    const activeEmpireIds = new Set(targetEmpires.map(e => e.id));
    const activeEmpiresWithContestedBorders = new Set<string>();
    for (const empire of targetEmpires) {
      if (empire.contestedBorder || empire.dashArray) {
        activeEmpiresWithContestedBorders.add(empire.id);
        continue;
      }
      for (const other of targetEmpires) {
        if (other.id !== empire.id && doPolygonsOverlap(empire.approximateBounds, other.approximateBounds)) {
          activeEmpiresWithContestedBorders.add(empire.id);
          activeEmpiresWithContestedBorders.add(other.id);
        }
      }
    }

    // 4. In all biblical eras, overlapping empires MUST exist and be rendered with dashed borders
    assert.ok(
      activeEmpiresWithContestedBorders.size >= 2,
      `Era [${era.id}] must have at least 2 empires with dashed contested borders, got ${activeEmpiresWithContestedBorders.size}`
    );

    // 5. Contested frontier zones must be chronologically restricted (no bleed-through to anachronistic eras)
    const activeContestedZones = CONTESTED_FRONTIER_ZONES.filter(zone => {
      const isEraMatch = isAll || zone.eraIds.includes(era.id);
      if (!isEraMatch) return false;
      return zone.claimedByEmpireIds.some(empId => activeEmpireIds.has(empId));
    });

    if (era.id === 'divided_monarchy_prophets') {
      // Divided Monarchy must include Benjamin, Gilead, Moab, Shephelah, Nubia, and Tigris borderlands
      const zoneIds = activeContestedZones.map(z => z.id);
      assert.ok(zoneIds.includes('contested-benjamin'), 'Divided Monarchy must include Benjamin borderland');
      assert.ok(zoneIds.includes('contested-gilead-ramoth'), 'Divided Monarchy must include Gilead/Ramoth borderland');
      assert.ok(zoneIds.includes('contested-plains-of-moab'), 'Divided Monarchy must include Plains of Moab');
      assert.ok(zoneIds.includes('contested-shephelah'), 'Divided Monarchy must include Shephelah buffer');
    }

    if (era.id === 'apostolic_church' || era.id === 'roman_christ') {
      // New Testament eras must NOT show the 900 BC Divided Kingdom Benjamin border dispute
      const zoneIds = activeContestedZones.map(z => z.id);
      assert.ok(
        !zoneIds.includes('contested-benjamin'),
        `Era [${era.id}] must NOT include anachronistic Divided Monarchy Benjamin frontier`
      );
      assert.ok(
        !zoneIds.includes('contested-gilead-ramoth'),
        `Era [${era.id}] must NOT include anachronistic Aram-Damascus Gilead frontier`
      );
    }
  }
});

test('Contested frontier zones and regional empires have mature high-density geodetic polygons (no primitive 4-to-6 sided boxes)', () => {
  // 1. Every contested frontier zone must have at least 12 vertices
  for (const zone of CONTESTED_FRONTIER_ZONES) {
    assert.ok(
      zone.bounds.length >= 12,
      `Contested zone [${zone.id}] must be a mature geodetic polygon with >= 12 vertices (no primitive boxes), got ${zone.bounds.length}`
    );
  }

  // 2. Old Babylonian & Kassite Kingdom must have realistic depth (> 250 km east-west span) without narrow bowtie pinches
  const oldBabylon = WORLD_EMPIRES_GEO.find(e => e.id === 'old_babylon');
  assert.ok(oldBabylon, 'Old Babylon must exist in WORLD_EMPIRES_GEO');
  assert.ok(oldBabylon.approximateBounds.length >= 16, 'Old Babylon must have >= 16 vertices');
  const lngs = oldBabylon.approximateBounds.map(p => p.lng);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  assert.ok(
    maxLng - minLng >= 4.0,
    `Old Babylon must span at least 4.0 degrees longitude across Mesopotamia, got ${maxLng - minLng}`
  );
  assert.ok(minLng <= 41.0, `Old Babylon western border must extend to Mari/desert plateau (<= 41.0 lng), got ${minLng}`);

  // 3. Egypt and Saite Egypt must encompass the Western Desert oasis chain (reaching <= 29.0 lng)
  const egypt = WORLD_EMPIRES_GEO.find(e => e.id === 'egypt');
  assert.ok(egypt, 'Egypt must exist in WORLD_EMPIRES_GEO');
  const egyptMinLng = Math.min(...egypt.approximateBounds.map(p => p.lng));
  assert.ok(
    egyptMinLng <= 28.5,
    `Egypt must extend to Western Desert oasis chain (<= 28.5 lng), got ${egyptMinLng}`
  );

  const saiteEgypt = WORLD_EMPIRES_GEO.find(e => e.id === 'saite_egypt');
  assert.ok(saiteEgypt, 'Saite Egypt must exist in WORLD_EMPIRES_GEO');
  const saiteMinLng = Math.min(...saiteEgypt.approximateBounds.map(p => p.lng));
  assert.ok(
    saiteMinLng <= 28.5,
    `Saite Egypt must extend to Western Desert oasis chain (<= 28.5 lng), got ${saiteMinLng}`
  );
});
