import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { LocalFirstStore } from '../src/store/localFirstStore.ts';
import { getNameAliases, getNameIdentities, getNameKind, getNameIdentityEvidence, getIdentityRefs, reviewedIdentityNames } from '../src/data/nameIdentities.ts';

test('identity selections keep reviewed referents separate and retain unreviewed occurrences', () => {
  const refs = ['Gen.4.2', 'Gen.4.8', '2Sam.20.15', '1Sam.6.18'];
  assert.equal(getNameKind('Abel'), 'mixed');
  assert.equal(getNameKind('Mary'), 'person');
  assert.equal(getNameKind('Eli'), 'mixed');
  assert.equal(getNameKind('unlisted'), 'unclassified');
  for (const name of ['constructor', '__proto__', 'toString']) {
    assert.deepEqual(getNameIdentities(name), [], 'unknown spellings cannot resolve inherited object properties');
    assert.equal(getNameKind(name), 'unclassified');
  }
  assert.deepEqual(getIdentityRefs('Abel', 'abel-brother-of-cain', refs), ['Gen.4.2', 'Gen.4.8']);
  assert.deepEqual(getIdentityRefs('Abel', 'abel-city', refs), ['2Sam.20.15']);
  assert.deepEqual(getIdentityRefs('Abel', 'unresolved', refs), ['1Sam.6.18']);
  assert.deepEqual(getIdentityRefs('Abel', 'all', refs), refs);
  assert.deepEqual(getIdentityRefs('Abel', 'invalid-id', refs), [], 'invalid selectors cannot silently broaden the study');
  assert.deepEqual(getIdentityRefs('unlisted', 'unresolved', refs), refs);
  assert.equal(getNameIdentityEvidence('Abel').review, 'partial');
  assert.equal(getNameIdentityEvidence('unlisted').review, 'unreviewed');
  assert.ok(getNameIdentities('Mary').filter(identity => identity.refs.includes('John.19.25')).length === 2,
    'a verse can explicitly name multiple people with the same spelling');
  const aliases = getNameAliases('Saul');
  assert.equal(aliases.length, 1);
  assert.equal(aliases[0].identityId, 'saul-paul');
  assert.deepEqual(aliases[0].refs, ['Acts.13.9']);
  assert.equal(getNameAliases('Mary').length, 0, 'similar names do not establish an alias');
});

test('every reviewed identity and alternate name cites the canonical corpus and indexed spelling', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async input => new Response(await readFile(new URL(`../public${input}`, import.meta.url), 'utf8'));
  try {
    const store = new LocalFirstStore(); await store.init();
    assert.ok(reviewedIdentityNames.length >= 15 && reviewedIdentityNames.length <= 40, 'keep the editorial seed explicitly bounded');
    for (const name of reviewedIdentityNames) {
      const entry = store.getNetworkName(name);
      assert.ok(entry, `indexed entry exists: ${name}`);
      const identities = getNameIdentities(name);
      assert.equal(new Set(identities.map(identity => identity.id)).size, identities.length, `unique identity IDs: ${name}`);
      for (const identity of identities) {
        assert.equal(identity.claimClass, 'SCRIPTURAL_INFERENCE');
        assert.ok(identity.refs.length && identity.note.length, `evidence and limitations: ${name}`);
        assert.equal(new Set(identity.refs).size, identity.refs.length);
        for (const ref of identity.refs) {
          const verse = store.getVerseByOsis(ref);
          assert.ok(verse, `canonical evidence exists: ${name} ${ref}`);
          assert.ok(entry.refs.includes(ref), `identity must be a subset of indexed spelling occurrences: ${name} ${ref}`);
          assert.ok(verse.text.toLowerCase().includes(name.toLowerCase().replace(/-/g, '')), `evidence names the entry: ${name} ${ref}`);
        }
      }
      const known = new Set(identities.flatMap(identity => identity.refs));
      assert.deepEqual(getIdentityRefs(name, 'unresolved', entry.refs), entry.refs.filter(ref => !known.has(ref)));
      for (const alias of getNameAliases(name)) {
        assert.ok(identities.some(identity => identity.id === alias.identityId));
        assert.ok(getNameIdentities(alias.name).some(identity => identity.id === alias.targetIdentityId));
        for (const ref of alias.refs) {
          const verse = store.getVerseByOsis(ref);
          assert.ok(verse && verse.text.includes(name) && verse.text.includes(alias.name), `alias must be explicit in the cited verse: ${name}/${alias.name}`);
        }
      }
    }
  } finally { globalThis.fetch = originalFetch; }
});
