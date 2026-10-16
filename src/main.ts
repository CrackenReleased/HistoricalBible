/**
 * src/main.ts
 * Controller for HistoricalBible.com/interact
 * Synchronizes Biblical Figures, Secular World Empires, and the Canonical KJV Text.
 */
import {
  localStore,
  HistoricalFigure,
  KjvVerseData,
  RankedBiblicalName
} from './store/localFirstStore';
import { discoveries } from './discoveries';
import { CollectionExplorer } from './collectionExplorer';
import { EgoGraphCanvas, type EgoGraphData, type EgoNode } from './engine/egoGraph';
import { AncientMapCanvas } from './engine/ancientMap';
import { readUrlState, writeUrlState, onUrlStateChange, type InteractUrlState } from './store/urlStateRouter';

class HistoricalInteractApp {
  private selectedEraId: string = 'all';
  private selectedEmpireId: string | null = null;
  private activeFigure: HistoricalFigure | null = null;
  private trail: string[] = [];
  private explorer: CollectionExplorer | null = null;
  private egoGraph: EgoGraphCanvas | null = null;
  private ancientMap: AncientMapCanvas | null = null;
  private activeView: 'list' | 'graph' | 'map' = 'list';
  private activeGraphTarget: HistoricalFigure | string | null = null;

  public async bootstrap(): Promise<void> {
    const errorBanner = document.getElementById('error-banner');
    const telemetryPill = document.getElementById('canonical-telemetry-pill');

    try {
      await localStore.init((msg) => {
        if (telemetryPill) telemetryPill.textContent = msg;
      });

      const count = localStore.getVerseCount();
      if (telemetryPill) {
        telemetryPill.innerHTML = `${count.toLocaleString()} Indexed KJV Verse Records · {c:v} · [...] · <span class="kjv-divine-name">L<span class="kjv-divine-rest">ORD</span></span>`;
      }

      const sync = localStore.getSynchrony();
      const urlState = readUrlState();
      const requestedFig = urlState.figure;
      this.activeFigure =
        sync.figures.find(f => f.id === requestedFig) ||
        sync.figures.find(f => f.id === 'jesus-christ') ||
        sync.figures[0];
      this.trail = [this.activeFigure.id];

      if (urlState.view === 'graph') {
        this.activeView = 'graph';
      } else if (urlState.view === 'map') {
        this.activeView = 'map';
      }

      this.renderEraFilterBar();
      this.renderDualStreamSpine();
      this.renderActiveFigureWorkspace();
      this.renderHitchcockDirectory('');
      this.explorer = new CollectionExplorer(
        (...args) => this.buildScriptureCard(...args),
        id => this.selectFigureById(id),
        name => this.openInGraph(name)
      );
      this.bindEvents();
      this.renderCollectionOverview();
      document.querySelectorAll<HTMLInputElement | HTMLButtonElement>('#collection-search input, #collection-search button').forEach(control => { control.disabled = false; });
      this.setSearchStatus('Search Scripture and the complete Obsidian name network. Every total below opens its records.');

      // Deep link handling
      if (urlState.tab) {
        this.explorer.open(urlState.tab as any, false);
      }
      if (urlState.ref) {
        const verse = localStore.getVerseByOsis(urlState.ref);
        if (verse) {
          const scripList = document.getElementById('scripture-anchors-list');
          if (scripList) {
            const disp = localStore.formatDisplayRef(verse);
            const card = this.buildScriptureCard(verse, disp, urlState.ref, 'Deep-linked from shared URL reference.');
            scripList.prepend(card);
          }
        }
      }
      if (urlState.name) {
        const netName = localStore.getNetworkName(urlState.name);
        if (netName) {
          this.explorer.showName(netName.name, false);
          if (this.activeView === 'graph') {
            this.renderEgoGraph(netName.name);
          }
        }
      }
      if (this.activeView === 'graph') {
        this.switchConnectionView('graph');
      } else if (this.activeView === 'map') {
        this.switchConnectionView('map');
      }

      // Popstate handling for browser back/forward buttons
      onUrlStateChange((state) => {
        if (state.figure && state.figure !== this.activeFigure?.id) {
          this.selectFigureById(state.figure, false);
        }
        if (state.view && state.view !== this.activeView) {
          this.switchConnectionView(state.view);
        }
        if (state.name) {
          this.renderEgoGraph(state.name);
        }
      });

      // Links from Home and shared discoveries still land on the requested person.
      if (requestedFig && sync.figures.some(figure => figure.id === requestedFig)) {
        document.getElementById('discovery')?.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      const loading = document.getElementById('loading-status');
      if (loading) loading.hidden = true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (errorBanner) {
        errorBanner.hidden = false;
        errorBanner.textContent = `The reader could not load its local collection. Please reload the page. Details: ${msg}`;
      }
      const loading = document.getElementById('loading-status');
      if (loading) loading.hidden = true;
      this.setSearchStatus('Search is unavailable. Please reload to try again, or read the KJV PDF.');
      const atlas = document.getElementById('connection-atlas');
      if (atlas) atlas.textContent = '';
    }
  }

  private setSearchStatus(message: string): void {
    const status = document.getElementById('search-status');
    if (status) status.textContent = message;
  }

  private renderCollectionOverview(): void {
    const collection = localStore.getCollectionOverview();
    for (const key of ['connections', 'names', 'nameEdges'] as const) {
      const el = document.getElementById(`stat-${key}`);
      if (el) el.textContent = collection[key].toLocaleString('en-US');
    }
    const atlas = document.getElementById('connection-atlas');
    if (!atlas) return;
    const x = (book: number) => 18 + book / (collection.books - 1) * 564;
    atlas.replaceChildren();
    for (const pair of collection.pairs) {
      const start = x(pair.from), end = x(pair.to), radius = (end - start) / 2;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${start} 298 A ${radius} ${radius} 0 0 1 ${end} 298`);
      path.setAttribute('fill', 'none');
      // Pairs are ordered by book: only NT-to-NT links start at index 39 or later.
      path.setAttribute('stroke', pair.from < 39 ? '#c5a059' : '#719e9b');
      path.setAttribute('stroke-opacity', pair.to - pair.from > 30 ? '.65' : '.32');
      path.setAttribute('stroke-width', '.85');
      atlas.appendChild(path);
    }
    for (let book = 0; book < collection.books; book++) {
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', String(x(book))); tick.setAttribute('x2', String(x(book)));
      tick.setAttribute('y1', '301'); tick.setAttribute('y2', '310');
      tick.setAttribute('stroke', book < 39 ? '#c5a059' : '#719e9b');
      tick.setAttribute('stroke-width', '3');
      atlas.appendChild(tick);
    }
  }

  private renderEraFilterBar(): void {
    const container = document.getElementById('era-filter-bar');
    if (!container) return;
    const sync = localStore.getSynchrony();

    const allBtn = document.createElement('button');
    allBtn.className = `era-chip ${this.selectedEraId === 'all' ? 'active' : ''}`;
    allBtn.textContent = 'All periods';
    allBtn.addEventListener('click', () => {
      this.selectedEraId = 'all';
      this.selectedEmpireId = null;
      this.renderEraFilterBar();
      this.renderDualStreamSpine();
    });
    container.innerHTML = '';
    container.appendChild(allBtn);

    for (const era of sync.eras) {
      const btn = document.createElement('button');
      btn.className = `era-chip ${this.selectedEraId === era.id ? 'active' : ''}`;
      btn.textContent = `${era.name} (${era.dateRangeLabel})`;
      btn.addEventListener('click', () => {
        this.selectedEraId = era.id;
        this.selectedEmpireId = null;
        const firstFigInEra = sync.figures
          .filter(f => f.eraId === era.id)
          .sort((a, b) => a.editorialProminence - b.editorialProminence)[0];
        if (firstFigInEra) {
          this.selectFigureById(firstFigInEra.id, false);
        }
        this.renderEraFilterBar();
        this.renderDualStreamSpine();
      });
      container.appendChild(btn);
    }
  }

  private renderDualStreamSpine(): void {
    const empiresTrack = document.getElementById('empires-stream-track');
    const figuresTrack = document.getElementById('figures-stream-track');
    if (!empiresTrack || !figuresTrack) return;

    const sync = localStore.getSynchrony();
    empiresTrack.innerHTML = '';
    figuresTrack.innerHTML = '';

    const activeEmpires = new Set(
      this.activeFigure?.secularContemporaries.map(c => c.empireId) || []
    );

    for (const emp of sync.empires) {
      const btn = document.createElement('button');
      const isHighlighted =
        this.selectedEmpireId === emp.id ||
        (this.selectedEmpireId === null && activeEmpires.has(emp.id));
      btn.className = `empire-node ${isHighlighted ? 'active' : ''}`;
      btn.style.background = `linear-gradient(135deg, ${emp.color}44 0%, #141a22 100%)`;
      btn.innerHTML = `
        <span class="empire-node-name">${emp.name}</span>
        <span class="empire-node-dates">${emp.dateRangeLabel}</span>
      `;
      btn.addEventListener('click', () => {
        this.selectedEraId = 'all';
        this.selectedEmpireId = this.selectedEmpireId === emp.id ? null : emp.id;
        const matchingFig = sync.figures.find(f =>
          f.secularContemporaries.some(c => c.empireId === emp.id)
        );
        if (matchingFig) {
          this.selectFigureById(matchingFig.id, false);
        }
        this.renderEraFilterBar();
        this.renderDualStreamSpine();
      });
      empiresTrack.appendChild(btn);
    }

    const sortedFigures = [...sync.figures]
      .filter(f => {
        if (this.selectedEraId !== 'all' && f.eraId !== this.selectedEraId) return false;
        if (
          this.selectedEmpireId &&
          !f.secularContemporaries.some(c => c.empireId === this.selectedEmpireId)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.editorialProminence - b.editorialProminence);

    if (sortedFigures.length === 0) {
      const overview = document.createElement('div');
      overview.className = 'empty-profiles';
      const empire = sync.empires.find(e => e.id === this.selectedEmpireId);
      const message = document.createElement('p');
      message.textContent = `No curated person profiles are included for ${empire?.name || 'this combination'} yet. Your current discovery remains open.`;
      overview.appendChild(message);
      if (empire) {
        const context = document.createElement('p');
        context.textContent = `${empire.dateRangeLabel} · ${empire.biblicalIntersection}`;
        overview.appendChild(context);
      }
      const reset = document.createElement('button');
      reset.className = 'btn-small';
      reset.textContent = 'Show all people';
      reset.addEventListener('click', () => {
        this.selectedEraId = 'all';
        this.selectedEmpireId = null;
        this.renderEraFilterBar();
        this.renderDualStreamSpine();
      });
      overview.appendChild(reset);
      figuresTrack.appendChild(overview);
    }

    for (const fig of sortedFigures) {
      const btn = document.createElement('button');
      const isSelected = this.activeFigure?.id === fig.id;
      const isChrist = fig.id === 'jesus-christ';
      btn.className = `figure-node ${isSelected ? 'active' : ''} ${isChrist ? 'christ-center' : ''}`;
      btn.setAttribute('data-figure-id', fig.id);
      btn.innerHTML = `
        <span class="figure-node-rank">${isChrist ? 'Jesus & the Roman world' : `${localStore.getNetworkName(fig.hitchcockKey)?.refs.length ?? 0} indexed verse links`}</span>
        <span class="figure-node-name">${fig.name}</span>
        <span class="figure-node-dates">${fig.dateRangeLabel}</span>
      `;
      btn.addEventListener('click', () => {
        this.selectFigureById(fig.id);
      });
      figuresTrack.appendChild(btn);
    }
  }

  public selectFigureById(figureId: string, reveal = true): void {
    const sync = localStore.getSynchrony();
    const target = sync.figures.find(f => f.id === figureId);
    if (!target) return;
    this.activeFigure = target;
    if (this.selectedEraId !== 'all' && target.eraId !== this.selectedEraId) this.selectedEraId = 'all';
    if (this.selectedEmpireId && !target.secularContemporaries.some(c => c.empireId === this.selectedEmpireId)) this.selectedEmpireId = null;
    if (this.trail.at(-1) !== figureId) this.trail.push(figureId);
    if (this.trail.length > 12) this.trail.shift();
    writeUrlState({ figure: figureId });
    this.renderEraFilterBar();
    this.renderDualStreamSpine();
    this.renderActiveFigureWorkspace();
    if (this.activeView === 'graph') {
      this.renderEgoGraph(target);
    } else if (this.activeView === 'map' && this.ancientMap) {
      this.ancientMap.focusOnFigure(target.id);
    }
    if (reveal) {
      const discovery = document.getElementById('discovery');
      discovery?.scrollIntoView({ behavior: 'instant', block: 'start' });
      discovery?.focus({ preventScroll: true });
    }
  }

  private renderActiveFigureWorkspace(): void {
    if (!this.activeFigure) return;
    const sync = localStore.getSynchrony();
    const fig = this.activeFigure;
    this.renderDiscovery(fig);
    if (this.activeView === 'graph') {
      this.renderEgoGraph(fig);
    } else if (this.activeView === 'map' && this.ancientMap) {
      this.ancientMap.focusOnFigure(fig.id);
    }
    const era = sync.eras.find(e => e.id === fig.eraId);

    const eraBadge = document.getElementById('active-era-badge');
    if (eraBadge && era) {
      eraBadge.textContent = era.name;
    }

    // 1. Hero & Covenant Summary
    const heroContainer = document.getElementById('figure-hero-container');
    if (heroContainer) {
      heroContainer.innerHTML = `
        <article class="figure-hero">
          <div class="figure-hero-dates">${fig.dateRangeLabel}</div>
          <h3 class="figure-hero-name">${fig.name}</h3>
          <div class="figure-hero-title">${fig.title}</div>
          <div class="figure-covenant-box">${fig.covenantSummary}</div>
          <div class="figure-meta-row">
            <span class="meta-tag"><strong>Name study:</strong> ${localStore.getNetworkName(fig.hitchcockKey)?.meaning || 'See Scripture and source notes'}</span>
            <button type="button" class="btn-small figure-network-link">Explore ${localStore.getNetworkName(fig.hitchcockKey)?.refs.length ?? 0} verse links &amp; the full name network →</button>
            ${era ? `<span class="meta-tag"><strong>World Horizon:</strong> ${era.worldContext}</span>` : ''}
          </div>
        </article>
      `;
      heroContainer.querySelector('.figure-network-link')?.addEventListener('click', () => this.explorer?.showName(fig.hitchcockKey, true));
    }

    // 2. Secular Contemporaries & Evidence Cards
    const secList = document.getElementById('secular-contemporaries-list');
    if (secList) {
      secList.innerHTML = '';
      for (const item of fig.secularContemporaries) {
        const evMeta = sync.evidenceCategories[item.evidenceCategory];
        const card = document.createElement('div');
        card.className = 'contemporary-card';
        card.innerHTML = `
          <div class="contemporary-top">
            <div>
              <div class="contemporary-name">${item.name}</div>
              <div class="contemporary-role">${item.role}</div>
            </div>
            <span class="evidence-badge evidence-${item.evidenceCategory}" title="${evMeta?.description || ''}">
              ${evMeta?.label || item.evidenceCategory}
            </span>
          </div>
          <p class="contemporary-detail">${item.synchronyDetail}</p>
          <div class="contemporary-source"><strong>Sources to investigate:</strong> ${item.sourceCitation}</div>
        `;
        secList.appendChild(card);
      }
    }

    // 3. Canonical KJV Scripture Anchors
    const scripList = document.getElementById('scripture-anchors-list');
    if (scripList) {
      scripList.innerHTML = '';
      for (const anchor of fig.scriptureAnchors) {
        const verseObj = localStore.getVerseByOsis(anchor.osisRef);
        const card = this.buildScriptureCard(
          verseObj,
          anchor.displayRef,
          anchor.osisRef,
          anchor.historicalContextNote
        );
        scripList.appendChild(card);
      }
    }

    // 4. Personal Network
    const netList = document.getElementById('personal-network-list');
    if (netList) {
      netList.innerHTML = '';
      for (const rel of fig.personalNetwork) {
        const btn = document.createElement('button');
        btn.className = 'network-card';
        const refVerse = localStore.getVerseByOsis(rel.ref);
        const dispRef = refVerse ? localStore.formatDisplayRef(refVerse) : rel.ref;
        btn.innerHTML = `
          <div class="network-card-top">
            <span>${rel.name}</span>
            <span style="color: var(--gold-primary); font-size: 0.75rem;">${dispRef} &rarr;</span>
          </div>
          <div class="network-card-rel">${rel.relation}</div>
        `;
        btn.addEventListener('click', () => {
          this.selectFigureById(rel.targetId);
        });
        netList.appendChild(btn);
      }
    }
  }

  private renderDiscovery(fig: HistoricalFigure): void {
    const discovery = discoveries[fig.id];
    const sync = localStore.getSynchrony();
    const setText = (id: string, text: string) => {
      const element = document.getElementById(id);
      if (element) element.textContent = text;
    };
    setText('discovery-title', discovery.title);
    setText('discovery-lead', discovery.lead);
    setText('discovery-setting', `${fig.name} · ${sync.eras.find(e => e.id === fig.eraId)?.dateRangeLabel || ''}`);
    const scripture = document.getElementById('discovery-scripture');
    const verse = localStore.getVerseByOsis(discovery.verse);
    if (scripture && verse) {
      scripture.innerHTML = `<span class="scripture-ref">${localStore.formatDisplayRef(verse)}</span><div class="kjv-verse-text">${localStore.formatCanonicalKjvHtml(verse.text)}</div><button class="btn-small" type="button">Read the surrounding passage ↓</button>`;
      scripture.querySelector('button')?.addEventListener('click', () => {
        const reader = document.getElementById('scripture-anchors-list');
        if (!reader) return;
        reader.prepend(this.buildScriptureCard(verse, localStore.formatDisplayRef(verse), discovery.verse, 'The passage from your current discovery.'));
        const card = reader.firstElementChild as HTMLElement;
        (card.querySelector('.btn-toggle-chapter') as HTMLButtonElement).click();
        card.scrollIntoView({ behavior: 'instant', block: 'start' });
        card.tabIndex = -1;
        card.focus({ preventScroll: true });
      });
    }
    const record = discovery.record;
    const evidence = document.getElementById('discovery-evidence');
    if (evidence) {
      evidence.replaceChildren();
      const label = document.createElement('p');
      label.className = 'evidence-label';
      label.textContent = record?.label || 'Context from the study collection';
      const heading = document.createElement('h3');
      heading.textContent = record?.title || fig.secularContemporaries[0]?.name || 'The historical setting';
      const text = document.createElement('p');
      text.textContent = record?.text || 'The wider study below brings together the biblical passages and named historical sources for this person. Examine each source and its evidence category before drawing a conclusion.';
      evidence.append(label, heading, text);
      if (fig.id === 'jesus-christ') {
        const photo = document.createElement('figure');
        photo.className = 'record-photo';
        const link = document.createElement('a');
        link.href = '/images/pilate-stone.jpg';
        link.target = '_blank';
        link.rel = 'noopener';
        link.setAttribute('aria-label', 'Examine the photograph of the Pilate Stone');
        const image = document.createElement('img');
        image.src = '/images/pilate-stone.jpg';
        image.alt = 'The surviving Pilate inscription on a broken limestone block in the Israel Museum';
        image.width = 960;
        image.height = 640;
        link.appendChild(image);
        const caption = document.createElement('figcaption');
        const credit = document.createElement('a');
        credit.href = 'https://commons.wikimedia.org/wiki/File:Limestone_Inscription_with_Name_of_Pontius_Pilate,_Caesarea,_26-36_AD_(42500903014).jpg';
        credit.textContent = 'Photograph: Gary Todd / CC0';
        credit.target = '_blank';
        credit.rel = 'noopener noreferrer';
        caption.append('Israel Museum · ', credit);
        photo.append(link, caption);
        evidence.insertBefore(photo, text);
      }
      if (record?.url) {
        const link = document.createElement('a');
        link.href = record.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'source-link';
        link.textContent = `${record.source} ↗`;
        evidence.appendChild(link);
      } else {
        const link = document.createElement('a');
        link.href = '#figure-hero-container';
        link.className = 'source-link';
        link.textContent = 'Explore the passages & historical context below ↓';
        evidence.appendChild(link);
      }
    }
    const note = document.getElementById('connection-note');
    if (note) {
      note.replaceChildren();
      const heading = document.createElement('strong');
      heading.textContent = 'What this connection tells us. ';
      note.append(heading, discovery.distinction);
    }
    const questions = document.getElementById('next-questions');
    if (questions) {
      questions.replaceChildren();
      const next = [...fig.personalNetwork.map(n => n.targetId), 'hezekiah', 'daniel', 'jesus-christ'];
      // Include a historical thread alongside the first two personal connections.
      const targets = [...new Set(next)].filter(id => id !== fig.id);
      const visible = targets.slice(0, 2);
      const historyThread = targets.find(id => ['daniel', 'hezekiah'].includes(id) && !visible.includes(id));
      if (historyThread) visible.push(historyThread);
      else if (targets[2]) visible.push(targets[2]);
      for (const targetId of visible) {
        const target = sync.figures.find(f => f.id === targetId);
        if (!target || !discoveries[targetId]) continue;
        const button = document.createElement('button');
        button.className = 'question-button';
        button.dataset.target = targetId;
        button.append(discoveries[targetId].question);
        const arrow = document.createElement('span');
        arrow.textContent = '→';
        arrow.setAttribute('aria-hidden', 'true');
        button.appendChild(arrow);
        button.addEventListener('click', () => this.selectFigureById(targetId));
        questions.appendChild(button);
      }
    }
    const trail = document.getElementById('journey-trail');
    if (trail) {
      trail.replaceChildren();
      this.trail.forEach((id, index) => {
        const name = sync.figures.find(f => f.id === id)?.name || id;
        if (index > 0) trail.append(' → ');
        if (index === this.trail.length - 1) {
          const current = document.createElement('span');
          current.className = 'trail-current';
          current.setAttribute('aria-current', 'step');
          current.textContent = name;
          trail.appendChild(current);
        } else {
          const button = document.createElement('button');
          button.className = 'trail-link';
          button.textContent = name;
          button.addEventListener('click', () => this.returnToTrail(index));
          trail.appendChild(button);
        }
      });
    }
    const back = document.getElementById('journey-back') as HTMLButtonElement;
    back.hidden = this.trail.length < 2;
    if (!back.hidden) back.textContent = `Back to ${sync.figures.find(f => f.id === this.trail.at(-2))?.name}`;
    document.querySelectorAll<HTMLButtonElement>('[data-start]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.start === fig.id)));
  }

  private returnToTrail(index: number): void {
    const target = this.trail[index];
    if (!target) return;
    this.trail = this.trail.slice(0, index + 1);
    this.selectFigureById(target);
  }

  private buildScriptureCard(
    verseObj: KjvVerseData | null,
    displayRef: string,
    osisRef: string,
    contextNote: string
  ): HTMLElement {
    const card = document.createElement('article');
    card.className = 'scripture-card';

    const formattedHtml = verseObj
      ? localStore.formatCanonicalKjvHtml(verseObj.text)
      : `<em>[Missing reference in local corpus: ${osisRef}]</em>`;

    const crossRefs = localStore.getCrossRefsForVerse(osisRef, 6);

    card.innerHTML = `
      <div class="scripture-ref-bar">
        <span class="scripture-ref">${verseObj ? localStore.formatDisplayRef(verseObj) : displayRef}</span>
        <div class="scripture-actions">
          <button type="button" class="btn-small btn-toggle-chapter" aria-expanded="false">Read in context</button>
          <button type="button" class="btn-small btn-toggle-xrefs" aria-expanded="false">Connected passages · preview (${crossRefs.length})</button>
          <button type="button" class="btn-small btn-all-xrefs">All source records →</button>
        </div>
      </div>
      <div class="kjv-verse-text">${formattedHtml}</div>
      <div class="scripture-context-note"><strong>Study note:</strong> ${contextNote}</div>
      <div class="drawer-box drawer-chapter"></div>
      <div class="drawer-box drawer-xrefs"></div>
    `;

    card.querySelector('.btn-all-xrefs')?.addEventListener('click', () => this.explorer?.openReferences(osisRef));

    const chapBtn = card.querySelector('.btn-toggle-chapter') as HTMLButtonElement | null;
    if (chapBtn && !verseObj) chapBtn.disabled = true;
    const chapDrawer = card.querySelector('.drawer-chapter') as HTMLElement | null;
    const xrefBtn = card.querySelector('.btn-toggle-xrefs') as HTMLButtonElement | null;
    const xrefDrawer = card.querySelector('.drawer-xrefs') as HTMLElement | null;

    if (chapBtn && chapDrawer && verseObj) {
      chapBtn.addEventListener('click', () => {
        const isOpen = chapDrawer.classList.toggle('open');
        chapBtn.setAttribute('aria-expanded', String(isOpen));
        if (isOpen && chapDrawer.innerHTML === '') {
          const allChap = localStore.getChapterVerses(verseObj.book, verseObj.chapter);
          const start = Math.max(1, verseObj.verse - 2);
          const end = Math.min(allChap.length, verseObj.verse + 3);
          const slice = allChap.filter(v => v.verse >= start && v.verse <= end);
          chapDrawer.innerHTML = slice
            .map(
              v => `
                <div class="crossref-item">
                  <strong style="color: var(--gold-primary);">${localStore.formatDisplayRef(v)}</strong>
                  <span> ${localStore.formatCanonicalKjvHtml(v.text)}</span>
                </div>
              `
            )
            .join('');
        }
      });
    }

    if (xrefBtn && xrefDrawer) {
      xrefBtn.addEventListener('click', () => {
        const isOpen = xrefDrawer.classList.toggle('open');
        xrefBtn.setAttribute('aria-expanded', String(isOpen));
        if (isOpen && xrefDrawer.innerHTML === '') {
          if (crossRefs.length === 0) {
            xrefDrawer.innerHTML = '<div class="crossref-item">No preview passages available for this verse. Open the full source records to check ranges and unavailable references.</div>';
          } else {
            xrefDrawer.innerHTML = crossRefs
              .map(
                xr => `
                  <div class="crossref-item">
                    <strong style="color: var(--gold-bright);">${localStore.formatDisplayRef(xr.verse)}</strong>
                    <div>${localStore.formatCanonicalKjvHtml(xr.verse.text)}</div>
                    <button class="btn-small btn-follow-ref" data-ref-index="${crossRefs.indexOf(xr)}">Read this passage →</button>
                  </div>
                `
              )
              .join('');
            xrefDrawer.querySelectorAll<HTMLButtonElement>('.btn-follow-ref').forEach(button => {
              button.addEventListener('click', () => {
                const ref = crossRefs[Number(button.dataset.refIndex)];
                const reader = card.parentElement;
                if (!reader || !ref) return;
                const next = this.buildScriptureCard(ref.verse, localStore.formatDisplayRef(ref.verse), localStore.toOsisRef(ref.verse), `Followed from ${displayRef}. A cross-reference connects passages; it is not an independent historical source.`);
                reader.prepend(next);
                next.scrollIntoView({ behavior: 'instant', block: 'start' });
                next.tabIndex = -1;
                next.focus({ preventScroll: true });
              });
            });
          }
        }
      });
    }

    return card;
  }

  private renderHitchcockDirectory(filterQuery: string): void {
    const container = document.getElementById('hitchcock-directory-list');
    if (!container) return;

    const entries = localStore.getRankedNames(filterQuery, 50);
    container.innerHTML = '';

    for (const item of entries) {
      const div = document.createElement('button');
      div.className = 'hitchcock-card';
      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: ${item.isFlagship ? 'var(--gold-bright)' : 'var(--text-primary)'};">${item.name}</strong>
          <span style="font-size: 0.7rem; color: var(--text-muted);">
            ${item.occurrences > 0 ? `${item.occurrences} refs` : 'Dictionary entry'}
          </span>
        </div>
        <div style="color: var(--text-secondary); font-size: 0.76rem; margin-top: 0.15rem;">
          ${item.meanings.join('; ')}
        </div>
      `;
      div.addEventListener('click', () => {
        if (item.flagshipId) {
          this.selectFigureById(item.flagshipId);
        } else {
          this.openNameSearchResult(item, true);
        }
      });
      container.appendChild(div);
    }
  }

  private openNameSearchResult(name: RankedBiblicalName, reveal = false): void {
    this.explorer?.showName(name.name, reveal);
  }

  private executeGlobalSearch(query: string): void {
    const dropdown = document.getElementById('search-results-list');
    if (!dropdown) return;
    const nameDetail = document.getElementById('name-search-detail');
    if (nameDetail) nameDetail.hidden = true;

    const trimmed = query.trim();
    if (!trimmed) {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
      this.setSearchStatus('Search Scripture and the complete Obsidian name network. Every total below opens its records.');
      return;
    }

    const results = localStore.searchAll(trimmed, 15);
    const count = results.figures.length + results.empires.length + results.verses.length + results.names.length;
    this.setSearchStatus(count ? `Showing ${count} results for “${trimmed}”. Select a result to explore.` : `No results for “${trimmed}”. Try a name, phrase, or reference such as John 3:16.`);
    dropdown.innerHTML = '';

    if (
      results.figures.length === 0 &&
      results.empires.length === 0 &&
      results.verses.length === 0 &&
      results.names.length === 0
    ) {
      dropdown.innerHTML = '<div class="search-result-item">No matching figures, empires, or KJV verses found.</div>';
      dropdown.classList.add('active');
      return;
    }

    if (results.figures.length > 0) {
      const h = document.createElement('div');
      h.className = 'search-group-title';
      h.textContent = 'Historical Figures';
      dropdown.appendChild(h);

      for (const fig of results.figures) {
        const btn = document.createElement('button');
        btn.className = 'search-result-item';
        btn.type = 'button';
        btn.innerHTML = `<strong>${fig.name}</strong> <span style="color: var(--text-secondary);">— ${fig.dateRangeLabel}</span>`;
        btn.addEventListener('click', () => {
          this.selectFigureById(fig.id);
          dropdown.classList.remove('active');
        });
        dropdown.appendChild(btn);
      }
    }

    for (const empire of results.empires) {
      const button = document.createElement('button');
      button.className = 'search-result-item';
      button.type = 'button';
      button.textContent = `${empire.name} — Explore people in this empire`;
      button.addEventListener('click', () => {
        this.selectedEraId = 'all';
        this.selectedEmpireId = empire.id;
        const figure = localStore.getSynchrony().figures.find(f => f.secularContemporaries.some(c => c.empireId === empire.id));
        if (figure) this.selectFigureById(figure.id);
        else {
          this.renderEraFilterBar();
          this.renderDualStreamSpine();
        }
        const browser = document.getElementById('timeline-browser') as HTMLDetailsElement;
        browser.open = true;
        browser.scrollIntoView({ behavior: 'instant', block: 'start' });
        dropdown.classList.remove('active');
      });
      dropdown.appendChild(button);
    }

    for (const name of results.names) {
      const button = document.createElement('button');
      button.className = 'search-result-item';
      button.type = 'button';
      button.textContent = `${name.name} — ${name.meanings.join('; ')}`;
      button.addEventListener('click', () => {
        if (name.flagshipId) this.selectFigureById(name.flagshipId);
        else {
          this.openNameSearchResult(name);
        }
        dropdown.classList.remove('active');
      });
      dropdown.appendChild(button);
    }

    if (results.verses.length > 0) {
      const h = document.createElement('div');
      h.className = 'search-group-title';
      h.textContent = 'Canonical KJV Verses';
      dropdown.appendChild(h);

      for (const v of results.verses) {
        const btn = document.createElement('button');
        btn.className = 'search-result-item';
        btn.type = 'button';
        const disp = localStore.formatDisplayRef(v);
        btn.innerHTML = `<strong style="color: var(--gold-bright);">${disp}</strong> <span>${localStore.formatCanonicalKjvHtml(v.text)}</span>`;
        btn.addEventListener('click', () => {
          const scripList = document.getElementById('scripture-anchors-list');
          if (scripList) {
            const osis = localStore.toOsisRef(v);
            const card = this.buildScriptureCard(
              v,
              disp,
              osis,
              'Selected directly from canonical KJV search.'
            );
            scripList.prepend(card);
            card.scrollIntoView({ behavior: 'instant', block: 'start' });
            card.tabIndex = -1;
            card.focus({ preventScroll: true });
          }
          dropdown.classList.remove('active');
        });
        dropdown.appendChild(btn);
      }
    }

    dropdown.classList.add('active');
  }

  private bindEvents(): void {
    document.querySelector('.primary-link')?.addEventListener('click', e => {
      e.preventDefault();
      this.selectFigureById('jesus-christ');
    });
    document.querySelectorAll<HTMLButtonElement>('[data-start]').forEach(button => {
      button.addEventListener('click', () => this.selectFigureById(button.dataset.start!));
    });
    document.getElementById('journey-back')?.addEventListener('click', () => this.returnToTrail(this.trail.length - 2));
    const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
    const dropdown = document.getElementById('search-results-list');

    document.getElementById('name-search-close')?.addEventListener('click', () => {
      document.getElementById('name-search-detail')!.hidden = true;
      searchInput?.focus({ preventScroll: true });
      this.setSearchStatus('Search Scripture and the complete Obsidian name network. Every total below opens its records.');
    });

    document.getElementById('collection-search-form')?.addEventListener('submit', event => {
      event.preventDefault();
      if (searchInput) this.executeGlobalSearch(searchInput.value);
    });
    document.querySelectorAll<HTMLButtonElement>('[data-search]').forEach(button => {
      button.addEventListener('click', () => {
        if (!searchInput) return;
        searchInput.value = button.dataset.search!;
        searchInput.focus({ preventScroll: true });
        this.executeGlobalSearch(searchInput.value);
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.executeGlobalSearch(searchInput.value);
      });
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') dropdown?.classList.remove('active');
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          dropdown?.querySelector<HTMLButtonElement>('button')?.focus();
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (dropdown && searchInput && !(e.target as Element).closest('#collection-search')) {
        dropdown.classList.remove('active');
      }
    });
    dropdown?.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        dropdown.classList.remove('active');
        searchInput?.focus({ preventScroll: true });
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const buttons = [...dropdown.querySelectorAll<HTMLButtonElement>('button')];
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next = current + (event.key === 'ArrowDown' ? 1 : -1);
        if (next < 0) searchInput?.focus();
        else buttons[Math.min(next, buttons.length - 1)]?.focus();
      }
    });

    const hitchcockInput = document.getElementById('hitchcock-input') as HTMLInputElement | null;
    if (hitchcockInput) {
      hitchcockInput.addEventListener('input', () => {
        this.renderHitchcockDirectory(hitchcockInput.value);
      });
    }

    document.getElementById('btn-view-list')?.addEventListener('click', () => {
      this.switchConnectionView('list');
    });
    document.getElementById('btn-view-graph')?.addEventListener('click', () => {
      this.switchConnectionView('graph');
    });
    document.getElementById('btn-view-map')?.addEventListener('click', () => {
      this.switchConnectionView('map');
    });
  }

  private switchConnectionView(view: 'list' | 'graph' | 'map'): void {
    this.activeView = view;
    const listBtn = document.getElementById('btn-view-list') as HTMLButtonElement | null;
    const graphBtn = document.getElementById('btn-view-graph') as HTMLButtonElement | null;
    const mapBtn = document.getElementById('btn-view-map') as HTMLButtonElement | null;
    const graphContainer = document.getElementById('ego-graph-container');
    const mapContainer = document.getElementById('ancient-map-container');

    // Reset button states
    listBtn?.classList.remove('active');
    listBtn?.setAttribute('aria-pressed', 'false');
    graphBtn?.classList.remove('active');
    graphBtn?.setAttribute('aria-pressed', 'false');
    mapBtn?.classList.remove('active');
    mapBtn?.setAttribute('aria-pressed', 'false');

    if (view === 'map') {
      mapBtn?.classList.add('active');
      mapBtn?.setAttribute('aria-pressed', 'true');
      if (graphContainer) graphContainer.hidden = true;
      if (mapContainer) {
        mapContainer.hidden = false;
        if (!this.ancientMap) {
          this.ancientMap = new AncientMapCanvas({
            container: mapContainer,
            compact: true,
            onSelectSite: (site) => {
              if (site.figureId && site.figureId !== this.activeFigure?.id) {
                this.selectFigureById(site.figureId);
              }
            }
          });
        }
        if (this.activeFigure) {
          this.ancientMap.focusOnFigure(this.activeFigure.id);
        }
      }
      writeUrlState({ view: 'map' });
    } else if (view === 'graph') {
      graphBtn?.classList.add('active');
      graphBtn?.setAttribute('aria-pressed', 'true');
      if (mapContainer) mapContainer.hidden = true;
      if (graphContainer) {
        graphContainer.hidden = false;
        this.renderEgoGraph(this.activeGraphTarget || this.activeFigure || 'Jesus');
      }
      writeUrlState({ view: 'graph' });
    } else {
      listBtn?.classList.add('active');
      listBtn?.setAttribute('aria-pressed', 'true');
      if (graphContainer) graphContainer.hidden = true;
      if (mapContainer) mapContainer.hidden = true;
      writeUrlState({ view: 'list' });
    }
  }

  public openInGraph(target: HistoricalFigure | string): void {
    this.switchConnectionView('graph');
    this.renderEgoGraph(target);
    const container = document.getElementById('ego-graph-container');
    container?.scrollIntoView({ behavior: 'instant', block: 'center' });
  }

  private renderEgoGraph(target: HistoricalFigure | string): void {
    this.activeGraphTarget = target;
    const container = document.getElementById('ego-graph-container');
    if (!container) return;

    if (!this.egoGraph) {
      this.egoGraph = new EgoGraphCanvas(container, {
        onSelectNode: (node) => this.handleEgoNodeClick(node),
      });
    }

    const data = this.buildEgoGraphData(target);
    this.egoGraph.render(data);
  }

  private handleEgoNodeClick(node: EgoNode): void {
    const sync = localStore.getSynchrony();
    const fig = sync.figures.find(f => f.id === node.id || f.name.toLowerCase() === node.title.toLowerCase());
    if (fig) {
      this.selectFigureById(fig.id);
      writeUrlState({ figure: fig.id, view: 'graph' });
      return;
    }

    const networkName = localStore.getNetworkName(node.title);
    if (networkName) {
      this.renderEgoGraph(networkName.name);
      writeUrlState({ name: networkName.name, view: 'graph' });
    }
  }

  private buildEgoGraphData(target: HistoricalFigure | string): EgoGraphData {
    const isFigure = typeof target !== 'string';
    const centerTitle = isFigure ? target.name : target;
    const centerId = isFigure ? target.id : target;
    const centerSubtitle = isFigure
      ? `${target.title} (${target.dateRangeLabel})`
      : (localStore.getNetworkName(target)?.meaning || 'Biblical Name');

    const nodesMap = new Map<string, EgoNode>();
    const edges: Array<{ source: string; target: string; weight: number }> = [];
    const seenEdges = new Set<string>();

    const addEdge = (source: string, targetId: string, weight = 1) => {
      if (source === targetId) return;
      const key = [source, targetId].sort().join('::');
      if (!seenEdges.has(key)) {
        seenEdges.add(key);
        edges.push({ source, target: targetId, weight });
      }
    };

    nodesMap.set(centerId, {
      id: centerId,
      title: centerTitle,
      subtitle: centerSubtitle,
      type: isFigure ? 'figure' : 'name',
      hop: 0,
      degree: 0,
    });

    const hop1Names: string[] = [];

    if (isFigure) {
      for (const rel of target.personalNetwork) {
        const id = rel.targetId || rel.name;
        if (!nodesMap.has(id)) {
          nodesMap.set(id, {
            id,
            title: rel.name,
            subtitle: rel.relation,
            type: 'name',
            hop: 1,
            degree: 1,
          });
          hop1Names.push(rel.name);
          addEdge(centerId, id, 3);
        }
      }

      for (const sc of target.secularContemporaries.slice(0, 4)) {
        const id = `sc-${sc.name.toLowerCase().replace(/\s+/g, '-')}`;
        if (!nodesMap.has(id)) {
          nodesMap.set(id, {
            id,
            title: sc.name,
            subtitle: `${sc.role} · ${sc.empireId}`,
            type: 'contemporary',
            hop: 1,
            degree: 1,
          });
          addEdge(centerId, id, 2);
        }
      }

      const networkName = target.hitchcockKey || target.name.split(' ')[0];
      const coNames = localStore.getConnectedNames(networkName).slice(0, 8);
      for (const cn of coNames) {
        if (!nodesMap.has(cn.name)) {
          nodesMap.set(cn.name, {
            id: cn.name,
            title: cn.name,
            subtitle: localStore.getNetworkName(cn.name)?.meaning,
            type: 'name',
            hop: 1,
            degree: cn.count,
            weight: cn.count,
          });
          hop1Names.push(cn.name);
          addEdge(centerId, cn.name, cn.count);
        }
      }
    } else {
      const coNames = localStore.getConnectedNames(target).slice(0, 14);
      for (const cn of coNames) {
        nodesMap.set(cn.name, {
          id: cn.name,
          title: cn.name,
          subtitle: localStore.getNetworkName(cn.name)?.meaning,
          type: 'name',
          hop: 1,
          degree: cn.count,
          weight: cn.count,
        });
        hop1Names.push(cn.name);
        addEdge(centerId, cn.name, cn.count);
      }
    }

    const topHop1 = hop1Names.slice(0, 4);
    for (const h1Name of topHop1) {
      const h2Neighbors = localStore.getConnectedNames(h1Name).slice(0, 3);
      for (const h2 of h2Neighbors) {
        if (!nodesMap.has(h2.name)) {
          nodesMap.set(h2.name, {
            id: h2.name,
            title: h2.name,
            subtitle: localStore.getNetworkName(h2.name)?.meaning,
            type: 'name',
            hop: 2,
            degree: h2.count,
            weight: h2.count,
          });
        }
        addEdge(h1Name, h2.name, h2.count);
      }
    }

    for (let i = 0; i < hop1Names.length; i++) {
      for (let j = i + 1; j < hop1Names.length; j++) {
        const a = hop1Names[i];
        const b = hop1Names[j];
        if (nodesMap.has(a) && nodesMap.has(b)) {
          const shared = localStore.getSharedRefs(a, b);
          if (shared.length > 0) {
            addEdge(a, b, shared.length);
          }
        }
      }
    }

    const nodes = Array.from(nodesMap.values());
    for (const n of nodes) {
      n.degree = edges.filter(e => e.source === n.id || e.target === n.id).length;
    }

    return {
      centerId,
      centerTitle,
      nodes,
      edges,
    };
  }
}

const app = new HistoricalInteractApp();
window.addEventListener('DOMContentLoaded', () => {
  void app.bootstrap();
});
