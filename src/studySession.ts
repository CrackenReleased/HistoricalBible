import { readUrlState, type InteractUrlState } from './store/urlStateRouter';
import { findStudySubject } from './data/studySubjects';
import { localStore } from './store/localFirstStore';
import { ARCHAEOLOGICAL_SITES, BIBLICAL_GEOGRAPHIC_ENTITIES, type BiblicalGeographicEntity } from './data/ancientMapData';
import { addStudyBookmark, MAX_STUDY_BOOKMARKS, readStudyBookmarks, writeStudyBookmarks, type StudyBookmark } from './store/studyBookmarks';

type StudyState = InteractUrlState & { compare?: string | null; identity?: string | null };
export type StudyMapTarget = { kind: 'geography'; key: string; entity: BiblicalGeographicEntity } | { kind: 'figure'; figureId: string };

export function getStudyMapTarget(state: StudyState): StudyMapTarget | null {
  if (state.subject || state.ref) return null;
  if (state.name) {
    const key = state.name.toLowerCase().trim();
    const entity = Object.hasOwn(BIBLICAL_GEOGRAPHIC_ENTITIES, key) ? BIBLICAL_GEOGRAPHIC_ENTITIES[key] : null;
    if (entity) return { kind: 'geography', key, entity };
    return null;
  }
  if (state.figure && ARCHAEOLOGICAL_SITES.some(site => site.figureId === state.figure)) {
    return { kind: 'figure', figureId: state.figure };
  }
  return null;
}

export class StudySessionBar {
  private element = document.createElement('section');
  private state: StudyState = {};
  private label = document.createElement('strong');
  private status = document.createElement('span');
  private mapButton: HTMLButtonElement;
  private linkInput = document.createElement('input');
  private bookmarkList = document.createElement('ul');
  private bookmarkSummary = document.createElement('summary');
  private bookmarks: StudyBookmark[] = [];

  constructor(callbacks: { onView: (view: 'list' | 'graph' | 'map') => void; onReturn: () => void }) {
    this.element.id = 'study-session-bar';
    this.element.className = 'study-session-bar';
    this.element.setAttribute('aria-label', 'Current study');
    this.element.hidden = true;
    const heading = document.createElement('div');
    heading.className = 'study-session-heading';
    const caption = document.createElement('span');
    caption.textContent = 'CURRENT STUDY';
    heading.append(caption, this.label);
    const actions = document.createElement('div');
    actions.className = 'study-session-actions';
    const button = (text: string, action: () => void): HTMLButtonElement => {
      const control = document.createElement('button');
      control.type = 'button'; control.textContent = text;
      control.addEventListener('click', action);
      actions.append(control);
      return control;
    };
    button('Passages', () => { callbacks.onView('list'); callbacks.onReturn(); });
    button('Graph', () => callbacks.onView('graph'));
    this.mapButton = button('Map', () => callbacks.onView('map'));
    button('Copy study link', () => void this.copyLink());
    button('Save study', () => this.save());
    this.linkInput.type = 'url';
    this.linkInput.readOnly = true;
    this.linkInput.hidden = true;
    this.linkInput.className = 'study-session-link';
    this.linkInput.setAttribute('aria-label', 'Study link — select and copy');
    this.status.className = 'study-session-status';
    this.status.setAttribute('role', 'status');
    const saved = document.createElement('details');
    saved.className = 'study-session-bookmarks';
    const note = document.createElement('p');
    note.textContent = 'Saved only in this browser. Remove a study whenever you wish.';
    saved.append(this.bookmarkSummary, note, this.bookmarkList);
    this.element.append(heading, actions, this.linkInput, this.status, saved);
    const header = document.querySelector('.site-header') || document.querySelector('header');
    if (header) header.after(this.element); else document.body.prepend(this.element);
    const refresh = () => this.refresh(readUrlState());
    window.addEventListener('interact-state-change', refresh);
    window.addEventListener('popstate', refresh);
    window.addEventListener('storage', () => this.renderBookmarks());
    this.refresh(readUrlState());
  }

  public refresh(state: StudyState): void {
    this.state = state;
    this.element.hidden = !state.name && !state.figure && !state.subject && !state.ref;
    let figureName = state.figure || '';
    if (state.figure) {
      try { figureName = localStore.getSynchrony().figures.find(figure => figure.id === state.figure)?.name || figureName; } catch { /* Store may still be loading. */ }
    }
    const empire = state.subject?.startsWith('empire:') ? localStore.getSynchrony().empires.find(empire => empire.id === state.subject?.slice(7)) : null;
    this.label.textContent = empire?.name || findStudySubject(state.subject || '')?.name || (state.name ? (state.compare ? `${state.name} ↔ ${state.compare}` : state.name) : state.ref || figureName);
    this.mapButton.hidden = !getStudyMapTarget(state);
    this.linkInput.value = window.location.href;
    this.linkInput.hidden = true;
    this.status.textContent = '';
    this.renderBookmarks();
  }

  private async copyLink(): Promise<void> {
    const href = window.location.href;
    try {
      await navigator.clipboard.writeText(href);
      this.status.textContent = 'Study link copied.';
    } catch {
      this.linkInput.value = href;
      this.linkInput.hidden = false;
      this.linkInput.focus(); this.linkInput.select();
      this.status.textContent = 'Select and copy the study link above.';
    }
  }

  private save(): void {
    if (!this.state.name && !this.state.figure && !this.state.subject && !this.state.ref) return;
    const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    this.renderBookmarks();
    if (this.bookmarks.length >= MAX_STUDY_BOOKMARKS && !this.bookmarks.some(item => item.href === href)) {
      this.status.textContent = 'You have 50 saved studies. Remove one before saving another.';
      return;
    }
    const next = addStudyBookmark(this.bookmarks, { label: this.label.textContent || 'Study', href, savedAt: new Date().toISOString() });
    this.persist(next, 'Study saved in this browser.');
  }

  private persist(next: StudyBookmark[], success: string): void {
    try {
      if (!writeStudyBookmarks(window.localStorage, next)) throw new Error('Storage unavailable');
      this.renderBookmarks();
      this.status.textContent = success;
    } catch { this.status.textContent = 'This browser could not save the change. Use Copy study link to keep your study.'; }
  }

  private renderBookmarks(): void {
    try { this.bookmarks = readStudyBookmarks(window.localStorage); } catch { this.bookmarks = []; }
    this.bookmarkSummary.textContent = `Saved studies (${this.bookmarks.length})`;
    this.bookmarkList.replaceChildren();
    if (!this.bookmarks.length) {
      const empty = document.createElement('li'); empty.textContent = 'No saved studies yet.';
      this.bookmarkList.append(empty);
    }
    this.bookmarks.forEach(item => {
      const row = document.createElement('li');
      const link = document.createElement('a'); link.href = item.href; link.textContent = item.label;
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove saved study ${item.label}`);
      remove.addEventListener('click', () => this.persist(this.bookmarks.filter(entry => entry.href !== item.href), 'Saved study removed.'));
      row.append(link, remove); this.bookmarkList.append(row);
    });
  }
}
