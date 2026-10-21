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
import { EgoGraphCanvas, type EgoGraphData, type EgoNode, type EgoEdge, type EgoGraphSettings } from './engine/egoGraph';
import { AncientMapCanvas } from './engine/ancientMap';
import { readUrlState, writeUrlState, onUrlStateChange, restoreUrlState, type InteractUrlState } from './store/urlStateRouter';
import { StudySessionBar, getStudyMapTarget } from './studySession';
import { findStudySubject } from './data/studySubjects';
import { getIdentityRefs } from './data/nameIdentities';
import { createEvidenceReceiptElement, getEvidenceReceipt } from './data/evidenceReceipts';

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
  private studyBar: StudySessionBar | null = null;

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
        name => this.openInGraph(name),
        (name, compare) => this.renderNameWorkspace(name, compare)
      );
      this.bindEvents();
      this.renderCollectionOverview();
      document.querySelectorAll<HTMLInputElement | HTMLButtonElement>('#collection-search input, #collection-search button').forEach(control => { control.disabled = false; });
      this.setSearchStatus('Search Scripture and the complete Obsidian name network. Every total below opens its records.');

      // Deep link handling
      this.explorer.restore(urlState);
      this.restoreStudy(urlState);
      restoreUrlState(() => this.switchConnectionView(this.activeView));
      this.studyBar = new StudySessionBar({
        onView: view => {
          this.switchConnectionView(view);
          if (view !== 'list') document.getElementById(view === 'graph' ? 'ego-graph-container' : 'ancient-map-container')?.scrollIntoView({ block: 'start' });
        },
        onReturn: () => {
          const state = readUrlState();
          const target = state.compare ? 'collection-explorer' : state.name ? 'name-search-detail' : 'scripture-anchors-list';
          document.getElementById(target)?.scrollIntoView({ block: 'start' });
        }
      });

      // Popstate handling for browser back/forward buttons
      onUrlStateChange((state) => {
        this.explorer?.restore(state);
        this.restoreStudy(state);
        this.switchConnectionView(state.view || 'list');
        this.studyBar?.refresh(state);
      });

      // Links from Home and shared discoveries still land on the requested person.
      if (requestedFig && !urlState.name && !urlState.subject && !urlState.ref && sync.figures.some(figure => figure.id === requestedFig)) {
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
        this.selectEmpire(emp.id, false);
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
      message.textContent = `No curated person profiles are included for ${empire?.name || 'this combination'} yet.`;
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
    writeUrlState({ figure: figureId, name: null, compare: null, identity: null, studyPage: 1 });
    const input = document.getElementById('search-input') as HTMLInputElement | null;
    if (input) input.value = target.name;
    this.setWorkspaceLabels(target.name, true);
    this.activeGraphTarget = target;
    const namePanel = document.getElementById('name-search-detail');
    if (namePanel) namePanel.hidden = true;
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

  private restoreStudy(state: InteractUrlState): void {
    const subject = findStudySubject(state.subject || '');
    if (state.subject?.startsWith('empire:')) this.selectEmpire(state.subject.slice(7), false);
    else if (subject) this.selectPassageStudy(subject.name, subject.refs, subject.note, { subject: subject.id }, false);
    else if (state.name) this.renderNameWorkspace(state.name, state.compare || undefined);
    else if (state.ref && localStore.getVerseByOsis(state.ref)) this.selectVerse(state.ref, false);
    else this.selectFigureById(state.figure || 'jesus-christ', false);
  }

  private renderNameWorkspace(name: string, compare?: string): void {
    const state = readUrlState();
    const figure = !compare && !state.identity && localStore.getSynchrony().figures.find(fig => fig.hitchcockKey.toLowerCase() === name.toLowerCase());
    if (figure) {
      this.activeFigure = figure;
      this.activeGraphTarget = figure;
      this.setWorkspaceLabels(figure.name, true);
      this.renderActiveFigureWorkspace();
    } else {
      const entry = localStore.getNetworkName(name);
      const refs = (compare ? localStore.getSharedRefs(name, compare) : getIdentityRefs(name, state.identity || 'all', entry?.refs || []))
        .filter(ref => !state.occurrenceBook || ref.split('.')[0].toLowerCase() === state.occurrenceBook.toLowerCase());
      const label = compare ? `${name} ↔ ${compare}` : name;
      const note = compare ? 'Shared passage occurrences in the name index; these do not by themselves establish a personal relationship.' : localStore.getNameReview(name)?.identity?.text || '';
      this.renderPassageWorkspace(label, refs.slice(0, 5), note);
      this.activeGraphTarget = entry ? name : null;
      const list = document.getElementById('personal-network-list');
      if (list && entry && !compare) {
        for (const neighbor of localStore.getConnectedNames(name).slice(0, 12)) {
          const button = document.createElement('button');
          button.className = 'network-card'; button.type = 'button';
          button.textContent = `${neighbor.name} · ${neighbor.count} shared verse${neighbor.count === 1 ? '' : 's'} (name index)`;
          button.addEventListener('click', () => this.explorer?.showName(neighbor.name, true));
          list.append(button);
        }
      }
      if (refs.length > 5) {
        const more = document.createElement('button'); more.type = 'button'; more.className = 'btn-small';
        more.textContent = `Explore all ${refs.length} indexed passages →`;
        more.addEventListener('click', () => compare ? this.explorer?.showShared(name, compare) : this.explorer?.showName(name, true, true));
        document.getElementById('scripture-anchors-list')?.append(more);
      }
    }
    this.renderDualStreamSpine();
    this.switchConnectionView(this.activeView);
  }

  private selectVerse(ref: string, reveal = true): void {
    const verse = localStore.getVerseByOsis(ref);
    if (!verse) return;
    this.selectPassageStudy(localStore.formatDisplayRef(verse), [ref], '', { ref }, reveal);
  }

  private selectEmpire(id: string, reveal = true): void {
    const sync = localStore.getSynchrony(), empire = sync.empires.find(empire => empire.id === id);
    if (!empire) return;
    this.selectPassageStudy(empire.name, [], empire.biblicalIntersection, { subject: `empire:${id}` }, reveal);
    this.selectedEmpireId = id;
    this.renderEraFilterBar(); this.renderDualStreamSpine();
    for (const figure of sync.figures.filter(figure => figure.secularContemporaries.some(item => item.empireId === id))) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'network-card';
      button.textContent = `${figure.name} · Profile in this historical setting`;
      button.addEventListener('click', () => this.selectFigureById(figure.id));
      document.getElementById('personal-network-list')?.append(button);
    }
    const browser = document.getElementById('timeline-browser') as HTMLDetailsElement | null;
    if (browser) browser.open = true;
  }

  private setWorkspaceLabels(label: string, person = false): void {
    const heading = document.getElementById('research-title'); if (heading) heading.textContent = `${label} · Wider study`;
    const context = document.querySelector('[aria-label="The person and their world"] h3');
    if (context) context.textContent = person ? 'The person & their world' : 'The subject & its context';
    const connections = document.querySelector('.connections-panel .panel-header h3');
    if (connections) connections.textContent = person ? 'People connected to this story' : 'Connections in Scripture';
    // Navigation prompts need real destinations; empty evidence cards remain in place.
    const questions = document.querySelector<HTMLElement>('.next-section'); if (questions) questions.hidden = !person;
    const note = document.getElementById('connection-note'); if (note) note.hidden = !person;
    const era = document.getElementById('active-era-badge'); if (era) era.hidden = !person;
  }

  private selectPassageStudy(label: string, refs: string[], note: string, selection: Partial<InteractUrlState>, reveal = true): void {
    writeUrlState({ ...selection, compare: null, identity: null, section: null, studyPage: 1 });
    const panel = document.getElementById('name-search-detail'); if (panel) panel.hidden = true;
    this.renderPassageWorkspace(label, refs, note);
    this.switchConnectionView('list');
    const input = document.getElementById('search-input') as HTMLInputElement | null;
    if (input) input.value = label;
    document.getElementById('search-results-list')?.classList.remove('active');
    this.setSearchStatus(`Selected ${label}. Cards without supported information are empty.`);
    if (reveal) document.getElementById('discovery')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }

  private renderPassageWorkspace(label: string, refs: string[], note: string): void {
    this.activeFigure = null;
    this.activeGraphTarget = null;
    this.selectedEraId = 'all'; this.selectedEmpireId = null;
    this.setWorkspaceLabels(label);
    // Clear all subject-owned slots together so no prior biography, evidence or route survives.
    for (const id of ['figure-hero-container', 'active-era-badge', 'secular-contemporaries-list', 'scripture-anchors-list', 'personal-network-list', 'discovery-scripture', 'discovery-evidence', 'connection-note', 'next-questions', 'journey-trail']) document.getElementById(id)?.replaceChildren();
    const text = (id: string, value: string) => { const node = document.getElementById(id); if (node) node.textContent = value; };
    text('discovery-title', label); text('discovery-setting', label); text('discovery-lead', note);
    text('journey-trail', label);
    const back = document.getElementById('journey-back'); if (back) back.hidden = true;
    const heading = document.createElement('h3'); heading.className = 'figure-hero-name'; heading.textContent = label;
    document.getElementById('figure-hero-container')?.append(heading);
    if (note) { const description = document.createElement('p'); description.textContent = note; document.getElementById('figure-hero-container')?.append(description); }
    for (const [index, ref] of refs.entries()) {
      const verse = localStore.getVerseByOsis(ref); if (!verse) continue;
      document.getElementById('scripture-anchors-list')?.append(this.buildScriptureCard(verse, localStore.formatDisplayRef(verse), ref, 'Passage from the selected study.'));
      if (!index) document.getElementById('discovery-scripture')?.append(this.buildScriptureCard(verse, localStore.formatDisplayRef(verse), ref, 'Passage from the selected study.'));
    }
    this.renderDualStreamSpine();
    this.renderEraFilterBar();
  }

  private renderDiscovery(fig: HistoricalFigure): void {
    const discovery = discoveries[fig.id];
    if (!discovery) return;
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
        const card = reader.firstElementChild as HTMLElement | null;
        if (!card) return;
        (card.querySelector('.btn-toggle-chapter') as HTMLButtonElement | null)?.click();
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
      const receipt = discovery.evidenceSiteId && getEvidenceReceipt(discovery.evidenceSiteId);
      if (receipt) {
        evidence.append(createEvidenceReceiptElement(receipt));
        const mapLink = document.createElement('a');
        mapLink.href = `/map?site=${encodeURIComponent(receipt.siteId)}`;
        mapLink.className = 'source-link';
        mapLink.textContent = 'View on map →';
        evidence.append(mapLink);
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
    const back = document.getElementById('journey-back') as HTMLButtonElement | null;
    if (back) {
      back.hidden = this.trail.length < 2;
      if (!back.hidden) back.textContent = `Back to ${sync.figures.find(f => f.id === this.trail.at(-2))?.name || 'previous'}`;
    }
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

  private executeGlobalSearch(query: string, openResult = false): void {
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
    const subject = findStudySubject(trimmed);
    const count = results.figures.length + results.empires.length + results.verses.length + results.names.length + Number(Boolean(subject));
    this.setSearchStatus(count ? `Showing ${count} results for “${trimmed}”. Select a result to explore.` : `No results for “${trimmed}”. Try a name, phrase, or reference such as John 3:16.`);
    dropdown.innerHTML = '';

    if (
      !subject && results.figures.length === 0 &&
      results.empires.length === 0 &&
      results.verses.length === 0 &&
      results.names.length === 0
    ) {
      dropdown.innerHTML = '<div class="search-result-item">No matching figures, empires, or KJV verses found.</div>';
      dropdown.classList.add('active');
      return;
    }

    if (subject) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'search-result-item';
      button.textContent = `${subject.name} — Numbers 22:21–35 · KJV “ass”`;
      button.addEventListener('click', () => this.selectPassageStudy(subject.name, subject.refs, subject.note, { subject: subject.id }));
      dropdown.append(button);
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
        if ([fig.name, fig.hitchcockKey].some(name => name.toLowerCase() === trimmed.toLowerCase())) btn.dataset.exactMatch = 'true';
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
        this.selectEmpire(empire.id);
        dropdown.classList.remove('active');
      });
      dropdown.appendChild(button);
    }

    for (const name of results.names) {
      const button = document.createElement('button');
      button.className = 'search-result-item';
      button.type = 'button';
      button.textContent = `${name.name} — ${name.meanings.join('; ')}`;
      if (name.name.toLowerCase() === trimmed.toLowerCase()) button.dataset.exactMatch = 'true';
      button.addEventListener('click', () => {
        if (name.flagshipId) this.selectFigureById(name.flagshipId);
        else {
          this.openNameSearchResult(name, openResult);
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
        if (localStore.getVerseByOsis(trimmed) === v) btn.dataset.exactMatch = 'true';
        btn.innerHTML = `<strong style="color: var(--gold-bright);">${disp}</strong> <span>${localStore.formatCanonicalKjvHtml(v.text)}</span>`;
        btn.addEventListener('click', () => {
          this.selectVerse(localStore.toOsisRef(v));
          dropdown.classList.remove('active');
        });
        dropdown.appendChild(btn);
      }
    }

    dropdown.classList.add('active');
    // Submission opens the same ranked result as selecting its suggestion.
    // Input events only populate suggestions; no-result searches stay visible.
    if (openResult) (dropdown.querySelector<HTMLButtonElement>('[data-exact-match]') || dropdown.querySelector<HTMLButtonElement>('button'))?.click();
  }

  private bindEvents(): void {
    document.querySelector('.primary-link')?.addEventListener('click', e => {
      e.preventDefault();
      this.selectFigureById('jesus-christ');
    });
    document.querySelectorAll<HTMLButtonElement>('[data-start]').forEach(button => {
      button.addEventListener('click', () => {
        if (button.dataset.start) this.selectFigureById(button.dataset.start);
      });
    });
    document.getElementById('journey-back')?.addEventListener('click', () => this.returnToTrail(this.trail.length - 2));
    const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
    const dropdown = document.getElementById('search-results-list');

    document.getElementById('name-search-close')?.addEventListener('click', () => {
      const detail = document.getElementById('name-search-detail');
      if (detail) detail.hidden = true;
      searchInput?.focus({ preventScroll: true });
      this.setSearchStatus('Study details closed. Your selected subject remains in the wider study below.');
    });

    document.getElementById('collection-search-form')?.addEventListener('submit', event => {
      event.preventDefault();
      if (searchInput) this.executeGlobalSearch(searchInput.value, true);
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
    const study = readUrlState();
    const mapTarget = getStudyMapTarget(study);
    const canGraph = Boolean(this.activeGraphTarget || this.activeFigure);
    if (view === 'map' && !mapTarget || view === 'graph' && !canGraph) view = 'list';
    this.activeView = view;
    const listBtn = document.getElementById('btn-view-list') as HTMLButtonElement | null;
    const graphBtn = document.getElementById('btn-view-graph') as HTMLButtonElement | null;
    const mapBtn = document.getElementById('btn-view-map') as HTMLButtonElement | null;
    const graphContainer = document.getElementById('ego-graph-container');
    const mapContainer = document.getElementById('ancient-map-container');
    if (mapBtn) { mapBtn.disabled = !mapTarget; mapBtn.title = mapBtn.disabled ? 'No reviewed geographic location for this study.' : ''; }
    if (graphBtn) graphBtn.disabled = !canGraph;
    const listContainer = document.getElementById('personal-network-list');
    if (listContainer) listContainer.hidden = view !== 'list';

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
        if (mapTarget?.kind === 'geography') {
          this.ancientMap.highlightGeographicPlace(mapTarget.entity);
        } else if (mapTarget?.kind === 'figure') {
          this.ancientMap.focusOnFigure(mapTarget.figureId);
        } else if (this.activeFigure && !study.name) {
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
    this.activeGraphTarget = target;
    this.switchConnectionView('graph');
    this.renderEgoGraph(target);
    const container = document.getElementById('ego-graph-container');
    container?.scrollIntoView({ behavior: 'instant', block: 'center' });
  }

  private renderEgoGraph(target: HistoricalFigure | string): void {
    this.activeGraphTarget = target;
    const container = document.getElementById('ego-graph-container');
    if (!container) return;

    const state = readUrlState();
    const settings: Partial<EgoGraphSettings> = {
      maxHops: state.hops, maxNodes: state.maxNodes, minSharedVerses: state.minShared,
      kinds: state.kinds ? state.kinds.split(',') as EgoGraphSettings['kinds'] : undefined,
      showLabels: state.labels !== 'off',
    };
    if (!this.egoGraph) {
      this.egoGraph = new EgoGraphCanvas(container, {
        onSelectNode: (node) => this.handleEgoNodeClick(node),
        settings,
        onSettingsChange: next => writeUrlState({ hops: next.maxHops, maxNodes: next.maxNodes,
          minShared: next.minSharedVerses, kinds: next.kinds.length ? next.kinds.join(',') : 'none',
          labels: next.showLabels ? null : 'off' }),
      });
    } else this.egoGraph.setSettings(settings);

    const data = this.buildEgoGraphData(target);
    this.egoGraph.render(data);
  }

  private handleEgoNodeClick(node: EgoNode): void {
    const sync = localStore.getSynchrony();
    const fig = sync.figures.find(f => f.id === node.id);
    writeUrlState({ compare: null, identity: null, studyPage: 1 });
    if (fig) {
      this.explorer?.showName(fig.hitchcockKey, false);
      this.selectFigureById(fig.id);
      this.renderEgoGraph(fig);
      writeUrlState({ figure: fig.id, view: 'graph' });
      return;
    }

    const networkName = localStore.getNetworkName(node.title);
    if (networkName) {
      this.explorer?.showName(networkName.name, false);
      this.renderEgoGraph(networkName.name);
      writeUrlState({ figure: null, name: networkName.name, view: 'graph' });
    } else {
      // A sourced contemporary can be explored even without a Bible-name index entry.
      this.renderEgoGraph(node.title);
      writeUrlState({ figure: null, name: node.title, view: 'graph' });
    }
  }

  private buildEgoGraphData(target: HistoricalFigure | string): EgoGraphData {
    const figures = localStore.getSynchrony().figures;
    const figureById = new Map(figures.map(figure => [figure.id, figure]));
    const bySpelling = new Map<string, HistoricalFigure[]>();
    for (const figure of figures) {
      for (const spelling of new Set([figure.hitchcockKey, figure.name])) {
        if (!spelling) continue;
        const key = spelling.toLowerCase(), matches = bySpelling.get(key) ?? [];
        if (!matches.includes(figure)) matches.push(figure);
        bySpelling.set(key, matches);
      }
    }
    const figureFor = (name: string) => {
      const matches = bySpelling.get(name.toLowerCase());
      return matches?.length === 1 ? matches[0] : undefined;
    };
    const canonicalId = (name: string) => figureFor(name)?.id || localStore.getNetworkName(name)?.name || name;
    const spellingFor = (id: string) => figureById.get(id)?.hitchcockKey || id;
    const centerName = typeof target === 'string' ? target : target.hitchcockKey;
    const centerId = typeof target === 'string' ? canonicalId(target) : target.id;
    const centerTitle = typeof target === 'string' ? target : target.name;
    const state = readUrlState();
    const identityRefs = state.identity && typeof target === 'string'
      ? new Set(getIdentityRefs(centerName, state.identity, localStore.getNetworkName(centerName)?.refs ?? [])) : null;
    const nodes = new Map<string, EgoNode>();
    const edges = new Map<string, EgoEdge>();
    const addNode = (id: string, title: string, hop: 0 | 1 | 2, subtitle?: string, contemporary = false) => {
      const previous = nodes.get(id);
      if (previous) { previous.hop = Math.min(previous.hop, hop) as 0 | 1 | 2; return; }
      const figure = figureById.get(id);
      nodes.set(id, { id, title: figure?.name || title,
        subtitle: subtitle || (figure ? `${figure.title} (${figure.dateRangeLabel})` : localStore.getNetworkName(title)?.meaning),
        type: contemporary ? 'contemporary' : figure ? 'figure' : 'name', hop, degree: 0 });
    };
    const addEdge = (source: string, targetId: string, kind: NonNullable<EgoEdge['kind']>, evidence: string[], note?: string) => {
      if (source === targetId || !nodes.has(source) || !nodes.has(targetId)) return;
      const refs = kind === 'shared' && identityRefs && (source === centerId || targetId === centerId)
        ? evidence.filter(ref => identityRefs.has(ref)) : evidence;
      if (kind === 'shared' && !refs.length) return;
      const key = `${kind}:${[source, targetId].sort().join('::')}`;
      const previous = edges.get(key);
      const combined = [...new Set([...(previous?.evidence ?? []), ...refs])];
      edges.set(key, { source, target: targetId, kind, evidence: combined,
        weight: kind === 'shared' ? combined.length : 1,
        note: previous?.note && previous.note !== note ? `${previous.note}; ${note || ''}` : note });
    };
    const network = localStore.getNetwork();
    const adjacency = new Map<string, string[]>();
    for (const [a, b] of network.edges) {
      const first = network.names[a].name, second = network.names[b].name;
      adjacency.set(first, [...(adjacency.get(first) ?? []), second]);
      adjacency.set(second, [...(adjacency.get(second) ?? []), first]);
    }
    const contemporaryId = (name: string, empireId: string) => `sc:${empireId}:${name.toLowerCase()}`;
    addNode(centerId, centerTitle, 0);
    const queue = [centerId];
    const expand = (id: string, hop: 1 | 2, create: boolean) => {
      const figure = figureById.get(id);
      const name = localStore.getNetworkName(spellingFor(id));
      const neighbor = (targetId: string, title: string, subtitle?: string, contemporary = false) => {
        if (create && !nodes.has(targetId)) { addNode(targetId, title, hop, subtitle, contemporary); queue.push(targetId); }
      };
      if (name) for (const title of adjacency.get(name.name) ?? []) {
        const targetId = canonicalId(title);
        const refs = localStore.getSharedRefs(name.name, title);
        if (identityRefs && (id === centerId || targetId === centerId) && !refs.some(ref => identityRefs.has(ref))) continue;
        neighbor(targetId, title);
        addEdge(id, targetId, 'shared', refs, 'Indexed spellings occur in the same verse; co-occurrence alone does not establish identity or a personal relationship.');
      }
      if (figure && !(identityRefs && id === centerId)) {
        for (const relation of figure.personalNetwork) {
          const targetId = figureById.has(relation.targetId) ? relation.targetId : canonicalId(relation.name);
          if (identityRefs && targetId === centerId) continue;
          neighbor(targetId, relation.name, relation.relation);
          addEdge(id, targetId, 'relationship', relation.ref ? [relation.ref] : [], `Curated relationship: ${relation.relation}`);
        }
        for (const contemporary of figure.secularContemporaries) {
          const targetId = contemporaryId(contemporary.name, contemporary.empireId);
          neighbor(targetId, contemporary.name, `${contemporary.role} · ${contemporary.empireId}`, true);
          addEdge(id, targetId, 'contemporary', contemporary.sourceCitation ? [contemporary.sourceCitation] : [],
            `${contemporary.evidenceCategory}: ${contemporary.synchronyDetail}`);
        }
      }
    };
    for (let i = 0; i < queue.length; i++) {
      const node = nodes.get(queue[i])!;
      if (node.hop < 2) expand(node.id, (node.hop + 1) as 1 | 2, true);
    }
    const pinnedIds: string[] = [];
    if (state.compare) {
      const comparison = localStore.getNetworkName(state.compare);
      if (comparison) { const id = canonicalId(comparison.name); addNode(id, comparison.name, 1); pinnedIds.push(id); }
    }
    // Complete the induced neighborhood, including links between second-hop nodes.
    for (const node of nodes.values()) expand(node.id, 2, false);
    for (const edge of edges.values()) {
      nodes.get(edge.source)!.degree++;
      nodes.get(edge.target)!.degree++;
    }
    return { centerId, centerTitle, nodes: [...nodes.values()], edges: [...edges.values()], pinnedIds };
  }}

const app = new HistoricalInteractApp();
window.addEventListener('DOMContentLoaded', () => {
  void app.bootstrap();
});
