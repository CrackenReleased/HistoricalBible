import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getDatedEvent, REVIEWED_DATED_EVENTS } from '../src/data/datedEvents.ts';
import {
  HISTORICAL_RELATIONSHIPS,
  getRelationshipForPassage,
  getRelationshipsBetween,
  getRelationshipById
} from '../src/data/historicalRelationships.ts';
import {
  HISTORICAL_WORLD_ITEMS,
  getWorldHorizonItem,
  isWorldItemInDateInterval
} from '../src/data/historicalWorldItems.ts';
import { resolvePassageUserContext } from '../src/store/userContextStore.ts';

test('2 Kings 18:13 dated event separates passage synchrony from independent world horizon', () => {
  const event = getDatedEvent('2Kgs', 18, 13);
  assert.ok(event, '2 Kings 18:13 must have a reviewed dated event');
  assert.equal(event.ref, '2Kgs.18.13');
  assert.equal(event.siteId, 'taylor-prism');

  // How the passage is dated (the synchronizing inscription)
  assert.match(event.dateLabel, /701 BC/i);
  assert.match(event.event, /2 Kings 18:13 reports Sennacherib/i);
  assert.match(event.sourceTitle, /Taylor Prism/i);
  assert.ok(event.sourceUrl.startsWith('https://'), 'Taylor Prism must have valid source URL');
  assert.ok(event.method && event.limit, 'Method and limitation must be explicit');

  // Must not let the inscription alone masquerade as the entire world horizon
  assert.ok(event.worldItem, '2 Kings 18:13 must have an associated world horizon item');
  const worldItem = event.worldItem;
  assert.equal(worldItem.id, 'eastern-zhou-spring-autumn');
  assert.match(worldItem.name, /Eastern Zhou/i);
  assert.match(worldItem.name, /Spring and Autumn/i);
  assert.match(worldItem.regionName, /China/i);
  assert.ok(worldItem.sourceUrl.startsWith('https://'), 'World item source URL must be valid');
  assert.match(worldItem.sourceTitle, /Spring and Autumn Annals|Chunqiu|Zuo Zhuan/i);

  // Must explicitly state that no contact with Judah is claimed
  assert.match(worldItem.overlapExplanation, /no.*contact.*claimed/i,
    'World item must explicitly state no contact with Judah is claimed');
  assert.equal(worldItem.connectionKind, 'contemporary_overlap_no_contact');

  // Interval check: must be active during 701 BC, and false outside its stated interval
  assert.ok(isWorldItemInDateInterval(worldItem, -701), 'World item must be active at 701 BC (-701)');
  assert.ok(!isWorldItemInDateInterval(worldItem, 100), 'World item must not be active in AD 100');
  assert.ok(!isWorldItemInDateInterval(worldItem, -1500), 'World item must not be active in 1500 BC');
});

test('Judah and Assyria 701 BC relationship expresses actor perspectives, tension, and changes over time', () => {
  const rel = getRelationshipForPassage('2Kgs', 18, 13);
  assert.ok(rel, 'Passage 2 Kings 18:13 must resolve to a time-specific relationship');
  assert.equal(rel.actor1Id, 'judah');
  assert.equal(rel.actor2Id, 'assyria');
  assert.equal(rel.startYear, -701);
  assert.equal(rel.endYear, -701);

  // Both actors and roles identified
  assert.equal(rel.actor1Type, 'kingdom');
  assert.equal(rel.actor2Type, 'empire');
  assert.match(rel.actor1Leader || '', /Hezekiah/i);
  assert.match(rel.actor2Leader || '', /Sennacherib/i);

  // Relationship kind & tension
  assert.match(rel.relationshipKind, /conflict|tribute|siege/i);
  assert.ok(rel.perspectiveActor1, 'Judah perspective must be documented');
  assert.match(rel.perspectiveActor1, /rebel|tribute|siege|deliver/i);
  assert.ok(rel.perspectiveActor2, 'Assyria perspective must be documented');
  assert.match(rel.perspectiveActor2, /Taylor Prism|bird in a cage|tribute|caged/i);
  assert.ok(rel.tensionAndLimits, 'Tension and limits must be documented');

  // Sources and moral evaluation
  assert.ok(rel.scriptureRefs.length > 0, 'Must cite Scripture references');
  assert.ok(rel.attestationSources && rel.attestationSources.length > 0, 'Must cite external attestation');
  assert.ok(rel.moralAssessmentBasis, 'Moral assessment must have an explicit biblical basis');
  assert.match(rel.moralAssessmentBasis, /2 Kings 18/i);

  // Time-changing relationship check: Judah and Assyria changed across 8th-7th centuries BC
  const allJudahAssyria = getRelationshipsBetween('judah', 'assyria');
  assert.ok(allJudahAssyria.length >= 2,
    'Must document multiple periods showing Judah-Assyria relationship changed over time');

  // Verify contrast: Ahaz (734-732 BC) sought vassalage vs Hezekiah (701 BC) rebelled/under siege
  const ahazRel = allJudahAssyria.find(r => r.actor1Leader?.includes('Ahaz'));
  assert.ok(ahazRel, 'Must include Ahaz tributary alliance period');
  assert.notEqual(ahazRel.relationshipKind, rel.relationshipKind,
    'Ahaz voluntary vassalage must have distinct relationship kind from Hezekiah siege');
});

test('Passage context carrying: 2 Kings 18:13 preserves passage, time, and entity into map', () => {
  const context = resolvePassageUserContext({
    bookOsis: '2Kgs',
    bookName: '2 Kings',
    chapter: 18,
    verseNum: 13,
    eraId: 'assyrian_siege',
    eraName: 'Assyrian Siege: Sennacherib',
    eventDateLabel: '701 BC'
  });

  // Verify mapHref carries ref
  assert.ok(context.mapHref.includes('ref=2Kgs.18.13') || context.mapHref.includes('ref=2KGS.18.13'),
    `mapHref must carry ref: got ${context.mapHref}`);
  assert.ok(context.mapHref.includes('era=assyrian_siege'),
    `mapHref must carry era: got ${context.mapHref}`);

  // Return link to Bible reader preserves exact passage
  assert.ok(context.bibleHref.includes('2Kgs') || context.bibleHref.includes('2%20Kings'),
    `bibleHref must reference 2 Kings: got ${context.bibleHref}`);
  assert.ok(context.bibleHref.includes('18'), `bibleHref must include chapter 18`);

  // Undated passage check: Genesis 1:1 yields broad fallback without invented year
  const undatedContext = resolvePassageUserContext({
    bookOsis: 'Gen',
    bookName: 'Genesis',
    chapter: 1,
    verseNum: 1
  });

  assert.ok(undatedContext.mapHref.includes('ref=Gen.1.1') || undatedContext.mapHref.includes('ref=GEN.1.1'),
    `Undated mapHref must carry ref: got ${undatedContext.mapHref}`);
  assert.equal(undatedContext.eraId, 'patriarchs');
  assert.equal(getDatedEvent('Gen', 1, 1), undefined,
    'Genesis 1:1 must remain an honest undated passage');
});
