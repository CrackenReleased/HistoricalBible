import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addStudyBookmark, parseStudyBookmarks, readStudyBookmarks, writeStudyBookmarks, MAX_STUDY_BOOKMARKS } from '../src/store/studyBookmarks.ts';

const study = (name = 'Abel') => ({ label: name, href: `/interact?name=${encodeURIComponent(name)}&view=graph`, savedAt: '2026-10-17T12:00:00.000Z' });

test('saved studies retain complete local links and reject corrupt or external entries', () => {
  const pair = { ...study(), href: '/interact.html?name=Abel&compare=Cain&identity=person&book=Gen&view=graph' };
  const entries = parseStudyBookmarks(JSON.stringify([pair, pair, null, {}, { ...study(), href: 'https://evil.example/interact?name=Abel' }, { ...study(), href: 'javascript:alert(1)' }, { ...study(), href: '/interact/../other?name=Abel' }, { ...study(), savedAt: 'invalid' }]));
  assert.deepEqual(entries, [pair]);
  assert.deepEqual(parseStudyBookmarks('broken JSON'), []);
  assert.deepEqual(parseStudyBookmarks('{}'), []);
});

test('bookmark capacity preserves saved studies and an existing link updates without duplicates', () => {
  const entries = Array.from({ length: MAX_STUDY_BOOKMARKS }, (_, index) => study(`Name ${index}`));
  assert.deepEqual(addStudyBookmark(entries, study('New name')), entries);
  const replacement = { ...entries[10], label: 'Updated study' };
  const updated = addStudyBookmark(entries, replacement);
  assert.equal(updated.length, MAX_STUDY_BOOKMARKS);
  assert.deepEqual(updated[0], replacement);
  assert.equal(updated.filter(item => item.href === replacement.href).length, 1);
  assert.equal(parseStudyBookmarks(JSON.stringify([...entries, study('Overflow')])).length, MAX_STUDY_BOOKMARKS);
});

test('blocked storage never crashes reading or claims a successful write', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); } };
  assert.deepEqual(readStudyBookmarks(blocked), []);
  assert.equal(writeStudyBookmarks(blocked, [study()]), false);
  let stored = '';
  const available = { getItem() { return stored; }, setItem(_key: string, value: string) { stored = value; } };
  assert.equal(writeStudyBookmarks(available, [study()]), true);
  assert.deepEqual(readStudyBookmarks(available), [study()]);
  assert.equal(writeStudyBookmarks(available, []), true);
  assert.deepEqual(readStudyBookmarks(available), []);
});
