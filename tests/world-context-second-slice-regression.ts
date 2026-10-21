import test from 'node:test';
import assert from 'node:assert/strict';
import { getJourneyStopForPassage, BIBLICAL_ROUTES } from '../src/data/ancientMapData.ts';
import { getRelationshipForPassage, HISTORICAL_RELATIONSHIPS } from '../src/data/historicalRelationships.ts';
import { getWorldHorizonItem, HISTORICAL_WORLD_ITEMS } from '../src/data/historicalWorldItems.ts';

test('Elijah narrative passages wire to matching stops on elijah-prophet route', () => {
  const route = BIBLICAL_ROUTES.find(r => r.id === 'elijah-prophet');
  assert.ok(route, 'elijah-prophet route must exist');
  assert.equal(route.figureId, 'elijah', 'elijah-prophet figureId must be elijah');
  assert.equal(route.stops.length, 7, 'elijah-prophet must have 7 sequential narrative stops');

  // Test 1: Cherith passage (1 Kings 17:3)
  const cherithMatch = getJourneyStopForPassage('1Kgs', 17, 3);
  assert.ok(cherithMatch, '1 Kings 17:3 must resolve to journey stop');
  assert.equal(cherithMatch.route.id, 'elijah-prophet');
  assert.equal(cherithMatch.stopIndex, 1);
  assert.match(cherithMatch.stop.name, /Cherith/i);
  assert.ok(cherithMatch.stop.coords.lat > 0 && cherithMatch.stop.coords.lng > 0);

  // Test 2: Zarephath passage (1 Kings 17:9)
  const zarephathMatch = getJourneyStopForPassage('1Kgs', 17, 9);
  assert.ok(zarephathMatch, '1 Kings 17:9 must resolve to journey stop');
  assert.equal(zarephathMatch.route.id, 'elijah-prophet');
  assert.equal(zarephathMatch.stopIndex, 2);
  assert.match(zarephathMatch.stop.name, /Zarephath/i);

  // Test 3: Carmel contest (1 Kings 18:38)
  const carmelMatch = getJourneyStopForPassage('1Kgs', 18, 38);
  assert.ok(carmelMatch, '1 Kings 18:38 must resolve to journey stop');
  assert.equal(carmelMatch.route.id, 'elijah-prophet');
  assert.equal(carmelMatch.stopIndex, 3);
  assert.match(carmelMatch.stop.name, /Carmel/i);

  // Test 4: Whirlwind ascension (2 Kings 2:11)
  const whirlwindMatch = getJourneyStopForPassage('2Kgs', 2, 11);
  assert.ok(whirlwindMatch, '2 Kings 2:11 must resolve to journey stop');
  assert.equal(whirlwindMatch.route.id, 'elijah-prophet');
  assert.equal(whirlwindMatch.stopIndex, 6);
  assert.match(whirlwindMatch.stop.name, /Jordan/i);

  // Narrative sequence ordering: spacing is narrative order, not elapsed time
  assert.equal(cherithMatch.stopIndex < zarephathMatch.stopIndex, true);
  assert.equal(zarephathMatch.stopIndex < carmelMatch.stopIndex, true);
  assert.equal(carmelMatch.stopIndex < whirlwindMatch.stopIndex, true);
});

test('David/Achish vs Saul/Philistines relationship counterexample', () => {
  // Test David & Achish in 1 Samuel 27
  const davidRel = getRelationshipForPassage('1Sam', 27, 1);
  assert.ok(davidRel, '1 Samuel 27:1 must have a reviewed relationship');
  assert.equal(davidRel.id, 'david-achish-1012bc');
  assert.equal(davidRel.actor1Id, 'david');
  assert.equal(davidRel.actor2Id, 'gath-philistines');
  assert.equal(davidRel.relationshipKind, 'refuge');
  assert.match(davidRel.perspectiveActor1, /escape into the land of the Philistines/i);
  assert.match(davidRel.perspectiveActor2, /He hath made his people Israel utterly to abhor him/i);
  assert.match(davidRel.tensionAndLimits, /crucial counterexample to static faction labeling/i);

  // Test Saul & Philistines in 1 Samuel 31
  const saulRel = getRelationshipForPassage('1Sam', 31, 1);
  assert.ok(saulRel, '1 Samuel 31:1 must have a reviewed relationship');
  assert.equal(saulRel.id, 'saul-philistines-1010bc');
  assert.equal(saulRel.actor1Id, 'saul');
  assert.equal(saulRel.actor2Id, 'philistines');
  assert.equal(saulRel.relationshipKind, 'armed_conflict');
  assert.match(saulRel.perspectiveActor1, /Saul was afraid/i);
  assert.match(saulRel.tensionAndLimits, /directly contemporaneous with David’s sanctuary under Achish/i);

  // Verify non-collapse: David’s refuge does NOT make Saul a friend of Philistines
  assert.notEqual(davidRel.relationshipKind, saulRel.relationshipKind);
  assert.notEqual(davidRel.actor1Id, saulRel.actor1Id);

  // Verify biblical basis cited
  assert.ok(davidRel.moralAssessmentBasis && davidRel.moralAssessmentBasis.length > 20);
  assert.ok(saulRel.moralAssessmentBasis && saulRel.moralAssessmentBasis.length > 20);
});

test('Western Zhou contemporary world horizon (c. 1010 BC)', () => {
  const zhouItem = getWorldHorizonItem('western-zhou-early');
  assert.ok(zhouItem, 'western-zhou-early must be defined in HISTORICAL_WORLD_ITEMS');
  assert.equal(zhouItem.startYear <= -1010 && zhouItem.endYear >= -1010, true, 'Must cover 1010 BC');
  assert.match(zhouItem.overlapExplanation, /no known contact with Israel is claimed/i);
  assert.match(zhouItem.sourceTitle, /Chinese Text Project/i);
  assert.ok(zhouItem.sourceUrl.startsWith('http'));
});
