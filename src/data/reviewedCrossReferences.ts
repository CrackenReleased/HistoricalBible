/** Manually checked links layered over the unchanged OpenBible/TSK archive. */
export interface ReviewedCrossReference {
  source: string;
  target: string;
  kind: 'Explicit quotation' | 'Parallel account' | 'Reviewed shared entity' | 'Reviewed lexical link';
  reason: string;
  sourceCredit: string;
}

export const REVIEWED_CROSS_REFERENCES: readonly ReviewedCrossReference[] = [
  {
    source: 'Matt.3.3', target: 'Isa.40.3', kind: 'Explicit quotation',
    reason: 'Matthew identifies the speaker as Esaias and reproduces the voice-in-the-wilderness passage. The KJV wording and LORD/Lord casing remain distinct.',
    sourceCredit: 'KJV Matthew 3:3 and Isaiah 40:3; link also present in OpenBible/TSK.'
  },
  {
    source: 'Mark.1.2', target: 'Mal.3.1', kind: 'Explicit quotation',
    reason: 'Mark introduces a prophetic citation and quotes the messenger sent before thy face from Malachi 3:1.',
    sourceCredit: 'KJV Mark 1:2 and Malachi 3:1; link also present in OpenBible/TSK.'
  },
  {
    source: 'Luke.4.18', target: 'Isa.61.1', kind: 'Explicit quotation',
    reason: 'Luke 4:17 says the book of Esaias was delivered to Jesus; the reading beginning in Luke 4:18 corresponds to Isaiah 61:1. The wording differs and remains as printed in each passage.',
    sourceCredit: 'KJV Luke 4:17–18 and Isaiah 61:1; link also present in OpenBible/TSK.'
  }
];

export function getReviewedCrossReferences(osis: string): Array<ReviewedCrossReference & { other: string }> {
  return REVIEWED_CROSS_REFERENCES.flatMap(link => link.source === osis
    ? [{ ...link, other: link.target }]
    : link.target === osis ? [{ ...link, other: link.source }] : []);
}
