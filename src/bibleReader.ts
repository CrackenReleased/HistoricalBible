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

  public async init(): Promise<void> {
    const readerRoot = document.getElementById('live-bible-reader');
    if (!readerRoot) return;

    this.bindDomElements();
    this.renderLoading();

    try {
      await localStore.init((msg) => {
        const statusEl = document.getElementById('reader-loading-status');
        if (statusEl) statusEl.textContent = msg;
      });

      this.books = localStore.getBooks();
      this.parseUrlParameters();
      this.populateBookSelect();
      this.populateChapterSelect();
      this.renderCurrentChapter();
      this.attachEventListeners();
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
      const parts = refParam.split('.');
      if (parts[0]) {
        const matched = this.books.find(
          (b) => b.osis.toLowerCase() === parts[0].toLowerCase() || b.name.toLowerCase() === parts[0].toLowerCase()
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
      const matched = this.books.find(
        (b) => b.osis.toLowerCase() === bookParam.toLowerCase() || b.name.toLowerCase() === bookParam.toLowerCase()
      );
      if (matched) this.currentBookOsis = matched.osis;
      if (chapterParam) {
        const ch = parseInt(chapterParam, 10);
        if (!isNaN(ch) && ch >= 1) this.currentChapter = ch;
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

  public selectVerse(verseNum: number): void {
    this.selectedVerseNum = verseNum;
    const book = this.getActiveBook();
    const verses = localStore.getChapterVerses(book.osis, this.currentChapter);
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
      this.switchTab('xrefs');
    }
  }

  public inspectWord(wordText: string): void {
    const clean = wordText.trim().toLowerCase().replace(/[^a-z']/g, '');
    if (!clean) return;

    this.selectedWord = clean;
    this.updateUrl();

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

    this.renderWordInspector(clean);
    this.switchTab('word');
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
    } else {
      xrefsHtml = `<p style="font-size: 0.88rem; color: var(--text-muted); font-style: italic;">No direct cross-reference connections cataloged for this verse.</p>`;
    }

    this.tabContentXrefs.innerHTML = `
      <div class="companion-verse-hero">
        <div class="companion-verse-ref">${displayRef}</div>
        <div class="companion-verse-body">${canonicalHtml}</div>
      </div>

      <div class="companion-section-title">
        <span>Connected Passages (TSK)</span>
        <span style="font-size: 0.72rem; color: var(--gold-muted);">${xrefs.length} Connections</span>
      </div>

      <div class="companion-xrefs-list">
        ${xrefsHtml}
      </div>

      <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.76rem; color: var(--text-muted);">Explore with contemporary world history:</span>
        <a href="/interact?ref=${encodeURIComponent(osis)}" class="secondary-link" style="font-size: 0.76rem; padding: 0.35rem 0.65rem;">Open Study Desk &rarr;</a>
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

      <!-- 4. Bridge to Study Desk Timeline -->
      <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.76rem; color: var(--text-muted);">Explore with contemporary empires:</span>
        <a href="/interact?era=${encodeURIComponent(chrono.eventEraId)}" class="secondary-link" style="font-size: 0.76rem; padding: 0.35rem 0.65rem;">View Era in Study Desk &rarr;</a>
      </div>
    `;
  }

  private renderWordInspector(word: string): void {
    if (!this.tabContentWord) return;

    const reference = `${this.currentBookOsis}.${this.currentChapter}.${this.selectedVerseNum || 1}`;
    const netName = localStore.getNameAtReference(word, reference);
    const review = netName ? localStore.getNameReview(netName.name) : undefined;
    const english = localStore.getNameReview(word)?.english;
    const searchRes = localStore.searchAll(word, 8);

    const titleCase = word.charAt(0).toUpperCase() + word.slice(1);
    let meaningHtml = '';
    if (netName && netName.meaning) {
      meaningHtml = `
        <div class="word-meaning-box">
          <strong style="color: var(--gold-warm); display: block; margin-bottom: 0.2rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Reviewed lexical note · distinct from Scripture:</strong>
          ${review?.identity ? `<p>${review.identity.text}</p>` : ''}
          <span>${netName.meaning}</span>
        </div>
      `;
    } else if (english) {
      meaningHtml = `<div class="word-meaning-box"><strong>Webster’s 1828 · ${english.partOfSpeech}</strong><p>${english.definition}</p><a href="${english.url}">Read the source entry →</a></div>`;
    }

    let concordanceHtml = '';
    if (searchRes.verses.length > 0) {
      concordanceHtml = searchRes.verses
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
        <span class="eyebrow">WORD INSPECTOR</span>
        <h3 class="word-inspect-name">${titleCase}</h3>
        <p class="word-inspect-meta">Interactive Scripture Concordance &amp; Dictionary</p>
        ${meaningHtml}
      </div>

      <div class="companion-section-title">
        <span>Concordance Occurrences</span>
        <span style="font-size: 0.72rem; color: var(--gold-muted);">${searchRes.verses.length} sample results</span>
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
    this.updateUrl();

    if (this.tabBtnXrefs) {
      this.tabBtnXrefs.classList.toggle('active', tab === 'xrefs');
      this.tabBtnXrefs.setAttribute('aria-selected', String(tab === 'xrefs'));
    }
    if (this.tabBtnWord) {
      this.tabBtnWord.classList.toggle('active', tab === 'word');
      this.tabBtnWord.setAttribute('aria-selected', String(tab === 'word'));
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

    if (tab === 'map') {
      this.renderCompanionMap();
    }
  }

  private getMapEraForCurrentPassage(): string {
    const book = this.getActiveBook();
    const osis = book.osis.toLowerCase();
    const ch = this.currentChapter;

    if (osis === 'gen') {
      return 'patriarchs';
    }
    if (['exod', 'lev', 'num', 'deut', 'josh'].includes(osis)) {
      return 'exodus';
    }
    if (['judg', 'ruth', '1sam', '2sam', '1chr', 'ps', 'prov', 'eccl', 'song'].includes(osis)) {
      return 'united_monarchy';
    }
    if (osis === '1kgs' && ch <= 11) return 'united_monarchy';
    if (['1kgs', '2kgs', 'isa', 'hos', 'amos', 'mic', 'jonah', 'nah'].includes(osis)) {
      if (osis === '2kgs' && ch >= 21) return 'babylonian_exile';
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
    if (['acts', 'rom', '1cor', '2cor', 'gal', 'eph', 'phil', 'col', '1thess', '2thess', '1tim', '2tim', 'tit', 'phlm', 'heb', 'jas', '1pet', '2pet', '1john', '2john', '3john', 'jude', 'rev'].includes(osis)) {
      return 'apostolic_church';
    }
    return 'all';
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
      fullLink.href = `/map?era=${targetEraId}`;
    }

    if (!this.companionMapCanvas) {
      this.companionMapCanvas = new AncientMapCanvas({
        container,
        compact: true,
        initialEraId: targetEraId
      });
    } else {
      this.companionMapCanvas.setEra(targetEraId);
      setTimeout(() => {
        this.companionMapCanvas?.map.invalidateSize();
      }, 100);
    }

    if (titleEl && this.companionMapCanvas.activeEra) {
      titleEl.textContent = `${book.name} ${this.currentChapter} · ${this.companionMapCanvas.activeEra.name}`;
    }
    if (descEl && this.companionMapCanvas.activeEra) {
      descEl.textContent = `Historical Setting: ${this.companionMapCanvas.activeEra.yearLabel} — ${this.companionMapCanvas.activeEra.headline}`;
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
      const target = e.target as HTMLElement;
      const wordEl = target.closest('.kjv-word') as HTMLElement;
      if (wordEl) {
        const row = wordEl.closest('.bible-verse-row') as HTMLElement | null;
        if (row) this.selectVerse(Number(row.dataset.verse));
        const wordText = wordEl.getAttribute('data-word') || wordEl.textContent || '';
        this.inspectWord(wordText);
        return;
      }

      const verseRow = target.closest('.bible-verse-row') as HTMLElement;
      if (verseRow) {
        const verseNum = parseInt(verseRow.getAttribute('data-verse') || '1', 10);
        this.selectVerse(verseNum);
      }
    });

    // Right-Click Context Menu to Dive into Word
    this.versesContainer.addEventListener('contextmenu', (e) => {
      const target = e.target as HTMLElement;
      const wordEl = target.closest('.kjv-word') as HTMLElement;
      if (wordEl) {
        e.preventDefault();
        const row = wordEl.closest('.bible-verse-row') as HTMLElement | null;
        if (row) this.selectVerse(Number(row.dataset.verse));
        const wordText = wordEl.getAttribute('data-word') || wordEl.textContent || '';
        this.inspectWord(wordText);
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

  private renderError(message: string): void {
    if (this.versesContainer) {
      this.versesContainer.innerHTML = `
        <div class="reader-error-card">
          <h3>Failed to load Scripture corpus</h3>
          <p>${message}</p>
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
