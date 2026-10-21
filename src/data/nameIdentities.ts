/**
 * Canonical home for HistoricalBible's reviewed occurrence identities, separate from
 * lexical name_audit.json. The Names directory and study controls consume this seed.
 * Provenance: cited verses in public/data/kjv_verses.json, read in their local context.
 * These are fallible SCRIPTURAL_INFERENCE annotations, not changes to Scripture.
 * Retain with the feature; update only after checking the cited canonical passages.
 * Scope: 22 spelling entries, maximum 40 before a separate editorial review. No
 * personal/private data, external quotations, or inferred bulk occurrence mappings.
 * Regression validation checks IDs, citations, spelling membership and alias evidence.
 */
export type IdentityKind = 'person' | 'place' | 'term';
export type NameKind = IdentityKind | 'mixed' | 'unclassified';
export interface NameIdentity {
  id: string;
  label: string;
  kind: IdentityKind;
  refs: readonly string[];
  note: string;
  claimClass: 'SCRIPTURAL_INFERENCE';
}
export interface NameAlias {
  name: string;
  identityId: string;
  targetIdentityId: string;
  refs: readonly string[];
  note: string;
}
const identity = (id: string, label: string, kind: IdentityKind, refs: string[], note: string): NameIdentity =>
  ({ id, label, kind, refs, note, claimClass: 'SCRIPTURAL_INFERENCE' });

const identities: Readonly<Record<string, readonly NameIdentity[]>> = {
  Abel: [
    identity('abel-brother-of-cain', 'Abel, brother of Cain', 'person', ['Gen.4.2', 'Gen.4.8'], 'These passages explicitly identify Abel as Cain’s brother.'),
    identity('abel-city', 'Abel, the city in 2 Samuel 20', 'place', ['2Sam.20.14', '2Sam.20.15', '2Sam.20.18'], 'The siege narrative identifies a city; this does not assign the stone of Abel in 1 Samuel 6:18.'),
  ],
  Mary: [
    identity('mary-mother-of-jesus', 'Mary, mother of Jesus', 'person', ['Matt.1.18', 'Matt.13.55'], 'These passages explicitly identify Jesus’s mother.'),
    identity('mary-magdalene', 'Mary Magdalene', 'person', ['Luke.8.2', 'John.19.25'], 'Both verses explicitly use Magdalene. John 19:25 also names another Mary.'),
    identity('mary-sister-of-martha', 'Mary, sister of Martha', 'person', ['Luke.10.39', 'John.11.1'], 'Luke 10:38–39 names Martha and her sister; John 11:1 names both sisters at Bethany.'),
    identity('mary-cleophas', 'Mary, wife of Cleophas', 'person', ['John.19.25'], 'The KJV identifies Mary with Cleophas; wife is marked as a supplied word in the canonical text. No identification with other Marys is imposed.'),
    identity('mary-mother-of-john', 'Mary, mother of John whose surname was Mark', 'person', ['Acts.12.12'], 'The verse identifies this Mary by her son; no other Mary entry is merged with her.'),
  ],
  Simon: [
    identity('simon-peter', 'Simon called Peter', 'person', ['Matt.4.18'], 'The verse explicitly joins Simon and Peter; it does not identify every Simon as Peter.'),
    identity('simon-canaanite', 'Simon the Canaanite', 'person', ['Matt.10.4'], 'The apostle list uses this identifying description.'),
    identity('simon-leper', 'Simon the leper', 'person', ['Matt.26.6'], 'The verse names Simon the leper and his house in Bethany.'),
    identity('simon-cyrene', 'Simon of Cyrene', 'person', ['Matt.27.32'], 'The verse identifies the man compelled to bear the cross.'),
    identity('simon-sorcery', 'Simon who used sorcery', 'person', ['Acts.8.9'], 'The verse identifies this Simon by his activity in Samaria.'),
    identity('simon-tanner', 'Simon the tanner', 'person', ['Acts.9.43'], 'The verse explicitly identifies Simon as a tanner in Joppa.'),
  ],
  Peter: [identity('peter-apostle', 'Peter, also called Simon', 'person', ['Matt.4.18'], 'Simon called Peter is explicitly named alongside his brother Andrew.')],
  Abram: [identity('abram-patriarch', 'Abram, named Abraham', 'person', ['Gen.17.5'], 'The verse explicitly gives the change from Abram to Abraham.')],
  Abraham: [identity('abraham-patriarch', 'Abraham, previously Abram', 'person', ['Gen.17.5'], 'The verse explicitly gives the change from Abram to Abraham.')],
  Saul: [
    identity('saul-king', 'Saul, king of Israel', 'person', ['1Sam.9.2', '1Sam.11.15'], 'First Samuel 9 introduces Saul; 11:15 records his being made king.'),
    identity('saul-paul', 'Saul, also called Paul', 'person', ['Acts.13.9'], 'Acts says also called Paul; this is not a claim that he was renamed at conversion.'),
    identity('saul-rehoboth', 'Saul of Rehoboth', 'person', ['Gen.36.37'], 'This ruler succeeds Samlah in the Genesis 36 list, distinct from the other reviewed Sauls.'),
  ],
  Paul: [identity('paul-apostle', 'Paul, also called Saul', 'person', ['Acts.13.9'], 'The verse explicitly joins Saul and Paul; it does not say that conversion changed his name.')],
  Noah: [
    identity('noah-genesis', 'Noah in Genesis', 'person', ['Gen.6.9'], 'Genesis identifies Noah as a man who walked with God.'),
    identity('noah-daughter', 'Noah, daughter of Zelophehad', 'person', ['Num.26.33'], 'The verse explicitly lists Noah among Zelophehad’s daughters.'),
  ],
  Adam: [identity('adam-genesis', 'Adam in Genesis', 'person', ['Gen.2.19', 'Gen.3.20'], 'These passages identify Adam as naming the creatures and his wife Eve.')],
  Eve: [identity('eve-wife-of-adam', 'Eve, wife of Adam', 'person', ['Gen.3.20'], 'The verse explicitly names Adam’s wife Eve.')],
  Moses: [identity('moses-exodus', 'Moses in Exodus', 'person', ['Exod.2.10', 'Exod.4.14'], 'Exodus 2 names the child Moses; 4:14 identifies Aaron as his brother.')],
  Aaron: [identity('aaron-brother-of-moses', 'Aaron, brother of Moses', 'person', ['Exod.4.14'], 'The verse identifies Aaron the Levite as Moses’s brother.')],
  David: [identity('david-son-of-jesse', 'David, son of Jesse', 'person', ['1Sam.17.12'], 'The verse names David’s father Jesse.')],
  Jerusalem: [identity('jerusalem-city', 'Jerusalem in David’s narrative', 'place', ['2Sam.5.6'], 'The passage describes the city occupied by the Jebusites. Other uses, including heavenly Jerusalem, are not assigned here.')],
  Nazareth: [identity('nazareth-city', 'Nazareth, city of Galilee', 'place', ['Luke.1.26'], 'The verse explicitly calls Nazareth a city of Galilee.')],
  Galilee: [identity('galilee-region', 'Galilee, region containing Nazareth', 'place', ['Luke.1.26', 'Matt.4.15'], 'These verses identify Galilee geographically; this does not conflate it with Nazareth.')],
  Egypt: [identity('egypt-land', 'Egypt in Abram’s journey', 'place', ['Gen.12.10'], 'The verse describes Abram going into Egypt. Figurative uses elsewhere are left unassigned.')],
  Jordan: [identity('jordan-baptism', 'Jordan, place of baptism', 'place', ['Matt.3.6'], 'The verse describes baptism in Jordan; no map coordinate is inferred from this annotation.')],
  Eden: [identity('eden-garden-region', 'Eden, where the garden was planted', 'place', ['Gen.2.8'], 'The verse locates the garden eastward in Eden; no modern geographic identification is asserted.')],
  Alleluia: [identity('alleluia-expression', 'Alleluia, expression in praise', 'term', ['Rev.19.1'], 'The word appears in the heavenly praise; it is not a personal name.')],
  Eli: [
    identity('eli-priest', 'Eli the priest', 'person', ['1Sam.1.9'], 'The verse explicitly names Eli as the priest.'),
    identity('eli-expression', 'Eli in Jesus’s cry', 'term', ['Matt.27.46'], 'Matthew interprets the cry in the verse itself; it is not a reference to the priest Eli.'),
  ],
  Nahor: [
    identity('nahor-father-terah', 'Nahor, father of Terah', 'person', ['Gen.11.24'], 'Genesis 11:24 says this Nahor begat Terah; he is not Terah’s son of the same name.'),
    identity('nahor-son-terah', 'Nahor, son of Terah and brother of Abram', 'person', ['Gen.11.26', 'Gen.22.20'], 'Genesis 11:26 lists Nahor among Terah’s sons; Genesis 22:20 calls him Abraham’s brother.'),
    identity('nahor-city', 'City of Nahor', 'place', ['Gen.24.10'], 'This verse names a city of Nahor; the place reference is not silently assigned to either man.'),
  ],
  Jehoash: [
    identity('jehoash-judah', 'Jehoash, king of Judah', 'person', ['2Kgs.12.1'], 'The verse says he reigned in Jerusalem; this is not the king of Israel in 2 Kings 13.'),
    identity('jehoash-israel', 'Jehoash, king of Israel', 'person', ['2Kgs.13.10'], 'The verse calls him son of Jehoahaz and says he reigned in Samaria, distinct from Joash king of Judah named in the same verse.'),
  ],
  Joash: [
    identity('joash-judah', 'Joash, king of Judah', 'person', ['2Kgs.12.19', '2Kgs.13.1'], 'The Judah king is named in 2 Kings 12:19 and identified as son of Ahaziah in 13:1.'),
    identity('joash-israel', 'Joash, king of Israel', 'person', ['2Kgs.13.9', '2Kgs.13.14'], 'The son of Jehoahaz reigns in Samaria; 13:14 identifies him during Elisha’s illness.'),
  ],
};

const aliasPairs = [
  { a: 'Simon', aId: 'simon-peter', b: 'Peter', bId: 'peter-apostle', ref: 'Matt.4.18', note: 'Simon called Peter; other Simons are not included.' },
  { a: 'Abram', aId: 'abram-patriarch', b: 'Abraham', bId: 'abraham-patriarch', ref: 'Gen.17.5', note: 'The verse explicitly changes Abram’s name to Abraham.' },
  { a: 'Saul', aId: 'saul-paul', b: 'Paul', bId: 'paul-apostle', ref: 'Acts.13.9', note: 'Also called Paul; this does not apply to king Saul or assert a conversion-time renaming.' },
];
export const reviewedIdentityNames: readonly string[] = Object.keys(identities);
const spellingIndex = new Map(reviewedIdentityNames.map(name => [name.toLowerCase(), name]));
const canonicalSpelling = (name: string): string => spellingIndex.get(name.trim().toLowerCase()) || name;

export function getNameIdentities(name: string): readonly NameIdentity[] {
  const spelling = canonicalSpelling(name);
  return Object.hasOwn(identities, spelling) ? identities[spelling] : [];
}

/** Directory classification describes the reviewed senses, never every occurrence. */
export function getNameKind(name: string): NameKind {
  const kinds = new Set(getNameIdentities(name).map(item => item.kind));
  return kinds.size > 1 ? 'mixed' : kinds.values().next().value || 'unclassified';
}

export function getNameIdentityEvidence(name: string): { kind: NameKind; refs: string[]; review: 'partial' | 'unreviewed'; note: string } {
  const entries = getNameIdentities(name);
  return {
    kind: getNameKind(name), refs: [...new Set(entries.flatMap(entry => [...entry.refs]))],
    review: entries.length ? 'partial' : 'unreviewed',
    note: entries.length
      ? 'Selected passages have reviewed identities. Other occurrences remain unassigned; categories describe only the reviewed senses.'
      : 'No occurrence identities have been reviewed for this spelling. Dictionary meanings do not establish identity.',
  };
}

export function getNameAliases(name: string): readonly NameAlias[] {
  const spelling = canonicalSpelling(name);
  return aliasPairs.filter(pair => pair.a === spelling || pair.b === spelling).map(pair => ({
    name: pair.a === spelling ? pair.b : pair.a,
    identityId: pair.a === spelling ? pair.aId : pair.bId,
    targetIdentityId: pair.a === spelling ? pair.bId : pair.aId,
    refs: [pair.ref], note: pair.note,
  }));
}

/** Keep source order and never assign unknown references by book, spelling, or gloss. */
export function getIdentityRefs(name: string, identityId: string, allRefs: readonly string[]): string[] {
  if (identityId === 'all') return [...allRefs];
  const entries = getNameIdentities(name);
  if (identityId === 'unresolved') {
    const assigned = new Set(entries.flatMap(entry => [...entry.refs]));
    return allRefs.filter(ref => !assigned.has(ref));
  }
  const selected = entries.find(entry => entry.id === identityId);
  return selected ? allRefs.filter(ref => selected.refs.includes(ref)) : [];
}
