import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHRONOLOGICAL_ERAS,
  BIBLICAL_GEOGRAPHIC_ENTITIES,
  getJourneyStopForPassage,
  resolveBiblicalEntity
} from '../src/data/ancientMapData.ts';

test('Patriarchs era does NOT falsely highlight 550 BC Nabonidus Cylinder in 2000 BC', () => {
  const patriarchs = CHRONOLOGICAL_ERAS.find(e => e.id === 'patriarchs');
  assert.ok(patriarchs, 'patriarchs era must exist');
  assert.ok(
    !patriarchs.activeSiteIds.includes('nabonidus-cylinder'),
    'Patriarchs era (c. 2100-1800 BC) must not have Nabonidus Cylinder (c. 550 BC Neo-Babylonian) as an active site'
  );
  assert.ok(
    patriarchs.focusCenter.lng <= 36,
    `Patriarchs focusCenter longitude should center on Levant/Egypt (< 36), got ${patriarchs.focusCenter.lng}`
  );
});

test('Genesis 47 journey resolution maps to Joseph in Egypt stop at Goshen', () => {
  const match = getJourneyStopForPassage('Gen', 47, 1);
  assert.ok(match, 'Genesis 47:1 must map to narrative journey stop');
  assert.equal(match.route.id, 'joseph-egypt');
  assert.equal(match.stopIndex, 4);
  assert.match(match.stop.name, /Goshen/i);
  assert.ok(match.stop.coords.lat >= 30.5 && match.stop.coords.lat <= 31.0);
  assert.ok(match.stop.coords.lng >= 31.5 && match.stop.coords.lng <= 32.2);
});

test('Clicking Pharaoh in Genesis 47 resolves to Egypt, approx year c. 1876-1800 BC, region of power, and paths', () => {
  const resolved = resolveBiblicalEntity('pharaoh', { bookOsis: 'Gen', chapter: 47, verse: 3 });
  assert.ok(resolved, 'Pharaoh in Genesis 47 must resolve to a biblical entity');
  assert.match(resolved.name, /Pharaoh/i);
  assert.match(resolved.ancientRegion, /Egypt/i);
  assert.match(resolved.dateRange, /1876|1800|Middle Kingdom/i);
  assert.ok(resolved.regionOfPower, 'Must include region of power');
  assert.match(resolved.regionOfPower, /Egypt/i);
  assert.ok(resolved.alliesAndContemporaries, 'Must include allies and contemporaries');
  assert.equal(resolved.relatedEmpireId, 'egypt');
  assert.equal(resolved.relatedRouteId, 'joseph-egypt');
  assert.equal(resolved.stopIndex, 4);
  // Coords must focus on Egypt / Nile Delta
  assert.ok(resolved.coords.lat >= 29.5 && resolved.coords.lat <= 31.0);
  assert.ok(resolved.coords.lng >= 31.0 && resolved.coords.lng <= 32.5);
});

test('Jacob path begins at Isaac\'s tents (Beer-sheba / Lahai-roi) where brothers were born and birthright sold', () => {
  const match25 = getJourneyStopForPassage('Gen', 25, 26);
  assert.ok(match25, 'Genesis 25:26 must map to Jacob\'s journey');
  assert.equal(match25.route.id, 'jacob-padan-aram');
  assert.equal(match25.stopIndex, 0);
  assert.match(match25.stop.name, /Tents of Isaac|Lahai-roi|Beer-sheba/i);
  assert.match(match25.stop.note, /born at Isaac's tents/i);
  assert.match(match25.stop.note, /birthright/i);
  assert.match(match25.stop.note, /blessing/i);

  const match27 = getJourneyStopForPassage('Gen', 27, 30);
  assert.ok(match27, 'Genesis 27:30 must map to Jacob\'s journey stop 0');
  assert.equal(match27.stopIndex, 0);
});

test('Clicking Joseph resolves to Joseph: From Canaan\'s Pit to Ruler of Egypt', () => {
  const resolved = resolveBiblicalEntity('joseph', { bookOsis: 'Gen', chapter: 47, verse: 1 });
  assert.ok(resolved, 'Joseph must resolve');
  assert.match(resolved.name, /Joseph/i);
  assert.match(resolved.name, /Grand Vizier/i);
  assert.equal(resolved.relatedRouteId, 'joseph-egypt');
  assert.equal(resolved.stopIndex, 4);
});

test('Geographic places in Egypt & Patriarchal narrative are resolved as entities', () => {
  const goshen = resolveBiblicalEntity('goshen');
  assert.ok(goshen, 'Goshen must resolve');
  assert.match(goshen.name, /Goshen/i);
  assert.match(goshen.ancientRegion, /Nile Delta|Egypt/i);

  const rameses = resolveBiblicalEntity('rameses');
  assert.ok(rameses, 'Rameses must resolve');

  const memphis = resolveBiblicalEntity('memphis');
  assert.ok(memphis, 'Memphis must resolve');

  const canaan = resolveBiblicalEntity('canaan');
  assert.ok(canaan, 'Canaan must resolve');

  const haran = resolveBiblicalEntity('haran');
  assert.ok(haran, 'Haran must resolve');
});

test('Generic vocabulary words return null so they route to Word Inspector', () => {
  assert.equal(resolveBiblicalEntity('shepherds'), null);
  assert.equal(resolveBiblicalEntity('flocks'), null);
  assert.equal(resolveBiblicalEntity('famine'), null);
  assert.equal(resolveBiblicalEntity('pasture'), null);
});
