import { localStore } from './store/localFirstStore';

const statusLabels = {
  corroborated: 'Comparable dictionary glosses', disputed: 'Dictionary disagreement',
  uncertain: 'Uncertain derivation', ambiguous: 'Multiple senses or referents',
  unmatched: 'No secure lexical match', 'not-name': 'Title, expression or biblical term',
};

/** Keep biblical context ahead of lexical proposals and preserve each source's attribution. */
export function renderNameStudy(name: string, heading: HTMLElement, readVerse: (ref: string) => void): void {
  document.getElementById('name-study-evidence')?.remove();
  const review = localStore.getNameReview(name);
  if (!review) { heading.textContent = 'The name study could not load. Scripture passages remain available below.'; return; }
  heading.textContent = review.identity?.text || review.displayMeaning;
  const eyebrow = document.querySelector('#name-search-detail .eyebrow');
  if (eyebrow) eyebrow.textContent = `${review.status === 'not-name' ? 'BIBLICAL TERM' : 'BIBLICAL ENTRY'} · SCRIPTURE & NAME STUDY`;
  const study = document.createElement('div'); study.id = 'name-study-evidence'; study.className = 'name-study';
  if (review.identity) {
    const refs = document.createElement('div'); refs.className = 'name-study-refs';
    for (const ref of review.identity.refs) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'btn-small'; button.textContent = ref;
      button.addEventListener('click', () => readVerse(ref)); refs.append(button);
    }
    study.append(refs);
  }
  const badge = document.createElement('p'); badge.className = `name-study-status ${review.status}`;
  badge.textContent = `LEXICAL NOTE · ${statusLabels[review.status]}`; study.append(badge);
  if (review.identity) {
    const lexical = document.createElement('p'); lexical.textContent = review.displayMeaning; study.append(lexical);
  }
  const details = document.createElement('details'); details.className = 'name-study-sources';
  const summary = document.createElement('summary'); summary.textContent = 'Read the evidence & dictionary comparison';
  const note = document.createElement('p'); note.textContent = review.note.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  details.append(summary, note);
  const historical = document.createElement('p'); historical.className = 'name-study-historical';
  historical.textContent = `Hitchcock’s historical entry (${review.hitchcockEntry}): ${review.hitchcock.join('; ')}.`;
  details.append(historical);
  for (const entry of review.strongs) {
    const row = document.createElement('div'); row.className = 'name-study-source';
    const link = document.createElement('a'); link.href = `https://biblehub.com/${entry.id[0] === 'H' ? 'hebrew' : 'greek'}/${Number(entry.id.slice(1))}.htm`;
    link.textContent = `Strong’s ${entry.id} · ${entry.lemma} · ${entry.xlit || entry.translit || ''}`;
    const excerpt = document.createElement('p'); excerpt.textContent = `${entry.derivation || ''} ${entry.strongs_def || ''}`.trim();
    row.append(link, excerpt); details.append(row);
  }
  if (review.english) {
    const english = document.createElement('p'); const link = document.createElement('a');
    link.href = review.english.url; link.textContent = `Webster’s 1828 · ${review.english.word} (${review.english.partOfSpeech})`;
    english.append(link, document.createTextNode(`: ${review.english.definition}`)); details.append(english);
  }
  const scope = document.createElement('p'); scope.className = 'helper';
  scope.textContent = 'Dictionary proposals are distinct from Scripture. Excerpts use the pinned OpenScriptures transcription of Strong’s; source discrepancies and unresolved meanings are stated above. English definitions, where used, follow Webster’s 1828.';
  details.append(scope); study.append(details); heading.after(study);
}
