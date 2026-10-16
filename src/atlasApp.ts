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
  CHRONOLOGICAL_ERAS,
  type ArchaeologicalSite,
  type BiblicalCity,
  type ChronologicalEra
} from './data/ancientMapData';

class HistoricalAtlasApp {
  private mapCanvas: AncientMapCanvas | null = null;
  private selectedSite: ArchaeologicalSite | null = null;

  public init(): void {
    const container = document.getElementById('atlas-canvas-container');
    if (!container) return;

    this.mapCanvas = new AncientMapCanvas({
      container,
      compact: false,
      initialEraId: 'all',
      onSelectSite: (site) => this.showSiteDetail(site),
      onSelectCity: (city) => this.showCityDetail(city),
      onEraChange: (era) => this.syncEraUI(era)
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

    const eraBtns = document.querySelectorAll<HTMLButtonElement>('.chrono-era-btn');
    eraBtns.forEach(btn => {
      const btnEra = btn.getAttribute('data-era');
      if (btnEra === era.id) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });
  }

  private checkInitialUrlParams(): void {
    const params = new URLSearchParams(window.location.search);
    const siteId = params.get('site');
    const region = params.get('region');
    const eraParam = params.get('era');

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
      scriptureLink.href = `/bible`;
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
      scriptureLink.textContent = `Open in Bible Reader →`;
      scriptureLink.href = `/bible`;
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

  private hideDetailDrawer(): void {
    const drawer = document.getElementById('atlas-detail-drawer');
    if (drawer) drawer.hidden = true;
    this.selectedSite = null;
  }
}

// Bootstrap on DOM ready
if (typeof document !== 'undefined') {
  const app = new HistoricalAtlasApp();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
  } else {
    app.init();
  }
}
