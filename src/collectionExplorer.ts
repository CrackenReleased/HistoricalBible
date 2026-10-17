import { localStore, type KjvVerseData } from './store/localFirstStore';
import { renderNameStudy } from './nameStudy';
import { writeUrlState, readUrlState, restoreUrlState, type InteractUrlState } from './store/urlStateRouter';
import { getNameKind, getNameIdentities, getNameAliases, getIdentityRefs } from './data/nameIdentities';

type Mode = 'books' | 'references' | 'names' | 'connections' | 'history';
type CardBuilder = (verse: KjvVerseData | null, display: string, ref: string, note: string) => HTMLElement;
const titles: Record<Mode, string> = { books: 'The books of the Bible', references: 'Scripture speaks to Scripture', names: 'Every name opens a story', connections: 'Where their stories meet', history: 'Scripture in the world of history' };
const labels: Record<Mode, string> = { books: 'Books & chapters', references: 'Cross-references', names: 'Biblical names', connections: 'Name connections', history: 'People & empires' };
const el = (tag: string, text = '', className = '') => { const node = document.createElement(tag); node.textContent = text; node.className = className; return node; };
const button = (text: string, run: () => void, className = 'explorer-button') => { const node = el('button', text, className) as HTMLButtonElement; node.type = 'button'; node.addEventListener('click', run); return node; };

export class CollectionExplorer {
  private root = document.getElementById('collection-explorer') ?? document.createElement('section');
  private body = el('div', '', 'explorer-body');
  private heading = el('h2');
  private filter = document.createElement('input');
  private mode: Mode = 'books';
  private query = '';
  private page = 0;
  private book = 'gen';
  private chapter = 1;
  private choosingBook = true;
  private sourceBook = '';
  private targetBook = '';
  private score = '';
  private nameBook = '';
  private testament = '';
  private nameKind = '';
  private reviewStatus = '';
  private sort = '';
  constructor(
    private card: CardBuilder,
    private figure: (id: string) => void,
    private openGraph?: (name: string) => void,
    private onSelection?: (name: string, compare?: string) => void
  ) {
    const top = el('div', '', 'explorer-heading');
    const intro = el('div'); intro.append(el('p', 'THE COLLECTION · OPEN & EXPLORE', 'eyebrow'), this.heading);
    top.append(intro, button('Close ×', () => {
      this.root.hidden = true;
      writeUrlState({ tab: null });
      document.querySelectorAll<HTMLButtonElement>('[data-collection]').forEach(node => node.setAttribute('aria-expanded', 'false'));
      document.querySelector<HTMLButtonElement>(`[data-collection="${this.mode}"]`)?.focus();
    }, 'text-button'));
    const nav = el('nav', '', 'explorer-nav'); nav.setAttribute('aria-label', 'Browse collections');
    for (const mode of Object.keys(labels) as Mode[]) {
      const item = button(labels[mode], () => this.open(mode, false)); item.dataset.mode = mode; nav.append(item);
    }
    this.filter.type = 'search'; this.filter.placeholder = 'Filter this collection…'; this.filter.setAttribute('aria-label', 'Filter collection');
    this.filter.addEventListener('input', () => { this.query = this.filter.value; this.page = 0; this.render(); this.saveCollection(true); });
    this.root.append(top, nav, this.filter, this.body);
    const studyWorkspace = el('div', '', 'study-workspace'); studyWorkspace.id = 'study-workspace';
    this.root.before(studyWorkspace); studyWorkspace.append(this.root);
    const namePanel = document.getElementById('name-search-detail'); if (namePanel) studyWorkspace.append(namePanel);
    document.querySelectorAll<HTMLButtonElement>('[data-collection]').forEach(node => {
      node.disabled = false; node.addEventListener('click', () => this.open(node.dataset.collection as Mode));
    });
  }
  public open(mode: Mode, reveal = true): void {
    this.mode = mode; this.query = ''; this.filter.value = ''; this.page = 0;
    this.filter.hidden = false;
    this.root.hidden = false; this.heading.textContent = titles[mode];
    this.root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.mode === mode)));
    document.querySelectorAll<HTMLButtonElement>('[data-collection]').forEach(node => node.setAttribute('aria-expanded', String(node.dataset.collection === mode)));
    this.saveCollection();
    this.render();
    if (reveal) { this.root.scrollIntoView({ behavior: 'instant', block: 'start' }); this.root.focus({ preventScroll: true }); }
  }
  private saveCollection(replace = false): void {
    writeUrlState({ tab: this.mode, query: this.query || null, page: this.page + 1,
      book: this.nameBook || null, testament: this.testament || null, kind: this.nameKind || null,
      status: this.reviewStatus || null, sort: this.sort || null, sourceBook: this.sourceBook || null,
      targetBook: this.targetBook || null, votes: this.score || null, readerBook: this.book, chapter: this.chapter }, replace);
  }
  public restore(state: InteractUrlState): void {
    restoreUrlState(() => {
      this.nameBook = state.book || ''; this.testament = state.testament || '';
      this.nameKind = state.kind || ''; this.reviewStatus = state.status || ''; this.sort = state.sort || '';
      this.sourceBook = state.sourceBook || ''; this.targetBook = state.targetBook || ''; this.score = state.votes || '';
      this.book = localStore.getBooks().some(b => b.osis === state.readerBook) ? state.readerBook! : 'gen';
      this.chapter = Math.min(state.chapter || 1, localStore.getBooks().find(b => b.osis === this.book)?.chapters || 1);
      this.choosingBook = !state.readerBook;
      if (state.tab) {
        this.open(state.tab as Mode, false);
        this.query = state.query || ''; this.filter.value = this.query; this.page = (state.page || 1) - 1; this.render();
      } else this.root.hidden = true;
      const panel = document.getElementById('name-search-detail');
      if (state.name && localStore.getNetworkName(state.name)) {
        this.showName(state.name, false, true);
        if (state.compare && localStore.getNetworkName(state.compare)) this.showShared(state.name, state.compare, true);
      } else if (panel) panel.hidden = true;
    });
  }
  private selectControl(host: HTMLElement, label: string, value: string, choices: Array<[string, string]>, change: (value: string) => void): void {
    const field = el('label', label); const select = document.createElement('select'); select.setAttribute('aria-label', label);
    for (const [value, text] of choices) { const option = el('option', text) as HTMLOptionElement; option.value = value; select.append(option); }
    select.value = value; select.addEventListener('change', () => change(select.value)); field.append(select); host.append(field);
  }
  private render(): void {
    this.body.replaceChildren();
    if (this.mode === 'books') this.books();
    else if (this.mode === 'names') this.names();
    else if (this.mode === 'connections') this.connections();
    else if (this.mode === 'references') this.references();
    else this.history();
  }
  public openReferences(ref: string): void {
    this.sourceBook = ''; this.targetBook = ''; this.score = '';
    this.open('references'); this.filter.value = this.query = ref; this.render();
  }
  private nameButton(name: string): HTMLButtonElement { return button(name, () => this.showName(name, true)); }
  private sourceNote(title: string, text: string): void {
    const details = document.createElement('details'); details.className = 'explorer-source';
    details.append(el('summary', title), el('p', text, 'explorer-note')); this.body.append(details);
  }
  private names(): void {
    this.body.append(el('p', 'People, places and biblical terms from our reviewed index. Open an entry for Scripture, lexical evidence and connected names.', 'explorer-note'));
    this.sourceNote('How name links work', 'Entries represent name spellings, not necessarily unique individuals. Verse links preserve case-sensitive whole-name matches in the Obsidian source snapshot.');
    const controls = el('div', '', 'explorer-filters name-filters');
    const update = (run: () => void) => { run(); this.page = 0; this.render(); this.saveCollection(); };
    const books = localStore.getBooks();
    this.selectControl(controls, 'Book', this.nameBook, [['','All books'], ...books.map(b => [b.osis,b.name] as [string,string])], value => update(() => this.nameBook = value));
    this.selectControl(controls, 'Testament', this.testament, [['','Both testaments'],['old','Old Testament'],['new','New Testament']], value => update(() => this.testament = value));
    this.selectControl(controls, 'Entry type', this.nameKind, [['','All entry types'],['person','Person'],['place','Place'],['term','Term'],['mixed','Multiple types'],['unclassified','Not yet classified']], value => update(() => this.nameKind = value));
    this.selectControl(controls, 'Lexical review', this.reviewStatus, [['','All lexical reviews'],['corroborated','Comparable glosses'],['disputed','Dictionary disagreement'],['uncertain','Uncertain derivation'],['ambiguous','Multiple senses'],['unmatched','No secure match'],['not-name','Title or expression']], value => update(() => this.reviewStatus = value));
    this.selectControl(controls, 'Sort names', this.sort, [['','Name A–Z'],['reverse','Name Z–A'],['verses','Most verse links']], value => update(() => this.sort = value));
    controls.append(button('Reset filters', () => update(() => { this.nameBook = this.testament = this.nameKind = this.reviewStatus = this.sort = this.query = this.filter.value = ''; })));
    this.body.append(controls, el('p', 'Entry types and identity selections cover reviewed passages only. Unclassified entries remain available; lexical review does not establish identity.', 'explorer-note'));
    const names = localStore.getNetwork().names.filter(name => {
      if (!`${name.name} ${name.meaning}`.toLowerCase().includes(this.query.toLowerCase())) return false;
      if (this.nameKind && getNameKind(name.name) !== this.nameKind) return false;
      if (this.reviewStatus && localStore.getNameReview(name.name)?.status !== this.reviewStatus) return false;
      return (!this.nameBook && !this.testament) || name.refs.some(ref => {
        const book = books.find(b => b.osis.toLowerCase() === ref.split('.')[0].toLowerCase());
        return book && (!this.nameBook || book.osis === this.nameBook) && (!this.testament || (books.indexOf(book) < 39 ? 'old' : 'new') === this.testament);
      });
    }).sort((a,b) => this.sort === 'verses' ? b.refs.length - a.refs.length || a.name.localeCompare(b.name) : this.sort === 'reverse' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
    this.paged(names, 25, name => {
      const row = el('div', '', 'explorer-row');
      const info = el('div'); info.append(this.nameButton(name.name), el('p', name.meaning, 'explorer-note'));
      info.append(el('span', getNameKind(name.name) === 'unclassified' ? 'Identity not yet classified' : getNameKind(name.name), 'name-kind'));
      row.append(info, button(`${name.refs.length} verse links →`, () => this.showName(name.name, true))); return row;
    });
  }
  private connections(): void {
    this.body.append(el('p', `Explore ${localStore.getNetwork().edges.length.toLocaleString()} connections in our reviewed index. Open a pair of entries to discover the verses they share.`, 'explorer-note'));
    this.sourceNote('What a connection means', 'Each link joins two name spellings appearing in at least one shared verse. Shared text alone does not establish kinship or identify the same person.');
    const network = localStore.getNetwork();
    const edges = network.edges.filter(([a, b]) => `${network.names[a].name} ${network.names[b].name}`.toLowerCase().includes(this.query.toLowerCase()));
    this.paged(edges, 25, ([a, b, count]) => {
      const first = network.names[a].name, second = network.names[b].name;
      const row = el('div', '', 'explorer-row'); const pair = el('div', '', 'explorer-pair');
      pair.append(this.nameButton(first), el('span', '↔'), this.nameButton(second));
      row.append(pair, button(`${count} shared verse${count === 1 ? '' : 's'} →`, () => this.showShared(first, second))); return row;
    });
  }
  public showShared(first: string, second: string, restoring = false): void {
    const saved = readUrlState();
    this.open('connections'); this.filter.hidden = true;
    writeUrlState({ name: first, compare: second, identity: null, studyPage: restoring ? saved.studyPage : 1 });
    this.onSelection?.(first, second);
    const namePanel = document.getElementById('name-search-detail'); if (namePanel) namePanel.hidden = true;
    const refs = localStore.getSharedRefs(first, second);
    const show = (page: number) => {
      writeUrlState({ studyPage: page + 1 });
      this.body.replaceChildren(button('← All name connections', () => this.open('connections')));
      const title = el('div', '', 'explorer-pair explorer-subtitle'); title.append(this.nameButton(first), el('span', '↔'), this.nameButton(second));
      const openGraph = this.openGraph;
      if (openGraph) {
        title.append(button('Explore in 2D Graph ↗', () => openGraph(first)));
      }
      this.body.append(title, el('p', `${refs.length} shared verse${refs.length === 1 ? '' : 's'} in the Obsidian source index. Follow either name to its complete entry.`, 'explorer-note'));
      const summaries = el('div', '', 'study-comparison');
      for (const name of [first, second]) {
        const summary = el('article', '', 'study-identity-summary'); const review = localStore.getNameReview(name);
        summary.append(el('h3', name), el('p', review?.identity?.text || 'Identity depends on the passage; this comparison uses name spellings.'), el('p', review?.displayMeaning || '', 'explorer-note'));
        for (const identity of getNameIdentities(name)) summary.append(el('p', `${identity.label} · ${identity.refs.join(', ')}`, 'explorer-note'));
        summaries.append(summary);
      }
      this.body.append(summaries);
      this.paged(refs, 10, ref => this.verseCard(ref, `Shared name occurrence: ${first} and ${second}.`), this.body, page, show);
    }; show(restoring ? (saved.studyPage || 1) - 1 : 0);
  }
  public showName(value: string, reveal = false, restoring = false): void {
    const name = localStore.getNetworkName(value); if (!name) return;
    const saved = readUrlState();
    if (!restoring) writeUrlState({ name: name.name, compare: null, identity: null, section: null, studyPage: 1, occurrenceBook: null, group: null });
    this.onSelection?.(name.name);
    const panel = document.getElementById('name-search-detail');
    const passages = document.getElementById('name-search-passages');
    const titleEl = document.getElementById('name-search-title');
    const meaningEl = document.getElementById('name-search-meaning');
    if (!panel || !passages || !meaningEl) return;
    if (titleEl) titleEl.textContent = name.name;
    renderNameStudy(name.name, meaningEl, ref => {
      const card = this.verseCard(ref, `Scripture supporting the name study for ${name.name}.`);
      passages.prepend(card); card.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
    if (searchInput) searchInput.value = name.name;
    document.getElementById('search-results-list')?.classList.remove('active');
    const neighbors = localStore.getConnectedNames(name.name);
    const openGraph = this.openGraph;
    let identity = restoring ? saved.identity || 'all' : 'all';
    let occurrenceBook = restoring ? saved.occurrenceBook || '' : '';
    let group = restoring ? saved.group || '' : '';
    let context = saved.context || 0;
    if (!['all','unresolved', ...getNameIdentities(name.name).map(i => i.id)].includes(identity)) identity = 'all';
    const show = (section: 'verses' | 'neighbors', page = 0) => {
      writeUrlState({ section, studyPage: page + 1, identity: identity === 'all' ? null : identity, occurrenceBook: occurrenceBook || null, group: group || null, context });
      passages.replaceChildren(); const nav = el('div', '', 'explorer-nav');
      const verses = button(`${name.refs.length} verse links`, () => show('verses'));
      const connections = button(`${neighbors.length} connected names`, () => show('neighbors'));
      verses.setAttribute('aria-pressed', String(section === 'verses')); connections.setAttribute('aria-pressed', String(section === 'neighbors'));
      nav.append(verses, connections);
      if (openGraph) {
        nav.append(button('Explore in 2D Graph ↗', () => openGraph(name.name)));
      }
      passages.append(nav);
      const compareForm = document.createElement('form'); compareForm.className = 'study-compare-form';
      const compareInput = document.createElement('input'); compareInput.type = 'search'; compareInput.placeholder = 'Choose another name…'; compareInput.setAttribute('aria-label', 'Compare with'); compareInput.setAttribute('list', 'study-name-options');
      if (!document.getElementById('study-name-options')) {
        const options = document.createElement('datalist'); options.id = 'study-name-options';
        for (const entry of localStore.getNetwork().names) { const option = document.createElement('option'); option.value = entry.name; options.append(option); }
        document.body.append(options);
      }
      const compare = button('Compare names', () => {}); compare.type = 'submit';
      const error = el('p', '', 'explorer-note'); error.setAttribute('role','status');
      compareForm.addEventListener('submit', event => { event.preventDefault(); const other = localStore.getNetworkName(compareInput.value.trim()); if (!other || other.name === name.name) { error.textContent = 'Choose a different name from the collection.'; return; } this.showShared(name.name, other.name); this.root.scrollIntoView({ block: 'start' }); });
      compareForm.append(compareInput, compare, error); passages.append(compareForm);
      if (section === 'verses') {
        const identities = getNameIdentities(name.name); const controls = el('div', '', 'explorer-filters');
        if (identities.length) {
          this.selectControl(controls, 'Identity', identity, [['all','All indexed occurrences'], ...identities.map(i => [i.id,i.label] as [string,string]), ['unresolved','Not assigned in this review']], value => { identity = value; occurrenceBook = ''; show(section); });
        }
        const scoped = getIdentityRefs(name.name, identity, name.refs);
        const books = localStore.getBooks().filter(b => scoped.some(ref => ref.split('.')[0].toLowerCase() === b.osis.toLowerCase()));
        this.selectControl(controls, 'Occurrence book', occurrenceBook, [['','All occurrence books'], ...books.map(b => [b.osis,b.name] as [string,string])], value => { occurrenceBook = value; show(section); });
        this.selectControl(controls, 'Passage grouping', group, [['','Verse list'],['book','Group by book']], value => { group = value; show(section); });
        this.selectControl(controls, 'Surrounding verses', String(context), [['0','Selected verse'],['1','1 verse either side'],['3','3 verses either side']], value => { context = Number(value); show(section, page); });
        passages.append(controls);
        const selected = identities.find(i => i.id === identity);
        passages.append(el('p', selected ? `${selected.note} Reviewed references only; this is not an exhaustive identity concordance.` : 'Name spellings may refer to different people, places or expressions. Identity selections include only individually reviewed passages.', 'explorer-note'));
        const aliases = getNameAliases(name.name).filter(alias => identity !== 'all' && identity !== 'unresolved' && alias.identityId === identity);
        for (const alias of aliases) {
          const row = el('p', '', 'explorer-note'); row.append(document.createTextNode(`Attested alternate name · ${alias.refs.join(', ')}: `), button(alias.name, () => this.showName(alias.name, true))); passages.append(row);
        }
        const distribution = el('div', '', 'study-distribution');
        for (const book of books) { const count = scoped.filter(ref => ref.split('.')[0].toLowerCase() === book.osis.toLowerCase()).length; distribution.append(button(`${book.name} · ${count}`, () => { occurrenceBook = book.osis; show(section); })); }
        const distributionDetails = document.createElement('details'); distributionDetails.append(el('summary', `Occurrences across ${books.length} books`), distribution); passages.append(distributionDetails);
        const refs = scoped.filter(ref => !occurrenceBook || ref.split('.')[0].toLowerCase() === occurrenceBook.toLowerCase());
        if (refs.length) passages.append(el('p', `First indexed: ${refs[0]} · Last indexed: ${refs.at(-1)}`, 'explorer-note'));
        let lastBook = '';
        this.paged(refs, 5, ref => {
          const wrap = el('div'); const book = ref.split('.')[0];
          if (group === 'book' && book !== lastBook) wrap.append(el('h4', localStore.getBooks().find(b => b.osis.toLowerCase() === book.toLowerCase())?.name || book));
          lastBook = book; wrap.append(this.verseCard(ref, `Verse link from the name index for ${name.name}.`));
          const verse = localStore.getVerseByOsis(ref);
          if (context && verse) {
            const nearby = localStore.getChapterVerses(book, verse.chapter).filter(v => v.verse !== verse.verse && Math.abs(v.verse - verse.verse) <= context);
            const details = document.createElement('details'); details.open = true; details.className = 'study-context'; details.append(el('summary','Surrounding passage'));
            for (const v of nearby) details.append(this.verseCard(localStore.toOsisRef(v), 'Surrounding context; not an additional indexed occurrence.'));
            wrap.append(details);
          }
          return wrap;
        }, passages, page, next => show(section, next));
      } else {
        passages.append(el('p', 'Connected names occur in shared verses; the links do not by themselves establish a family or historical relationship.', 'explorer-note'));
        this.paged(neighbors, 20, neighbor => {
          const row = el('div', '', 'explorer-row'); row.append(this.nameButton(neighbor.name), button(`${neighbor.count} shared verse${neighbor.count === 1 ? '' : 's'} →`, () => this.showShared(name.name, neighbor.name))); return row;
        }, passages, page, next => show(section, next));
      }
    };
    show(restoring && saved.section === 'neighbors' ? 'neighbors' : 'verses', restoring ? (saved.studyPage || 1) - 1 : 0); panel.hidden = false;
    const statusEl = document.getElementById('search-status');
    if (statusEl) statusEl.textContent = `Selected ${name.name}: ${name.refs.length} verse links and ${neighbors.length} connected names from the Obsidian network.`;
    if (reveal) panel.scrollIntoView({ behavior: 'instant', block: 'start' });
    panel.focus({ preventScroll: true });
  }
  private verseCard(ref: string, note: string): HTMLElement {
    const verse = localStore.getVerseByOsis(ref);
    const alternate = ref.toLowerCase() === '3john.1.15';
    const card = this.card(verse, ref, ref, alternate ? `${note} This source uses alternate verse numbering; the adopted KJV chapter ends at verse 14.` : note);
    if (!verse) {
      const link = el('a', 'Read in the Bible reader →') as HTMLAnchorElement; link.href = '/bible'; card.append(link);
    }
    return card;
  }
  private references(): void {
    this.body.append(el('p', 'All 344,799 source records, with complete passage ranges. Search a verse to find incoming and outgoing links, or filter by book.', 'explorer-note'));
    this.sourceNote('About the source & votes', 'OpenBible.info / Treasury of Scripture Knowledge · CC BY 4.0. Original vote scores are retained, including negative scores. Votes are editorial feedback, not a measure of truth or historical evidence.');
    const controls = el('div', '', 'explorer-filters');
    const select = (label: string, value: string, options: Array<[string, string]>, update: (value: string) => void) => {
      const field = el('label', label); const input = document.createElement('select'); input.setAttribute('aria-label', label);
      for (const [value, text] of options) { const option = document.createElement('option'); option.value = value; option.textContent = text; input.append(option); }
      input.value = value; input.addEventListener('change', () => { update(input.value); this.page = 0; this.render(); this.saveCollection(); }); field.append(input); controls.append(field);
    };
    const books: Array<[string, string]> = [['', 'All books'], ...localStore.getBooks().map(book => [book.osis, book.name] as [string, string])];
    select('Source book', this.sourceBook, books, value => { this.sourceBook = value; });
    select('Target book', this.targetBook, books, value => { this.targetBook = value; });
    select('Source votes', this.score, [['', 'All votes'], ['negative', 'Negative votes'], ['positive', 'Zero or positive votes']], value => { this.score = value; });
    this.body.append(controls);
    const direct = localStore.normalizeToOsis(this.query);
    const query = this.query.toLowerCase();
    const bookQuery = localStore.getBooks().find(book => book.name.toLowerCase() === query)?.osis;
    const records = localStore.getReferenceRecords().filter(record => {
      const source = record.s!, target = record.r || record.t!;
      if (this.sourceBook && !source.toLowerCase().startsWith(`${this.sourceBook}.`)) return false;
      if (this.targetBook && !target.toLowerCase().startsWith(`${this.targetBook}.`)) return false;
      if (this.score === 'negative' && Number(record.v) >= 0 || this.score === 'positive' && Number(record.v) < 0) return false;
      return !query || (direct ? localStore.referenceContains(source, direct) || localStore.referenceContains(target, direct) : `${source} ${target}`.toLowerCase().includes(bookQuery ? `${bookQuery}.` : query));
    });
    this.paged(records, 25, record => {
      const row = el('div', '', 'explorer-row');
      row.append(button(`${record.s} → ${record.r || record.t}`, () => this.showReference(record.s!, record.r || record.t!)), el('span', `Source votes: ${record.v}`, 'explorer-count')); return row;
    });
  }
  private showReference(source: string, target: string): void {
    const refs = localStore.expandReference(target);
    this.filter.hidden = true;
    const show = (page: number) => {
      this.body.replaceChildren(button('← Back to cross-reference results', () => { this.filter.hidden = false; this.render(); }), el('h3', `${source} → ${target}`, 'explorer-subtitle'));
      this.body.append(this.verseCard(source, 'Source passage of the selected cross-reference record.'), el('h3', 'Connected passage · complete range', 'explorer-subtitle'));
      this.paged(refs, 10, ref => this.verseCard(ref, `Target of the source record ${source} → ${target}.`), this.body, page, show);
    }; show(0);
  }
  private history(): void {
    const sync = localStore.getSynchrony(), query = this.query.toLowerCase();
    this.body.append(el('p', `${sync.figures.length} curated historical profiles and ${sync.empires.length} world empires. These are a starting collection, separate from the full Bible name network.`, 'explorer-note'));
    for (const figure of sync.figures.filter(figure => `${figure.name} ${figure.title}`.toLowerCase().includes(query))) {
      const row = el('div', '', 'explorer-row'); row.append(button(figure.name, () => this.figure(figure.id)), el('p', `${figure.title} · ${figure.dateRangeLabel}`, 'explorer-note')); this.body.append(row);
    }
    for (const empire of sync.empires.filter(empire => empire.name.toLowerCase().includes(query))) {
      const section = document.createElement('details'); section.className = 'explorer-row'; const summary = el('summary', `${empire.name} · ${empire.dateRangeLabel}`); section.append(summary, el('p', empire.biblicalIntersection, 'explorer-note'));
      for (const figure of sync.figures.filter(figure => figure.secularContemporaries.some(person => person.empireId === empire.id))) section.append(button(`Explore ${figure.name} →`, () => this.figure(figure.id)));
      this.body.append(section);
    }
  }
  private books(): void {
    const overview = localStore.getCollectionOverview();
    this.body.append(el('p', `66 books · 1,189 chapters · 31,102 KJV verses. All ${overview.verses.toLocaleString()} canonical verse records are fully indexed and browsable.`, 'explorer-note'));
    const selected = localStore.getBooks().find(book => book.osis === this.book)!;
    const chooser = document.createElement('details'); chooser.className = 'book-chooser'; chooser.open = this.choosingBook || Boolean(this.query);
    chooser.append(el('summary', `${selected.name} · choose a book`));
    const grid = el('div', '', 'book-grid');
    for (const [index, book] of localStore.getBooks().entries()) {
      if (!book.name.toLowerCase().includes(this.query.toLowerCase())) continue;
      const item = button(book.name, () => { this.book = book.osis; this.chapter = 1; this.page = 0; this.choosingBook = false; this.query = ''; this.filter.value = ''; this.render(); });
      item.dataset.testament = index < 39 ? 'old' : 'new'; item.setAttribute('aria-pressed', String(this.book === book.osis)); grid.append(item);
    }
    chooser.append(grid); this.body.append(chooser);
    this.body.append(el('h3', selected.name, 'explorer-subtitle'));
    const chapters = el('div', '', 'chapter-grid'); chapters.setAttribute('aria-label', `${selected.name} chapters`);
    for (let i = 1; i <= selected.chapters; i++) {
      const chapter = i;
      const item = button(String(i), () => { this.chapter = chapter; this.page = 0; this.render(); });
      item.setAttribute('aria-label', `${selected.name} chapter ${i}`); item.setAttribute('aria-pressed', String(i === this.chapter)); chapters.append(item);
    }
    this.body.append(chapters, el('h3', `${selected.name} ${this.chapter}`, 'explorer-subtitle'));
    const refs = localStore.getChapterReferences(this.book, this.chapter);
    this.paged(refs, 10, ref => this.verseCard(ref, 'Read within the selected chapter.'));
  }
  private paged<T>(items: readonly T[], size: number, render: (item: T) => HTMLElement, host = this.body, page = this.page, setPage = (value: number) => { this.page = value; this.render(); this.saveCollection(); }): void {
    page = Math.max(0, Math.min(page, Math.max(0, Math.ceil(items.length / size) - 1)));
    const first = page * size;
    const summary = el('p', items.length ? `${(first + 1).toLocaleString()}–${Math.min(first + size, items.length).toLocaleString()} of ${items.length.toLocaleString()} records` : 'No matching records.', 'explorer-count');
    summary.setAttribute('role', 'status'); host.append(summary);
    const list = el('div', '', 'explorer-list'); for (const item of items.slice(first, first + size)) list.append(render(item)); host.append(list);
    if (items.length > size) {
      const pager = el('div', '', 'explorer-pager');
      const previous = button('← Previous', () => setPage(page - 1)); previous.disabled = page === 0;
      const next = button('Next →', () => setPage(page + 1)); next.disabled = first + size >= items.length;
      const pages = Math.ceil(items.length / size);
      const jump = document.createElement('form'); jump.className = 'explorer-page-jump';
      const field = document.createElement('input'); field.type = 'number'; field.required = true; field.min = '1'; field.max = String(pages); field.value = String(page + 1); field.setAttribute('aria-label', 'Page number');
      const go = button('Go', () => {}); go.type = 'submit';
      jump.addEventListener('submit', event => { event.preventDefault(); if (field.checkValidity()) setPage(Number(field.value) - 1); });
      jump.append(el('span', 'Page'), field, el('span', `of ${pages.toLocaleString()}`), go);
      pager.append(previous, jump, next); host.append(pager);
    }
  }
}
