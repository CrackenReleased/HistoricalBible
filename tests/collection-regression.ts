import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { LocalFirstStore } from '../src/store/localFirstStore.ts';

test('collection overview counts the loaded records and draws only real book connections', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => new Response(await readFile(new URL(`../public${input}`, import.meta.url), 'utf8'));
  try {
    const store = new LocalFirstStore();
    await store.init();
    const overview = store.getCollectionOverview();
    const corpus = JSON.parse(await readFile(new URL('../public/data/kjv_verses.json', import.meta.url), 'utf8'));
    const { links } = JSON.parse(await readFile(new URL('../public/data/cross_references_curated.json', import.meta.url), 'utf8'));
    const history = JSON.parse(await readFile(new URL('../public/data/history/historical_synchrony.v1.json', import.meta.url), 'utf8'));
    assert.equal(overview.connections, links.length);
    assert.equal(overview.verses, corpus.length);
    assert.equal(overview.profiles, history.figures.length);
    assert.equal(overview.empires, history.empires.length);
    const books = [...new Set(corpus.map(verse => store.toOsisRef(verse).split('.')[0]))];
    assert.equal(overview.books, books.length);
    const realPairs = new Set(links.map(link => [books.indexOf(link.s.split('.')[0]), books.indexOf(link.t.split('.')[0])].sort((a, b) => a - b).join(':')));
    assert.ok(overview.pairs.length > 0 && overview.pairs.length <= 180);
    for (const pair of overview.pairs) assert.ok(realPairs.has(`${pair.from}:${pair.to}`));
    assert.equal(new Set(overview.pairs.map(pair => `${pair.from}:${pair.to}`)).size, overview.pairs.length);
    // All advertised entry points still resolve through the existing search engine.
    assert.equal(store.searchAll('John 3:16').verses[0].book, 'John');
    assert.ok(store.searchAll('Daniel').figures.some(figure => figure.id === 'daniel'));
    assert.ok(store.searchAll('Pilate').figures.some(figure => figure.id === 'jesus-christ'));
    assert.ok(store.searchAll('Rome').empires.some(empire => empire.id === 'rome'));
    assert.ok(store.searchAll('In the beginning').verses.some(verse => verse.book === 'Genesis' && verse.chapter === 1 && verse.verse === 1));
    assert.equal(store.searchAll('xyznonexistent987654').verses.length, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
