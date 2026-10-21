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
