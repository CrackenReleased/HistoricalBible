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
  getJourneyStopForPassage,
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
import { localStore } from './store/localFirstStore';
import { ATLAS_STORIES, ATLAS_STORY_PERIODS, type AtlasStory } from './data/atlasStories';
import { getDatedEvent, type DatedEvent } from './data/datedEvents.ts';
import { getRelationshipForPassage, type HistoricalRelationship } from './data/historicalRelationships.ts';
import { getWorldHorizonItem, isWorldItemInDateInterval, HISTORICAL_WORLD_ITEMS, type WorldHorizonItem } from './data/historicalWorldItems.ts';
import { createEvidenceReceiptElement, getArtifactDisplay, getEvidenceReceipt } from './data/evidenceReceipts';
import { trackMapLayerToggle, trackMapPreset, trackMapDossierView } from './analytics';

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
    this.populateJourneyMenu('all', true);
    const periodSelect = document.getElementById('atlas-era') as HTMLSelectElement;
    for (const period of ATLAS_STORY_PERIODS) {
      const option = new Option(period.name, period.id);
      const before = period.id === 'primeval' ? 1 : period.id === 'last_kings'
        ? [...periodSelect.options].findIndex(item => item.value === 'babylonian_exile') : periodSelect.options.length - 1;
      periodSelect.add(option, before);
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
    const storyId = new URL(ctx.mapHref, window.location.origin).searchParams.get('story');
    const story = ATLAS_STORIES.find(item => item.id === storyId);
    if (story) { this.chooseStory(story); return; }
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
      if (ATLAS_STORY_PERIODS.some(period => period.id === id)) {
        this.populateJourneyMenu(id);
        const story = ATLAS_STORIES.find(item => item.eraId === id);
        if (story) this.chooseStory(story);
        return;
      }
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
        this.populateJourneyMenu('all', true);
        this.updateSequence();
      }
      this.syncLayers();
    });
    document.getElementById('atlas-journey')?.addEventListener('change', event => {
      const id = (event.target as HTMLSelectElement).value;
      const story = ATLAS_STORIES.find(item => `story:${item.id}` === id);
      if (story) this.chooseStory(story);
      else this.chooseJourney(id);
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
        trackMapLayerToggle(key, this.mapCanvas.layers[key]);
        this.mapCanvas.render();
        this.syncLayers();
        this.updateSequence(false);
      });
    });
    document.querySelectorAll<HTMLButtonElement>('.atlas-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset!;
        this.mapCanvas?.jumpToPreset(preset);
        trackMapPreset(preset);
      });
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
      'jonah-prophet': 'jonah nineveh joppa tarshish fish whale deep tempest vomit vomited dry land sackcloth repent repentance gourd worm wind',
      'gideon-judges': 'gideon jerubbaal ophrah threshing winepress midian midianites fleece dew harod spring of harod well of harod 300 lap lapping moreh pitchers torches trumpets jordan fords beth-barah oreb zeeb succoth penuel karkor zebah zalmunna',
      'samson-judges': 'samson lion timnath lehi jawbone ass gaza gates delilah dagon philistines pillars',
      'ruth-boaz': 'ruth naomi boaz moab bethlehem barley threshingfloor kinsman redeemer obed david',
      'exodus-route': 'moses aaron pharaoh plagues passover red sea sinai law commandments tabernacle manna water rock rephidim amalek',
      'joshua-conquest': 'joshua nun jordan jericho rahab ai ebal gerizim gibeon sun stand still hazor shiloh',
      'david-exile-throne': 'david goliath bethlehem saul jonathan adullam en-gedi ziklag hebron zion jerusalem ark',
      'elijah-prophet': 'elijah ahab jezebel carmel prophets baal fire ravens brook cherith zarephath widow chariot of fire horeb',
      'elisha-ministry': 'elisha mantle jordan naaman leprosy axe head chariot hosts damascus shunammite'
    };

    let searchRevision = 0;
    let shownAnnotations = 8;
    let scriptureOffset = 0;
    const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const performSearch = async () => {
      const revision = ++searchRevision;
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        if (clearBtn) clearBtn.hidden = true;
        resultsContainer.hidden = true;
        resultsContainer.innerHTML = '';
        return;
      }

      if (clearBtn) clearBtn.hidden = false;
      const tokens = query.replace(/[’']s\b/g, '').match(/[\p{L}\p{N}]+/gu) || [];
      const referenceQuery = !!localStore.normalizeToOsis(query) || /^[1-3]?\s*[a-z][a-z\s.]*\s+\d+(?:[:.]\d+(?:[-–]\d+)?)?$/i.test(query);

      type MatchResult = {
        route: BiblicalRoute;
        score: number;
        matchedStopIndex: number;
        matchedSnippet: string;
        eraName: string;
      };

      const matches: MatchResult[] = [];

      for (const route of BIBLICAL_ROUTES) {
        if (referenceQuery) continue;
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
            scriptureLower.includes(token) ||
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

        if (score > 0 && allTokensFound) {
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
      const topMatches = matches.slice(0, shownAnnotations);
      const stories = ATLAS_STORIES.filter(story => {
        const text = `${story.title} ${story.keywords} ${story.note} ${story.ref}`.toLowerCase();
        return !referenceQuery && tokens.length > 0 && tokens.every(token => text.includes(token));
      });
      const places = BIBLICAL_CITIES.filter(city => !referenceQuery && tokens.length > 0 && tokens.every(token => `${city.name} ${city.ancientName || ''} ${city.region}`.toLowerCase().includes(token)));
      const discoveries = ARCHAEOLOGICAL_SITES.filter(site => !referenceQuery && tokens.length > 0 && tokens.every(token => `${site.name} ${site.artifactName} ${site.description}`.toLowerCase().includes(token)));

      if (topMatches.length === 0) {
        resultsContainer.innerHTML = '';
      } else {
        resultsContainer.innerHTML = topMatches.map(m => `
          <button type="button" class="atlas-search-item" data-route-id="${m.route.id}" data-stop-index="${m.matchedStopIndex}">
            <div class="atlas-search-item-header">
              <span class="atlas-search-item-title">${escape(m.route.name)}</span>
              <span class="atlas-search-item-era">${escape(m.eraName)}</span>
            </div>
            <div class="atlas-search-item-sub">${escape(m.route.travelerName)} · ${m.route.stops.length} stops · ${escape(m.route.scriptureRef)}</div>
            ${m.matchedSnippet ? `<div class="atlas-search-item-match">${escape(m.matchedSnippet)}</div>` : ''}
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
      for (const story of stories.slice(0, shownAnnotations)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'atlas-search-item';
        button.textContent = `${story.title} · Scripture story · ${story.ref}`;
        button.addEventListener('click', () => {
          this.chooseStory(story);
          ++searchRevision;
          resultsContainer.hidden = true;
        });
        resultsContainer.append(button);
      }
      if (matches.length > shownAnnotations || stories.length > shownAnnotations) {
        const more = document.createElement('button');
        more.type = 'button';
        more.className = 'atlas-search-item';
        more.textContent = `More stories & journeys (${matches.length + stories.length} matches)`;
        more.onclick = () => { shownAnnotations += 8; void performSearch(); };
        resultsContainer.append(more);
      }
      for (const place of places) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'atlas-search-item';
        button.textContent = `${place.name} · Map place · ${place.region}`;
        button.onclick = () => { this.showCityDetail(place); this.mapCanvas?.animateToCoords(place.coords, 7); resultsContainer.hidden = true; ++searchRevision; };
        resultsContainer.append(button);
      }
      for (const site of discoveries) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'atlas-search-item';
        button.textContent = `${site.name} · Archaeological annotation`;
        button.onclick = () => { this.showSiteDetail(site); this.mapCanvas?.animateToCoords(site.coords, 7); resultsContainer.hidden = true; ++searchRevision; };
        resultsContainer.append(button);
      }
      const scripture = document.createElement('section');
      scripture.setAttribute('aria-label', 'KJV Scripture matches');
      scripture.innerHTML = '<p class="atlas-search-empty" role="status">Searching the KJV text…</p>';
      resultsContainer.append(scripture);
      resultsContainer.hidden = false;
      try {
        await localStore.initCritical();
        if (revision !== searchRevision) return;
        const result = localStore.searchScripture(query, scriptureOffset, 12);
        scripture.replaceChildren();
        const status = document.createElement('p');
        status.className = 'atlas-search-empty';
        status.setAttribute('role', 'status');
        status.textContent = result.total
          ? `KJV text · ${scriptureOffset + 1}–${Math.min(scriptureOffset + 12, result.total)} of ${result.total} verses. Text matches may refer to different people with the same name; they do not establish a map location.`
          : matches.length || stories.length || places.length || discoveries.length ? 'No exact KJV text matches. Story titles and map annotations are editorial study aids.' : 'No matching story or KJV text. Try a KJV spelling, fewer words, or a reference such as John 3:16. This does not mean the subject is absent from Scripture.';
        scripture.append(status);
        for (const verse of result.verses) {
          const link = document.createElement('a');
          link.className = 'atlas-search-item';
          link.href = `/bible?ref=${encodeURIComponent(localStore.toOsisRef(verse))}`;
          const ref = document.createElement('strong');
          ref.textContent = localStore.formatDisplayRef(verse);
          const quote = document.createElement('span');
          quote.innerHTML = localStore.formatCanonicalKjvHtml(verse.text);
          link.append(ref, quote);
          scripture.append(link);
        }
        for (const [label, delta] of [['Previous Scripture results', -12], ['More Scripture results', 12]] as const) {
          if (delta < 0 ? scriptureOffset === 0 : scriptureOffset + 12 >= result.total) continue;
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'atlas-search-item';
          button.textContent = label;
          button.onclick = async () => {
            scriptureOffset += delta;
            await performSearch();
            resultsContainer.querySelector<HTMLElement>('[aria-label="KJV Scripture matches"] .atlas-search-item')?.focus();
          };
          scripture.append(button);
        }
      } catch {
        if (revision !== searchRevision) return;
        scripture.innerHTML = '<p class="atlas-search-empty" role="status">KJV search could not load. Curated stories remain available.</p>';
        const retry = document.createElement('button');
        retry.className = 'atlas-search-item';
        retry.textContent = 'Retry Scripture search';
        retry.onclick = () => { void performSearch(); };
        scripture.append(retry);
      }
    };

    searchInput.addEventListener('input', () => {
      shownAnnotations = 8;
      scriptureOffset = 0;
      void performSearch();
    });
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim()) performSearch();
    });

    clearBtn?.addEventListener('click', () => {
      ++searchRevision;
      searchInput.value = '';
      clearBtn.hidden = true;
      resultsContainer.hidden = true;
      resultsContainer.innerHTML = '';
      searchInput.focus();
    });

    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        ++searchRevision;
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
      const target = (event.target as HTMLElement).closest<HTMLElement>('.atlas-search-item');
      if (!target) return;
      const items = [...resultsContainer.querySelectorAll<HTMLElement>('.atlas-search-item')];
      const index = items.indexOf(target);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        items[index + 1]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prev = items[index - 1];
        if (prev) prev.focus();
        else searchInput.focus();
      } else if (event.key === 'Escape') {
        ++searchRevision;
        resultsContainer.hidden = true;
        searchInput.focus();
      }
    });

    document.addEventListener('click', event => {
      // Search actions replace their own button before this bubbling click arrives.
      // The event path retains the original container even after the target is detached.
      if (!event.composedPath().includes(searchInput) && !event.composedPath().includes(resultsContainer)) {
        ++searchRevision;
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
    this.populateJourneyMenu(era.id);
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

  private populateJourneyMenu(eraId: string, prompt = false): void {
    const select = document.getElementById('atlas-journey') as HTMLSelectElement;
    const era = CHRONOLOGICAL_ERAS.find(item => item.id === eraId);
    const routes = BIBLICAL_ROUTES.filter(route => eraId === 'all' || era?.activeRouteIds.includes(route.id));
    const stories = ATLAS_STORIES.filter(story => eraId === 'all' || story.eraId === eraId);
    select.replaceChildren();
    if (prompt) select.add(new Option('Choose a biblical journey or story…', ''));
    for (const [label, options] of [
      ['Journeys', routes.map(route => new Option(route.name + (route.evidenceClass === 'EXTERNAL_HISTORICAL_ATTESTATION' ? ' · External tradition' : ''), route.id))],
      ['Scripture stories', stories.map(story => new Option(story.title, `story:${story.id}`))],
    ] as const) {
      if (!options.length) continue;
      const group = document.createElement('optgroup');
      group.label = label;
      group.append(...options);
      select.append(group);
    }
    document.getElementById('atlas-journey-field')!.hidden = routes.length + stories.length === 0;
  }

  private chooseStory(story: AtlasStory): void {
    if (!this.mapCanvas) return;
    const eraSelect = document.getElementById('atlas-era') as HTMLSelectElement;
    const eraId = eraSelect.value === 'all' ? 'all' : story.eraId;
    this.orientation = false;
    const era = CHRONOLOGICAL_ERAS.find(item => item.id === eraId);
    if (era) this.mapCanvas.setEra(eraId);
    eraSelect.value = eraId;
    this.populateJourneyMenu(eraId);
    if (story.routeId) {
      this.selectJourneyAndStop(story.routeId, story.stopIndex || 0);
    } else {
      this.activeStepperRouteId = null;
      this.mapCanvas.activeRouteOverrideIds = [];
      this.mapCanvas.activeRouteStopSelection = null;
      this.mapCanvas.layers.routes = false;
      this.mapCanvas.layers.empires = false;
      this.mapCanvas.layers.archaeology = false;
      this.mapCanvas.render();
      this.updateSequence(false);
      this.syncLayers();
    }
    (document.getElementById('atlas-journey') as HTMLSelectElement).value = `story:${story.id}`;
    document.getElementById('drawer-title')!.textContent = story.title;
    document.getElementById('drawer-meta')!.textContent = `${story.ref} · Editorial Scripture guide${story.routeId ? '' : ' · Reading only; no map location assigned'}`;
    document.getElementById('drawer-desc')!.textContent = story.note;
    document.getElementById('drawer-significance')!.textContent = story.routeId
      ? 'Read the cited passage in context. The related journey uses approximate inherited geography; its coordinates and dates are not Scripture quotations.'
      : 'Scripture reading entry. No map location or travel route is assigned to this story. The background map is geographic context only. This does not imply the event did not occur or had no place; the atlas has not established coordinates. Period groupings are editorial, not exact dates.';
    const bible = document.getElementById('drawer-scripture-link') as HTMLAnchorElement;
    bible.href = `/bible?ref=${encodeURIComponent(story.ref)}`;
    bible.textContent = `Read Scripture (${story.ref}) →`;
    const desk = document.getElementById('drawer-desk-link') as HTMLAnchorElement;
    desk.hidden = false;
    desk.href = `/interact?ref=${encodeURIComponent(story.ref)}`;
    desk.textContent = 'Explore this passage in Interact →';
    document.getElementById('drawer-museum-link')!.hidden = true;
    document.getElementById('atlas-detail-drawer')!.hidden = false;
    const context: HistoricalBibleUserContext = {
      source: 'map', updatedAt: new Date().toISOString(), label: story.title,
      sublabel: story.ref, bibleHref: bible.getAttribute('href')!, interactHref: desk.getAttribute('href')!,
      mapHref: `/map?story=${encodeURIComponent(story.id)}`,
    };
    writeUserContext(context);
    this.renderContextBar(context, false);
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
    if (route) {
      this.chooseJourney(route.id);
      const stopParam = params.get('stop');
      if (stopParam !== null) {
        const stopIdx = parseInt(stopParam, 10);
        if (!isNaN(stopIdx) && stopIdx >= 0 && stopIdx < route.stops.length) {
          this.activeStepperStopIndex = stopIdx;
          this.updateSequence();
          this.mapCanvas?.animateToCoords(route.stops[stopIdx].coords, 7);
        }
      }
    }
    const story = ATLAS_STORIES.find(item => item.id === params.get('story'));
    if (story) this.chooseStory(story);
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

    // Passage context integration (HISTORICAL_WORLD_CONTEXT_BRIEF Work Package A, B & C)
    const refParam = params.get('ref');
    const entityParam = params.get('entity') || params.get('figure');
    if (refParam && this.mapCanvas) {
      const targetOsis = localStore.normalizeToOsis(refParam) || refParam;
      const parts = targetOsis.split('.');
      const bookOsis = parts[0] || 'Gen';
      const ch = parseInt(parts[1] || '1', 10);
      const v = parseInt(parts[2] || '1', 10);

      const datedEvent = getDatedEvent(bookOsis, ch, v);
      const relationship = getRelationshipForPassage(bookOsis, ch, v);
      const journeyMatch = getJourneyStopForPassage(bookOsis, ch, v);

      // Auto-resolve era if not explicitly provided in URL
      if (!era) {
        let passageEraId = 'all';
        const osisLower = bookOsis.toLowerCase();
        if (['gen', 'job'].includes(osisLower)) passageEraId = 'patriarchs';
        else if (['exod', 'lev', 'num', 'deut', 'josh'].includes(osisLower)) passageEraId = 'exodus';
        else if (['judg', 'ruth'].includes(osisLower)) passageEraId = 'judges';
        else if (['1sam', '2sam', '1chr'].includes(osisLower)) passageEraId = 'united_monarchy';
        else if (osisLower === '1kgs') {
          if (ch <= 11) passageEraId = 'united_monarchy';
          else passageEraId = 'divided_monarchy_prophets';
        } else if (osisLower === '2kgs') {
          if (ch <= 8) passageEraId = 'divided_monarchy_prophets';
          else if (ch <= 16) passageEraId = '2kings_jehu';
          else if (ch === 17) passageEraId = '2kings_fall_samaria';
          else if (ch <= 20) passageEraId = 'assyrian_siege';
          else passageEraId = 'babylonian_exile';
        } else if (['acts', 'rom', '1cor', '2cor', 'gal', 'eph', 'phil', 'col', '1thess', '2thess', '1tim', '2tim', 'titus', 'phlm', 'heb', 'jas', '1pet', '2pet', '1john', '2john', '3john', 'jude', 'rev'].includes(osisLower)) {
          passageEraId = 'apostolic_church';
        }
        if (CHRONOLOGICAL_ERAS.some(e => e.id === passageEraId)) {
          this.mapCanvas.setEra(passageEraId);
        }
      }

      const context: HistoricalBibleUserContext = {
        source: 'bible',
        updatedAt: new Date().toISOString(),
        label: v > 1 ? String(targetOsis) : (bookOsis + ' ' + ch),
        sublabel: datedEvent ? ('Biblical Setting · ' + datedEvent.dateLabel) : ('Biblical Setting · ' + this.mapCanvas.activeEra.name),
        eraId: this.mapCanvas.activeEra.id,
        siteId: (params.get('site') || datedEvent?.siteId || site?.id),
        figureId: entityParam || journeyMatch?.route.figureId,
        journeyId: params.get('journey') || journeyMatch?.route.id,
        stopIndex: params.get('stop') !== null ? parseInt(params.get('stop')!, 10) : journeyMatch?.stopIndex,
        bibleHref: '/bible?ref=' + encodeURIComponent(refParam),
        interactHref: '/interact?ref=' + encodeURIComponent(refParam),
        mapHref: window.location.search ? ('/map' + window.location.search) : '/map'
      };
      writeUserContext(context);
      this.renderContextBar(context, false);

      if (journeyMatch && !params.get('site')) {
        const stopIdx = params.get('stop') !== null ? parseInt(params.get('stop')!, 10) : journeyMatch.stopIndex;
        this.chooseJourney(journeyMatch.route.id);
        if (!isNaN(stopIdx) && stopIdx >= 0 && stopIdx < journeyMatch.route.stops.length) {
          this.activeStepperStopIndex = stopIdx;
          this.updateSequence();
          this.mapCanvas.animateToCoords(journeyMatch.route.stops[stopIdx].coords, 7);
          this.showRouteDetail(journeyMatch.route, journeyMatch.route.stops[stopIdx], stopIdx);
        }
      } else if (datedEvent) {
        this.mapCanvas.layers.archaeology = true;
        this.mapCanvas.layers.empires = true;
        this.mapCanvas.showAllSites = true;
        this.mapCanvas.render();
        this.syncLayers();

        // Focus map on biblical campaign setting without forcing globe-wide zoom
        this.mapCanvas.animateToCoords({ lat: 33.5, lng: 38 }, 6);

        const targetSite = ARCHAEOLOGICAL_SITES.find(s => s.id === (params.get('site') || datedEvent.siteId));
        if (targetSite) {
          this.showSiteDetail(targetSite, datedEvent, relationship);
        }
      } else if (relationship) {
        this.mapCanvas.layers.empires = true;
        this.mapCanvas.render();
        this.syncLayers();
      }
    }
  }

  private showSiteDetail(site: ArchaeologicalSite, datedEvent?: DatedEvent, relationship?: HistoricalRelationship): void {
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
    const display = getArtifactDisplay(site);

    if (titleEl) titleEl.textContent = site.artifactName;
    if (metaEl) metaEl.textContent = `${site.name} (${site.ancientRegion}) · ${display.date}${getEvidenceReceipt(site.id) ? ` · Now in ${site.currentLocation}` : ''}`;
    if (descEl) descEl.textContent = display.description;
    if (sigEl) {
      const receipt = getEvidenceReceipt(site.id);
      sigEl.textContent = receipt ? '' : display.significance;
      const disclosure = sigEl.closest('details');
      const summary = disclosure?.querySelector('summary');
      if (summary) summary.textContent = receipt ? 'Reviewed evidence & limits' : 'Sources & dating · review pending';
      if (disclosure) disclosure.open = Boolean(receipt);
      if (receipt) {
        const receiptElement = createEvidenceReceiptElement(receipt);
        receiptElement.id = 'drawer-receipt';
        sigEl.append(receiptElement);
      }
    }

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
        museumLink.textContent = display.sourceLabel;
        museumLink.href = site.externalUrl;
      } else {
        museumLink.hidden = true;
      }
    }

    // Look up dated event and relationship if not passed
    if (!datedEvent && site.scriptureOsis) {
      const parts = site.scriptureOsis.split(".");
      if (parts.length >= 2) {
        datedEvent = getDatedEvent(parts[0], parseInt(parts[1], 10), parseInt(parts[2] || "1", 10));
      }
    }
    if (!relationship && site.scriptureOsis) {
      const parts = site.scriptureOsis.split(".");
      if (parts.length >= 2) {
        relationship = getRelationshipForPassage(parts[0], parseInt(parts[1], 10), parseInt(parts[2] || "1", 10));
      }
    }

    // Render time-specific relationship card
    let relEl = document.getElementById("drawer-relationship");
    if (!relEl) {
      relEl = document.createElement("div");
      relEl.id = "drawer-relationship";
      relEl.className = "atlas-drawer-context-section";
      sigEl?.closest("details")?.after(relEl);
    }
    if (relationship) {
      relEl.hidden = false;
      relEl.innerHTML = `
        <div class="drawer-relationship-box" style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.04); border-radius: 4px; border: 1px solid var(--border-subtle, rgba(255,255,255,0.1));">
          <span class="eyebrow" style="color: var(--gold-warm); font-size: 0.7rem;">RELATIONSHIP AT THIS TIME · ${relationship.periodLabel}</span>
          <h4 style="margin: 0.25rem 0; font-size: 0.95rem; color: #fff;">${relationship.actor1Name} ↔ ${relationship.actor2Name}</h4>
          <p style="font-size: 0.8rem; margin: 0.25rem 0;"><strong>Status:</strong> ${relationship.relationshipLabel}</p>
          <p style="font-size: 0.78rem; color: var(--text-muted);">${relationship.summary}</p>
          <div style="font-size: 0.76rem; margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px dashed rgba(255,255,255,0.1); color: var(--text-muted);">
            <div><strong>${relationship.actor1Name}:</strong> ${relationship.perspectiveActor1}</div>
            <div style="margin-top: 0.2rem;"><strong>${relationship.actor2Name}:</strong> ${relationship.perspectiveActor2}</div>
            <div style="margin-top: 0.3rem;"><strong>Tension &amp; Limits:</strong> ${relationship.tensionAndLimits}</div>
          </div>
        </div>
      `;
    } else {
      relEl.hidden = true;
      relEl.innerHTML = "";
    }

    // Render independent world horizon item
    let worldEl = document.getElementById("drawer-world-item");
    if (!worldEl) {
      worldEl = document.createElement("div");
      worldEl.id = "drawer-world-item";
      worldEl.className = "atlas-drawer-context-section";
      (relEl || sigEl?.closest("details"))?.after(worldEl);
    }
    const worldItem = datedEvent?.worldItem;
    if (worldItem) {
      worldEl.hidden = false;
      worldEl.innerHTML = `
        <div class="drawer-world-item-box" style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.04); border-radius: 4px; border: 1px solid var(--border-subtle, rgba(255,255,255,0.1));">
          <span class="eyebrow" style="color: #c084fc; font-size: 0.7rem;">ELSEWHERE IN THE WORLD · CONTEMPORARY HORIZON</span>
          <h4 style="margin: 0.25rem 0; font-size: 0.95rem; color: #fff;">${worldItem.name}</h4>
          <p style="font-size: 0.78rem; color: var(--gold-warm); margin: 0.2rem 0;">${worldItem.regionName} · ${worldItem.dateRangeLabel}</p>
          <p style="font-size: 0.78rem; color: var(--text-muted);">${worldItem.summary}</p>
          <p style="font-size: 0.75rem; font-style: italic; color: var(--gold-muted); margin-top: 0.35rem;">${worldItem.overlapExplanation}</p>
          <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="${worldItem.sourceUrl}" target="_blank" rel="noopener noreferrer" class="atlas-drawer-btn" style="padding: 0.25rem 0.5rem; font-size: 0.74rem;">${worldItem.sourceTitle} ↗</a>
            <button type="button" id="drawer-pan-world-btn" class="atlas-drawer-btn" style="padding: 0.25rem 0.5rem; font-size: 0.74rem;">Pan to ${(worldItem.name.includes('China') || worldItem.regionName.includes('China') || worldItem.id.includes('zhou') || worldItem.id.includes('shang') || worldItem.id.includes('han')) ? 'China' : (worldItem.regionName.split('/')[0].split(',')[0].trim())} on map &rarr;</button>
          </div>
        </div>
      `;
      const panBtn = document.getElementById("drawer-pan-world-btn");
      if (panBtn && worldItem.coords) {
        panBtn.onclick = () => {
          this.mapCanvas?.animateToCoords(worldItem.coords!, 5);
        };
      }
    } else {
      worldEl.hidden = true;
      worldEl.innerHTML = "";
    }

    drawer.hidden = false;
    trackMapDossierView(site.artifactName || site.siteName, 'archaeological_site', site.biblicalAttestation);
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
    trackMapDossierView(city.name, 'biblical_city', city.scriptureRef);
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
    trackMapDossierView(empire.name, 'world_empire');
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

    // Resolve time-specific relationship and independent world horizon for this stop
    let stopRel: HistoricalRelationship | undefined;
    let stopWorld: WorldHorizonItem | undefined;
    if (osisTarget) {
      const parts = osisTarget.split('.');
      if (parts.length >= 2) {
        const b = parts[0];
        const ch = parseInt(parts[1], 10);
        const vs = parts[2] ? parseInt(parts[2], 10) : 1;
        stopRel = getRelationshipForPassage(b, ch, vs);
      }
    }
    if (stopRel?.preferredWorldItemId) {
      stopWorld = getWorldHorizonItem(stopRel.preferredWorldItemId);
    }
    if (!stopWorld && stopRel) {
      stopWorld = HISTORICAL_WORLD_ITEMS.find(item => isWorldItemInDateInterval(item, stopRel!.startYear));
    }
    if (!stopWorld) {
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
      const yr = routeYears[route.id];
      if (yr !== undefined) {
        stopWorld = HISTORICAL_WORLD_ITEMS.find(item => isWorldItemInDateInterval(item, yr));
      }
    }

    // Render relationship into drawer
    let relEl = document.getElementById("drawer-relationship");
    if (!relEl) {
      relEl = document.createElement("div");
      relEl.id = "drawer-relationship";
      relEl.className = "atlas-drawer-context-section";
      sigEl?.closest("details")?.after(relEl);
    }
    if (stopRel) {
      relEl.hidden = false;
      relEl.innerHTML = `
        <div class="drawer-relationship-box" style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(212, 163, 89, 0.08); border-radius: 4px; border: 1px solid var(--border-subtle, rgba(255,255,255,0.1));">
          <span class="eyebrow" style="color: var(--gold-bright); font-size: 0.7rem;">RELATIONSHIP AT THIS TIME</span>
          <h4 style="margin: 0.25rem 0; font-size: 0.95rem; color: #fff;">${stopRel.actor1Name} ↔ ${stopRel.actor2Name}</h4>
          <p style="font-size: 0.78rem; color: var(--gold-warm); margin: 0.2rem 0;">${stopRel.periodLabel} · ${stopRel.relationshipLabel}</p>
          <p style="font-size: 0.78rem; color: var(--text-light); line-height: 1.4;">${stopRel.summary}</p>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem; line-height: 1.35;">
            <div><strong>${stopRel.actor1Name}:</strong> ${stopRel.perspectiveActor1}</div>
            <div style="margin-top: 0.2rem;"><strong>${stopRel.actor2Name}:</strong> ${stopRel.perspectiveActor2}</div>
            <div style="margin-top: 0.3rem;"><strong>Tension &amp; Limits:</strong> ${stopRel.tensionAndLimits}</div>
          </div>
        </div>
      `;
    } else {
      relEl.hidden = true;
      relEl.innerHTML = "";
    }

    // Render world horizon into drawer
    let worldEl = document.getElementById("drawer-world-item");
    if (!worldEl) {
      worldEl = document.createElement("div");
      worldEl.id = "drawer-world-item";
      worldEl.className = "atlas-drawer-context-section";
      (relEl || sigEl?.closest("details"))?.after(worldEl);
    }
    if (stopWorld) {
      const regLabel = (stopWorld.name.includes('China') || stopWorld.regionName.includes('China') || stopWorld.id.includes('zhou') || stopWorld.id.includes('shang') || stopWorld.id.includes('han')) ? 'China' : (stopWorld.regionName.split('/')[0].split(',')[0].trim());
      worldEl.hidden = false;
      worldEl.innerHTML = `
        <div class="drawer-world-item-box" style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.04); border-radius: 4px; border: 1px solid var(--border-subtle, rgba(255,255,255,0.1));">
          <span class="eyebrow" style="color: #c084fc; font-size: 0.7rem;">ELSEWHERE IN THE WORLD · CONTEMPORARY HORIZON</span>
          <h4 style="margin: 0.25rem 0; font-size: 0.95rem; color: #fff;">${stopWorld.name}</h4>
          <p style="font-size: 0.78rem; color: var(--gold-warm); margin: 0.2rem 0;">${stopWorld.regionName} · ${stopWorld.dateRangeLabel}</p>
          <p style="font-size: 0.78rem; color: var(--text-muted);">${stopWorld.summary}</p>
          <p style="font-size: 0.75rem; font-style: italic; color: var(--gold-muted); margin-top: 0.35rem;">${stopWorld.overlapExplanation}</p>
          <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="${stopWorld.sourceUrl}" target="_blank" rel="noopener noreferrer" class="atlas-drawer-btn" style="padding: 0.25rem 0.5rem; font-size: 0.74rem;">${stopWorld.sourceTitle} ↗</a>
            <button type="button" id="drawer-pan-world-btn" class="atlas-drawer-btn" style="padding: 0.25rem 0.5rem; font-size: 0.74rem;">Pan to ${regLabel} on map &rarr;</button>
          </div>
        </div>
      `;
      const panBtn = document.getElementById("drawer-pan-world-btn");
      if (panBtn && stopWorld.coords) {
        panBtn.onclick = () => {
          this.mapCanvas?.animateToCoords(stopWorld!.coords!, 5);
        };
      }
    } else {
      worldEl.hidden = true;
      worldEl.innerHTML = "";
    }
    if (scriptureLink) {
      scriptureLink.textContent = `Read Scripture (${targetStop.scriptureRef}) →`;
      scriptureLink.href = `/bible?ref=${encodeURIComponent(osisTarget)}`;
    }

    if (studyDeskLink) {
      studyDeskLink.hidden = false;
      studyDeskLink.href = `/interact?ref=${encodeURIComponent(localStore.normalizeToOsis(osisTarget) || osisTarget)}`;
      studyDeskLink.textContent = 'Explore this passage in Interact →';
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
      bibleHref: `/bible?ref=${encodeURIComponent(osisTarget)}`,
      interactHref: `/interact?ref=${encodeURIComponent(localStore.normalizeToOsis(osisTarget) || osisTarget)}`,
      mapHref: `/map?era=${encodeURIComponent(this.mapCanvas?.activeEra.id || 'apostolic_church')}&journey=${encodeURIComponent(route.id)}`
    };
    writeUserContext(nextCtx);
    this.renderContextBar(nextCtx, false);
  }

  private hideDetailDrawer(): void {
    const drawer = document.getElementById('atlas-detail-drawer');
    if (drawer) drawer.hidden = true;
    const relEl = document.getElementById('drawer-relationship');
    if (relEl) relEl.hidden = true;
    const worldEl = document.getElementById('drawer-world-item');
    if (worldEl) worldEl.hidden = true;
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
