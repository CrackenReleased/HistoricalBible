/** Manually checked occurrence alignments. A spelling-level lexicon lookup is not one. */
export interface ReviewedWordOccurrence {
  ref: string;
  english: string;
  surface: string;
  lemma: string;
  transliteration: string;
  strongsId: string;
  sourceUrl: string;
  reviewNote: string;
}

const alignments: readonly ReviewedWordOccurrence[] = [
  {
    ref: 'Gen.1.2', english: 'spirit', surface: 'Spirit', lemma: 'רוּחַ',
    transliteration: 'rûwach', strongsId: 'H7307',
    sourceUrl: 'https://www.sefaria.org/Genesis.1.2?lang=bi',
    reviewNote: 'Reviewed the Spirit of God phrase against the Hebrew רוּחַ אֱלֹהִים in Genesis 1:2. This alignment applies only to this occurrence.'
  }
];

export const REVIEWED_WORD_OCCURRENCES = alignments;
export function getReviewedWordOccurrence(ref: string, english: string, surface: string, supplied: boolean): ReviewedWordOccurrence | undefined {
  if (supplied) return undefined;
  return alignments.find(item => item.ref.toLowerCase() === ref.toLowerCase() && item.english === english.toLowerCase() && (!surface || item.surface === surface));
}
