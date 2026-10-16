/**
 * src/engine/ancientMap.ts
 * High-Resolution Leaflet Cartographic Engine for HistoricalBible.com
 * Combines real-world geodetic topography with biblical archaeology and world empires.
 * Features:
 * - Real-world high-resolution raster tiles (CartoDB Dark Matter / Voyager)
 * - Ornate Golden Compass Rose explicitly indicating NORTH
 * - Chronological Era / Active Year synchronization (only relevant empire & discoveries shown)
 * - Custom animated gold coin markers for surviving archaeological discoveries
 * - Interactive route lines for Abraham, Exodus, and Paul
 * - Smooth camera transitions and high-DPI retina sharpness
 */

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  ARCHAEOLOGICAL_SITES,
  BIBLICAL_CITIES,
  BIBLICAL_ROUTES,
  WORLD_EMPIRES_GEO,
  CHRONOLOGICAL_ERAS,
  REGION_PRESETS,
  type GeoCoordinate,
  type ArchaeologicalSite,
  type BiblicalCity,
  type BiblicalRoute,
  type WorldEmpireRegion,
  type ChronologicalEra
} from '../data/ancientMapData';

export interface AncientMapOptions {
  container: HTMLElement;
  compact?: boolean;
  initialEraId?: string;
  onSelectSite?: (site: ArchaeologicalSite) => void;
  onSelectCity?: (city: BiblicalCity) => void;
  onEraChange?: (era: ChronologicalEra) => void;
}

export class AncientMapCanvas {
  public map: L.Map;
  private container: HTMLElement;
  private options: AncientMapOptions;

  // Active Layers
  private tileLayer: L.TileLayer;
  private empireLayerGroup: L.LayerGroup;
  private siteLayerGroup: L.LayerGroup;
  private routeLayerGroup: L.LayerGroup;
  private cityLayerGroup: L.LayerGroup;

  // Active Chronological State
  public activeEra: ChronologicalEra;

  // Layer Toggles
  public layers = {
    archaeology: true,
    empires: true,
    routes: true,
    cities: true,
  };

  constructor(options: AncientMapOptions) {
    this.options = options;
    this.container = options.container;

    // Default to 'all' or initial era
    const initialEra = CHRONOLOGICAL_ERAS.find(e => e.id === options.initialEraId) ||
      CHRONOLOGICAL_ERAS.find(e => e.id === 'all') ||
      CHRONOLOGICAL_ERAS[0];
    this.activeEra = initialEra;

    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.backgroundColor = '#080c11';

    // 1. Initialize Leaflet Map
    const initialZoom = options.compact ? 4 : initialEra.focusZoom;
    const initialCenter = options.compact ? [32.5, 35.5] : [initialEra.focusCenter.lat, initialEra.focusCenter.lng];

    this.map = L.map(this.container, {
      center: initialCenter as L.LatLngExpression,
      zoom: initialZoom,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: false, // We render custom zoom controls
      attributionControl: false
    });

    // 2. High-Resolution Basemap: Esri World Dark Gray Base (clean, dark, watermark-free)
    this.tileLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
    }).addTo(this.map);

    // 3. Layer Groups
    this.empireLayerGroup = L.layerGroup().addTo(this.map);
    this.routeLayerGroup = L.layerGroup().addTo(this.map);
    this.cityLayerGroup = L.layerGroup().addTo(this.map);
    this.siteLayerGroup = L.layerGroup().addTo(this.map);

    // 4. Custom On-Map UI: Ornate Compass Rose + Controls + Year HUD
    this.buildCompassRose();
    this.buildControls();
    this.buildYearHud();

    // 5. Initial Render
    this.renderActiveEra();

    // Handle container resize
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  private yearHudEl: HTMLElement | null = null;

  /**
   * Prominent, ornate compass rose explicitly indicating NORTH
   */
  private buildCompassRose(): void {
    const compassEl = document.createElement('div');
    compassEl.className = 'ornate-compass-rose';
    compassEl.setAttribute('role', 'img');
    compassEl.setAttribute('aria-label', 'Compass Rose indicating North direction');
    compassEl.innerHTML = `
      <div class="compass-inner">
        <svg viewBox="0 0 100 100" class="compass-svg" width="84" height="84">
          <!-- Outer Dial Ring -->
          <circle cx="50" cy="50" r="46" fill="rgba(8, 12, 17, 0.85)" stroke="#d4af37" stroke-width="1.8"/>
          <circle cx="50" cy="50" r="41" fill="none" stroke="rgba(212, 175, 55, 0.4)" stroke-width="0.8" stroke-dasharray="2,3"/>

          <!-- Cardinal Cross Lines -->
          <line x1="50" y1="12" x2="50" y2="88" stroke="rgba(212, 175, 55, 0.3)" stroke-width="0.8"/>
          <line x1="12" y1="50" x2="88" y2="50" stroke="rgba(212, 175, 55, 0.3)" stroke-width="0.8"/>

          <!-- Secondary Star Points (NW, NE, SW, SE) -->
          <polygon points="50,50 46,30 50,22 54,30" fill="rgba(197, 160, 89, 0.5)"/>
          <polygon points="50,50 70,46 78,50 70,54" fill="rgba(197, 160, 89, 0.5)"/>
          <polygon points="50,50 54,70 50,78 46,70" fill="rgba(197, 160, 89, 0.5)"/>
          <polygon points="50,50 30,54 22,50 30,46" fill="rgba(197, 160, 89, 0.5)"/>

          <!-- Primary Compass Needle pointing NORTH (Crisp Gold & Red) -->
          <!-- North Point (Illuminated Red & Gold) -->
          <polygon points="50,10 44,48 50,50" fill="#e11d48"/>
          <polygon points="50,10 56,48 50,50" fill="#be123c"/>
          <!-- South Point -->
          <polygon points="50,90 44,52 50,50" fill="#475569"/>
          <polygon points="50,90 56,52 50,50" fill="#334155"/>
          <!-- East & West Points -->
          <polygon points="90,50 52,44 50,50" fill="#94a3b8"/>
          <polygon points="10,50 48,44 50,50" fill="#64748b"/>

          <!-- Center Pivot Core -->
          <circle cx="50" cy="50" r="5" fill="#d4af37" stroke="#080c11" stroke-width="1.5"/>
          <circle cx="50" cy="50" r="2" fill="#ffffff"/>

          <!-- Cardinal Labels -->
          <text x="50" y="8" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-weight="700" font-size="10" fill="#ffd700">N</text>
          <text x="50" y="98" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-weight="600" font-size="8" fill="#94a3b8">S</text>
          <text x="96" y="53" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-weight="600" font-size="8" fill="#94a3b8">E</text>
          <text x="5" y="53" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-weight="600" font-size="8" fill="#94a3b8">W</text>
        </svg>
        <div class="compass-label-banner">NORTH &uarr;</div>
      </div>
    `;

    this.container.appendChild(compassEl);
  }

  private buildControls(): void {
    const ctrlEl = document.createElement('div');
    ctrlEl.className = 'ancient-map-controls';
    ctrlEl.innerHTML = `
      <div class="map-btn-group" role="group" aria-label="Map zoom controls">
        <button type="button" class="map-ctrl-btn" id="map-zoom-in" title="Zoom In" aria-label="Zoom in">+</button>
        <button type="button" class="map-ctrl-btn" id="map-zoom-out" title="Zoom Out" aria-label="Zoom out">&minus;</button>
        <button type="button" class="map-ctrl-btn" id="map-reset-view" title="Reset View" aria-label="Reset view">&#x21bb;</button>
      </div>
    `;

    ctrlEl.querySelector('#map-zoom-in')?.addEventListener('click', () => this.map.zoomIn());
    ctrlEl.querySelector('#map-zoom-out')?.addEventListener('click', () => this.map.zoomOut());
    ctrlEl.querySelector('#map-reset-view')?.addEventListener('click', () => this.resetView());

    this.container.appendChild(ctrlEl);
  }

  private buildYearHud(): void {
    this.yearHudEl = document.createElement('div');
    this.yearHudEl.className = 'map-canvas-year-hud';
    this.yearHudEl.setAttribute('aria-live', 'polite');
    this.updateYearHud();
    this.container.appendChild(this.yearHudEl);
  }

  public updateYearHud(): void {
    if (!this.yearHudEl) return;
    this.yearHudEl.innerHTML = `
      <div class="hud-label">EPOCH: ${this.activeEra.name.toUpperCase()}</div>
      <div class="hud-year">${this.activeEra.yearLabel}</div>
    `;
  }

  public setEra(eraId: string): void {
    const era = CHRONOLOGICAL_ERAS.find(e => e.id === eraId);
    if (!era) return;

    this.activeEra = era;
    this.updateYearHud();
    this.renderActiveEra();

    // Smoothly fly camera to era focus
    this.map.flyTo(
      [era.focusCenter.lat, era.focusCenter.lng],
      era.focusZoom,
      { duration: 1.2 }
    );

    if (this.options.onEraChange) {
      this.options.onEraChange(era);
    }
  }

  public jumpToPreset(presetId: string): void {
    const preset = REGION_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    // Map preset center and appropriate zoom for Leaflet
    const zoomMap: Record<string, number> = {
      all: 5,
      levant: 7,
      egypt: 6,
      mesopotamia: 6,
      mediterranean: 5
    };
    const targetZoom = zoomMap[presetId] || 6;
    this.map.flyTo([preset.center.lat, preset.center.lng], targetZoom, { duration: 1.2 });
  }

  public animateToCoords(coords: GeoCoordinate, zoom = 7): void {
    this.map.flyTo([coords.lat, coords.lng], zoom, { duration: 1.2 });
  }

  public resetView(): void {
    this.setEra('all');
  }

  public focusOnFigure(figureId: string): void {
    // Find matching site for this figure
    const site = ARCHAEOLOGICAL_SITES.find(s => s.figureId === figureId);
    if (site) {
      this.map.flyTo([site.coords.lat, site.coords.lng], 7, { duration: 1.0 });
      if (this.options.onSelectSite) {
        this.options.onSelectSite(site);
      }
      return;
    }

    // Otherwise check for figure's era
    const era = CHRONOLOGICAL_ERAS.find(e => e.activeFigureIds.includes(figureId));
    if (era) {
      this.setEra(era.id);
    }
  }

  public focusOnSite(siteId: string): void {
    const site = ARCHAEOLOGICAL_SITES.find(s => s.id === siteId);
    if (site) {
      this.map.flyTo([site.coords.lat, site.coords.lng], 8, { duration: 1.0 });
      if (this.options.onSelectSite) {
        this.options.onSelectSite(site);
      }
    }
  }

  public render(): void {
    this.renderActiveEra();
  }

  /**
   * Main render method filtering by the active chronological era
   */
  public renderActiveEra(): void {
    this.empireLayerGroup.clearLayers();
    this.routeLayerGroup.clearLayers();
    this.cityLayerGroup.clearLayers();
    this.siteLayerGroup.clearLayers();

    const isAll = this.activeEra.id === 'all';

    // 1. World Empires (Filtered strictly by era so empires never clash!)
    if (this.layers.empires) {
      const targetEmpires = isAll
        ? WORLD_EMPIRES_GEO
        : WORLD_EMPIRES_GEO.filter(emp => emp.id === this.activeEra.rulingEmpireId);

      for (const empire of targetEmpires) {
        const latLngs = empire.approximateBounds.map(b => [b.lat, b.lng] as L.LatLngTuple);
        const polygon = L.polygon(latLngs, {
          color: empire.color,
          fillColor: empire.color,
          fillOpacity: 0.14,
          weight: 1.8,
          dashArray: '6, 6'
        });

        polygon.bindTooltip(`
          <div class="map-leaflet-tooltip empire-tooltip">
            <strong>${empire.name}</strong><br/>
            <span>${empire.dateRange}</span>
          </div>
        `, { sticky: true });

        this.empireLayerGroup.addLayer(polygon);
      }
    }

    // 2. Biblical Routes (Filtered by era)
    if (this.layers.routes) {
      const routesToRender = isAll
        ? BIBLICAL_ROUTES
        : BIBLICAL_ROUTES.filter(r => this.activeEra.activeRouteIds.includes(r.id));

      for (const route of routesToRender) {
        const path = route.stops.map(s => [s.coords.lat, s.coords.lng] as L.LatLngTuple);

        const polyline = L.polyline(path, {
          color: route.color,
          weight: 3.5,
          opacity: 0.85,
          dashArray: '5, 8'
        });

        polyline.bindTooltip(`
          <div class="map-leaflet-tooltip">
            <strong>${route.name}</strong><br/>
            <span>${route.scriptureRef}</span>
          </div>
        `, { sticky: true });

        this.routeLayerGroup.addLayer(polyline);

        // Waypoints
        for (const stop of route.stops) {
          const dot = L.circleMarker([stop.coords.lat, stop.coords.lng], {
            radius: 4,
            fillColor: route.color,
            color: '#080c11',
            weight: 1.5,
            fillOpacity: 1
          });
          dot.bindTooltip(`<strong>${stop.name}</strong>${stop.note ? `<br/><em>${stop.note}</em>` : ''}`);
          this.routeLayerGroup.addLayer(dot);
        }
      }
    }

    // 3. Biblical Cities
    if (this.layers.cities) {
      for (const city of BIBLICAL_CITIES) {
        const cityIcon = L.divIcon({
          className: 'leaflet-city-marker',
          html: `<div class="city-marker-dot"></div><div class="city-marker-label">${city.name}</div>`,
          iconSize: [80, 20],
          iconAnchor: [4, 5]
        });

        const marker = L.marker([city.coords.lat, city.coords.lng], { icon: cityIcon });

        marker.bindTooltip(`
          <div class="map-leaflet-tooltip">
            <span class="tooltip-badge">BIBLICAL CITY</span>
            <strong>${city.name}</strong><br/>
            <em>&ldquo;${city.hitchcockMeaning}&rdquo;</em><br/>
            <small>${city.scriptureAnchor}</small>
          </div>
        `);

        marker.on('click', () => {
          if (this.options.onSelectCity) {
            this.options.onSelectCity(city);
          }
        });

        this.cityLayerGroup.addLayer(marker);
      }
    }

    // 4. Archaeological Discovery Sites
    if (this.layers.archaeology) {
      const sitesToRender = isAll
        ? ARCHAEOLOGICAL_SITES
        : ARCHAEOLOGICAL_SITES.filter(s => this.activeEra.activeSiteIds.includes(s.id));

      for (const site of sitesToRender) {
        const isEraHighlight = this.activeEra.activeSiteIds.includes(site.id);

        const goldIcon = L.divIcon({
          className: `leaflet-gold-marker ${isEraHighlight ? 'pulse' : ''}`,
          html: `
            <div class="gold-coin-core">
              <span class="core-inner">&#10022;</span>
            </div>
            ${isEraHighlight ? '<div class="gold-coin-halo"></div>' : ''}
            <div class="gold-coin-label">${site.artifactName}</div>
          `,
          iconSize: [120, 36],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([site.coords.lat, site.coords.lng], {
          icon: goldIcon,
          zIndexOffset: 1000
        });

        marker.bindTooltip(`
          <div class="map-leaflet-tooltip gold-tooltip">
            <span class="tooltip-badge">SURVIVING ARTIFACT · ${site.ancientRegion.toUpperCase()}</span>
            <strong>${site.artifactName}</strong><br/>
            <span>${site.name} · ${site.artifactDate}</span><br/>
            <small style="color: #38bdf8;">${site.scriptureRef}</small><br/>
            <span class="tooltip-cta">Click for full discovery card &rarr;</span>
          </div>
        `);

        marker.on('click', () => {
          if (this.options.onSelectSite) {
            this.options.onSelectSite(site);
          }
        });

        this.siteLayerGroup.addLayer(marker);
      }
    }
  }

  public destroy(): void {
    this.map.remove();
  }
}
