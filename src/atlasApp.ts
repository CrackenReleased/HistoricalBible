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
  type GranularTimelineFilter
} from './data/ancientMapData';

class HistoricalAtlasApp {
  private mapCanvas: AncientMapCanvas | null = null;
  private selectedSite: ArchaeologicalSite | null = null;
  private activeStepperRouteId: string | null = null;
  private activeStepperStopIndex: number = 0;

  public init(): void {
    const container = document.getElementById('atlas-canvas-container');
    if (!container) return;

    this.mapCanvas = new AncientMapCanvas({
      container,
      compact: false,
      initialEraId: 'all',
      onSelectSite: (site) => this.showSiteDetail(site),
      onSelectCity: (city) => this.showCityDetail(city),
      onSelectEmpire: (empire) => this.showEmpireDetail(empire),
      onSelectRouteStop: (route, stop, stopIndex) => {
        this.activeStepperRouteId = route.id;
        this.activeStepperStopIndex = typeof stopIndex === 'number' ? stopIndex : 0;
        this.renderWaypointStepper();
        this.showRouteDetail(route, stop, stopIndex);
      },
      onEraChange: (era) => this.syncEraUI(era),
      onGranularFilterChange: (filter) => this.syncGranularUI(filter)
    });

    this.bindControls();
    this.checkInitialUrlParams();
    if (this.mapCanvas.activeEra) {
      this.syncEraUI(this.mapCanvas.activeEra);
    }
  }

  private bindControls(): void {
    if (!this.mapCanvas) return;

    // 0. Chronological Era Buttons
    const eraBtns = document.querySelectorAll<HTMLButtonElement>('.chrono-era-btn');
    eraBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const eraId = btn.getAttribute('data-era');
        if (!eraId || !this.mapCanvas) return;
        this.hideDetailDrawer();
        this.mapCanvas.setEra(eraId);
      });
    });

    // 1. Layer Toggles
    const layerToggles = document.querySelectorAll<HTMLButtonElement>('.atlas-toggle-btn');
    layerToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const layer = btn.getAttribute('data-layer') as 'archaeology' | 'empires' | 'routes' | 'cities' | 'rivers';
        if (!layer || !this.mapCanvas) return;

        const isCurrentlyActive = btn.classList.contains('active');
        const nextActive = !isCurrentlyActive;

        if (nextActive) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        }

        this.mapCanvas.layers[layer] = nextActive;
        this.mapCanvas.render();
      });
    });

    // 2. Region Presets
    const presetBtns = document.querySelectorAll<HTMLButtonElement>('.atlas-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetId = btn.getAttribute('data-preset');
        if (!presetId || !this.mapCanvas) return;

        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.mapCanvas.jumpToPreset(presetId);
      });
    });

    // 3. Detail Drawer Close Button
    const closeBtn = document.getElementById('atlas-drawer-close');
    closeBtn?.addEventListener('click', () => {
      this.hideDetailDrawer();
    });
  }

  private syncEraUI(era: ChronologicalEra): void {
    const yearEl = document.getElementById('chrono-current-year');
    const headlineEl = document.getElementById('chrono-headline');
    const summaryEl = document.getElementById('chrono-summary');

    if (yearEl) yearEl.textContent = era.yearLabel;
    if (headlineEl) headlineEl.textContent = era.headline;
    if (summaryEl) summaryEl.textContent = era.historicalSummary;

    const buttonEraMap: Record<string, string> = {
      '2kings_jehu': 'divided_monarchy_prophets',
      '2kings_fall_samaria': 'assyrian_siege'
    };
    const targetBtnEra = buttonEraMap[era.id] || era.id;

    const eraBtns = document.querySelectorAll<HTMLButtonElement>('.chrono-era-btn');
    eraBtns.forEach(btn => {
      const btnEra = btn.getAttribute('data-era');
      if (btnEra === targetBtnEra) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    const visibleRoutes = this.mapCanvas?.getVisibleRoutes() || [];
    this.activeStepperRouteId = visibleRoutes[0]?.id || null;
    this.activeStepperStopIndex = 0;

    this.renderGranularControls(era);
    this.renderWaypointStepper();
  }

  private syncGranularUI(filter: GranularTimelineFilter | null): void {
    if (!this.mapCanvas) return;
    this.hideDetailDrawer();
    const era = this.mapCanvas.activeEra;
    const yearEl = document.getElementById('chrono-current-year');
    const headlineEl = document.getElementById('chrono-headline');
    const summaryEl = document.getElementById('chrono-summary');
    const statusEl = document.getElementById('chrono-granular-status');

    if (filter) {
      if (yearEl) yearEl.textContent = filter.dateLabel;
      if (headlineEl) headlineEl.textContent = `${filter.label} · ${filter.categoryLabel}`;
      if (summaryEl) summaryEl.textContent = filter.summary;
      if (statusEl) {
        statusEl.textContent = filter.evidenceClass === 'EXTERNAL_HISTORICAL_ATTESTATION'
          ? '🏛️ Showing Canonical Scripture + Early Patristic / External Historical Attestation'
          : `📖 Showing ${filter.routeIds.length > 1 ? `${filter.routeIds.length} Synchronized Tracks` : 'Canonical Scripture Track'} · Step through numbered waypoints below`;
      }
      this.activeStepperRouteId = filter.routeIds[0] || null;
      this.activeStepperStopIndex = 0;
    } else {
      if (yearEl) yearEl.textContent = era.yearLabel;
      if (headlineEl) headlineEl.textContent = era.headline;
      if (summaryEl) summaryEl.textContent = era.historicalSummary;
      if (statusEl) {
        statusEl.textContent = 'Select any life phase, prophet, or apostolic mission to trace stop-by-stop';
      }
      const visibleRoutes = this.mapCanvas.getVisibleRoutes();
      this.activeStepperRouteId = visibleRoutes[0]?.id || null;
      this.activeStepperStopIndex = 0;
    }

    this.renderGranularControls(era);
    this.renderWaypointStepper();
  }

  private renderGranularControls(era: ChronologicalEra): void {
    const barEl = document.getElementById('chrono-granular-bar');
    if (!barEl || !this.mapCanvas) return;

    const matchingFilters = GRANULAR_TIMELINE_FILTERS.filter(f => f.eraIds.includes(era.id));
    if (matchingFilters.length === 0) {
      barEl.innerHTML = '';
      return;
    }

    const activeFilterId = this.mapCanvas.activeGranularFilterId;
    const defaultRouteCount = era.id === 'all' ? BIBLICAL_ROUTES.length : era.activeRouteIds.length;

    let html = `
      <button type="button" class="chrono-granular-pill ${!activeFilterId ? 'active' : ''}" data-granular-id="all-era">
        <span class="granular-pill-label">🌐 All ${era.name} Tracks (${defaultRouteCount})</span>
      </button>
    `;

    for (const f of matchingFilters) {
      const isActive = activeFilterId === f.id;
      const primaryRoute = BIBLICAL_ROUTES.find(r => r.id === f.routeIds[0]);
      const swatchColor = primaryRoute?.color || '#d4af37';
      const isPatristic = f.evidenceClass === 'EXTERNAL_HISTORICAL_ATTESTATION';
      html += `
        <button
          type="button"
          class="chrono-granular-pill ${isActive ? 'active' : ''} ${isPatristic ? 'patristic-track' : ''}"
          data-granular-id="${f.id}"
          style="--track-color: ${swatchColor};"
          title="${f.summary.replace(/"/g, '&quot;')}"
        >
          <span class="granular-pill-dot" style="background: ${swatchColor};"></span>
          <span class="granular-pill-label">${f.label}</span>
          <span class="granular-pill-date">${f.dateLabel}</span>
        </button>
      `;
    }

    barEl.innerHTML = html;

    const pillBtns = barEl.querySelectorAll<HTMLButtonElement>('.chrono-granular-pill');
    pillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const gid = btn.getAttribute('data-granular-id');
        if (!this.mapCanvas) return;
        this.mapCanvas.setGranularFilter(gid === 'all-era' ? null : gid);
      });
    });
  }

  private renderWaypointStepper(): void {
    const stepperEl = document.getElementById('chrono-waypoint-stepper');
    if (!stepperEl || !this.mapCanvas) return;

    const visibleRoutes = this.mapCanvas.getVisibleRoutes();
    if (visibleRoutes.length === 0) {
      stepperEl.hidden = true;
      stepperEl.innerHTML = '';
      return;
    }

    // Ensure activeStepperRouteId points to one of the currently visible routes
    let activeRoute = visibleRoutes.find(r => r.id === this.activeStepperRouteId) || visibleRoutes[0];
    this.activeStepperRouteId = activeRoute.id;
    const stopCount = activeRoute.stops.length;
    const clampedIdx = ((this.activeStepperStopIndex % stopCount) + stopCount) % stopCount;
    this.activeStepperStopIndex = clampedIdx;
    const currentStop = activeRoute.stops[clampedIdx];

    const isPatristicStop =
      (currentStop.evidenceClass || activeRoute.evidenceClass) === 'EXTERNAL_HISTORICAL_ATTESTATION';

    // Route switcher tabs if multiple routes are visible (e.g. John the Baptist + Jesus Parallel, or Complete Life of Jesus)
    const routeTabsHtml = visibleRoutes.length > 1
      ? `
        <div class="stepper-route-tabs" role="tablist" aria-label="Active Journey Track Selector">
          <span class="stepper-tabs-label">STEP THROUGH JOURNEY:</span>
          ${visibleRoutes
            .map(
              r => `
                <button
                  type="button"
                  class="stepper-route-tab ${r.id === activeRoute.id ? 'active' : ''}"
                  data-stepper-route-id="${r.id}"
                  style="--route-color: ${r.color};"
                >
                  <span class="stepper-tab-dot" style="background: ${r.color};"></span>
                  <span>${r.name.split(':')[0]} (${r.stops.length} Stops)</span>
                </button>
              `
            )
            .join('')}
        </div>
      `
      : '';

    const stopChipsHtml = activeRoute.stops
      .map((s, idx) => {
        const shortStopName = s.name.split(' (')[0].split(' [')[0].split(' —')[0];
        return `
          <button
            type="button"
            class="stepper-stop-chip ${idx === clampedIdx ? 'active' : ''}"
            data-stop-index="${idx}"
            style="--route-color: ${activeRoute.color};"
            title="Stop ${idx + 1}: ${s.name} (${s.dateLabel}) — ${s.scriptureRef}"
          >
            <span class="chip-num">${idx + 1}</span>
            <span class="chip-name">${shortStopName}</span>
          </button>
        `;
      })
      .join('');

    stepperEl.hidden = false;
    stepperEl.innerHTML = `
      ${routeTabsHtml}
      <div class="stepper-main-row">
        <div class="stepper-nav-controls">
          <button type="button" class="stepper-nav-btn" id="stepper-prev-btn" aria-label="Previous chronological stop">
            &#9664; Prev Stop
          </button>
          <button type="button" class="stepper-nav-btn" id="stepper-next-btn" aria-label="Next chronological stop">
            Next Stop &#9654;
          </button>
        </div>
        <div class="stepper-active-readout" style="border-left-color: ${activeRoute.color};">
          <div class="stepper-readout-top">
            <span class="stepper-route-badge" style="color: ${activeRoute.color}; border-color: ${activeRoute.color};">
              ${activeRoute.name.toUpperCase()} &middot; STOP ${clampedIdx + 1} OF ${stopCount}
            </span>
            <span class="stepper-date-badge">🗓️ ${currentStop.dateLabel}</span>
            <span class="stepper-scripture-badge">📖 ${currentStop.scriptureRef}</span>
            ${isPatristicStop ? `<span class="stepper-attestation-badge">🏛️ Patristic / Historical Attestation</span>` : ''}
          </div>
          <div class="stepper-readout-title">
            <strong>${clampedIdx + 1}. ${currentStop.name}:</strong> ${currentStop.note}
          </div>
        </div>
      </div>
      <div class="stepper-chips-row" role="group" aria-label="Numbered stops along ${activeRoute.name}">
        ${stopChipsHtml}
      </div>
    `;

    // Bind route switcher tabs
    stepperEl.querySelectorAll<HTMLButtonElement>('.stepper-route-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const rid = tab.getAttribute('data-stepper-route-id');
        if (!rid || !this.mapCanvas) return;
        this.activeStepperRouteId = rid;
        this.activeStepperStopIndex = 0;
        this.mapCanvas.stepToRouteStop(rid, 0, true);
      });
    });

    // Bind Prev / Next buttons
    stepperEl.querySelector('#stepper-prev-btn')?.addEventListener('click', () => {
      if (!this.mapCanvas) return;
      const nextIdx = (this.activeStepperStopIndex - 1 + stopCount) % stopCount;
      this.activeStepperStopIndex = nextIdx;
      this.mapCanvas.stepToRouteStop(activeRoute.id, nextIdx, true);
    });

    stepperEl.querySelector('#stepper-next-btn')?.addEventListener('click', () => {
      if (!this.mapCanvas) return;
      const nextIdx = (this.activeStepperStopIndex + 1) % stopCount;
      this.activeStepperStopIndex = nextIdx;
      this.mapCanvas.stepToRouteStop(activeRoute.id, nextIdx, true);
    });

    // Bind individual numbered stop chips
    stepperEl.querySelectorAll<HTMLButtonElement>('.stepper-stop-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const idxAttr = chip.getAttribute('data-stop-index');
        if (idxAttr === null || !this.mapCanvas) return;
        const idx = Number(idxAttr);
        this.activeStepperStopIndex = idx;
        this.mapCanvas.stepToRouteStop(activeRoute.id, idx, true);
      });
    });
  }

  private checkInitialUrlParams(): void {
    const params = new URLSearchParams(window.location.search);
    const siteId = params.get('site');
    const region = params.get('region');
    const eraParam = params.get('era');
    const filterParam = params.get('filter') || params.get('journey');

    if (eraParam && this.mapCanvas) {
      this.mapCanvas.setEra(eraParam);
    } else if (region && this.mapCanvas) {
      this.mapCanvas.jumpToPreset(region);
      const activeBtn = document.querySelector(`.atlas-preset-btn[data-preset="${region}"]`);
      if (activeBtn) {
        document.querySelectorAll('.atlas-preset-btn').forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
      }
    }

    if (filterParam && this.mapCanvas) {
      this.mapCanvas.setGranularFilter(filterParam);
    }

    if (siteId) {
      const site = ARCHAEOLOGICAL_SITES.find(s => s.id === siteId);
      if (site) {
        this.showSiteDetail(site);
        if (this.mapCanvas) {
          this.mapCanvas.animateToCoords(site.coords, 3.5);
        }
      }
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

    if (scriptureLink) {
      scriptureLink.textContent = `Open in Bible Reader (${city.scriptureAnchor}) →`;
      scriptureLink.href = `/bible?ref=${encodeURIComponent(city.scriptureAnchor.split(',')[0].trim())}`;
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
      titleEl.textContent = `Stop ${idx + 1} of ${route.stops.length}: ${targetStop.name} (${route.name})`;
    }
    if (metaEl) {
      const stopEvidence = targetStop.evidenceClass || route.evidenceClass || 'SCRIPTURE_TEXT';
      const evidenceTag = stopEvidence === 'EXTERNAL_HISTORICAL_ATTESTATION'
        ? ` · Historical Attestation: ${targetStop.attestationSource || route.attestationSource || 'Early Patristic Tradition'}`
        : ' · Canonical Scripture';
      metaEl.textContent = `When: ${targetStop.dateLabel} · Traveler: ${route.travelerName} · Scripture: ${targetStop.scriptureRef}${evidenceTag}`;
    }
    if (descEl) {
      descEl.textContent = targetStop.note;
    }
    if (sigEl) {
      const itinerarySummary = route.stops
        .map((s, i) => `${i + 1}. ${s.name.split(' (')[0].split(' [')[0]}`)
        .join(' → ');
      sigEl.textContent = `Itinerary (${route.dateRange}): ${itinerarySummary}`;
    }

    if (scriptureLink) {
      scriptureLink.textContent = `Read Scripture (${targetStop.scriptureRef}) →`;
      scriptureLink.href = `/bible?ref=${encodeURIComponent(targetStop.scriptureOsis || route.scriptureOsis)}`;
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
