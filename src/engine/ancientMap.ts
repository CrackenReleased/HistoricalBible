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
  type ChronologicalEra,
  type BiblicalGeographicEntity
} from '../data/ancientMapData';

export interface AncientMapOptions {
  container: HTMLElement;
  compact?: boolean;
  initialEraId?: string;
  onSelectSite?: (site: ArchaeologicalSite) => void;
  onSelectCity?: (city: BiblicalCity) => void;
  onEraChange?: (era: ChronologicalEra) => void;
}

function getEmpireRelevanceNote(empireId: string, eraId: string, empire: WorldEmpireRegion): string {
  if (eraId === 'divided_monarchy_prophets') {
    if (empireId === 'israel_kingdom') {
      return 'Active theater of 2 Kings 1; capital at Samaria; Ahaziah falls sick and seeks Baal-zebub at Ekron; Elijah prophesies his judgment.';
    }
    if (empireId === 'judah') {
      return 'Southern Kingdom ruled by King Jehoshaphat; allied with Israel against the Moabite rebellion (2 Kings 3).';
    }
    if (empireId === 'assyria') {
      return "Regional northern superpower; Shalmaneser III marches westward and extracts tribute following Ahab's death.";
    }
    if (empireId === 'phoenicia') {
      return 'Allied maritime trading power; cultural and religious influence via Jezebel of Tyre/Sidon.';
    }
  } else if (eraId === '2kings_jehu') {
    if (empireId === 'israel_kingdom') {
      return "Jehu executes judgment on Ahab's house and eradicates Baal from Samaria; submits tribute to Shalmaneser III.";
    }
    if (empireId === 'judah') {
      return 'Athaliah usurps the throne in Jerusalem until young Joash is hidden in the Temple and crowned by Jehoiada.';
    }
    if (empireId === 'assyria') {
      return 'Rapid military expansion westward under Shalmaneser III and Tiglath-Pileser III, exacted tribute from Israel.';
    }
  } else if (eraId === '2kings_fall_samaria') {
    if (empireId === 'israel_kingdom') {
      return 'Under three-year siege; Samaria falls to Shalmaneser V and Sargon II; the ten northern tribes deported (722 BC).';
    }
    if (empireId === 'judah') {
      return 'Hezekiah witnesses the catastrophic fall of the northern sister kingdom and prepares Jerusalem.';
    }
    if (empireId === 'assyria') {
      return 'Conquering empire; Sargon II records deporting 27,290 Israelites and resettling foreigners in Samaria.';
    }
  } else if (eraId === 'assyrian_siege') {
    if (empireId === 'assyria') {
      return 'Sennacherib invades 46 fortified cities of Judah and besieges Hezekiah in Jerusalem like a "caged bird" (701 BC).';
    }
    if (empireId === 'judah') {
      return 'Hezekiah excavates the Siloam Tunnel and trusts the LORD; the Angel of the LORD strikes 185,000 Assyrian soldiers.';
    }
  }
  return empire.biblicalIntersection;
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
  public showAllSites: boolean = false;

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

    // 1. Initialize Leaflet Map (maxZoom: 15 for deep scholarly inspection)
    const initialZoom = options.compact ? 4 : initialEra.focusZoom;
    const initialCenter = options.compact ? [32.5, 35.5] : [initialEra.focusCenter.lat, initialEra.focusCenter.lng];

    this.map = L.map(this.container, {
      center: initialCenter as L.LatLngExpression,
      zoom: initialZoom,
      minZoom: 3,
      maxZoom: 15,
      zoomControl: false, // We render custom zoom controls
      attributionControl: false
    });

    // 2. High-Resolution Basemap: Esri World Dark Gray Base (clean, dark, watermark-free)
    this.tileLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 15,
      maxNativeZoom: 13,
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
    compassEl.setAttribute('aria-label', 'Compass needle indicating North direction');
    compassEl.innerHTML = `
      <div class="compass-inner">
        <svg viewBox="0 0 36 44" class="compass-svg" width="32" height="38" aria-hidden="true">
          <!-- Subtle North N indicator -->
          <text x="18" y="7" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="8" fill="#ef4444">N</text>
          
          <!-- Faint East & West subtle labels -->
          <text x="33" y="24" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="6" fill="rgba(148, 163, 184, 0.4)">E</text>
          <text x="3" y="24" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="6" fill="rgba(148, 163, 184, 0.4)">W</text>
          
          <!-- Faint horizontal cross tick -->
          <line x1="8" y1="22" x2="13" y2="22" stroke="rgba(148, 163, 184, 0.3)" stroke-width="0.8" stroke-linecap="round"/>
          <line x1="23" y1="22" x2="28" y2="22" stroke="rgba(148, 163, 184, 0.3)" stroke-width="0.8" stroke-linecap="round"/>

          <!-- Faint East & West wings -->
          <polygon points="18,22 13,22 18,20" fill="rgba(148, 163, 184, 0.2)"/>
          <polygon points="18,22 13,22 18,24" fill="rgba(100, 116, 139, 0.2)"/>
          <polygon points="18,22 23,22 18,20" fill="rgba(148, 163, 184, 0.2)"/>
          <polygon points="18,22 23,22 18,24" fill="rgba(100, 116, 139, 0.2)"/>

          <!-- North Needle (Red: bright red left, shaded red right) -->
          <polygon points="18,9 15,22 18,22" fill="#ef4444"/>
          <polygon points="18,9 21,22 18,22" fill="#b91c1c"/>

          <!-- South Needle (Gray: light slate left, slate gray right) -->
          <polygon points="18,35 15,22 18,22" fill="#94a3b8"/>
          <polygon points="18,35 21,22 18,22" fill="#64748b"/>

          <!-- Center Pivot Core -->
          <circle cx="18" cy="22" r="1.8" fill="#0f172a" stroke="#cbd5e1" stroke-width="0.8"/>
        </svg>
      </div>
    `;

    this.container.appendChild(compassEl);
  }

  private buildControls(): void {
    const ctrlEl = document.createElement('div');
    ctrlEl.className = 'ancient-map-controls';
    ctrlEl.innerHTML = `
      <div class="map-btn-group" role="group" aria-label="Map zoom controls">
        <button type="button" class="map-ctrl-btn" id="map-zoom-in" title="Zoom In (Up to 15x)" aria-label="Zoom in">+</button>
        <button type="button" class="map-ctrl-btn" id="map-zoom-out" title="Zoom Out" aria-label="Zoom out">&minus;</button>
        <button type="button" class="map-ctrl-btn" id="map-reset-view" title="Reset View" aria-label="Reset view">&#x21bb;</button>
        <button type="button" class="map-ctrl-btn" id="map-toggle-all-sites" title="Toggle All Era Artifacts" aria-label="Toggle all era artifacts">✨</button>
      </div>
    `;

    ctrlEl.querySelector('#map-zoom-in')?.addEventListener('click', () => this.map.zoomIn());
    ctrlEl.querySelector('#map-zoom-out')?.addEventListener('click', () => this.map.zoomOut());
    ctrlEl.querySelector('#map-reset-view')?.addEventListener('click', () => this.resetView());
    ctrlEl.querySelector('#map-toggle-all-sites')?.addEventListener('click', () => {
      this.showAllSites = !this.showAllSites;
      const btn = ctrlEl.querySelector('#map-toggle-all-sites') as HTMLElement | null;
      if (btn) {
        btn.classList.toggle('active', this.showAllSites);
        btn.title = this.showAllSites ? 'Showing All Era Artifacts (Click for Chapter Only)' : 'Showing Chapter Epoch Artifacts (Click for All)';
      }
      this.renderActiveEra();
    });

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

  public highlightGeographicPlace(entity: BiblicalGeographicEntity): void {
    this.map.flyTo([entity.coords.lat, entity.coords.lng], entity.zoom || 9, { duration: 1.0 });

    const popupContent = `
      <div class="map-leaflet-tooltip geo-callout-tooltip" style="min-width: 200px; max-width: 280px;">
        <span class="tooltip-badge">BIBLICAL GEOGRAPHY · ${entity.ancientRegion.toUpperCase()}</span>
        <div style="color: #d4af37; font-weight: 700; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.15rem; margin: 3px 0 2px;">${entity.name}</div>
        <p style="font-size: 0.78rem; color: #f1f5f9; margin: 4px 0 6px; line-height: 1.45;">${entity.note}</p>
        ${entity.scriptureRef ? `<div style="font-size: 0.72rem; color: #38bdf8; border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 4px;"><strong>Scripture:</strong> ${entity.scriptureRef}</div>` : ''}
      </div>
    `;

    L.popup({
      className: 'map-leaflet-popup',
      closeButton: true,
      autoClose: true
    })
      .setLatLng([entity.coords.lat, entity.coords.lng])
      .setContent(popupContent)
      .openOn(this.map);
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
        : WORLD_EMPIRES_GEO.filter(emp =>
            emp.id === this.activeEra.rulingEmpireId ||
            (this.activeEra.additionalRegionIds && this.activeEra.additionalRegionIds.includes(emp.id))
          );

      for (const empire of targetEmpires) {
        const latLngs = empire.approximateBounds.map(b => [b.lat, b.lng] as L.LatLngTuple);
        const polygon = L.polygon(latLngs, {
          color: empire.color,
          fillColor: empire.color,
          fillOpacity: 0.14,
          weight: 1.8,
          dashArray: '6, 6'
        });

        const relevance = getEmpireRelevanceNote(empire.id, this.activeEra.id, empire);

        polygon.bindTooltip(`
          <div class="map-leaflet-tooltip empire-tooltip">
            <div class="tooltip-title" style="color: #d4af37; font-weight: 700; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.05rem; margin-bottom: 2px;">${empire.name}</div>
            <div class="tooltip-dates" style="color: #a0aab8; font-size: 0.78rem; margin-bottom: 6px; font-family: var(--font-mono, monospace);">${empire.dateRange}</div>
            <div class="tooltip-relevance" style="color: #e2e8f0; font-size: 0.75rem; line-height: 1.45; border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 5px;">
              <strong style="color: #ffd700;">Chapter Relevance:</strong> ${relevance}
            </div>
          </div>
        `, {
          className: 'map-leaflet-tooltip',
          sticky: true,
          opacity: 0.98
        });

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
        `, { className: 'map-leaflet-tooltip', sticky: true, opacity: 0.98 });

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
          dot.bindTooltip(`<strong>${stop.name}</strong>${stop.note ? `<br/><em>${stop.note}</em>` : ''}`, { className: 'map-leaflet-tooltip' });
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
        `, { className: 'map-leaflet-tooltip' });

        marker.on('click', () => {
          if (this.options.onSelectCity) {
            this.options.onSelectCity(city);
          }
        });

        this.cityLayerGroup.addLayer(marker);
      }
    }

    // 4. Archaeological Discovery Sites (Filtered by active chapter era + radial micro-jitter offset)
    if (this.layers.archaeology) {
      const sitesToRender = (isAll || this.showAllSites)
        ? ARCHAEOLOGICAL_SITES
        : ARCHAEOLOGICAL_SITES.filter(s => this.activeEra.activeSiteIds.includes(s.id));

      // Group nearby markers within < 0.12 deg distance to avoid overlapping stacks in Jerusalem
      const clusters: Array<ArchaeologicalSite[]> = [];
      for (const site of sitesToRender) {
        let placed = false;
        for (const cluster of clusters) {
          const rep = cluster[0];
          const dLat = rep.coords.lat - site.coords.lat;
          const dLng = rep.coords.lng - site.coords.lng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          if (dist < 0.12) {
            cluster.push(site);
            placed = true;
            break;
          }
        }
        if (!placed) {
          clusters.push([site]);
        }
      }

      // Compute radial offsets for clusters with multiple overlapping markers
      const sitesWithOffset: Array<{ site: ArchaeologicalSite; displayCoords: GeoCoordinate; isCluster: boolean }> = [];
      for (const cluster of clusters) {
        if (cluster.length === 1) {
          sitesWithOffset.push({ site: cluster[0], displayCoords: cluster[0].coords, isCluster: false });
        } else {
          const total = cluster.length;
          cluster.forEach((site, idx) => {
            const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
            const radius = 0.045; // ~5 km visual offset to separate cleanly
            const lat = site.coords.lat + Math.sin(angle) * radius;
            const lng = site.coords.lng + (Math.cos(angle) * radius) / Math.cos((lat * Math.PI) / 180);
            sitesWithOffset.push({ site, displayCoords: { lat, lng }, isCluster: true });
          });
        }
      }

      for (const item of sitesWithOffset) {
        const site = item.site;
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

        const marker = L.marker([item.displayCoords.lat, item.displayCoords.lng], {
          icon: goldIcon,
          zIndexOffset: 1000
        });

        marker.bindTooltip(`
          <div class="map-leaflet-tooltip gold-tooltip" style="min-width: 220px; max-width: 320px;">
            <span class="tooltip-badge">SURVIVING ARTIFACT · ${site.ancientRegion.toUpperCase()}</span>
            <div class="tooltip-title" style="color: #ffd700; font-weight: 700; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.05rem; margin-bottom: 2px;">${site.artifactName}</div>
            <div style="color: #cbd5e1; font-size: 0.78rem; margin-bottom: 4px;">${site.name} · ${site.artifactDate}</div>
            <div class="tooltip-scripture-connection" style="margin-top: 5px; padding: 5px 8px; background: rgba(212, 175, 55, 0.12); border-left: 2px solid #d4af37; border-radius: 3px; font-size: 0.74rem; color: #fef08a; line-height: 1.35;">
              <strong>✦ Scripture Connection:</strong><br/>
              ${site.scriptureConnection}
            </div>
            <span class="tooltip-cta" style="margin-top: 6px; display: block; color: #38bdf8; font-size: 0.74rem;">Click to view discovery card in companion panel &rarr;</span>
          </div>
        `, {
          className: 'map-leaflet-tooltip',
          opacity: 0.98
        });

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
