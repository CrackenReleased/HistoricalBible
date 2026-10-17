import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterStudyGraph, normalizeGraphSettings } from '../src/engine/egoGraph.ts';
import type { EgoGraphData } from '../src/engine/egoGraph.ts';

const fixture: EgoGraphData = {
  centerId: 'a', centerTitle: 'A',
  nodes: ['a', 'b', 'c', 'd', 'e', 'orphan'].map((id, index) => ({ id, title: id.toUpperCase(), type: 'name', hop: index === 0 ? 0 : index < 3 ? 1 : 2, degree: 1 })),
  edges: [
    { source: 'a', target: 'b', weight: 8, kind: 'shared', evidence: ['Gen.1.1'] },
    { source: 'a', target: 'c', weight: 1, kind: 'relationship' },
    { source: 'b', target: 'd', weight: 2, kind: 'shared' },
    { source: 'c', target: 'e', weight: 1, kind: 'contemporary' },
    { source: 'missing', target: 'orphan', weight: 9, kind: 'shared' },
  ],
};

test('edge type filtering removes unreachable descendants and dangling edges', () => {
  const result = filterStudyGraph(fixture, { kinds: ['shared', 'contemporary'] });
  assert.deepEqual(result.nodes.map(n => n.id), ['a', 'b', 'd']);
  assert.equal(result.totalEdges, 4);
  assert.equal(result.edges.length, 2);
});

test('minimum shared verses does not remove curated or contemporary connections', () => {
  const result = filterStudyGraph(fixture, { minSharedVerses: 5 });
  assert.deepEqual(new Set(result.nodes.map(n => n.id)), new Set(['a', 'b', 'c', 'e']));
  assert.equal(result.edges.length, 3);
});

test('density limits preserve connecting paths and a pinned comparison', () => {
  const result = filterStudyGraph({ ...fixture, pinnedIds: ['e'] }, { maxNodes: 3 });
  assert.deepEqual(new Set(result.nodes.map(n => n.id)), new Set(['a', 'c', 'e']));
  assert.equal(result.edges.length, 2);
});

test('hops and an empty kind selection do not manufacture connections', () => {
  assert.deepEqual(filterStudyGraph(fixture, { maxHops: 1 }).nodes.map(n => n.id), ['a', 'b', 'c']);
  const result = filterStudyGraph({ ...fixture, pinnedIds: ['e'] }, { kinds: [] });
  assert.deepEqual(result.nodes.map(n => n.id), ['a', 'e']);
  assert.deepEqual(result.edges, []);
});

test('untrusted graph settings normalize into bounded valid values', () => {
  const result = normalizeGraphSettings({ maxNodes: NaN, minSharedVerses: -3, kinds: ['shared', 'shared', 'invalid'] as any });
  assert.equal(result.maxNodes, 30);
  assert.equal(result.minSharedVerses, 1);
  assert.deepEqual(result.kinds, ['shared']);
});
