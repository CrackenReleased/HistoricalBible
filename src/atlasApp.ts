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

class HistoricalAtlasApp {
  private mapCanvas: AncientMapCanvas | null = null;
  private selectedSite: ArchaeologicalSite | null = null;
  private activeStepperRouteId: string | null = null;
  private activeStepperStopIndex = 0;
  private orientation = true;
  private showAllStops = false;

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
    this.bindControls();
    this.syncLayers();
    this.checkInitialUrlParams();
  }

  private bindControls(): void {
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
        document.getElementById('atlas-journey-field')!.hidden = true;
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
