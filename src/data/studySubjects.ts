/** Reviewed search vocabulary, separate from canonical Scripture and person metadata.
 * Owned and consumed by Interact search, share links and study headings. Public,
 * fallible annotations retained with this feature; review passages before updating.
 * One entry / 16 references; cap at 25 entries before a separate editorial review.
 * No generated biography, tracking, private data, or copies of canonical verse text.
 */
export const studySubjects = [{
  id: 'balaams-donkey',
  name: 'Balaam’s donkey',
  aliases: ["Balaam's donkey", "Balam's donkey", "Balaam's ass", "Balam's ass", 'Balaams donkey', 'Balams donkey', 'Balaam donkey', 'Balam donkey'],
  note: 'The KJV calls this animal Balaam’s “ass.” Read the account in Numbers 22:21–35 and the reference in 2 Peter 2:16.',
  refs: [...Array.from({ length: 15 }, (_, index) => `Num.22.${21 + index}`), '2Pet.2.16'],
}];
const normalize = (value: string) => value.toLowerCase().replace(/[’']/g, '').replace(/\s+/g, ' ').trim();
export function findStudySubject(query: string) {
  const key = normalize(query);
  return studySubjects.find(subject => subject.id === key || [subject.name, ...subject.aliases].some(alias => normalize(alias) === key));
}
