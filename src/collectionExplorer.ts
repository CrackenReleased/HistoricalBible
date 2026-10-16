import { localStore, type KjvVerseData } from './store/localFirstStore';
import { writeUrlState } from './store/urlStateRouter';

type Mode = 'books' | 'references' | 'names' | 'connections' | 'history';
type CardBuilder = (verse: KjvVerseData | null, display: string, ref: string, note: string) => HTMLElement;
const titles: Record<Mode, string> = { books: 'The books of the Bible', references: 'Scripture speaks to Scripture', names: 'Every name opens a story', connections: 'Where their stories meet', history: 'Scripture in the world of history' };
const labels: Record<Mode, string> = { books: 'Books & chapters', references: 'Cross-references', names: 'Biblical names', connections: 'Name connections', history: 'People & empires' };
const el = (tag: string, text = '', className = '') => { const node = document.createElement(tag); node.textContent = text; node.className = className; return node; };
const button = (text: string, run: () => void, className = 'explorer-button') => { const node = el('button', text, className) as HTMLButtonElement; node.type = 'button'; node.addEventListener('click', run); return node; };

export class CollectionExplorer {
  private root = document.getElementById('collection-explorer')!;
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
  constructor(
    private card: CardBuilder,
    private figure: (id: string) => void,
    private openGraph?: (name: string) => void
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
    this.filter.addEventListener('input', () => { this.query = this.filter.value; this.page = 0; this.render(); });
    this.root.append(top, nav, this.filter, this.body);
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
    writeUrlState({ tab: mode });
    this.render();
    if (reveal) { this.root.scrollIntoView({ behavior: 'instant', block: 'start' }); this.root.focus({ preventScroll: true }); }
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
    this.body.append(el('p', 'People and places from our Bible name network. Open a name to explore its meaning, verse links, and connected names.', 'explorer-note'));
    this.sourceNote('How name links work', 'Entries represent name spellings, not necessarily unique individuals. Verse links preserve case-sensitive whole-name matches in the Obsidian source snapshot.');
    const names = localStore.getNetwork().names.filter(name => `${name.name} ${name.meaning}`.toLowerCase().includes(this.query.toLowerCase()));
    this.paged(names, 25, name => {
      const row = el('div', '', 'explorer-row');
      const info = el('div'); info.append(this.nameButton(name.name), el('p', name.meaning, 'explorer-note'));
      row.append(info, button(`${name.refs.length} verse links →`, () => this.showName(name.name, true))); return row;
    });
  }
  private connections(): void {
    this.body.append(el('p', 'Explore 12,058 connections in our Bible name network. Open a pair of names to discover the verses they share.', 'explorer-note'));
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
  public showShared(first: string, second: string): void {
    this.open('connections'); this.filter.hidden = true;
    const refs = localStore.getSharedRefs(first, second);
    const show = (page: number) => {
      this.body.replaceChildren(button('← All name connections', () => this.open('connections')));
      const title = el('div', '', 'explorer-pair explorer-subtitle'); title.append(this.nameButton(first), el('span', '↔'), this.nameButton(second));
      if (this.openGraph) {
        title.append(button('Explore in 2D Graph ↗', () => this.openGraph!(first)));
      }
      this.body.append(title, el('p', `${refs.length} shared verse${refs.length === 1 ? '' : 's'} in the Obsidian source index. Follow either name to its complete entry.`, 'explorer-note'));
      this.paged(refs, 10, ref => this.verseCard(ref, `Shared name occurrence: ${first} and ${second}.`), this.body, page, show);
    }; show(0);
  }
  public showName(value: string, reveal = false): void {
    const name = localStore.getNetworkName(value); if (!name) return;
    const panel = document.getElementById('name-search-detail')!;
    const passages = document.getElementById('name-search-passages')!;
    document.getElementById('name-search-title')!.textContent = name.name;
    document.getElementById('name-search-meaning')!.textContent = name.meaning;
    (document.getElementById('search-input') as HTMLInputElement).value = name.name;
    document.getElementById('search-results-list')?.classList.remove('active');
    const neighbors = localStore.getConnectedNames(name.name);
    const show = (section: 'verses' | 'neighbors', page = 0) => {
      passages.replaceChildren(); const nav = el('div', '', 'explorer-nav');
      const verses = button(`${name.refs.length} verse links`, () => show('verses'));
      const connections = button(`${neighbors.length} connected names`, () => show('neighbors'));
      verses.setAttribute('aria-pressed', String(section === 'verses')); connections.setAttribute('aria-pressed', String(section === 'neighbors'));
      nav.append(verses, connections);
      if (this.openGraph) {
        nav.append(button('Explore in 2D Graph ↗', () => this.openGraph!(name.name)));
      }
      passages.append(nav);
      if (section === 'verses') {
        this.paged(name.refs, 5, ref => this.verseCard(ref, `Verse link from the name index for ${name.name}.`), passages, page, next => show(section, next));
      } else {
        passages.append(el('p', 'Connected names occur in shared verses; the links do not by themselves establish a family or historical relationship.', 'explorer-note'));
        this.paged(neighbors, 20, neighbor => {
          const row = el('div', '', 'explorer-row'); row.append(this.nameButton(neighbor.name), button(`${neighbor.count} shared verse${neighbor.count === 1 ? '' : 's'} →`, () => this.showShared(name.name, neighbor.name))); return row;
        }, passages, page, next => show(section, next));
      }
    };
    show('verses'); panel.hidden = false;
    document.getElementById('search-status')!.textContent = `Selected ${name.name}: ${name.refs.length} verse links and ${neighbors.length} connected names from the Obsidian network.`;
    if (reveal) panel.scrollIntoView({ behavior: 'instant', block: 'start' });
    panel.focus({ preventScroll: true });
  }
  private verseCard(ref: string, note: string): HTMLElement {
    const verse = localStore.getVerseByOsis(ref);
    const alternate = ref.toLowerCase() === '3john.1.15';
    const card = this.card(verse, ref, ref, alternate ? `${note} This source uses alternate verse numbering; the adopted KJV chapter ends at verse 14.` : note);
    if (!verse) {
      const link = el('a', 'Read the complete KJV PDF →') as HTMLAnchorElement; link.href = '/bible'; card.append(link);
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
      input.value = value; input.addEventListener('change', () => { update(input.value); this.page = 0; this.render(); }); field.append(input); controls.append(field);
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
    this.body.append(el('p', `66 books · 1,189 chapters · 31,102 KJV verses. The current reader contains ${overview.verses.toLocaleString()} verse records; four source references are unavailable here.`, 'explorer-note'));
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
  private paged<T>(items: readonly T[], size: number, render: (item: T) => HTMLElement, host = this.body, page = this.page, setPage = (value: number) => { this.page = value; this.render(); }): void {
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
