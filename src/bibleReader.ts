/**
 * src/bibleReader.ts
 * 16:10 Split-Screen Live Scripture Workspace for HistoricalBible.com (/bible)
 * Left Pane: Pinned sticky toolbar + continuous reading sanctuary with dual chronology.
 * Right Pane: Interactive companion inspector (Passage X-Refs, Word-for-word dive, Chronology & Eras).
 */

import { localStore, KjvVerseData } from './store/localFirstStore';
import {
  BibleSortMode,
  getSortedBooks,
  getBookChronology,
  getChapterChronology,
  BookChronology,
  ChapterChronologyInfo,
  BIBLE_CHRONOLOGY
} from './data/bibleChronology';
import { AncientMapCanvas } from './engine/ancientMap';
import {
  getEvidenceReceipt,
  getArtifactDisplay,
  createEvidenceReceiptElement
} from './data/evidenceReceipts';
import {
  getReviewedCrossReferences
} from './data/reviewedCrossReferences';
import { getDatedEvent, type DatedEvent } from './data/datedEvents.ts';
import { getRelationshipForPassage, type HistoricalRelationship } from './data/historicalRelationships.ts';
import {
  getWorldHorizonItem,
  isWorldItemInDateInterval,
  type WorldHorizonItem,
  HISTORICAL_WORLD_ITEMS
} from './data/historicalWorldItems.ts';
import {
  ARCHAEOLOGICAL_SITES,
  BIBLICAL_GEOGRAPHIC_ENTITIES,
  BIBLICAL_ROUTES,
  WORLD_EMPIRES_GEO,
  getJourneyStopForPassage,
  resolveBiblicalEntity,
  type ResolvedBiblicalEntity,
  type PassageJourneyMatch,
  type ArchaeologicalSite,
  type BiblicalGeographicEntity,
  type BiblicalRoute,
  type BiblicalRouteStop,
  type WorldEmpireRegion
} from './data/ancientMapData';
import {
  isStrongsReverseReady,
  lookupScriptureLexicon,
  prefetchStrongsReverse
} from './data/scriptureLexicon';
import {
  resolvePassageUserContext,
  writeUserContext
} from './store/userContextStore';

import {
  trackBibleChapterView,
  trackBibleVerseSelect,
  trackCompanionTabSwitch,
  trackCompanionLayerToggle,
  trackConcordanceInspect
} from './analytics';

interface BookMeta {
  osis: string;
  name: string;
  chapters: number;
}

class BibleReader {
  private currentBookOsis = 'Gen';
  private currentChapter = 1;
  private selectedVerseNum: number | null = null;
  private selectedWord: string | null = null;
  private activeTab: 'xrefs' | 'word' | 'chrono' | 'map' = 'xrefs';
  private sortMode: BibleSortMode = 'canonical';
  private books: BookMeta[] = [];

  // DOM Elements
  private sortSelect!: HTMLSelectElement;
  private bookSelect!: HTMLSelectElement;
  private chapterSelect!: HTMLSelectElement;
  private prevBtn!: HTMLButtonElement;
  private nextBtn!: HTMLButtonElement;
  private versesContainer!: HTMLElement;
  private chapterTitle!: HTMLElement;
  private chapterSubtitle!: HTMLElement;
  private bottomPrevBtn!: HTMLButtonElement;
  private bottomNextBtn!: HTMLButtonElement;
  private chronologyBanner!: HTMLElement;
  private orderEyebrow!: HTMLElement;

  // Companion Pane DOM
  private companionPane!: HTMLElement;
  private tabBtnXrefs!: HTMLButtonElement;
  private tabBtnWord!: HTMLButtonElement;
  private tabBtnChrono!: HTMLButtonElement;
  private tabBtnMap!: HTMLButtonElement;
  private tabContentXrefs!: HTMLElement;
  private tabContentWord!: HTMLElement;
  private tabContentChrono!: HTMLElement;
  private tabContentMap!: HTMLElement;
  private companionMapCanvas: AncientMapCanvas | null = null;
  private mapResizeTimer: ReturnType<typeof setTimeout> | null = null;

  public async init(): Promise<void> {
    const readerRoot = document.getElementById('live-bible-reader');
    if (!readerRoot) return;

    this.bindDomElements();
    this.renderLoading();

    try {
      // Kick off full parallel hydration immediately while awaiting critical Scripture + Synchrony first
      const fullInitPromise = localStore.init((msg) => {
        const statusEl = document.getElementById('reader-loading-status');
        if (statusEl) statusEl.textContent = msg;
      });

      await localStore.initCritical();

      this.books = localStore.getBooks();
      this.parseUrlParameters();
      this.populateBookSelect();
      this.populateChapterSelect();
      this.renderCurrentChapter();
      this.attachEventListeners();

      if (!localStore.isFullyLoaded()) {
        void fullInitPromise
          .then(() => {
            const book = this.getActiveBook();
            const verses = localStore.getChapterVerses(book.osis, this.currentChapter);
    trackBibleChapterView(book.name, this.currentChapter, verses.length);
            const activeVerse = verses.find((v) => v.verse === this.selectedVerseNum) || verses[0];
            if (activeVerse) {
              this.renderCompanionXrefs(activeVerse);
            }
            if (this.selectedWord) {
              this.renderWordInspector(this.selectedWord);
            }
          })
          .catch((err) => {
            console.warn('[HistoricalBible] Background companion index hydration warning:', err);
          });
      }
    } catch (err) {
      this.renderError(err instanceof Error ? err.message : String(err));
    }
  }

  private bindDomElements(): void {
    this.sortSelect = document.getElementById('reader-sort-select') as HTMLSelectElement;
    this.bookSelect = document.getElementById('reader-book-select') as HTMLSelectElement;
    this.chapterSelect = document.getElementById('reader-chapter-select') as HTMLSelectElement;
    this.prevBtn = document.getElementById('reader-prev-btn') as HTMLButtonElement;
    this.nextBtn = document.getElementById('reader-next-btn') as HTMLButtonElement;
    this.versesContainer = document.getElementById('reader-verses-container') as HTMLElement;
    this.chapterTitle = document.getElementById('reader-chapter-title') as HTMLElement;
    this.chapterSubtitle = document.getElementById('reader-chapter-subtitle') as HTMLElement;
    this.bottomPrevBtn = document.getElementById('reader-bottom-prev') as HTMLButtonElement;
    this.bottomNextBtn = document.getElementById('reader-bottom-next') as HTMLButtonElement;
    this.chronologyBanner = document.getElementById('reader-chronology-banner') as HTMLElement;
    this.orderEyebrow = document.getElementById('reader-order-eyebrow') as HTMLElement;

    this.companionPane = document.getElementById('bible-companion-pane') as HTMLElement;
    this.tabBtnXrefs = document.getElementById('companion-tab-xrefs-btn') as HTMLButtonElement;
    this.tabBtnWord = document.getElementById('companion-tab-word-btn') as HTMLButtonElement;
    this.tabBtnChrono = document.getElementById('companion-tab-chrono-btn') as HTMLButtonElement;
    this.tabBtnMap = document.getElementById('companion-tab-map-btn') as HTMLButtonElement;
    this.tabContentXrefs = document.getElementById('companion-tab-xrefs-content') as HTMLElement;
    this.tabContentWord = document.getElementById('companion-tab-word-content') as HTMLElement;
    this.tabContentChrono = document.getElementById('companion-tab-chrono-content') as HTMLElement;
    this.tabContentMap = document.getElementById('companion-tab-map-content') as HTMLElement;
  }

  private getActiveBook(): BookMeta {
    return (
      this.books.find(
        (b) =>
          b.osis.toLowerCase() === this.currentBookOsis.toLowerCase() ||
          b.name.toLowerCase() === this.currentBookOsis.toLowerCase()
      ) || this.books[0]
    );
  }

  private populateBookSelect(): void {
    if (!this.bookSelect) return;
    this.bookSelect.innerHTML = '';

    const sortedChronos = getSortedBooks(this.sortMode);

    if (this.sortMode === 'canonical') {
      const otGroup = document.createElement('optgroup');
      otGroup.label = 'Old Testament (39 Books)';
      const ntGroup = document.createElement('optgroup');
      ntGroup.label = 'New Testament (27 Books)';

      sortedChronos.forEach((chrono, index) => {
        const opt = document.createElement('option');
        opt.value = chrono.osis;
        opt.textContent = `${chrono.name} (${chrono.totalChapters} ch)`;
        if (index < 39) {
          otGroup.appendChild(opt);
        } else {
          ntGroup.appendChild(opt);
        }
      });
      this.bookSelect.appendChild(otGroup);
      this.bookSelect.appendChild(ntGroup);
    } else if (this.sortMode === 'event') {
      // Group by historical era of the events
      const groups = new Map<string, HTMLOptGroupElement>();
      sortedChronos.forEach((chrono) => {
        const eraLabel = `${chrono.eventEraName} · ${chrono.eventDateLabel}`;
        if (!groups.has(chrono.eventEraId)) {
          const group = document.createElement('optgroup');
          group.label = eraLabel;
          groups.set(chrono.eventEraId, group);
          this.bookSelect.appendChild(group);
        }
        const opt = document.createElement('option');
        opt.value = chrono.osis;
        opt.textContent = `${chrono.name} — Event: ${chrono.eventDateLabel}`;
        groups.get(chrono.eventEraId)!.appendChild(opt);
      });
    } else if (this.sortMode === 'written') {
      // Group by period of composition / authorship
      const groups = new Map<string, HTMLOptGroupElement>();
      sortedChronos.forEach((chrono) => {
        let period = 'Early Inscripturation (c. 1446–1000 BC)';
        if (chrono.writtenStartYear >= -1000 && chrono.writtenStartYear < -722) {
          period = 'United Monarchy & Scribes (c. 1000–722 BC)';
        } else if (chrono.writtenStartYear >= -722 && chrono.writtenStartYear < -586) {
          period = 'Divided Kingdom & Classical Prophets (c. 722–586 BC)';
        } else if (chrono.writtenStartYear >= -586 && chrono.writtenStartYear < -400) {
          period = 'Exilic & Second Temple Restoration (c. 586–400 BC)';
        } else if (chrono.writtenStartYear >= 40 && chrono.writtenStartYear < 60) {
          period = 'Early Apostolic Epistles (c. AD 45–58)';
        } else if (chrono.writtenStartYear >= 60 && chrono.writtenStartYear < 70) {
          period = 'Synoptic Gospels & Prison Epistles (c. AD 60–68)';
        } else if (chrono.writtenStartYear >= 70) {
          period = 'Johannine Corpus & Apocalypse (c. AD 85–96)';
        }

        if (!groups.has(period)) {
          const group = document.createElement('optgroup');
          group.label = period;
          groups.set(period, group);
          this.bookSelect.appendChild(group);
        }
        const opt = document.createElement('option');
        opt.value = chrono.osis;
        opt.textContent = `${chrono.name} — Penned: ${chrono.writtenDateLabel} (${chrono.writtenAuthor})`;
        groups.get(period)!.appendChild(opt);
      });
    }

    this.bookSelect.value = this.currentBookOsis;
  }

  private populateChapterSelect(): void {
    if (!this.chapterSelect) return;
    this.chapterSelect.innerHTML = '';

    const book = this.getActiveBook();
    const totalChapters = book.chapters;

    for (let c = 1; c <= totalChapters; c++) {
      const opt = document.createElement('option');
      opt.value = String(c);
      opt.textContent = `Chapter ${c}`;
      this.chapterSelect.appendChild(opt);
    }

    if (this.currentChapter > totalChapters) {
      this.currentChapter = 1;
    }
    this.chapterSelect.value = String(this.currentChapter);
  }

  private parseUrlParameters(): void {
    const params = new URLSearchParams(window.location.search);
    const bookParam = params.get('book');
    const chapterParam = params.get('chapter');
    const refParam = params.get('ref');
    const wordParam = params.get('word');
    const orderParam = params.get('order') as BibleSortMode | null;
    const tabParam = params.get('tab');

    if (orderParam && ['canonical', 'event', 'written'].includes(orderParam)) {
      this.sortMode = orderParam;
      if (this.sortSelect) this.sortSelect.value = this.sortMode;
    }

    if (refParam) {
      const parts = (localStore.normalizeToOsis(refParam) || refParam).split('.');
      if (parts[0]) {
        const normRef = parts[0].toLowerCase().replace(/[\s_]+/g, '');
        const matched = this.books.find(
          (b) =>
            b.osis.toLowerCase() === parts[0].toLowerCase() ||
            b.name.toLowerCase() === parts[0].toLowerCase() ||
            b.name.toLowerCase().replace(/[\s_]+/g, '') === normRef
        );
        if (matched) this.currentBookOsis = matched.osis;
      }
      if (parts[1]) {
        const ch = parseInt(parts[1], 10);
        if (!isNaN(ch) && ch >= 1) this.currentChapter = ch;
      }
      if (parts[2]) {
        const v = parseInt(parts[2], 10);
        if (!isNaN(v) && v >= 1) this.selectedVerseNum = v;
      }
    } else if (bookParam) {
      const normBook = bookParam.toLowerCase().replace(/[\s_]+/g, '');
      const matched = this.books.find(
        (b) =>
          b.osis.toLowerCase() === bookParam.toLowerCase() ||
          b.name.toLowerCase() === bookParam.toLowerCase() ||
          b.name.toLowerCase().replace(/[\s_]+/g, '') === normBook
      );
      if (matched) this.currentBookOsis = matched.osis;
      if (chapterParam) {
        const ch = parseInt(chapterParam, 10);
        if (!isNaN(ch) && ch >= 1) this.currentChapter = ch;
      }
      const verseParam = params.get('verse');
      if (verseParam) {
        const v = parseInt(verseParam, 10);
        if (!isNaN(v) && v >= 1) this.selectedVerseNum = v;
      }
    }

    if (wordParam) {
      this.selectedWord = wordParam;
      this.activeTab = 'word';
    } else if (tabParam === 'chrono') {
      this.activeTab = 'chrono';
    } else if (tabParam === 'map') {
      this.activeTab = 'map';
    } else {
      this.activeTab = 'xrefs';
    }

    const active = this.getActiveBook();
    this.currentBookOsis = active.osis;
    if (this.bookSelect) this.bookSelect.value = this.currentBookOsis;
  }

  private updateUrl(): void {
    const book = this.getActiveBook();
    const url = new URL(window.location.href);
    url.searchParams.set('book', book.name);
    url.searchParams.set('chapter', String(this.currentChapter));
    if (this.sortMode !== 'canonical') {
      url.searchParams.set('order', this.sortMode);
    } else {
      url.searchParams.delete('order');
    }
    if (this.selectedWord) {
      url.searchParams.set('word', this.selectedWord);
    } else {
      url.searchParams.delete('word');
    }
    if (this.activeTab !== 'xrefs') {
      url.searchParams.set('tab', this.activeTab);
    } else {
      url.searchParams.delete('tab');
    }
    window.history.replaceState({}, '', url.toString());
  }

  /**
   * Formats verse text into word tokens for word-level inspection
   * while strictly preserving small-caps LORD / GOD and bracketed italics.
   */
  private formatInteractiveTokens(rawText: string): string {
    let text = rawText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Isolate italics: [word]
    text = text.replace(/\[([^\]]+)\]/g, '@@ITALIC_START@@$1@@ITALIC_END@@');

    // Isolate divine names
    text = text.replace(/\b(LORD|GOD|JEHOVAH)\b/g, '@@DIVINE_$1@@');

    // Wrap remaining alphabetic words in .kjv-word
    text = text.replace(/\b([A-Za-z']+)\b/g, (match) => {
      if (match.startsWith('DIVINE_') || match.startsWith('ITALIC_')) {
        return match;
      }
      const clean = match.toLowerCase();
      const isActive = this.selectedWord && this.selectedWord.toLowerCase() === clean ? ' active-word' : '';
      return `<span class="kjv-word${isActive}" data-word="${clean}" tabindex="0" title="Click or right-click to inspect '${match}'">${match}</span>`;
    });

    // Restore divine names with small-caps
    text = text.replace(/@@DIVINE_(LORD|GOD|JEHOVAH)@@/g, (_m, word) => {
      const clean = word.toLowerCase();
      const first = word.charAt(0);
      const rest = word.slice(1);
      const isActive = this.selectedWord && this.selectedWord.toLowerCase() === clean ? ' active-word' : '';
      return `<span class="kjv-divine-name"><span class="kjv-word${isActive}" data-word="${clean}">${first}<span class="kjv-divine-rest">${rest}</span></span></span>`;
    });

    // Restore italics
    text = text.replace(/@@ITALIC_START@@/g, '<em class="kjv-italics">[');
    text = text.replace(/@@ITALIC_END@@/g, ']</em>');

    return text;
  }

  public renderCurrentChapter(): void {
    const book = this.getActiveBook();
    const chrono = getBookChronology(book.osis);
    const chapterChrono = getChapterChronology(book.osis, this.currentChapter);
    const verses = localStore.getChapterVerses(book.osis, this.currentChapter);
    trackBibleChapterView(book.name, this.currentChapter, verses.length);

    if (this.chapterTitle) {
      this.chapterTitle.textContent = book.name.toUpperCase();
    }
    if (this.chapterSubtitle) {
      this.chapterSubtitle.textContent = `Chapter ${this.currentChapter}`;
    }

    // Render Dual Chronology Banner & Eyebrow
    if (chrono) {
      const activeEventDate = chapterChrono ? chapterChrono.eventDateLabel : chrono.eventDateLabel;
      const activeEraName = chapterChrono ? chapterChrono.eraName : chrono.eventEraName;

      if (this.chronologyBanner) {
        this.chronologyBanner.innerHTML = `
          <span class="chrono-pill chrono-pill-event" title="When the events in this chapter actually occurred in world history">
            <strong>🗓️ Happened:</strong> ${activeEventDate}
          </span>
          <span class="chrono-pill chrono-pill-written" title="When this book was authored and penned down">
            <strong>✍️ Written:</strong> ${chrono.writtenDateLabel} (${chrono.writtenAuthor})
          </span>
          <span class="chrono-pill-delta">${chrono.deltaNote}</span>
        `;
      }

      if (this.orderEyebrow) {
        if (this.sortMode === 'event') {
          this.orderEyebrow.textContent = `— EVENT CHRONOLOGY · ${activeEraName.toUpperCase()}`;
        } else if (this.sortMode === 'written') {
          this.orderEyebrow.textContent = `— COMPOSITION CHRONOLOGY · PENNED ${chrono.writtenDateLabel.toUpperCase()}`;
        } else {
          this.orderEyebrow.textContent = `— CANONICAL SCRIPTURE · BOOK ${chrono.canonicalOrder} OF 66`;
        }
      }
    }

    // Update nav button states based on currently sorted sequence
    const sortedChronos = getSortedBooks(this.sortMode);
    const currentSortIdx = sortedChronos.findIndex((c) => c.osis.toLowerCase() === book.osis.toLowerCase());
    const isFirst = currentSortIdx === 0 && this.currentChapter === 1;
    const isLast = currentSortIdx === sortedChronos.length - 1 && this.currentChapter === book.chapters;

    if (this.prevBtn) this.prevBtn.disabled = isFirst;
    if (this.nextBtn) this.nextBtn.disabled = isLast;
    if (this.bottomPrevBtn) this.bottomPrevBtn.disabled = isFirst;
    if (this.bottomNextBtn) this.bottomNextBtn.disabled = isLast;

    if (!verses || verses.length === 0) {
      this.versesContainer.innerHTML = `
        <div class="reader-empty-notice">
          <p>No verses found for ${book.name} chapter ${this.currentChapter}.</p>
        </div>
      `;
      return;
    }

    // Default to verse 1 if no verse is selected
    if (this.selectedVerseNum === null || this.selectedVerseNum > verses.length) {
      this.selectedVerseNum = 1;
    }

    const rows = verses.map((v) => {
      const formattedText = this.formatInteractiveTokens(v.text);
      const displayRef = localStore.formatDisplayRef(v);
      const isActive = v.verse === this.selectedVerseNum ? ' active-verse' : '';
      return `
        <article class="bible-verse-row${isActive}" id="v${v.verse}" data-verse="${v.verse}" title="Click to view cross-references and notes for ${displayRef}">
          <span class="verse-anchor">{${v.chapter}:${v.verse}}</span>
          <span class="verse-text">${formattedText}</span>
        </article>
      `;
    });

    this.versesContainer.innerHTML = rows.join('');
    this.updateUrl();

    // Persist cross-page reading context so /map and /interact are aware of the active passage
    writeUserContext(
      resolvePassageUserContext({
        bookOsis: book.osis,
        bookName: book.name,
        chapter: this.currentChapter,
        verseNum: this.selectedVerseNum || 1,
        eraId: chrono?.eventEraId,
        eraName: chapterChrono ? chapterChrono.eraName : chrono?.eventEraName,
        eventDateLabel: chapterChrono ? chapterChrono.eventDateLabel : chrono?.eventDateLabel
      })
    );

    // Render companion pane content
    const activeVerse = verses.find((v) => v.verse === this.selectedVerseNum) || verses[0];
    this.renderCompanionXrefs(activeVerse);
    this.renderCompanionChrono(chrono, chapterChrono);

    if (this.selectedWord) {
      this.renderWordInspector(this.selectedWord);
      this.switchTab('word');
    } else {
      this.switchTab(this.activeTab);
    }

    // Scroll to verse anchor if hash present
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  public selectVerse(verseNum: number, autoSwitchTab = true): void {
    this.selectedVerseNum = verseNum;
    const book = this.getActiveBook();
    const verses = localStore.getChapterVerses(book.osis, this.currentChapter);
    trackBibleChapterView(book.name, this.currentChapter, verses.length);
    const verseObj = verses.find((v) => v.verse === verseNum);

    // Update active row class
    const allRows = this.versesContainer.querySelectorAll('.bible-verse-row');
    allRows.forEach((row) => {
      const rowNum = parseInt(row.getAttribute('data-verse') || '0', 10);
      if (rowNum === verseNum) {
        row.classList.add('active-verse');
      } else {
        row.classList.remove('active-verse');
      }
    });

    if (verseObj) {
      this.renderCompanionXrefs(verseObj);
      const chrono = getBookChronology(book.osis);
      const chapterChrono = getChapterChronology(book.osis, this.currentChapter);
      this.renderCompanionChrono(chrono, chapterChrono);
      if (this.activeTab === 'map') {
        this.renderCompanionMap();
      }
      if (autoSwitchTab && this.activeTab !== 'map' && this.activeTab !== 'chrono') {
        this.switchTab('xrefs');
      }
    }
  }

  public inspectWord(
    wordText: string,
    isRightClick = false,
    wordOptions?: { isSupplied?: boolean; isDivine?: boolean; surface?: string }
  ): void {
    const clean = wordText.trim().toLowerCase().replace(/[^a-z']/g, '');
    if (!clean) return;

    this.selectedWord = clean;
    this.updateUrl();
    trackConcordanceInspect(clean);

    // Update active word styling across chapter
    const allWords = this.versesContainer.querySelectorAll('.kjv-word');
    allWords.forEach((el) => {
      const w = el.getAttribute('data-word');
      if (w === clean) {
        el.classList.add('active-word');
      } else {
        el.classList.remove('active-word');
      }
    });

    // Render word inspector in background so data is ready when opened
    this.renderWordInspector(clean, wordOptions);

    // Subtle badge on Word Inspector tab indicating inspected word without hijacking
    if (this.tabBtnWord && !isRightClick && this.activeTab !== 'word') {
      this.tabBtnWord.innerHTML = `Word Inspector <span class="tab-word-indicator" style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#ffd700; margin-left:4px; vertical-align:middle;" title="Word: ${clean}"></span>`;
    }

    // Resolve if clicked word is a Biblical Entity (Person, Place, Ruler, Realm, Route, or Artifact)
    const entity = resolveBiblicalEntity(clean, {
      bookOsis: this.currentBookOsis,
      chapter: this.currentChapter,
      verse: this.selectedVerseNum
    });

    if (entity && !isRightClick) {
      // User clicked a Person / Place / Ruler / Empire / Entity!
      // In accordance with user preference: ALWAYS open the Map first!
      if (this.activeTab !== 'map') {
        this.switchTab('map');
      }

      if (this.companionMapCanvas) {
        // Fly/zoom to entity location
        this.companionMapCanvas.map.flyTo([entity.coords.lat, entity.coords.lng], entity.zoom || 7, { duration: 0.8 });

        // Highlight with luminous pulsing pin
        this.companionMapCanvas.highlightGeographicPlace({
          name: entity.name,
          ancientRegion: entity.ancientRegion,
          coords: entity.coords,
          zoom: entity.zoom,
          note: entity.context,
          scriptureRef: entity.scriptureRef
        });

        // Ensure empire layer is active if entity is linked to a realm
        if (entity.relatedEmpireId) {
          this.companionMapCanvas.layers.empires = true;
        }

        // Spotlight related narrative route and stop if present
        if (entity.relatedRouteId) {
          this.companionMapCanvas.activeRouteOverrideIds = [entity.relatedRouteId];
          if (typeof entity.stopIndex === 'number') {
            this.companionMapCanvas.activeRouteStopSelection = {
              routeId: entity.relatedRouteId,
              stopIndex: entity.stopIndex
            };
          }
          this.companionMapCanvas.layers.routes = true;
          this.companionMapCanvas.renderActiveEra();
        }

        this.syncLayerChips();
      }

      this.renderArtifactDrawer(null, undefined, undefined, undefined, undefined, undefined, entity);
      return;
    }

    // If user clicked while viewing Map, respect active tab lock! Do NOT hijack away to Word Inspector!
    if (this.activeTab === 'map' && !isRightClick) {
      return;
    }

    // If user clicked while viewing Chronology, respect active tab lock!
    if (this.activeTab === 'chrono' && !isRightClick) {
      return;
    }

    // Explicit Word Inspector Trigger (right-click or currently on Word / Xrefs)
    this.switchTab('word');
  }

  public renderArtifactDrawer(
    site: ArchaeologicalSite | null,
    geoEntity?: BiblicalGeographicEntity,
    empire?: WorldEmpireRegion,
    route?: BiblicalRoute,
    stop?: BiblicalRouteStop,
    stopIndex?: number,
    resolvedEntity?: ResolvedBiblicalEntity
  ): void {
    const drawerEl = document.getElementById('bible-companion-artifact-drawer');
    if (!drawerEl) return;

    if (!site && !geoEntity && !empire && !route && !resolvedEntity) {
      drawerEl.hidden = true;
      drawerEl.innerHTML = '';
      return;
    }

    if (site) {
      drawerEl.hidden = false;
      const receipt = getEvidenceReceipt(site.id);
      const display = getArtifactDisplay(site);
      drawerEl.innerHTML = `
        <div class="artifact-drawer-header">
          <div>
            <span class="eyebrow" style="font-size: 0.68rem; color: #ffd700;">SURVIVING ARTIFACT · ${site.ancientRegion.toUpperCase()}</span>
            <h4 class="artifact-drawer-title">${site.artifactName}</h4>
          </div>
          <button type="button" class="artifact-drawer-close" aria-label="Dismiss artifact card">&times;</button>
        </div>
        <div class="artifact-drawer-meta">
          <span><strong>Discovery:</strong> ${site.name} (${display.date})</span>
          <span><strong>Current:</strong> ${site.currentLocation}</span>
        </div>
        <div class="artifact-drawer-connection">
          <strong>✦ Scripture Connection:</strong><br/>
          ${display.connection}
        </div>
        <div class="artifact-drawer-desc">
          ${display.description}
        </div>
        ${
          receipt
            ? ''
            : `<div class="artifact-drawer-significance">
                 <strong>Historical Significance:</strong> ${display.significance}
               </div>`
        }
        ${site.externalUrl ? `<div style="margin-top: 0.6rem;"><a href="${site.externalUrl}" target="_blank" rel="noopener" class="secondary-link" style="font-size: 0.76rem; padding: 0.3rem 0.6rem;">${display.sourceLabel}</a></div>` : ''}
      `;
      if (receipt) {
        drawerEl.appendChild(createEvidenceReceiptElement(receipt));
      }
    } else if (geoEntity) {
      drawerEl.hidden = false;
      drawerEl.innerHTML = `
        <div class="artifact-drawer-header">
          <div>
            <span class="eyebrow" style="font-size: 0.68rem; color: #38bdf8;">BIBLICAL GEOGRAPHY · ${geoEntity.ancientRegion.toUpperCase()}</span>
            <h4 class="artifact-drawer-title">${geoEntity.name}</h4>
          </div>
          <button type="button" class="artifact-drawer-close" aria-label="Dismiss geographic card">&times;</button>
        </div>
        <div class="artifact-drawer-connection">
          <strong>✦ Biblical Setting:</strong><br/>
          ${geoEntity.note}
        </div>
        ${geoEntity.scriptureRef ? `<div class="artifact-drawer-meta" style="color: #38bdf8;"><strong>Passage Anchor:</strong> ${geoEntity.scriptureRef}</div>` : ''}
      `;
    } else if (empire) {
      drawerEl.hidden = false;
      drawerEl.innerHTML = `
        <div class="artifact-drawer-header">
          <div>
            <span class="eyebrow" style="font-size: 0.68rem; color: #ffd700;">HISTORICAL KINGDOM · ${empire.factionCategory ? empire.factionCategory.toUpperCase() : 'WORLD REALM'}</span>
            <h4 class="artifact-drawer-title">${empire.name}</h4>
          </div>
          <button type="button" class="artifact-drawer-close" aria-label="Dismiss kingdom card">&times;</button>
        </div>
        <div class="artifact-drawer-meta">
          <span><strong>Capital:</strong> ${empire.capital.name}</span>
          <span><strong>Est. Population:</strong> ${empire.populationEstimate}</span>
          <span><strong>Kingdom Extent:</strong> ${empire.approximateArea}</span>
        </div>
        <div class="artifact-drawer-connection">
          <strong>✦ Scripture Synchrony:</strong><br/>
          ${empire.biblicalIntersection || 'Contemporary ancient world power.'}
        </div>
        <div class="artifact-drawer-desc">
          <strong>Historical Setting (${empire.dateRange}):</strong> Imperial seat at ${empire.capital.name} throughout the biblical epoch.
        </div>
      `;
    } else if (route) {
      const targetStop = stop || route.stops[0];
      const idx = typeof stopIndex === 'number' ? stopIndex : 0;
      drawerEl.hidden = false;
      drawerEl.innerHTML = `
        <div class="artifact-drawer-header">
          <div>
            <span class="eyebrow" style="font-size: 0.68rem; color: ${route.color};">${route.name.toUpperCase()} · STOP ${idx + 1} OF ${route.stops.length}</span>
            <h4 class="artifact-drawer-title">Stop ${idx + 1}: ${targetStop.name}</h4>
          </div>
          <button type="button" class="artifact-drawer-close" aria-label="Dismiss journey card">&times;</button>
        </div>
        <div class="artifact-drawer-meta">
          <span><strong>🗓️ When:</strong> ${targetStop.dateLabel}</span>
          <span><strong>🧭 Traveler:</strong> ${route.travelerName}</span>
          <span><strong>📖 Scripture:</strong> ${targetStop.scriptureRef}</span>
        </div>
        <div class="artifact-drawer-connection">
          <strong>✦ Event at ${targetStop.name}:</strong><br/>
          ${targetStop.note}
        </div>
        <div class="artifact-drawer-desc">
          <strong>Journey Overview (${route.dateRange}):</strong> ${route.summary}
        </div>
      `;
    } else if (resolvedEntity) {
      drawerEl.hidden = false;
      const kindLabel = resolvedEntity.entityKind === 'ruler'
        ? `BIBLICAL RULER · ${resolvedEntity.ancientRegion.toUpperCase()}`
        : resolvedEntity.entityKind === 'person'
        ? `BIBLICAL FIGURE · ${resolvedEntity.ancientRegion.toUpperCase()}`
        : `BIBLICAL GEOGRAPHY · ${resolvedEntity.ancientRegion.toUpperCase()}`;

      drawerEl.innerHTML = `
        <div class="artifact-drawer-header">
          <div>
            <span class="eyebrow" style="font-size: 0.68rem; color: #ffd700;">${kindLabel}</span>
            <h4 class="artifact-drawer-title">${resolvedEntity.name}</h4>
          </div>
          <button type="button" class="artifact-drawer-close" aria-label="Dismiss entity card">&times;</button>
        </div>
        <div class="artifact-drawer-meta">
          ${resolvedEntity.approximateYear ? `<span><strong>🗓️ Approximate Year:</strong> ${resolvedEntity.approximateYear}</span>` : ''}
          ${resolvedEntity.dateRange ? `<span><strong>⏳ Era:</strong> ${resolvedEntity.dateRange}</span>` : ''}
          ${resolvedEntity.scriptureRef ? `<span><strong>📖 Scripture Anchor:</strong> ${resolvedEntity.scriptureRef}</span>` : ''}
        </div>
        ${
          resolvedEntity.regionOfPower
            ? `<div class="artifact-drawer-meta" style="color: #fbbf24; margin-top: 0.25rem;">
                 <span><strong>👑 Region of Power:</strong> ${resolvedEntity.regionOfPower}</span>
               </div>`
            : ''
        }
        ${
          resolvedEntity.alliesAndContemporaries
            ? `<div class="artifact-drawer-meta" style="color: #38bdf8; margin-top: 0.25rem;">
                 <span><strong>🤝 Allies & Contemporaries:</strong> ${resolvedEntity.alliesAndContemporaries}</span>
               </div>`
            : ''
        }
        ${
          resolvedEntity.connectedNarrativePath || resolvedEntity.relatedRouteId
            ? `<div class="artifact-drawer-meta" style="color: #4ade80; margin-top: 0.25rem;">
                 <span><strong>🚶 Connected Narrative Path:</strong> ${
                   resolvedEntity.connectedNarrativePath
                     ? resolvedEntity.connectedNarrativePath
                     : (BIBLICAL_ROUTES.find((r) => r.id === resolvedEntity.relatedRouteId)?.name || 'Biblical Journey')
                 }</span>
               </div>`
            : ''
        }
        <div class="artifact-drawer-connection" style="margin-top: 0.5rem;">
          <strong>✦ Biblical Setting & Narrative:</strong><br/>
          ${resolvedEntity.biblicalSettingAndNarrative || resolvedEntity.context}
        </div>
      `;
    }

    drawerEl.querySelector('.artifact-drawer-close')?.addEventListener('click', () => {
      drawerEl.hidden = true;
      drawerEl.innerHTML = '';
    });

    drawerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private renderCompanionXrefs(v: KjvVerseData): void {
    if (!this.tabContentXrefs) return;

    const osis = localStore.toOsisRef(v);
    const displayRef = localStore.formatDisplayRef(v);
    const xrefs = localStore.getCrossRefsForVerse(osis, 10);
    const canonicalHtml = localStore.formatCanonicalKjvHtml(v.text);

    let xrefsHtml = '';
    if (xrefs.length > 0) {
      xrefsHtml = xrefs
        .map((x) => {
          const targetRef = x.targetOsis;
          const targetText = x.verse ? localStore.formatCanonicalKjvHtml(x.verse.text) : '';
          const parts = targetRef.split('.');
          const bookOsis = parts[0];
          const chap = parts[1] || '1';
          return `
            <div class="xref-card-mini">
              <div class="xref-mini-header">
                <a href="/bible?book=${encodeURIComponent(bookOsis)}&chapter=${encodeURIComponent(chap)}" class="xref-mini-target" title="Open ${targetRef} in Bible Reader">${targetRef}</a>
                <span class="xref-mini-votes">Votes: ${x.votes}</span>
              </div>
              <div class="xref-mini-text">${targetText}</div>
            </div>
          `;
        })
        .join('');
    } else if (!localStore.isFullyLoaded()) {
      xrefsHtml = `<p style="font-size: 0.88rem; color: var(--gold-muted); font-style: italic;">Indexing 64,299 cross-reference connections in background...</p>`;
    } else {
      xrefsHtml = `<p style="font-size: 0.88rem; color: var(--text-muted); font-style: italic;">No direct cross-reference connections cataloged for this verse.</p>`;
    }

    const reviewed = getReviewedCrossReferences(osis);
    let reviewedHtml = '';
    if (reviewed.length > 0) {
      reviewedHtml = `
        <div class="reviewed-xrefs-section" style="margin-bottom: 1.25rem;">
          <div class="companion-section-title">
            <span>Reviewed connections</span>
            <span style="font-size: 0.72rem; color: var(--gold-bright); font-weight: 600;">${reviewed.length} verified</span>
          </div>
          <div class="xref-list">
            ${reviewed
              .map((r) => {
                const targetRef = r.other;
                const parts = targetRef.split('.');
                const bookOsis = parts[0];
                const chap = parts[1] || '1';
                return `
                  <div class="xref-card-mini reviewed-xref-card" style="border-left: 3px solid var(--gold-bright);">
                    <div class="xref-mini-header">
                      <a href="/bible?book=${encodeURIComponent(bookOsis)}&chapter=${encodeURIComponent(chap)}" class="xref-mini-target" title="Open ${targetRef} in Bible Reader">${targetRef}</a>
                      <span class="xref-mini-kind" style="color: var(--gold-bright); font-size: 0.72rem; font-weight: 600;">${r.kind}</span>
                    </div>
                    <p style="font-size: 0.78rem; line-height: 1.4; color: var(--text-light); margin: 0.35rem 0 0 0;">${r.reason}</p>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      `;
    } else {
      reviewedHtml = `
        <div style="margin-bottom: 1rem; font-size: 0.8rem; color: var(--text-muted); font-style: italic;">
          No individually reviewed connection has been established for this verse.
        </div>
      `;
    }

    this.tabContentXrefs.innerHTML = `
      <div class="companion-verse-hero">
        <div class="companion-verse-ref">${displayRef}</div>
        <div class="companion-verse-body">${canonicalHtml}</div>
      </div>

      ${reviewedHtml}

      <details class="xref-archive" style="margin-top: 1rem;">
        <summary style="cursor: pointer; font-size: 0.85rem; color: var(--gold-muted); font-weight: 600;">
          OpenBible suggestions · not individually reviewed (${xrefs.length} Connections)
        </summary>
        <div class="companion-xrefs-list" style="margin-top: 0.65rem;">
          ${xrefsHtml}
        </div>
      </details>

      <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.76rem; color: var(--text-muted);">Explore with contemporary world history:</span>
        <a href="/interact?ref=${encodeURIComponent(osis)}" class="secondary-link" style="font-size: 0.76rem; padding: 0.35rem 0.65rem;">Open in Interact &rarr;</a>
      </div>
    `;
  }

  private renderCompanionChrono(
    chrono: BookChronology | null,
    chapterChrono?: ChapterChronologyInfo | null
  ): void {
    if (!this.tabContentChrono) return;

    if (!chrono) {
      this.tabContentChrono.innerHTML = `
        <div class="word-inspect-card">
          <span class="eyebrow">CHRONOLOGY &amp; ERAS</span>
          <h3 class="chrono-inspect-name">Timeline Synchrony</h3>
          <p class="word-inspect-meta">Chronological metadata not available for this passage.</p>
        </div>
      `;
      return;
    }

    const activeEventDate = chapterChrono ? chapterChrono.eventDateLabel : chrono.eventDateLabel;
    const activeEraName = chapterChrono ? chapterChrono.eraName : chrono.eventEraName;
    const activeSummary = chapterChrono ? chapterChrono.chapterSummary : chrono.eventSummary;

    const verseNum = this.selectedVerseNum || 1;
    const datedEvent = getDatedEvent(this.currentBookOsis, this.currentChapter, verseNum);
    const relationship = getRelationshipForPassage(this.currentBookOsis, this.currentChapter, verseNum);
    const journeyMatch = getJourneyStopForPassage(this.currentBookOsis, this.currentChapter, verseNum);

    let worldItem: WorldHorizonItem | undefined = datedEvent?.worldItem;
    if (!worldItem && relationship) {
      if (relationship.preferredWorldItemId) {
        worldItem = getWorldHorizonItem(relationship.preferredWorldItemId);
      }
      if (!worldItem) {
        worldItem = HISTORICAL_WORLD_ITEMS.find((item) => isWorldItemInDateInterval(item, relationship.startYear));
      }
    }
    if (!worldItem && journeyMatch) {
      const routeYears: Record<string, number> = {
        'abraham-call': -2090,
        'jacob-padan-aram': -1900,
        'exodus-route': -1446,
        'joshua-conquest': -1400,
        'ruth-boaz': -1150,
        'solomon-glory': -960,
        'elijah-prophet': -841,
        'jeremiah-ministry': -605,
        'daniel-exile': -586,
        'esther-mordecai': -479,
        'ezra-journey': -450,
        'nehemiah-walls': -445,
        'jesus-galilean-ministry': 28,
        'jesus-passion-resurrection': 33,
        'peter-philip-missions': 38,
        'paul-second-journey': 60,
        'paul-voyage-rome': 60,
        'john-seven-churches-patmos': 95,
      };
      const year = routeYears[journeyMatch.route.id];
      if (year !== undefined) {
        worldItem = HISTORICAL_WORLD_ITEMS.find((item) => isWorldItemInDateInterval(item, year));
      }
    }

    let datedEventHtml = '';
    if (datedEvent) {
      datedEventHtml = `
        <div class="chrono-card-section dated-passage-section" style="border-left: 3px solid var(--gold-bright); margin-top: 1rem; padding: 0.85rem; background: rgba(212, 163, 89, 0.08); border-radius: 4px;">
          <span class="eyebrow" style="color: var(--gold-bright); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">🏛️ HOW THIS PASSAGE IS DATED · REVIEWED PASSAGE SYNCHRONY</span>
          <h4 style="margin: 0 0 0.4rem 0; font-size: 0.95rem; color: #fff;">${this.escapeHtml(datedEvent.dateLabel)} (${this.escapeHtml(datedEvent.sourceTitle)})</h4>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.82rem; line-height: 1.4; color: var(--text-light);">${this.escapeHtml(datedEvent.event)}</p>
          <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.35; margin-bottom: 0.5rem;">
            <strong>Method:</strong> ${this.escapeHtml(datedEvent.method)} · <strong>Limitation:</strong> ${this.escapeHtml(datedEvent.limit)}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem;">
            <a href="${this.escapeHtml(datedEvent.sourceUrl)}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; color: var(--gold-muted); text-decoration: underline;">Source: ${this.escapeHtml(datedEvent.sourceTitle)} &rarr;</a>
            <a href="/map?site=${encodeURIComponent(datedEvent.siteId)}" class="secondary-link chrono-map-jump" data-jump-type="site" data-site-id="${encodeURIComponent(datedEvent.siteId)}" style="font-size: 0.74rem; padding: 0.25rem 0.55rem;">View on map &rarr;</a>
          </div>
        </div>
      `;
    } else {
      datedEventHtml = `
        <div class="chrono-card-section undated-passage-section" style="margin-top: 1rem; padding: 0.85rem; background: rgba(255, 255, 255, 0.03); border-radius: 4px; font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
          No reviewed event date is established for this selected verse. Event dates are displayed only when anchored by reviewed passage synchrony; broad book and chapter settings are shown above.
        </div>
      `;
    }

    let journeyHtml = '';
    if (journeyMatch) {
      const stopRef = `${this.currentBookOsis}.${this.currentChapter}.${verseNum}`;
      journeyHtml = `
        <div class="chrono-card-section reviewed-journey-stop-card" style="border-left: 3px solid #64b5f6; margin-top: 1rem; padding: 0.85rem; background: rgba(100, 181, 246, 0.08); border-radius: 4px;">
          <span class="eyebrow" style="color: #64b5f6; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">🚶 ALONG THIS JOURNEY · NARRATIVE SEQUENCE</span>
          <h4 style="margin: 0 0 0.3rem 0; font-size: 0.95rem; color: #fff;">${this.escapeHtml(journeyMatch.route.name)}</h4>
          <div style="font-size: 0.82rem; color: #bbdefb; margin-bottom: 0.35rem;">
            <strong>Stop ${journeyMatch.stopIndex + 1} of ${journeyMatch.route.stops.length}:</strong> ${this.escapeHtml(journeyMatch.stop.name)} (${this.escapeHtml(journeyMatch.stop.scriptureRef)}) · <em>${this.escapeHtml(journeyMatch.stop.dateLabel)}</em>
          </div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.8rem; line-height: 1.4; color: var(--text-light);">${this.escapeHtml(journeyMatch.stop.note)}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem;">
            <span style="font-size: 0.72rem; color: var(--text-muted);">Sequential narrative order in Scripture</span>
            <a href="/map?ref=${encodeURIComponent(stopRef)}&journey=${encodeURIComponent(journeyMatch.route.id)}&stop=${journeyMatch.stopIndex}" class="secondary-link chrono-map-jump" data-jump-type="journey" data-journey-id="${encodeURIComponent(journeyMatch.route.id)}" data-stop-index="${journeyMatch.stopIndex}" style="font-size: 0.74rem; padding: 0.25rem 0.55rem;">View Stop on Map &rarr;</a>
          </div>
        </div>
      `;
    }

    let relationshipHtml = '';
    if (relationship) {
      relationshipHtml = `
        <div class="chrono-card-section reviewed-relationship-card" style="border-left: 3px solid #ffb74d; margin-top: 1rem; padding: 0.85rem; background: rgba(255, 183, 77, 0.08); border-radius: 4px;">
          <span class="eyebrow" style="color: #ffb74d; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">⚖️ RELATIONSHIP AT THIS TIME</span>
          <h4 style="margin: 0 0 0.25rem 0; font-size: 0.95rem; color: #fff;">${this.escapeHtml(relationship.actor1Name)} ↔ ${this.escapeHtml(relationship.actor2Name)}</h4>
          <div style="font-size: 0.75rem; color: var(--gold-muted); margin-bottom: 0.45rem;">
            <strong>Period:</strong> ${this.escapeHtml(relationship.periodLabel)} (${this.escapeHtml(relationship.actor1Leader || '')} &amp; ${this.escapeHtml(relationship.actor2Leader || '')}) · <strong>Status:</strong> ${this.escapeHtml(relationship.relationshipLabel)}
          </div>
          <p style="margin: 0 0 0.45rem 0; font-size: 0.8rem; line-height: 1.4; color: var(--text-light);">${this.escapeHtml(relationship.summary)}</p>
          <div style="font-size: 0.8rem; line-height: 1.4; color: var(--text-light); margin-bottom: 0.45rem;">
            <strong>${this.escapeHtml(relationship.actor1Name)} perspective:</strong> ${this.escapeHtml(relationship.perspectiveActor1)}
          </div>
          <div style="font-size: 0.8rem; line-height: 1.4; color: var(--text-light); margin-bottom: 0.45rem;">
            <strong>${this.escapeHtml(relationship.actor2Name)} perspective:</strong> ${this.escapeHtml(relationship.perspectiveActor2)}
          </div>
          <div style="font-size: 0.75rem; line-height: 1.35; color: var(--text-muted); border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 0.4rem;">
            <strong>Tension &amp; Limits:</strong> ${this.escapeHtml(relationship.tensionAndLimits)}
          </div>
          ${relationship.moralAssessmentBasis ? `<div style="font-size: 0.72rem; color: var(--gold-muted); margin-top: 0.35rem;"><strong>Biblical Evaluation:</strong> ${this.escapeHtml(relationship.moralAssessmentBasis)}</div>` : ''}
        </div>
      `;
    }

    let worldItemHtml = '';
    if (worldItem) {
      worldItemHtml = `
        <div class="chrono-card-section reviewed-world-horizon-card" style="border-left: 3px solid #81c784; margin-top: 1rem; padding: 0.85rem; background: rgba(129, 199, 132, 0.08); border-radius: 4px;">
          <span class="eyebrow" style="color: #81c784; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">🌏 ELSEWHERE IN THE WORLD · CONTEMPORARY HORIZON</span>
          <h4 style="margin: 0 0 0.25rem 0; font-size: 0.95rem; color: #fff;">${this.escapeHtml(worldItem.name)}</h4>
          <div style="font-size: 0.75rem; color: #a5d6a7; margin-bottom: 0.45rem;">
            <strong>Region:</strong> ${this.escapeHtml(worldItem.regionName)} · <strong>Date Range:</strong> ${this.escapeHtml(worldItem.dateRangeLabel)}
          </div>
          <p style="margin: 0 0 0.45rem 0; font-size: 0.8rem; line-height: 1.4; color: var(--text-light);">${this.escapeHtml(worldItem.summary)}</p>
          <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.35; margin-bottom: 0.45rem;">
            <strong>Contemporary Overlap:</strong> ${this.escapeHtml(worldItem.overlapExplanation)}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">
            <strong>Source:</strong> <a href="${this.escapeHtml(worldItem.sourceUrl)}" target="_blank" rel="noopener noreferrer" style="color: var(--gold-muted); text-decoration: underline;">${this.escapeHtml(worldItem.sourceTitle)}</a>
          </div>
        </div>
      `;
    }

    this.tabContentChrono.innerHTML = `
      <div class="word-inspect-card" style="margin-bottom: 1rem;">
        <span class="eyebrow">CHRONOLOGICAL DUAL-PERSPECTIVE</span>
        <h3 class="chrono-inspect-name" style="font-size: 1.4rem;">${chrono.name}</h3>
        <p class="word-inspect-meta">Book ${chrono.canonicalOrder} of 66 Canonical Scriptures</p>
      </div>

      <!-- 1. Event Section (When it happened) -->
      <div class="chrono-card-section event-section">
        <span class="eyebrow" style="color: #a8cfb4;">🗓️ 1. EVENT CHRONOLOGY (WHEN IT HAPPENED)</span>
        <h4>${activeEventDate}</h4>
        <div class="chrono-card-desc"><strong>Historical Setting:</strong> ${activeEraName}</div>
        <div class="chrono-card-desc">${activeSummary}</div>
        ${
          chapterChrono && chapterChrono.isGranular
            ? `<div style="margin-top: 0.65rem; padding-top: 0.5rem; border-top: 1px dashed rgba(255, 255, 255, 0.1); font-size: 0.75rem; color: var(--gold-muted);">
                <strong>Complete Book Sweep:</strong> ${chrono.eventDateLabel}
              </div>`
            : ''
        }
      </div>

      <!-- 2. Composition Section (When it was written) -->
      <div class="chrono-card-section written-section">
        <span class="eyebrow" style="color: var(--gold-warm);">✍️ 2. COMPOSITION CHRONOLOGY (WHEN WRITTEN)</span>
        <h4>${chrono.writtenDateLabel}</h4>
        <div class="chrono-card-desc"><strong>Inscribed by:</strong> ${chrono.writtenAuthor}</div>
        <div class="chrono-card-desc"><strong>Setting:</strong> ${chrono.writtenContext}</div>
      </div>

      <!-- 3. Chronological Delta Explanation -->
      <div class="chrono-card-delta-box">
        <strong>The Chronological Distinction:</strong><br />
        ${chrono.deltaNote}
      </div>

      <!-- 4. Evidence Classification Disclosure (AGENTS.md §4) -->
      <div style="margin-top: 0.75rem; font-size: 0.72rem; color: var(--text-muted); line-height: 1.4;">
        <strong>Evidence Class:</strong> Chronological Reconstruction (correlating internal KJV genealogical/regnal spans with Ussher &amp; classical Near Eastern synchrony; distinct from direct KJV verse text).
      </div>

      ${datedEventHtml}
      ${journeyHtml}
      ${relationshipHtml}
      ${worldItemHtml}

      <!-- 5. Bridge to Study Desk Timeline -->
      <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.76rem; color: var(--text-muted);">Explore with contemporary empires:</span>
        <a href="/interact?era=${encodeURIComponent(chrono.eventEraId)}" class="secondary-link" style="font-size: 0.76rem; padding: 0.35rem 0.65rem;">View in Interact &rarr;</a>
      </div>
    `;

    const jumpLinks = this.tabContentChrono.querySelectorAll<HTMLAnchorElement>('.chrono-map-jump');
    jumpLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
          e.preventDefault();
          this.switchTab('map');
          const jumpType = link.getAttribute('data-jump-type');
          if (jumpType === 'site') {
            const siteId = decodeURIComponent(link.getAttribute('data-site-id') || '');
            if (this.companionMapCanvas && siteId) {
              this.companionMapCanvas.focusOnSite(siteId);
            }
          } else if (jumpType === 'journey') {
            const journeyId = decodeURIComponent(link.getAttribute('data-journey-id') || '');
            const stopIdx = parseInt(link.getAttribute('data-stop-index') || '0', 10);
            const route = BIBLICAL_ROUTES.find((r) => r.id === journeyId);
            if (route && this.companionMapCanvas) {
              const stop = route.stops[stopIdx];
              this.companionMapCanvas.activeRouteOverrideIds = [route.id];
              this.companionMapCanvas.activeRouteStopSelection = { routeId: route.id, stopIndex: stopIdx };
              this.companionMapCanvas.focusedStopOnly = true;
              this.companionMapCanvas.layers.routes = true;
              this.companionMapCanvas.renderActiveEra();
              if (stop) {
                this.companionMapCanvas.map.setView([stop.coords.lat, stop.coords.lng], Math.max(stop.zoom || 8, 7));
                this.renderArtifactDrawer(null, undefined, undefined, route, stop, stopIdx);
              }
            }
          }
        }
      });
    });
  }

  private renderWordInspector(
    word: string,
    options?: { isSupplied?: boolean; isDivine?: boolean; surface?: string }
  ): void {
    if (!this.tabContentWord) return;

    if (!isStrongsReverseReady()) {
      void prefetchStrongsReverse().then(() => {
        if (this.selectedWord === word && isStrongsReverseReady()) {
          this.renderWordInspector(word, options);
        }
      });
    }

    const concordanceVerses = localStore.searchWholeWord(word, 8);
    const lexicon = lookupScriptureLexicon(
      word,
      this.currentBookOsis,
      this.currentChapter,
      this.selectedVerseNum || 1,
      options
    );

    const titleCase = lexicon.word === 'Lord' ? 'Lord' : lexicon.word.toUpperCase();

    // 1. Definition / Name Meaning Section
    const defLabel = lexicon.nameMeaning ? 'NAME MEANING' : 'WORD DEFINITION';
    const defContent = lexicon.nameMeaning || lexicon.definition;
    const defHtml = `
      <div class="word-inspect-section">
        <div class="word-section-title">${defLabel}</div>
        <div class="word-section-body">${defContent}</div>
      </div>
    `;

    // 2. Untranslated Word & Linguistic Origin Section
    const untranslated = lexicon.untranslated;
    const hasLemma = untranslated.lemma && untranslated.lemma !== '—';
    const strongsTag = untranslated.strongsId
      ? `<span class="untranslated-strongs-tag">· Strong's ${untranslated.strongsId}</span>`
      : '';
    const originHtml = `
      <div class="word-inspect-section">
        <div class="word-section-title">UNTRANSLATED WORD &amp; ORIGIN</div>
        <div class="word-section-body">
          ${hasLemma ? `
            <div class="untranslated-lemma-box">
              <span class="untranslated-lemma-text">${untranslated.lemma}</span>
              ${untranslated.transliteration ? `<span class="untranslated-xlit">(${untranslated.transliteration})</span>` : ''}
              ${untranslated.pronunciation ? `<span class="untranslated-pron">· pronounced: ${untranslated.pronunciation}</span>` : ''}
              ${strongsTag}
            </div>
          ` : (untranslated.strongsId ? `<div class="untranslated-lemma-box">${strongsTag}</div>` : '')}
          <p class="untranslated-derivation">${untranslated.derivation}</p>
          ${untranslated.etymology ? `<p class="untranslated-etymology"><strong>Root / Usage:</strong> ${untranslated.etymology}</p>` : ''}
        </div>
      </div>
    `;

    // 3. Modern Meaning Section (Explicitly labeled "✦ MODERN MEANING")
    const modernHtml = `
      <div class="word-inspect-section word-section-modern">
        <div class="word-section-title" style="color: var(--gold-bright);">✦ MODERN MEANING</div>
        <div class="word-section-body modern-meaning-text">
          ${lexicon.modernMeaning}
        </div>
      </div>
    `;

    let concordanceHtml = '';
    if (concordanceVerses.length > 0) {
      concordanceHtml = concordanceVerses
        .map((v) => {
          const displayRef = localStore.formatDisplayRef(v);
          const formatted = localStore.formatCanonicalKjvHtml(v.text);
          return `
            <div class="concordance-verse-item" data-book="${v.book}" data-chap="${v.chapter}" data-verse="${v.verse}" title="Jump to ${displayRef}">
              <div class="concordance-verse-ref">${displayRef}</div>
              <div class="concordance-verse-text">${formatted}</div>
            </div>
          `;
        })
        .join('');
    } else {
      concordanceHtml = `<p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">No other direct concordance occurrences indexed for this token.</p>`;
    }

    this.tabContentWord.innerHTML = `
      <div class="word-inspect-card">
        <h3 class="word-inspect-name" style="margin-top: 0; margin-bottom: 0.85rem;">${titleCase}</h3>

        ${defHtml}
        ${originHtml}
        ${modernHtml}
      </div>

      <div class="companion-section-title" style="margin-top: 1rem;">
        <span>Concordance Occurrences</span>
        <span style="font-size: 0.72rem; color: var(--gold-muted);">${concordanceVerses.length} sample results</span>
      </div>

      <div class="concordance-list concordance-verses-list" style="margin-top: 0.5rem;">
        ${concordanceHtml}
      </div>
    `;

    // Add click listeners to concordance items
    const items = this.tabContentWord.querySelectorAll('.concordance-verse-item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const bookName = item.getAttribute('data-book');
        const chap = parseInt(item.getAttribute('data-chap') || '1', 10);
        const verse = parseInt(item.getAttribute('data-verse') || '1', 10);
        if (bookName) {
          const matched = this.books.find(
            (b) => b.name.toLowerCase() === bookName.toLowerCase() || b.osis.toLowerCase() === bookName.toLowerCase()
          );
          if (matched) {
            this.currentBookOsis = matched.osis;
            this.currentChapter = chap;
            this.selectedVerseNum = verse;
            this.bookSelect.value = this.currentBookOsis;
            this.populateChapterSelect();
            this.renderCurrentChapter();
            this.scrollToReader();
          }
        }
      });
    });
  }

  private switchTab(tab: 'xrefs' | 'word' | 'chrono' | 'map'): void {
    this.activeTab = tab;
    trackCompanionTabSwitch(tab);
    this.updateUrl();

    if (this.tabBtnXrefs) {
      this.tabBtnXrefs.classList.toggle('active', tab === 'xrefs');
      this.tabBtnXrefs.setAttribute('aria-selected', String(tab === 'xrefs'));
    }
    if (this.tabBtnWord) {
      this.tabBtnWord.classList.toggle('active', tab === 'word');
      this.tabBtnWord.setAttribute('aria-selected', String(tab === 'word'));
      if (tab === 'word') {
        this.tabBtnWord.textContent = 'Word Inspector';
      }
    }
    if (this.tabBtnChrono) {
      this.tabBtnChrono.classList.toggle('active', tab === 'chrono');
      this.tabBtnChrono.setAttribute('aria-selected', String(tab === 'chrono'));
    }
    if (this.tabBtnMap) {
      this.tabBtnMap.classList.toggle('active', tab === 'map');
      this.tabBtnMap.setAttribute('aria-selected', String(tab === 'map'));
    }

    if (this.tabContentXrefs) this.tabContentXrefs.hidden = tab !== 'xrefs';
    if (this.tabContentWord) this.tabContentWord.hidden = tab !== 'word';
    if (this.tabContentChrono) this.tabContentChrono.hidden = tab !== 'chrono';
    if (this.tabContentMap) this.tabContentMap.hidden = tab !== 'map';

    if (tab === 'chrono') {
      const book = this.getActiveBook();
      const chrono = getBookChronology(book.osis);
      const chapterChrono = getChapterChronology(book.osis, this.currentChapter);
      this.renderCompanionChrono(chrono, chapterChrono);
    }

    if (tab === 'map') {
      this.renderCompanionMap();
    }
  }

  private getMapEraForCurrentPassage(): string {
    const book = this.getActiveBook();
    const osis = book.osis.toLowerCase();
    const ch = this.currentChapter;

    if (['gen', 'job'].includes(osis)) {
      return 'patriarchs';
    }
    if (['exod', 'lev', 'num', 'deut', 'josh'].includes(osis)) {
      return 'exodus';
    }
    if (['judg', 'ruth', '1sam', '2sam', '1chr', 'ps', 'prov', 'eccl', 'song'].includes(osis)) {
      return 'united_monarchy';
    }
    if (osis === '1kgs') {
      if (ch <= 11) return 'united_monarchy';
      return 'divided_monarchy_prophets';
    }
    if (osis === '2kgs') {
      if (ch <= 8) return 'divided_monarchy_prophets'; // c. 853–841 BC Moabite Rebellion & Elijah/Elisha (Mesha Stele, Tel Dan)
      if (ch <= 16) return '2kings_jehu'; // c. 841–732 BC Jehu & Tiglath-Pileser (Black Obelisk)
      if (ch === 17) return '2kings_fall_samaria'; // 722 BC Fall of Samaria (Sargon II Prism)
      if (ch <= 20) return 'assyrian_siege'; // 701 BC Sennacherib & Hezekiah (Taylor Prism, Siloam)
      return 'babylonian_exile'; // 697–586 BC Josiah to Babylonian Captivity
    }
    if (osis === '2chr') {
      if (ch <= 9) return 'united_monarchy';
      if (ch <= 28) return 'divided_monarchy_prophets';
      if (ch <= 35) return 'assyrian_siege';
      return 'babylonian_exile';
    }
    if (['joel', 'obad'].includes(osis)) {
      return 'divided_monarchy_prophets';
    }
    if (['isa', 'hos', 'amos', 'mic', 'jonah', 'nah'].includes(osis)) {
      return 'assyrian_siege';
    }
    if (['jer', 'lam', 'ezek', 'dan', 'hab', 'zeph'].includes(osis)) {
      return 'babylonian_exile';
    }
    if (['ezra', 'neh', 'esth', 'hag', 'zech', 'mal'].includes(osis)) {
      return 'persian_restoration';
    }
    if (['matt', 'mark', 'luke', 'john'].includes(osis)) {
      return 'roman_christ';
    }
    if (['acts', 'rom', '1cor', '2cor', 'gal', 'eph', 'phil', 'col', '1thess', '2thess', '1tim', '2tim', 'titus', 'phlm', 'heb', 'jas', '1pet', '2pet', '1john', '2john', '3john', 'jude', 'rev'].includes(osis)) {
      return 'apostolic_church';
    }
    return getBookChronology(book.osis)?.eventEraId || 'all';
  }

  private renderCompanionMap(): void {
    const container = document.getElementById('bible-companion-map-container');
    if (!container) return;

    const book = this.getActiveBook();
    const targetEraId = this.getMapEraForCurrentPassage();

    const titleEl = document.getElementById('companion-map-title');
    const descEl = document.getElementById('companion-map-desc');
    const fullLink = document.getElementById('companion-map-full-link') as HTMLAnchorElement | null;

    if (fullLink) {
      const refStr = `${this.currentBookOsis}.${this.currentChapter}.${this.selectedVerseNum || 1}`;
      let href = `/map?era=${targetEraId}&ref=${encodeURIComponent(refStr)}`;
      const datedEvent = getDatedEvent(this.currentBookOsis, this.currentChapter, this.selectedVerseNum || 1);
      if (datedEvent) {
        href += `&site=${encodeURIComponent(datedEvent.siteId)}`;
      }
      const journeyMatch = getJourneyStopForPassage(this.currentBookOsis, this.currentChapter, this.selectedVerseNum || 1);
      if (journeyMatch) {
        href += `&journey=${encodeURIComponent(journeyMatch.route.id)}&stop=${journeyMatch.stopIndex}`;
      }
      fullLink.href = href;
    }

    if (!this.companionMapCanvas) {
      this.companionMapCanvas = new AncientMapCanvas({
        container,
        compact: true,
        initialEraId: targetEraId,
        onSelectSite: (site) => this.renderArtifactDrawer(site),
        onSelectEmpire: (empire) => this.renderArtifactDrawer(null, undefined, empire),
        onSelectRouteStop: (route, stop, stopIndex) =>
          this.renderArtifactDrawer(null, undefined, undefined, route, stop, stopIndex)
      });
    } else {
      this.companionMapCanvas.setEra(targetEraId);
      if (this.mapResizeTimer !== null) {
        clearTimeout(this.mapResizeTimer);
      }
      this.mapResizeTimer = setTimeout(() => {
        this.companionMapCanvas?.map.invalidateSize();
        this.mapResizeTimer = null;
      }, 100);
    }

    // Curate overlay density: if current passage has a narrative journey, spotlight it!
    // If not, mute route spaghetti to keep biblical geography clean and legible.
    const journeyMatch = getJourneyStopForPassage(this.currentBookOsis, this.currentChapter, this.selectedVerseNum || 1);
    if (journeyMatch) {
      this.companionMapCanvas.activeRouteOverrideIds = [journeyMatch.route.id];
      this.companionMapCanvas.activeRouteStopSelection = { routeId: journeyMatch.route.id, stopIndex: journeyMatch.stopIndex };
      this.companionMapCanvas.focusedStopOnly = true;
      this.companionMapCanvas.layers.routes = true;
      this.companionMapCanvas.renderActiveEra();
      this.companionMapCanvas.map.setView([journeyMatch.stop.coords.lat, journeyMatch.stop.coords.lng], Math.max(journeyMatch.stop.zoom || 8, 7));
      this.renderArtifactDrawer(null, undefined, undefined, journeyMatch.route, journeyMatch.stop, journeyMatch.stopIndex);
    } else {
      this.companionMapCanvas.activeRouteOverrideIds = null;
      this.companionMapCanvas.activeRouteStopSelection = null;
      this.companionMapCanvas.focusedStopOnly = false;
      this.companionMapCanvas.layers.routes = false;
      this.companionMapCanvas.renderActiveEra();
    }

    this.syncLayerChips();

    if (titleEl && this.companionMapCanvas.activeEra) {
      titleEl.textContent = `${book.name} ${this.currentChapter} · ${this.companionMapCanvas.activeEra.name}`;
    }
    if (descEl && this.companionMapCanvas.activeEra) {
      descEl.textContent = `Historical Setting: ${this.companionMapCanvas.activeEra.yearLabel} — ${this.companionMapCanvas.activeEra.headline}`;
    }
  }

  private syncLayerChips(): void {
    const chipsContainer = document.getElementById('companion-map-layer-chips');
    if (!chipsContainer || !this.companionMapCanvas) return;

    const chips = chipsContainer.querySelectorAll<HTMLButtonElement>('.map-layer-chip');
    chips.forEach((chip) => {
      const layer = chip.getAttribute('data-layer') as 'cities' | 'empires' | 'archaeology' | 'routes';
      if (layer && this.companionMapCanvas) {
        const isActive = !!this.companionMapCanvas.layers[layer];
        chip.classList.toggle('active', isActive);
        chip.setAttribute('aria-pressed', String(isActive));
      }
    });

    if (!(chipsContainer as any).__listenersAttached) {
      (chipsContainer as any).__listenersAttached = true;
      chips.forEach((chip) => {
        chip.addEventListener('click', () => {
          const layer = chip.getAttribute('data-layer') as 'cities' | 'empires' | 'archaeology' | 'routes';
          if (!layer || !this.companionMapCanvas) return;
          const nextState = !this.companionMapCanvas.layers[layer];
          this.companionMapCanvas.layers[layer] = nextState;
          trackCompanionLayerToggle(layer, nextState);
          chip.classList.toggle('active', nextState);
          chip.setAttribute('aria-pressed', String(nextState));
          this.companionMapCanvas.renderActiveEra();
        });
      });
    }
  }

  private goToPreviousChapter(): void {
    if (this.currentChapter > 1) {
      this.currentChapter--;
    } else {
      const sortedChronos = getSortedBooks(this.sortMode);
      const currentSortIdx = sortedChronos.findIndex((c) => c.osis.toLowerCase() === this.currentBookOsis.toLowerCase());
      if (currentSortIdx > 0) {
        const prevChrono = sortedChronos[currentSortIdx - 1];
        const prevBook = this.books.find((b) => b.osis.toLowerCase() === prevChrono.osis.toLowerCase());
        if (prevBook) {
          this.currentBookOsis = prevBook.osis;
          this.currentChapter = prevBook.chapters;
          if (this.bookSelect) this.bookSelect.value = this.currentBookOsis;
          this.populateChapterSelect();
        }
      }
    }
    if (this.chapterSelect) this.chapterSelect.value = String(this.currentChapter);
    this.selectedVerseNum = 1;
    this.renderCurrentChapter();
    this.scrollToReader();
  }

  private goToNextChapter(): void {
    const book = this.getActiveBook();
    if (this.currentChapter < book.chapters) {
      this.currentChapter++;
    } else {
      const sortedChronos = getSortedBooks(this.sortMode);
      const currentSortIdx = sortedChronos.findIndex((c) => c.osis.toLowerCase() === this.currentBookOsis.toLowerCase());
      if (currentSortIdx < sortedChronos.length - 1) {
        const nextChrono = sortedChronos[currentSortIdx + 1];
        const nextBook = this.books.find((b) => b.osis.toLowerCase() === nextChrono.osis.toLowerCase());
        if (nextBook) {
          this.currentBookOsis = nextBook.osis;
          this.currentChapter = 1;
          if (this.bookSelect) this.bookSelect.value = this.currentBookOsis;
          this.populateChapterSelect();
        }
      }
    }
    if (this.chapterSelect) this.chapterSelect.value = String(this.currentChapter);
    this.selectedVerseNum = 1;
    this.renderCurrentChapter();
    this.scrollToReader();
  }

  private scrollToReader(): void {
    const readingPane = document.getElementById('bible-reading-pane');
    if (readingPane) {
      readingPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private attachEventListeners(): void {
    this.sortSelect?.addEventListener('change', () => {
      this.sortMode = this.sortSelect.value as BibleSortMode;
      this.populateBookSelect();
      this.renderCurrentChapter();
    });

    this.bookSelect?.addEventListener('change', () => {
      this.currentBookOsis = this.bookSelect.value;
      this.currentChapter = 1;
      this.selectedVerseNum = 1;
      this.populateChapterSelect();
      this.renderCurrentChapter();
    });

    this.chapterSelect?.addEventListener('change', () => {
      this.currentChapter = parseInt(this.chapterSelect.value, 10) || 1;
      this.selectedVerseNum = 1;
      this.renderCurrentChapter();
    });

    this.prevBtn?.addEventListener('click', () => this.goToPreviousChapter());
    this.nextBtn?.addEventListener('click', () => this.goToNextChapter());
    this.bottomPrevBtn?.addEventListener('click', () => this.goToPreviousChapter());
    this.bottomNextBtn?.addEventListener('click', () => this.goToNextChapter());

    this.tabBtnXrefs?.addEventListener('click', () => this.switchTab('xrefs'));
    this.tabBtnWord?.addEventListener('click', () => this.switchTab('word'));
    this.tabBtnChrono?.addEventListener('click', () => this.switchTab('chrono'));
    this.tabBtnMap?.addEventListener('click', () => this.switchTab('map'));

    // Verse and Word Interaction Delegation (Left Click & Right Click)
    this.versesContainer.addEventListener('click', (e) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      const wordEl = target.closest('.kjv-word') as HTMLElement;
      if (wordEl) {
        const row = wordEl.closest('.bible-verse-row') as HTMLElement | null;
        if (row) this.selectVerse(Number(row.dataset.verse), false);
        const wordText = wordEl.getAttribute('data-word') || wordEl.textContent || '';
        const isSupplied = !!wordEl.closest('.kjv-italics');
        const isDivine = !!wordEl.closest('.kjv-divine-name');
        const surface = (wordEl.textContent || '').trim();
        this.inspectWord(wordText, false, { isSupplied, isDivine, surface });
        return;
      }

      const verseRow = target.closest('.bible-verse-row') as HTMLElement;
      if (verseRow) {
        const verseNum = parseInt(verseRow.getAttribute('data-verse') || '1', 10);
        this.selectVerse(verseNum, this.activeTab === 'xrefs');
      }
    });

    // Right-Click Context Menu to Dive into Word
    this.versesContainer.addEventListener('contextmenu', (e) => {
      const target = e.target as HTMLElement;
      const wordEl = target.closest('.kjv-word') as HTMLElement;
      if (wordEl) {
        e.preventDefault();
        const row = wordEl.closest('.bible-verse-row') as HTMLElement | null;
        if (row) this.selectVerse(Number(row.dataset.verse), false);
        const wordText = wordEl.getAttribute('data-word') || wordEl.textContent || '';
        const isSupplied = !!wordEl.closest('.kjv-italics');
        const isDivine = !!wordEl.closest('.kjv-divine-name');
        const surface = (wordEl.textContent || '').trim();
        this.inspectWord(wordText, true, { isSupplied, isDivine, surface });
      }
    });

    window.addEventListener('popstate', () => {
      this.parseUrlParameters();
      this.populateChapterSelect();
      this.renderCurrentChapter();
    });
  }

  private renderLoading(): void {
    if (this.versesContainer) {
      this.versesContainer.innerHTML = `
        <div class="reader-loading-card">
          <div class="spinner-gold" style="margin: 0 auto 1rem;"></div>
          <p id="reader-loading-status" style="color: var(--gold-warm); font-family: var(--font-display);">Preparing canonical KJV Scripture...</p>
        </div>
      `;
    }
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private renderError(message: string): void {
    const controls = [this.sortSelect, this.bookSelect, this.chapterSelect, this.prevBtn, this.nextBtn, this.bottomPrevBtn, this.bottomNextBtn];
    for (const ctrl of controls) {
      if (ctrl) ctrl.disabled = true;
    }
    if (this.versesContainer) {
      this.versesContainer.innerHTML = `
        <div class="reader-error-card">
          <h3>Failed to load Scripture corpus</h3>
          <p>${this.escapeHtml(message)}</p>
          <a href="/Bible.pdf" class="primary-link" style="margin-top: 1rem;">Read Offline in the KJV PDF &rarr;</a>
        </div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const reader = new BibleReader();
  reader.init();
});
