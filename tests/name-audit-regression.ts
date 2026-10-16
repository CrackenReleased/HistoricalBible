import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { LocalFirstStore } from '../src/store/localFirstStore.ts';

test('every name has a sourced review; disputed glosses and false personal links cannot reappear', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async input => new Response(await readFile(new URL(`../public${input}`, import.meta.url), 'utf8'));
  try {
    const store = new LocalFirstStore(); await store.init();
    assert.equal(typeof store.getNameReview, 'function', 'the reader must expose name-review evidence');
    const shadrach = store.getNameReview('Shadrach');
    assert.match(shadrach.identity.text, /Hananiah/);
    assert.doesNotMatch(shadrach.displayMeaning, /nipple/i);
    assert.ok(shadrach.hitchcock.some(gloss => /nipple/.test(gloss)), 'preserve source attribution instead of rewriting Hitchcock');
    assert.ok(shadrach.strongs.some(entry => entry.id === 'H7714'));
    assert.equal(shadrach.status, 'uncertain');
    assert.equal(store.getNetworkName('Mark')!.refs.length, 5);
    assert.equal(store.getNameAtReference('mark', '2Sam.13.28'), undefined, 'an English verb must not inherit the person Mark’s lexical note');
    assert.equal(store.getNameAtReference('Mark', 'Acts.12.12')!.name, 'Mark');
    assert.equal(store.getNameAtReference('sin', 'John.8.11'), undefined, 'English sin must not inherit the wilderness Sin’s name study');
    assert.equal(store.getNameAtReference('Sin', 'Exod.16.1')!.name, 'Sin');
    assert.ok(!store.getConnectedNames('Mark').some(name => ['Absalom', 'Amnon', 'Israel', 'Job'].includes(name.name)));
    for (const ref of ['Matt.1.21','Matt.1.25','Matt.27.37','Luke.1.31','Luke.2.21','John.19.19']) {
      assert.ok(store.getNetworkName('Jesus')!.refs.includes(ref), `include the explicitly named JESUS in ${ref}`);
    }
    const audit = JSON.parse(await readFile(new URL('../public/data/name_audit.json', import.meta.url), 'utf8'));
    const original = JSON.parse(await readFile(new URL('../public/data/hitchcock_names.json', import.meta.url), 'utf8'));
    const rawNetwork = JSON.parse(await readFile(new URL('../public/data/bible_network.json', import.meta.url), 'utf8'));
    const expected = new Set([...Object.keys(original), ...rawNetwork.names.map(name => name.name)]);
    assert.equal(audit.entries.length, expected.size);
    assert.equal(new Set(audit.entries.map(entry => entry.name)).size, expected.size);
    const lexicon = {};
    for (const source of audit.meta.sources.files) {
      const bytes = await readFile(new URL(`../audit/name-sources/${source.path}`, import.meta.url));
      assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256);
      if (source.path.endsWith('.js')) {
        const text = bytes.toString('utf8'), assignment = /\bvar\s+strongs\w+Dictionary\s*=\s*/.exec(text)!;
        Object.assign(lexicon, JSON.parse(text.slice(assignment.index + assignment[0].length, text.lastIndexOf('module.exports')).trim().replace(/;$/, '')));
      }
    }
    for (const review of audit.entries) for (const { id, ...excerpt } of review.strongs) assert.deepEqual(excerpt, lexicon[id], `source excerpt mismatch: ${review.name} / ${id}`);
    for (const name of expected) assert.ok(store.getNameReview(name), `missing review for ${name}`);
    for (const name of store.getNetwork().names) assert.equal(name.meaning, store.getNameReview(name.name)!.displayMeaning);
    assert.match(store.getNameReview('Noah')!.identity!.text, /daughter/);
    assert.ok(store.getNameReview('Rahab')!.note.toLowerCase().includes('egypt'));
    assert.match(store.getNameReview('Eli')!.identity!.text, /My God/);
    assert.equal(store.getCollectionOverview().nameEdges, store.getNetwork().edges.length);
    assert.ok(store.getNameReview('Phalti'));
    assert.equal(store.getNetworkName('Abednego')!.refs.length, 14);
    assert.ok(store.getConnectedNames('Shadrach').some(name => name.name === 'Abednego' && name.count === 14));
    assert.ok(store.getRankedNames('Abed-nego').some(name => name.name === 'Abednego'));
    assert.equal(store.getNetworkName('On')!.refs.length, 4);
    assert.equal(store.getNetworkName('No')!.refs.length, 5);
    assert.equal(store.getNetworkName('So')!.refs.length, 1);
    assert.match(store.getNameReview('Arphaxad')!.identity!.text, /sons of Shem/);
    assert.match(store.getNameReview('Lo-ruhamah')!.identity!.text, /daughter/);
  } finally { globalThis.fetch = originalFetch; }
});

test('unavailable lexical audit never revives unchecked glosses or blocks Scripture', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async input => input === '/data/name_audit.json'
    ? new Response('', { status: 503 })
    : new Response(await readFile(new URL(`../public${input}`, import.meta.url), 'utf8'));
  try {
    const store = new LocalFirstStore(); await store.init();
    assert.equal(store.getVerseCount(), 31098);
    assert.equal(store.getNameReview('Shadrach'), undefined);
    assert.match(store.getNetworkName('Shadrach')!.meaning, /unavailable/);
    assert.doesNotMatch(store.getNetworkName('Shadrach')!.meaning, /nipple/i);
  } finally { globalThis.fetch = originalFetch; }
});
