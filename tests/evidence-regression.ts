import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ARCHAEOLOGICAL_SITES } from '../src/data/ancientMapData.ts';
import { EVIDENCE_RECEIPTS, getArtifactDisplay } from '../src/data/evidenceReceipts.ts';
import { REVIEWED_DATED_EVENTS, getDatedEvent } from '../src/data/datedEvents.ts';
import { REVIEWED_CROSS_REFERENCES } from '../src/data/reviewedCrossReferences.ts';
import { getReviewedWordOccurrence } from '../src/data/reviewedWordOccurrences.ts';

test('artifact cards require a source receipt before showing catalog claims as reviewed', () => {
  assert.equal(ARCHAEOLOGICAL_SITES.length, 20);
  assert.equal(new Set(ARCHAEOLOGICAL_SITES.map(site => site.id)).size, 20);
  assert.deepEqual(Object.keys(EVIDENCE_RECEIPTS).sort(), ARCHAEOLOGICAL_SITES.map(site => site.id).sort(),
    'all 20 atlas artifacts need an individually scoped receipt');
  assert.equal(EVIDENCE_RECEIPTS['caiaphas-ossuary'].status, 'proposed');
  assert.equal(EVIDENCE_RECEIPTS['erastus-inscription'].status, 'proposed');
  assert.equal(EVIDENCE_RECEIPTS['siloam-inscription'].status, 'disputed');
  assert.equal(EVIDENCE_RECEIPTS['lachish-ostraca'].status, 'disputed');
  assert.equal(EVIDENCE_RECEIPTS['sergius-paulus-inscription'].status, 'proposed');
  assert.equal(ARCHAEOLOGICAL_SITES.find(site => site.id === 'black-obelisk')?.figureId, undefined,
    'Jehu must not route through Hezekiah’s identity');
  assert.equal(ARCHAEOLOGICAL_SITES.find(site => site.id === 'sargon-prism')?.figureId, undefined,
    'Sargon’s inscription must not route through Hezekiah’s identity');
  assert.equal(ARCHAEOLOGICAL_SITES.find(site => site.id === 'merneptah-stele')?.figureId, undefined,
    'Merneptah’s later name reference must not route through Moses’s identity');
  assert.equal(ARCHAEOLOGICAL_SITES.find(site => site.id === 'sergius-paulus-inscription')?.modernCountry, 'Cyprus',
    'the reviewed Soloi inscription must be mapped in Cyprus');
  for (const site of ARCHAEOLOGICAL_SITES) {
    const receipt = EVIDENCE_RECEIPTS[site.id];
    const display = getArtifactDisplay(site);
    if (receipt) {
      assert.equal(receipt.siteId, site.id);
      assert.equal(receipt.scriptureRef, site.scriptureOsis);
      assert.match(receipt.sourceUrl, /^https:\/\//);
      assert.ok(receipt.sourceRecord && receipt.connectionMethod && receipt.limitation && receipt.reuse);
      assert.equal(display.description, site.description);
      assert.ok(!receipt.sourceUrl.includes('wikipedia.org'));
    } else {
      assert.notEqual(display.description, site.description, `${site.id} must not show unreviewed catalog prose`);
      assert.notEqual(display.significance, site.significance);
      assert.match(display.significance, /review pending/i);
      assert.match(display.sourceLabel, /not a reviewed object record/i);
    }
  }
});

test('reviewed chronology has passage-level evidence and no automatic verse dating', () => {
  assert.equal(REVIEWED_DATED_EVENTS.length, 2);
  for (const event of REVIEWED_DATED_EVENTS) {
    const [book, chapter, verse] = event.ref.split('.');
    assert.equal(getDatedEvent(book, Number(chapter), Number(verse)), event);
    assert.equal(EVIDENCE_RECEIPTS[event.siteId]?.sourceUrl, event.sourceUrl);
    assert.ok(event.method && event.limit && event.meanwhile);
  }
  assert.equal(getDatedEvent('Gen', 1, 2), undefined);
  assert.equal(getDatedEvent('Acts', 18, 13), undefined);
});

test('reviewed quotation links are drawn from but never remove the attributed source archive', async () => {
  const { links } = JSON.parse(await readFile(new URL('../public/data/cross_references_bundle.json', import.meta.url), 'utf8'));
  assert.equal(links.length, 344799);
  assert.equal(links.filter((link: { v: number }) => link.v <= 0).length, 3504);
  for (const link of REVIEWED_CROSS_REFERENCES) {
    assert.equal(link.kind, 'Explicit quotation');
    assert.ok(link.reason && link.sourceCredit);
    assert.ok(links.some((raw: { s: string; t: string }) =>
      (raw.s === link.source && raw.t === link.target) || (raw.s === link.target && raw.t === link.source)));
  }
});

test('word alignment is occurrence-specific and excludes supplied English', () => {
  assert.equal(getReviewedWordOccurrence('Gen.1.2', 'spirit', 'Spirit', false)?.strongsId, 'H7307');
  assert.equal(getReviewedWordOccurrence('Gen.1.2', 'spirit', 'Spirit', true), undefined);
  assert.equal(getReviewedWordOccurrence('Gen.1.3', 'spirit', 'Spirit', false), undefined);
  assert.equal(getReviewedWordOccurrence('Gen.1.2', 'spirit', 'spirit', false), undefined);
});
