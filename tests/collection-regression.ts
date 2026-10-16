import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { LocalFirstStore } = await import(process.env.STORE_UNDER_TEST || '../src/store/localFirstStore.ts');

test('public documentation does not claim manual transcription of the Bible', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  assert.equal(/hand[- ]?typed|(?:re[- ]?typed|typed)\s+by\s+hand|work of my fingers|keystroke[- ]by[- ]keystroke/i.test(readme), false, 'README must not repeat the unsupported transcription story');
  for (const file of ['changelog.md', 'HANDOFF.md', 'what_and_how_log.md']) {
    const content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.equal(/Joel(?: McCracken Jr\.?)?'s hand[- ]typed|hand[- ]typed (?:authoritative|KJV|textual)|(?:re[- ]?typed|typed)\s+(?:the entire Bible\s+)?by\s+hand|work of Joel's fingers|keystroke[- ]by[- ]keystroke/i.test(content), false, `${file} must not assert the unsupported transcription story`);
  }
});

test('collection overview counts the loaded records and draws only real book connections', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => new Response(await readFile(new URL(`../public${input}`, import.meta.url), 'utf8'));
  try {
    const store = new LocalFirstStore();
    await store.init();
    const overview = store.getCollectionOverview();
    const corpus = JSON.parse(await readFile(new URL('../public/data/kjv_verses.json', import.meta.url), 'utf8'));
    const { links } = JSON.parse(await readFile(new URL('../public/data/cross_references_bundle.json', import.meta.url), 'utf8'));
    const history = JSON.parse(await readFile(new URL('../public/data/history/historical_synchrony.v1.json', import.meta.url), 'utf8'));
    assert.equal(overview.connections, links.length);
    assert.equal(overview.verses, corpus.length);
    assert.equal(overview.profiles, history.figures.length);
    assert.equal(overview.empires, history.empires.length);
    const books = [...new Set(corpus.map(verse => store.toOsisRef(verse).split('.')[0]))];
    assert.equal(overview.books, books.length);
    assert.equal(overview.connections, 344799, 'every original source record must be reachable');
    assert.equal(overview.names, 2453);
    assert.equal(overview.nameEdges, 12323);
    assert.equal(overview.chapters, 1189);
    assert.equal(store.getNetwork().meta.sourceVerseCount, 31102);
    assert.equal(store.getNetwork().meta.unavailableSiteRefs.length, 4);
    assert.equal(store.getRankedNames('', Infinity).length, 2453, 'no reviewed linked entry may silently disappear from the directory');
    assert.equal(store.getBooks().reduce((sum, book) => sum + book.chapters, 0), 1189);
    assert.equal(store.getReferenceRecords().filter(record => Number(record.v) < 0).length, 1229);
    assert.ok(store.getReferenceRecords().some(record => record.r?.includes('-')));
    const gideon = store.getNetworkName('Gideon');
    assert.equal(gideon.refs.length, 37);
    assert.equal(gideon.refs[0], 'Judg.6.11');
    assert.equal(store.getConnectedNames('Gideon').length, 21);
    assert.equal(store.getSharedRefs('Gideon', 'Israel').length, 9);
    assert.equal(store.getSharedRefs('Israel', 'Gideon').length, 9);
    const network = store.getNetwork(), nameRefs = network.names.map(name => new Set(name.refs));
    for (const [a, b, count] of network.edges) {
      assert.equal(network.names[a].refs.filter(ref => nameRefs[b].has(ref)).length, count, `shared verses must substantiate ${network.names[a].name} / ${network.names[b].name}`);
    }
    assert.equal(store.referenceContains('John.3.14-John.3.18', 'John.3.16'), true);
    assert.equal(store.referenceContains('John.3.14-John.3.18', 'John.3.19'), false);
    assert.equal(store.referenceContains('John.3.14-John.4.2', 'John.4.1'), true);
    assert.deepEqual(store.expandReference('John.3.14-John.3.18'), ['John.3.14','John.3.15','John.3.16','John.3.17','John.3.18']);
    assert.equal(store.getVerseByOsis('Rev.22.21'), null, 'do not invent missing canonical text');
    assert.equal(store.getChapterReferences('rev', 22).at(-1), 'Rev.22.21', 'all 31,102 verse identifiers must be browsable, including unavailable text');
    assert.equal(store.getBooks().reduce((total, book) => total + Array.from({length: book.chapters}, (_, i) => store.getChapterReferences(book.osis, i + 1).length).reduce((a, b) => a + b, 0), 0), 31102);
    assert.equal(store.expandReference('Rev.22.20-Rev.22.21').at(-1), 'Rev.22.21', 'unavailable range endpoints must stay visible');
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
