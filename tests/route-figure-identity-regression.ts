import test from 'node:test';
import assert from 'node:assert/strict';
import { BIBLICAL_ROUTES, CHRONOLOGICAL_ERAS } from '../src/data/ancientMapData.ts';

test('Route figure identity: routes point to their actual historical traveler, not generic placeholders', () => {
  const expectedRouteFigures: Record<string, string> = {
    'elijah-prophet': 'elijah',
    'elijah-elisha-ministry': 'elijah',
    'elisha-ministry': 'elisha',
    'amos-prophet': 'amos',
    'hosea-prophet': 'hosea',
    'gideon-judges': 'gideon',
    'samson-judges': 'samson',
    'ruth-boaz': 'ruth',
    'samuel-circuit': 'samuel',
    'saul-reign': 'saul',
    'balaam-journey': 'balaam',
    'jacob-padan-aram': 'jacob',
    'ezekiel-exile': 'ezekiel',
    'esther-mordecai': 'esther',
    'thomas-parthia-india': 'thomas',
    'andrew-mark-missions': 'andrew',
    'john-seven-churches-patmos': 'john',
    'stephen-philip-deacons': 'stephen',
    'barnabas-mark': 'barnabas',
    'joshua-conquest': 'joshua',
    'jacob-joseph-egypt': 'joseph',
    'john-baptist-ministry': 'john-baptist',
  };

  const failures: string[] = [];

  for (const [routeId, expectedFig] of Object.entries(expectedRouteFigures)) {
    const route = BIBLICAL_ROUTES.find(r => r.id === routeId);
    assert.ok(route, `Route ${routeId} must exist`);
    if (route.figureId !== expectedFig) {
      failures.push(`Route "${route.name}" (${route.id}) has figureId "${route.figureId}", expected "${expectedFig}"`);
    }
  }

  assert.equal(failures.length, 0, `Mismatched route figures found:\n${failures.join('\n')}`);
});

test('Every route figureId is valid and contained in an era activeFigureIds list', () => {
  const allEraFigures = new Set(CHRONOLOGICAL_ERAS.flatMap(e => e.activeFigureIds));

  const invalidRoutes: string[] = [];
  for (const route of BIBLICAL_ROUTES) {
    if (!allEraFigures.has(route.figureId)) {
      invalidRoutes.push(`Route ${route.id} has figureId "${route.figureId}" not found in any era activeFigureIds`);
    }
  }

  assert.equal(invalidRoutes.length, 0, `Routes with unknown figureIds:\n${invalidRoutes.join('\n')}`);
});
