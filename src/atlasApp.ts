/**
 * src/atlasApp.ts
 * Dedicated Cartographic Atlas Controller for HistoricalBible.com/map
 */

import {
  AncientMapCanvas
} from './engine/ancientMap';
import {
  REGION_PRESETS,
  ARCHAEOLOGICAL_SITES,
  BIBLICAL_CITIES,
  BIBLICAL_ROUTES,
  CHRONOLOGICAL_ERAS,
  GRANULAR_TIMELINE_FILTERS,
  type ArchaeologicalSite,
  type BiblicalCity,
  type BiblicalRoute,
  type BiblicalRouteStop,
  type WorldEmpireRegion,
  type ChronologicalEra,
} from './data/ancientMapData';
import {
  readUserContext,
  writeUserContext,
  type HistoricalBibleUserContext
} from './store/userContextStore';

class HistoricalAtlasApp {
  private mapCanvas: AncientMapCanvas | null = null;
  private selectedSite: ArchaeologicalSite | null = null;
  private activeStepperRouteId: string | null = null;
  private activeStepperStopIndex = 0;
  private orientation = true;
  private showAllStops = false;
  private pendingSavedContext: HistoricalBibleUserContext | null = null;

  public init(): void {
    const container = document.getElementById('atlas-canvas-container');
    if (!container) return;
    this.mapCanvas = new AncientMapCanvas({
      container,
      compact: false,
      readingMode: true,
      initialEraId: 'apostolic_church',
      initialLayers: { archaeology: false, empires: false, routes: false },
      onSelectSite: site => this.showSiteDetail(site),
      onSelectCity: city => this.showCityDetail(city),
      onSelectEmpire: empire => this.showEmpireDetail(empire),
      onSelectRouteStop: (route, stop, index) => {
        this.activeStepperRouteId = route.id;
        this.activeStepperStopIndex = index ?? 0;
        this.updateSequence();
        this.showRouteDetail(route, stop, index);
      },
      onEraChange: era => this.syncEraUI(era),
      onGranularFilterChange: () => {
        const route = this.mapCanvas?.getVisibleRoutes()[0];
        if (route) this.chooseJourney(route.id);
      }
    });
    this.mapCanvas.activeRouteOverrideIds = [];
    const journeySelect = document.getElementById('atlas-journey') as HTMLSelectElement | null;
    const journeyField = document.getElementById('atlas-journey-field');
    if (journeySelect && journeyField) {
      journeySelect.innerHTML = '<option value="">Choose a biblical journey…</option>' +
        BIBLICAL_ROUTES.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
      journeyField.hidden = false;
    }
    this.bindControls();
    this.syncLayers();
    this.checkInitialUrlParams();
    this.initContextContinuity();
  }

  private initContextContinuity(): void {
    const saved = readUserContext();
    if (!saved) return;
    if (this.orientation) {
      this.pendingSavedContext = saved;
      this.renderContextBar(saved, true);
    } else {
      this.renderContextBar(saved, false);
    }
  }

  private renderContextBar(ctx: HistoricalBibleUserContext, showApplyButton: boolean): void {
    const bar = document.getElementById('atlas-context-bar');
    if (!bar) return;
    const badgeEl = document.getElementById('atlas-context-badge');
    const titleEl = document.getElementById('atlas-context-title');
    const subEl = document.getElementById('atlas-context-sub');
    const applyBtn = document.getElementById('atlas-context-apply') as HTMLButtonElement | null;
    const bibleLink = document.getElementById('atlas-context-bible') as HTMLAnchorElement | null;
    const interactLink = document.getElementById('atlas-context-interact') as HTMLAnchorElement | null;

    const sourceLabel =
      ctx.source === 'bible'
        ? 'ACTIVE READING CONTEXT · BIBLE READER'
        : ctx.source === 'interact'
          ? 'ACTIVE STUDY CONTEXT · INTERACT DESK'
          : 'ACTIVE ATLAS CONTEXT';

    if (badgeEl) badgeEl.textContent = sourceLabel;
    if (titleEl) titleEl.textContent = ctx.label;
    if (subEl) subEl.textContent = ctx.sublabel ? ` · ${ctx.sublabel}` : '';
    if (applyBtn) {
      applyBtn.hidden = !showApplyButton;
      applyBtn.textContent = `Focus Map on ${ctx.label}`;
    }
    if (bibleLink) {
      bibleLink.href = ctx.bibleHref;
      bibleLink.textContent = ctx.source === 'bible' ? `Return to ${ctx.label} in Bible →` : `Open in Bible Reader →`;
    }
    if (interactLink) {
      interactLink.href = ctx.interactHref;
      interactLink.textContent = `Explore in Interact →`;
    }
    bar.hidden = false;
  }

  private applySavedContext(ctx: HistoricalBibleUserContext): void {
    if (!this.mapCanvas) return;
    this.pendingSavedContext = null;
    if (ctx.siteId) {
      const site = ARCHAEOLOGICAL_SITES.find(s => s.id === ctx.siteId);
      if (site) {
        this.orientation = false;
        this.mapCanvas.layers.archaeology = true;
        this.mapCanvas.showAllSites = true;
        this.mapCanvas.render();
        this.syncLayers();
        this.showSiteDetail(site);
        this.mapCanvas.animateToCoords(site.coords, 7);
        return;
      }
    }
    if (ctx.eraId && CHRONOLOGICAL_ERAS.some(e => e.id === ctx.eraId)) {
      this.mapCanvas.setEra(ctx.eraId);
    }
    if (ctx.journeyId && BIBLICAL_ROUTES.some(r => r.id === ctx.journeyId)) {
      this.chooseJourney(ctx.journeyId);
      if (typeof ctx.stopIndex === 'number' && ctx.stopIndex > 0) {
        this.activeStepperStopIndex = ctx.stopIndex;
        this.updateSequence();
      }
    }
    this.syncLayers();
  }

  private bindControls(): void {
    document.getElementById('atlas-context-apply')?.addEventListener('click', () => {
      if (this.pendingSavedContext) {
        this.applySavedContext(this.pendingSavedContext);
      }
    });
    document.getElementById('atlas-era')?.addEventListener('change', event => {
      const id = (event.target as HTMLSelectElement).value;
      this.orientation = !id;
      this.hideDetailDrawer();
      if (id) this.mapCanvas?.setEra(id);
      else {
        this.activeStepperRouteId = null;
        if (this.mapCanvas) {
          this.mapCanvas.activeRouteOverrideIds = [];
          this.mapCanvas.layers.routes = false;
          this.mapCanvas.render();
        }
        const journeySelect = document.getElementById('atlas-journey') as HTMLSelectElement | null;
        if (journeySelect) {
          journeySelect.innerHTML = '<option value="">Choose a biblical journey…</option>' +
            BIBLICAL_ROUTES.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
        }
        this.updateSequence();
      }
      this.syncLayers();
    });
    document.getElementById('atlas-journey')?.addEventListener('change', event => {
      this.chooseJourney((event.target as HTMLSelectElement).value);
    });
    document.getElementById('atlas-sequence-slider')?.addEventListener('input', event => {
      this.activeStepperStopIndex = Number((event.target as HTMLInputElement).value);
      this.showAllStops = false;
      this.updateSequence();
    });
    for (const [id, delta] of [['stepper-prev-btn', -1], ['stepper-next-btn', 1]] as const) {
      document.getElementById(id)?.addEventListener('click', () => {
        this.activeStepperStopIndex += delta;
        this.showAllStops = false;
        this.updateSequence();
      });
    }
    document.getElementById('atlas-show-all')?.addEventListener('click', () => {
      this.showAllStops = !this.showAllStops;
      this.updateSequence();
    });
    document.querySelectorAll<HTMLButtonElement>('.atlas-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.mapCanvas) return;
        const key = btn.dataset.layer!;
        this.mapCanvas.layers[key] = !this.mapCanvas.layers[key];
        this.mapCanvas.render();
        this.syncLayers();
        this.updateSequence(false);
      });
    });
    document.querySelectorAll<HTMLButtonElement>('.atlas-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => this.mapCanvas?.jumpToPreset(btn.dataset.preset!));
    });
    document.getElementById('atlas-drawer-close')?.addEventListener('click', () => this.hideDetailDrawer());
    this.setupJourneySearch();
  }

  private selectJourneyAndStop(routeId: string, stopIndex = 0): void {
    const route = BIBLICAL_ROUTES.find(r => r.id === routeId);
    if (!route || !this.mapCanvas) return;

    const routeEra = CHRONOLOGICAL_ERAS.find(e => e.id !== 'all' && e.activeRouteIds.includes(route.id));
    const targetEraId = routeEra ? routeEra.id : 'all';
    const currentEraId = (document.getElementById('atlas-era') as HTMLSelectElement)?.value;

    if (currentEraId !== targetEraId) {
      this.mapCanvas.setEra(targetEraId);
    }

    this.chooseJourney(route.id);
    if (stopIndex >= 0 && stopIndex < route.stops.length) {
      this.activeStepperStopIndex = stopIndex;
      this.updateSequence();
    }
  }

  private setupJourneySearch(): void {
    const searchInput = document.getElementById('atlas-journey-search') as HTMLInputElement | null;
    const clearBtn = document.getElementById('atlas-search-clear') as HTMLButtonElement | null;
    const resultsContainer = document.getElementById('atlas-search-results');
    if (!searchInput || !resultsContainer) return;

    const KEYWORD_MAP: Record<string, string> = {
      'balaam-journey': 'donkey balak speaking donkey ass curse blessing angel sword vineyards moab pisgah peor star of jacob numbers balac',
      'jacob-padan-aram': 'rachel leah laban well haran padan-aram bethel ladder angels mahanaim peniel penuel wrestling thigh esau reconciliation succoth shechem ephrath bethlehem grave tomb genesis',
      'jonah-prophet': 'jonah nineveh joppa tarshish fish whale deep tempest sea monster vomit vomited dry land shore 550 miles trek walk walking overland hamath euphrates tiphsah sackcloth repent repentance gourd worm wind',
      'gideon-judges': 'gideon jerubbaal ophrah threshing winepress midian midianites fleece dew harod spring of harod well of harod 300 lap lapping moreh pitchers torches trumpets jordan fords beth-barah oreb zeeb succoth penuel karkor zebah zalmunna',
      'samson-judges': 'samson lion timnath lehi jawbone ass gaza gates delilah dagon philistines pillars',
      'ruth-boaz': 'ruth naomi boaz moab bethlehem barley threshingfloor kinsman redeemer obed david',
      'exodus-route': 'moses aaron pharaoh plagues passover red sea sinai law commandments tabernacle manna water rock rephidim amalek',
      'joshua-conquest': 'joshua nun jordan jericho rahab ai ebal gerizim gibeon sun stand still hazor shiloh',
      'david-exile-throne': 'david goliath bethlehem saul jonathan adullam en-gedi ziklag hebron zion jerusalem ark',
      'elijah-prophet': 'elijah ahab jezebel carmel prophets baal fire ravens brook cherith zarephath widow chariot of fire horeb',
      'elisha-ministry': 'elisha mantle jordan naaman leprosy axe head chariot hosts damascus shunammite'
    };

    const performSearch = () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        if (clearBtn) clearBtn.hidden = true;
        resultsContainer.hidden = true;
        resultsContainer.innerHTML = '';
        return;
      }

      if (clearBtn) clearBtn.hidden = false;
      const tokens = query.split(/\s+/).filter(Boolean);

      type MatchResult = {
        route: BiblicalRoute;
        score: number;
        matchedStopIndex: number;
        matchedSnippet: string;
        eraName: string;
      };

      const matches: MatchResult[] = [];

      for (const route of BIBLICAL_ROUTES) {
        let score = 0;
        let matchedStopIndex = 0;
        let matchedSnippet = '';

        const nameLower = route.name.toLowerCase();
        const shortLower = route.shortBanner.toLowerCase();
        const travelerLower = route.travelerName.toLowerCase();
        const summaryLower = route.summary.toLowerCase();
        const scriptureLower = route.scriptureRef.toLowerCase();
        const keywords = KEYWORD_MAP[route.id] || '';

        // Exact phrase matches
        if (nameLower.includes(query)) score += 60;
        if (shortLower.includes(query)) score += 50;
        if (travelerLower.includes(query)) score += 40;
        if (keywords.includes(query)) score += 45;
        if (summaryLower.includes(query)) score += 25;
        if (scriptureLower.includes(query)) score += 20;

        let hasNameMatch = false;
        // Check stops
        for (let i = 0; i < route.stops.length; i++) {
          const stop = route.stops[i];
          const sNameLower = stop.name.toLowerCase();
          const sNoteLower = stop.note.toLowerCase();
          const sRefLower = stop.scriptureRef.toLowerCase();

          if (sNameLower.includes(query)) {
            score += 35;
            if (!hasNameMatch) {
              matchedStopIndex = i;
              matchedSnippet = `Stop ${i + 1}: ${stop.name}`;
              hasNameMatch = true;
            }
          }
          if (sNoteLower.includes(query)) {
            score += 30;
            if (!matchedSnippet && !hasNameMatch) {
              matchedStopIndex = i;
              const idx = sNoteLower.indexOf(query);
              const start = Math.max(0, idx - 20);
              const end = Math.min(stop.note.length, idx + query.length + 40);
              matchedSnippet = `Stop ${i + 1} (${stop.name}): "…${stop.note.substring(start, end)}…"`;
            }
          }
          if (sRefLower.includes(query)) {
            score += 15;
          }
        }

        // Token matching
        let allTokensFound = true;
        for (const token of tokens) {
          const found = nameLower.includes(token) ||
            shortLower.includes(token) ||
            travelerLower.includes(token) ||
            summaryLower.includes(token) ||
            keywords.includes(token) ||
            route.stops.some(s => s.name.toLowerCase().includes(token) || s.note.toLowerCase().includes(token));
          if (found) {
            score += 15;
          } else {
            allTokensFound = false;
          }
        }

        if (allTokensFound && tokens.length > 1) {
          score += 30;
        }

        if (score > 0) {
          const era = CHRONOLOGICAL_ERAS.find(e => e.id !== 'all' && e.activeRouteIds.includes(route.id));
          matches.push({
            route,
            score,
            matchedStopIndex,
            matchedSnippet,
            eraName: era?.name || 'Biblical History'
          });
        }
      }

      matches.sort((a, b) => b.score - a.score);
      const topMatches = matches.slice(0, 8);

      if (topMatches.length === 0) {
        resultsContainer.innerHTML = `<div class="atlas-search-empty">No biblical journeys found for "${query}"</div>`;
      } else {
        resultsContainer.innerHTML = topMatches.map(m => `
          <button type="button" class="atlas-search-item" data-route-id="${m.route.id}" data-stop-index="${m.matchedStopIndex}">
            <div class="atlas-search-item-header">
              <span class="atlas-search-item-title">${m.route.name}</span>
              <span class="atlas-search-item-era">${m.eraName}</span>
            </div>
            <div class="atlas-search-item-sub">${m.route.travelerName} · ${m.route.stops.length} stops · ${m.route.scriptureRef}</div>
            ${m.matchedSnippet ? `<div class="atlas-search-item-match">${m.matchedSnippet}</div>` : ''}
          </button>
        `).join('');

        resultsContainer.querySelectorAll<HTMLButtonElement>('.atlas-search-item').forEach(btn => {
          btn.addEventListener('click', () => {
            const rId = btn.dataset.routeId!;
            const sIdx = Number(btn.dataset.stopIndex || '0');
            this.selectJourneyAndStop(rId, sIdx);
            resultsContainer.hidden = true;
          });
        });
      }

      resultsContainer.hidden = false;
    };

    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim()) performSearch();
    });

    clearBtn?.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.hidden = true;
      resultsContainer.hidden = true;
      resultsContainer.innerHTML = '';
      searchInput.focus();
    });

    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        resultsContainer.hidden = true;
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        const first = resultsContainer.querySelector<HTMLButtonElement>('.atlas-search-item');
        first?.focus();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const first = resultsContainer.querySelector<HTMLButtonElement>('.atlas-search-item');
        first?.click();
      }
    });

    resultsContainer.addEventListener('keydown', event => {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('atlas-search-item')) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        (target.nextElementSibling as HTMLElement | null)?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prev = target.previousElementSibling as HTMLElement | null;
        if (prev) prev.focus();
        else searchInput.focus();
      } else if (event.key === 'Escape') {
        resultsContainer.hidden = true;
        searchInput.focus();
      }
    });

    document.addEventListener('click', event => {
      if (!searchInput.contains(event.target as Node) && !resultsContainer.contains(event.target as Node)) {
        resultsContainer.hidden = true;
      }
    });
  }

  private syncLayers(): void {
    document.querySelectorAll<HTMLButtonElement>('.atlas-toggle-btn').forEach(btn => {
      const active = !!this.mapCanvas?.layers[btn.dataset.layer!];
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    const legend = document.getElementById('atlas-legend');
    if (legend) {
      legend.hidden = !this.mapCanvas?.layers.empires;
    }
  }

  private syncEraUI(era: ChronologicalEra): void {
    if (!this.mapCanvas) return;
    this.orientation = false;
    (document.getElementById('atlas-era') as HTMLSelectElement).value = era.id;
    const routes = BIBLICAL_ROUTES.filter(r => era.id === 'all' || era.activeRouteIds.includes(r.id));
    const select = document.getElementById('atlas-journey') as HTMLSelectElement;
    select.replaceChildren(...routes.map(route => new Option(route.name +
      (route.evidenceClass === 'EXTERNAL_HISTORICAL_ATTESTATION' ? ' · External tradition' : ''), route.id)));
    document.getElementById('atlas-journey-field')!.hidden = routes.length === 0;
    const introductory = routes.find(r => r.id === 'paul-first-journey' && era.id === 'apostolic_church')
      || routes.find(r => r.evidenceClass !== 'EXTERNAL_HISTORICAL_ATTESTATION');
    if (introductory) this.chooseJourney(introductory.id);
    else {
      this.activeStepperRouteId = null;
      this.mapCanvas.activeRouteOverrideIds = [];
      this.mapCanvas.render();
      this.hideDetailDrawer();
      this.updateSequence(false);
    }
  }

  private chooseJourney(id: string): void {
    const route = BIBLICAL_ROUTES.find(r => r.id === id);
    if (!route || !this.mapCanvas) return;
    this.orientation = false;
    this.activeStepperRouteId = route.id;
    this.activeStepperStopIndex = 0;
    this.showAllStops = false;
    this.mapCanvas.activeRouteOverrideIds = [route.id];
    this.mapCanvas.layers.routes = true;
    (document.getElementById('atlas-journey') as HTMLSelectElement).value = route.id;

    // Auto-sync period dropdown if current era does not contain this route
    const eraSelect = document.getElementById('atlas-era') as HTMLSelectElement | null;
    const currentEraId = eraSelect?.value;
    const currentEra = CHRONOLOGICAL_ERAS.find(e => e.id === currentEraId);
    const eraAlreadyContainsRoute = currentEra && currentEra.activeRouteIds.includes(route.id);
    if (!eraAlreadyContainsRoute && currentEraId !== 'all') {
      const routeEra = CHRONOLOGICAL_ERAS.find(e => e.id !== 'all' && e.activeRouteIds.includes(route.id));
      const targetEraId = routeEra ? routeEra.id : 'all';
      if (eraSelect) eraSelect.value = targetEraId;
      this.mapCanvas.activeEra = routeEra || CHRONOLOGICAL_ERAS.find(e => e.id === 'all')!;
      this.mapCanvas.updateYearHud();
    }

    this.syncLayers();
    this.updateSequence();
    this.mapCanvas.fitRoute(route.id);
  }

  private updateSequence(renderMap = true): void {
    const route = BIBLICAL_ROUTES.find(r => r.id === this.activeStepperRouteId);
    const section = document.getElementById('atlas-sequence')!;
    section.hidden = this.orientation || !route;
    if (!route || !this.mapCanvas) return;
    this.activeStepperStopIndex = Math.max(0, Math.min(route.stops.length - 1, this.activeStepperStopIndex));
    const index = this.activeStepperStopIndex;
    const stop = route.stops[index];
    const slider = document.getElementById('atlas-sequence-slider') as HTMLInputElement;
    slider.max = String(route.stops.length - 1);
    slider.value = String(index);
    slider.setAttribute('aria-valuetext', 'Selected place ' + (index + 1) + ' of ' + route.stops.length + ': ' + stop.name);
    document.getElementById('chrono-current-year')!.textContent = this.mapCanvas.activeEra.yearLabel + ' · Journey sequence';
    document.getElementById('chrono-headline')!.textContent = route.name;
    document.getElementById('atlas-stop-count')!.textContent = this.showAllStops ? 'All selected places' : (index + 1) + ' / ' + route.stops.length;
    (document.getElementById('stepper-prev-btn') as HTMLButtonElement).disabled = index === 0;
    (document.getElementById('stepper-next-btn') as HTMLButtonElement).disabled = index === route.stops.length - 1;
    const all = document.getElementById('atlas-show-all')!;
    all.textContent = this.showAllStops ? 'Return to selected stop' : 'Show all stops';
    all.setAttribute('aria-pressed', String(this.showAllStops));
    document.getElementById('atlas-sequence-status')!.textContent = !this.mapCanvas.layers.routes
      ? 'Journey marks are hidden. Turn on Biblical Journeys in What to show to see them.'
      : 'Narrative order · spacing is not elapsed time. See Sources & dating for what is established.';
    this.mapCanvas.focusedStopOnly = !this.showAllStops;
    this.mapCanvas.activeRouteStopSelection = { routeId: route.id, stopIndex: index };
    if (renderMap) {
      this.mapCanvas.renderRouteSelection();
      this.showRouteDetail(route, stop, index);
    }
  }

  private checkInitialUrlParams(): void {
    const params = new URLSearchParams(window.location.search);
    const era = CHRONOLOGICAL_ERAS.find(e => e.id === params.get('era'));
    const filterId = params.get('filter') || params.get('journey');
    const filter = GRANULAR_TIMELINE_FILTERS.find(f => f.id === filterId);
    const route = BIBLICAL_ROUTES.find(r => r.id === (filter?.routeIds[0] || filterId));
    if (era) this.mapCanvas?.setEra(era.id);
    else if (route) {
      const routeEra = CHRONOLOGICAL_ERAS.find(e => e.id !== 'all' && e.activeRouteIds.includes(route.id));
      if (routeEra) this.mapCanvas?.setEra(routeEra.id);
    }
    if (route) this.chooseJourney(route.id);
    const region = REGION_PRESETS.find(r => r.id === params.get('region'));
    if (region) this.mapCanvas?.jumpToPreset(region.id);
    const site = ARCHAEOLOGICAL_SITES.find(s => s.id === params.get('site'));
    if (site && this.mapCanvas) {
      this.mapCanvas.layers.archaeology = true;
      this.mapCanvas.showAllSites = true;
      this.mapCanvas.render();
      this.syncLayers();
      this.showSiteDetail(site);
      this.mapCanvas.animateToCoords(site.coords, 7);
    }
  }

  private showSiteDetail(site: ArchaeologicalSite): void {
    this.selectedSite = site;
    const drawer = document.getElementById('atlas-detail-drawer');
    if (!drawer) return;

    const titleEl = document.getElementById('drawer-title');
    const metaEl = document.getElementById('drawer-meta');
    const descEl = document.getElementById('drawer-desc');
    const sigEl = document.getElementById('drawer-significance');
    const scriptureLink = document.getElementById('drawer-scripture-link') as HTMLAnchorElement | null;
    const studyDeskLink = document.getElementById('drawer-desk-link') as HTMLAnchorElement | null;
    const museumLink = document.getElementById('drawer-museum-link') as HTMLAnchorElement | null;

    if (titleEl) titleEl.textContent = site.artifactName;
    if (metaEl) metaEl.textContent = `${site.name} (${site.ancientRegion}) · Discovered ${site.discoveryYear || 'Antiquity'} · Now in ${site.currentLocation}`;
    if (descEl) descEl.textContent = site.description;
    if (sigEl) sigEl.textContent = site.significance;

    if (scriptureLink) {
      scriptureLink.textContent = `Read Scripture (${site.scriptureRef}) →`;
      scriptureLink.href = `/bible?ref=${encodeURIComponent(site.scriptureOsis)}`;
    }

    if (studyDeskLink) {
      if (site.figureId) {
        studyDeskLink.hidden = false;
        studyDeskLink.href = `/interact?figure=${site.figureId}`;
      } else {
        studyDeskLink.hidden = true;
      }
    }

    if (museumLink) {
      if (site.externalUrl) {
        museumLink.hidden = false;
        museumLink.href = site.externalUrl;
      } else {
        museumLink.hidden = true;
      }
    }

    drawer.hidden = false;
    const nextCtx: HistoricalBibleUserContext = {
      source: 'map',
      updatedAt: new Date().toISOString(),
      label: site.artifactName,
      sublabel: `${site.name} · ${site.scriptureRef}`,
      eraId: this.mapCanvas?.activeEra.id,
      siteId: site.id,
      figureId: site.figureId,
      bibleHref: `/bible?ref=${encodeURIComponent(site.scriptureOsis)}`,
      interactHref: site.figureId ? `/interact?figure=${encodeURIComponent(site.figureId)}` : `/interact?ref=${encodeURIComponent(site.scriptureOsis)}`,
      mapHref: `/map?site=${encodeURIComponent(site.id)}`
    };
    writeUserContext(nextCtx);
    this.renderContextBar(nextCtx, false);
  }

  private showCityDetail(city: BiblicalCity): void {
    const drawer = document.getElementById('atlas-detail-drawer');
    if (!drawer) return;

    const titleEl = document.getElementById('drawer-title');
    const metaEl = document.getElementById('drawer-meta');
    const descEl = document.getElementById('drawer-desc');
    const sigEl = document.getElementById('drawer-significance');
    const scriptureLink = document.getElementById('drawer-scripture-link') as HTMLAnchorElement | null;
    const studyDeskLink = document.getElementById('drawer-desk-link') as HTMLAnchorElement | null;
    const museumLink = document.getElementById('drawer-museum-link') as HTMLAnchorElement | null;

    if (titleEl) titleEl.textContent = city.name;
    if (metaEl) metaEl.textContent = `${city.ancientName ? `${city.ancientName} · ` : ''}${city.region}`;
    if (descEl) descEl.innerHTML = `Biblical Meaning: <em>&ldquo;${city.hitchcockMeaning}&rdquo;</em> (Hitchcock / Historical Bible index)`;
    if (sigEl) sigEl.textContent = `Scripture Anchor: ${city.scriptureAnchor}`;

    const primaryRef = city.scriptureAnchor.split(',')[0].trim();
    if (scriptureLink) {
      scriptureLink.textContent = `Open in Bible Reader (${city.scriptureAnchor}) →`;
      scriptureLink.href = `/bible?ref=${encodeURIComponent(primaryRef)}`;
    }

    if (studyDeskLink) {
      if (city.figureIds && city.figureIds.length > 0) {
        studyDeskLink.hidden = false;
        studyDeskLink.href = `/interact?figure=${city.figureIds[0]}`;
        studyDeskLink.textContent = `Explore in Interact →`;
      } else {
        studyDeskLink.hidden = true;
      }
    }

    if (museumLink) {
      museumLink.hidden = true;
    }

    drawer.hidden = false;
    const nextCtx: HistoricalBibleUserContext = {
      source: 'map',
      updatedAt: new Date().toISOString(),
      label: city.name,
      sublabel: `${city.region} · ${city.scriptureAnchor}`,
      eraId: this.mapCanvas?.activeEra.id,
      cityKey: city.name.toLowerCase(),
      figureId: city.figureIds?.[0],
      bibleHref: `/bible?ref=${encodeURIComponent(primaryRef)}`,
      interactHref: city.figureIds?.[0] ? `/interact?figure=${encodeURIComponent(city.figureIds[0])}` : `/interact?name=${encodeURIComponent(city.name)}`,
      mapHref: `/map`
    };
    writeUserContext(nextCtx);
    this.renderContextBar(nextCtx, false);
  }

  private showEmpireDetail(empire: WorldEmpireRegion): void {
    const drawer = document.getElementById('atlas-detail-drawer');
    if (!drawer) return;

    const titleEl = document.getElementById('drawer-title');
    const metaEl = document.getElementById('drawer-meta');
    const descEl = document.getElementById('drawer-desc');
    const sigEl = document.getElementById('drawer-significance');
    const scriptureLink = document.getElementById('drawer-scripture-link') as HTMLAnchorElement | null;
    const studyDeskLink = document.getElementById('drawer-desk-link') as HTMLAnchorElement | null;
    const museumLink = document.getElementById('drawer-museum-link') as HTMLAnchorElement | null;

    if (titleEl) titleEl.textContent = empire.name;
    if (metaEl) metaEl.textContent = `Capital: ${empire.capital.name} · Estimated Population: ${empire.populationEstimate} · Extent: ${empire.approximateArea} · ${empire.dateRange}`;
    if (descEl) descEl.textContent = empire.biblicalIntersection || 'Major world civilization contemporary with biblical history.';
    if (sigEl) sigEl.textContent = `Faction: ${empire.factionCategory ? empire.factionCategory.toUpperCase() : 'REGIONAL POWER'} · Direct synchrony with Scripture and ancient near eastern annals.`;

    if (scriptureLink) {
      scriptureLink.textContent = `Open in Bible Reader →`;
      scriptureLink.href = `/bible?tab=map`;
    }

    if (studyDeskLink) {
      studyDeskLink.hidden = true;
    }

    if (museumLink) {
      museumLink.hidden = true;
    }

    drawer.hidden = false;
  }

  private showRouteDetail(route: BiblicalRoute, stop?: BiblicalRouteStop, stopIndex?: number): void {
    const drawer = document.getElementById('atlas-detail-drawer');
    if (!drawer) return;

    const targetStop = stop || route.stops[0];
    const idx = typeof stopIndex === 'number' ? stopIndex : 0;

    const titleEl = document.getElementById('drawer-title');
    const metaEl = document.getElementById('drawer-meta');
    const descEl = document.getElementById('drawer-desc');
    const sigEl = document.getElementById('drawer-significance');
    const scriptureLink = document.getElementById('drawer-scripture-link') as HTMLAnchorElement | null;
    const studyDeskLink = document.getElementById('drawer-desk-link') as HTMLAnchorElement | null;
    const museumLink = document.getElementById('drawer-museum-link') as HTMLAnchorElement | null;

    if (titleEl) {
      titleEl.textContent = targetStop.name;
    }
    if (metaEl) {
      metaEl.textContent = 'Selected place ' + (idx + 1) + ' · ' + targetStop.scriptureRef +
        ((targetStop.evidenceClass || route.evidenceClass) === 'EXTERNAL_HISTORICAL_ATTESTATION' ? ' · External historical tradition' : ' · Study annotation');
    }
    if (descEl) {
      descEl.textContent = targetStop.note;
    }
    if (sigEl) {
      sigEl.textContent = route.id === 'paul-first-journey'
        ? 'Narrative sequence checked against Acts 13–14 in this project’s KJV text. These are selected places, not every stop. Map coordinates are approximate inherited locations, not surveyed ancient boundaries. Exact dates and paths are not established here.'
        : 'Existing study annotation linked to ' + targetStop.scriptureRef + '. Dates (' + targetStop.dateLabel + ') and geographic placement are reconstructions, not Scripture quotations. ' + (targetStop.attestationSource || route.attestationSource || 'Independent historical sourcing remains to be reviewed.');
    }

    const osisTarget = targetStop.scriptureOsis || route.scriptureOsis;
    if (scriptureLink) {
      scriptureLink.textContent = `Read Scripture (${targetStop.scriptureRef}) →`;
      scriptureLink.href = `/bible?ref=${encodeURIComponent(osisTarget)}`;
    }

    if (studyDeskLink) {
      studyDeskLink.hidden = false;
      studyDeskLink.href = `/interact?figure=${route.figureId}`;
      const figureLabelMap: Record<string, string> = {
        'jesus-christ': 'Jesus Christ',
        'paul': 'Paul',
        'peter': 'Peter & the Apostles',
        'moses': 'Moses & Joshua',
        'abraham': 'Abraham, Jacob & Joseph',
        'david': 'David',
        'hezekiah': 'Elijah, Elisha & Hezekiah',
        'daniel': 'Daniel',
        'ezra-nehemiah': 'Ezra & Nehemiah'
      };
      const figureLabel = figureLabelMap[route.figureId] || route.figureId;
      studyDeskLink.textContent = `Explore ${figureLabel} in Interact →`;
    }

    if (museumLink) {
      museumLink.hidden = true;
    }

    drawer.hidden = false;
    const nextCtx: HistoricalBibleUserContext = {
      source: 'map',
      updatedAt: new Date().toISOString(),
      label: `${route.name} · ${targetStop.name}`,
      sublabel: targetStop.scriptureRef,
      eraId: this.mapCanvas?.activeEra.id,
      journeyId: route.id,
      stopIndex: idx,
      figureId: route.figureId,
      bibleHref: `/bible?ref=${encodeURIComponent(osisTarget)}`,
      interactHref: `/interact?figure=${encodeURIComponent(route.figureId)}`,
      mapHref: `/map?era=${encodeURIComponent(this.mapCanvas?.activeEra.id || 'apostolic_church')}&journey=${encodeURIComponent(route.id)}`
    };
    writeUserContext(nextCtx);
    this.renderContextBar(nextCtx, false);
  }

  private hideDetailDrawer(): void {
    const drawer = document.getElementById('atlas-detail-drawer');
    if (drawer) drawer.hidden = true;
    this.selectedSite = null;
  }

  public getCanvas(): AncientMapCanvas | null {
    return this.mapCanvas;
  }

  public getActiveEra(): ChronologicalEra | null {
    return this.mapCanvas ? this.mapCanvas.activeEra : null;
  }
}

// Bootstrap on DOM ready
if (typeof document !== 'undefined') {
  const app = new HistoricalAtlasApp();
  (window as any).ancientAtlasApp = app;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
  } else {
    app.init();
  }
}
