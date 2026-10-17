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
  type BiblicalGeographicEntity,
  type FactionType
} from '../data/ancientMapData';

export interface AncientMapOptions {
  container: HTMLElement;
  compact?: boolean;
  initialEraId?: string;
  onSelectSite?: (site: ArchaeologicalSite) => void;
  onSelectCity?: (city: BiblicalCity) => void;
  onSelectEmpire?: (empire: WorldEmpireRegion) => void;
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
    if (empireId === 'moab_kingdom') {
      return 'Transjordan kingdom directly east of Dead Sea; King Mesha rebelled against Israel after Ahab died (2 Kings 1:1, 3:4–27; Mesha Stele).';
    }
    if (empireId === 'aram_damascus') {
      return 'Syrian adversary centered at Damascus; waged continuous frontier wars against Israel and Judah under Ben-hadad II and Hazael.';
    }
    if (empireId === 'philistia') {
      return 'Coastal pentapolis; Ahaziah sent royal messengers to inquire of Baal-zebub the god of Ekron in 2 Kings 1:2.';
    }
    if (empireId === 'edom_kingdom') {
      return 'Mountainous kingdom of Esau; marched in alliance with Judah and Israel during the punitive expedition against Moab in 2 Kings 3.';
    }
    if (empireId === 'assyria') {
      return "Regional northern superpower; Shalmaneser III marches westward and extracts tribute following Ahab's death (Black Obelisk).";
    }
    if (empireId === 'phoenicia') {
      return 'Allied maritime trading power; cultural and religious influence via Jezebel of Tyre/Sidon.';
    }
    if (empireId === 'kush_nubia') {
      return 'Formidable kingdom of Upper Nile / Nubia; burgeoning power along the Nile south of Egypt; renowned for archers and cavalry.';
    }
    if (empireId === 'kingdom_sheba') {
      return 'Wealthy South Arabian trade kingdom; maintained gold and incense caravan routes to Jerusalem established during Solomon\'s reign.';
    }
    if (empireId === 'china_zhou') {
      return 'Western Zhou Dynasty along the Yellow River; contemporary global superpower and origin of the silk trade network (Land of Sinim, Isaiah 49:12).';
    }
    if (empireId === 'scythia_steppes') {
      return 'Nomadic equestrian confederation of the northern Eurasian steppes; identified in Ezekiel 38–39 as the far northern horsemen.';
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
    if (empireId === 'aram_damascus') {
      return 'Hazael of Damascus oppresses Israel and marches as far as Gath, exacting heavy tribute from King Jehoash of Judah (2 Kings 12:17).';
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
      return 'Sennacherib invades 46 fortified cities of Judah and besieges Hezekiah in Jerusalem like a "caged bird" (701 BC; Taylor Prism).';
    }
    if (empireId === 'judah') {
      return 'Hezekiah excavates the Siloam Tunnel and trusts the LORD; the Angel of the LORD strikes 185,000 Assyrian soldiers.';
    }
    if (empireId === 'kush_nubia') {
      return 'Under Pharaoh Tirhakah (Taharqa, 25th Nubian Dynasty), Kush marched out to confront Sennacherib, relieving Jerusalem (2 Kings 19:9, Isaiah 37:9).';
    }
    if (empireId === 'babylon') {
      return 'Chaldean king Merodach-baladan rebels against Assyria and sends envoys to Hezekiah after his illness (2 Kings 20:12, Isaiah 39).';
    }
  } else if (eraId === 'babylonian_exile') {
    if (empireId === 'babylon') {
      return 'Nebuchadnezzar captures Jerusalem, burns Solomon\'s Temple (586 BC), and deports Judah into 70 years of exile.';
    }
    if (empireId === 'judah') {
      return 'Jerusalem lies desolate; faithful remnant survives; Daniel and Ezekiel prophesy in Babylonian exile.';
    }
    if (empireId === 'media') {
      return 'Allied with Babylon to overthrow Nineveh in 612 BC; ruled the Iranian plateau under Cyaxares and Astyages.';
    }
    if (empireId === 'saite_egypt') {
      return 'Pharaoh Necho and Hophra battle Babylon; defeated at Carchemish; refuge where Jeremiah was taken.';
    }
  } else if (eraId === 'persian_restoration') {
    if (empireId === 'persia') {
      return 'Cyrus the Great conquers Babylon (539 BC) and issues the decree allowing the Jewish exiles to rebuild the Temple in Jerusalem (Ezra 1; Cyrus Cylinder).';
    }
    if (empireId === 'judah') {
      return 'Yehud Medinata province; Zerubbabel, Joshua, Ezra, and Nehemiah rebuild the Second Temple and Jerusalem\'s walls.';
    }
    if (empireId === 'india_maurya') {
      return 'Easternmost satrapy of the Persian realm; designated "Hoddu" in Esther 1:1 ("from India even unto Ethiopia").';
    }
  } else if (eraId === 'roman_christ' || eraId === 'apostolic_church') {
    if (empireId === 'rome') {
      return 'Imperial superpower; Caesar Augustus decrees the census; Pontius Pilate condemns Christ; highways facilitate Gospel proclamation.';
    }
    if (empireId === 'judah') {
      return 'Roman Judea & Galilee; birthplace, earthly ministry, crucifixion, and resurrection of our Lord Jesus Christ.';
    }
    if (empireId === 'parthia') {
      return 'Eastern rival of Rome beyond the Euphrates; pilgrims from Parthia heard the Gospel at Pentecost in Jerusalem (Acts 2:9).';
    }
    if (empireId === 'china_han') {
      return 'Imperial Han Dynasty at the eastern terminus of the Silk Road; prophesied in Isaiah 49:12 as the Land of Sinim.';
    }
    if (empireId === 'kush_nubia') {
      return 'Kingdom of Meroë in Upper Nile / Ethiopia ruled by Queen Candace; her royal treasurer baptized by Philip (Acts 8:27).';
    }
    if (empireId === 'nabataea') {
      return 'Sandstone fortress kingdom of Petra; King Aretas IV\'s governor guarded Damascus to apprehend Paul (2 Corinthians 11:32).';
    }
  }

  // Fallback defaults for global civilizations
  if (empireId === 'china_zhou' || empireId === 'china_han') {
    return 'Contemporary eastern world power along the Yellow and Yangtze rivers; terminus of the ancient Silk Road designated biblically as the Land of Sinim (Isaiah 49:12).';
  }
  if (empireId === 'scythia_steppes') {
    return 'Nomadic equestrian federation of the northern Eurasian steppes; identified in Ezekiel 38–39 as the far northern horsemen of Magog, Meshech, and Tubal.';
  }
  if (empireId === 'kush_nubia') {
    return 'Ancient Nilotic empire of Cush south of Egypt; major biblical synchronies under Pharaoh Tirhakah (2 Kings 19:9) and Queen Candace (Acts 8:27).';
  }
  if (empireId === 'india_maurya') {
    return 'Vast Indian subcontinent civilization designated "Hoddu" in Esther 1:1 & 8:9 ("from India even unto Ethiopia").';
  }
  if (empireId === 'kingdom_sheba') {
    return 'Sabaean trading kingdom of Southern Arabia; renowned for frankincense, spices, and the Queen of Sheba\'s visit to King Solomon (1 Kings 10:1–13).';
  }
  if (empireId === 'moab_kingdom') {
    return 'Transjordan kingdom of King Mesha east of the Dead Sea; rebelled against Israel following King Ahab\'s death (2 Kings 1:1, 3:4–27).';
  }
  if (empireId === 'aram_damascus') {
    return 'Syrian kingdom centered at Damascus; frequent military adversary and regional rival of Israel and Judah under Ben-hadad and Hazael.';
  }
  if (empireId === 'philistia') {
    return 'Coastal confederacy of 5 royal cities (Gaza, Ashkelon, Ashdod, Gath, Ekron); cult of Baal-zebub at Ekron in 2 Kings 1:2.';
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
      minZoom: 2,
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

    // 5. Zero-Collision Event Handlers
    this.map.on('movestart', () => this.closeActiveTooltip());
    this.map.on('zoomstart', () => this.closeActiveTooltip());
    this.map.on('click', () => this.closeActiveTooltip());
    this.container.addEventListener('mouseleave', () => this.closeActiveTooltip());

    // 6. Initial Render
    this.renderActiveEra();

    // Handle container resize
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  // Singleton Active Tooltip Tracking across all layers
  private activeTooltipLayer: L.Layer | null = null;

  public closeActiveTooltip(): void {
    if (this.activeTooltipLayer) {
      try {
        this.activeTooltipLayer.closeTooltip();
      } catch {
        // Safe fallback
      }
      this.activeTooltipLayer = null;
    }
    // Also remove any rogue unclosed tooltips in the Leaflet tooltip pane
    try {
      const tooltipPane = this.map.getPane('tooltipPane');
      if (tooltipPane) {
        const rogueTooltips = tooltipPane.querySelectorAll('.leaflet-tooltip');
        rogueTooltips.forEach(t => t.remove());
      }
    } catch {
      // Safe fallback
    }
  }

  public bindManagedTooltip(layer: L.Layer, content: string, options?: L.TooltipOptions): void {
    const defaultOptions: L.TooltipOptions = {
      className: 'map-leaflet-tooltip',
      opacity: 0.98,
      direction: 'top',
      offset: [0, -8],
      sticky: false,
      ...options
    };

    layer.bindTooltip(content, defaultOptions);

    layer.on('mouseover', () => {
      if (this.activeTooltipLayer && this.activeTooltipLayer !== layer) {
        try {
          this.activeTooltipLayer.closeTooltip();
        } catch {
          // ignore
        }
      }
      this.activeTooltipLayer = layer;
    });

    layer.on('mouseout', () => {
      if (this.activeTooltipLayer === layer) {
        this.activeTooltipLayer = null;
      }
    });
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
      all: 3,
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
    this.closeActiveTooltip();
    this.empireLayerGroup.clearLayers();
    this.routeLayerGroup.clearLayers();
    this.cityLayerGroup.clearLayers();
    this.siteLayerGroup.clearLayers();

    const isAll = this.activeEra.id === 'all';
    const targetEmpires = isAll
      ? WORLD_EMPIRES_GEO
      : WORLD_EMPIRES_GEO.filter(emp =>
          emp.id === this.activeEra.rulingEmpireId ||
          (this.activeEra.additionalRegionIds && this.activeEra.additionalRegionIds.includes(emp.id)) ||
          (emp.eraIds && emp.eraIds.includes(this.activeEra.id))
        );
    const activeCapitalNames = new Set(targetEmpires.map(emp => emp.capital?.name.toLowerCase()).filter(Boolean));

    // 1. World Empires & Global Civilizations (Filtered strictly by era so empires never clash!)
    if (this.layers.empires) {
      // Z-Index ordering by area descending:
      // Macro empires (millions of km²) render FIRST (in background).
      // Smaller focal kingdoms (Judah, Israel, Phoenicia, Moab, etc.) render LAST (in foreground on top).
      const parseArea = (areaStr?: string): number => {
        if (!areaStr) return 0;
        const num = parseFloat(areaStr.replace(/[^0-9.]/g, ''));
        if (areaStr.includes('M') || areaStr.includes('million')) return num * 1_000_000;
        if (areaStr.includes('k')) return num * 1_000;
        return num || 0;
      };

      const sortedEmpires = [...targetEmpires].sort((a, b) => {
        return parseArea(b.approximateArea) - parseArea(a.approximateArea);
      });

      const badgeMap: Record<FactionType, { text: string; bg: string; color: string; border: string }> = {
        covenant: { text: 'COVENANT NATION · ROYAL DAVIDIC LINE', bg: 'rgba(234, 179, 8, 0.2)', color: '#fde047', border: 'rgba(234, 179, 8, 0.5)' },
        israel: { text: 'NORTHERN KINGDOM · 10 TRIBES', bg: 'rgba(34, 197, 94, 0.2)', color: '#86efac', border: 'rgba(34, 197, 94, 0.5)' },
        hostile: { text: 'HOSTILE EMPIRE / ENEMY', bg: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: 'rgba(239, 68, 68, 0.5)' },
        allied: { text: 'ALLIED / FRIENDLY REGION', bg: 'rgba(56, 189, 248, 0.2)', color: '#7dd3fc', border: 'rgba(56, 189, 248, 0.5)' },
        global_power: { text: 'CONTEMPORARY WORLD CIVILIZATION', bg: 'rgba(192, 132, 252, 0.2)', color: '#e9d5ff', border: 'rgba(192, 132, 252, 0.5)' }
      };

      for (const empire of sortedEmpires) {
        const latLngs = empire.approximateBounds.map(b => [b.lat, b.lng] as L.LatLngTuple);
        const defaultStyle: L.PathOptions = {
          color: empire.color,
          fillColor: empire.fillColor || empire.color,
          fillOpacity: 0.16,
          weight: 1.8,
          dashArray: '6, 6'
        };
        const hoverStyle: L.PathOptions = {
          color: '#ffd700',
          fillColor: empire.fillColor || empire.color,
          fillOpacity: 0.32,
          weight: 2.8,
          dashArray: undefined
        };

        const polygon = L.polygon(latLngs, defaultStyle);

        polygon.on('mouseover', () => {
          polygon.setStyle(hoverStyle);
          polygon.bringToFront();
        });
        polygon.on('mouseout', () => {
          polygon.setStyle(defaultStyle);
        });
        polygon.on('click', () => {
          if (this.options.onSelectEmpire) {
            this.options.onSelectEmpire(empire);
          }
        });

        const relevance = getEmpireRelevanceNote(empire.id, this.activeEra.id, empire);
        const faction = empire.factionCategory || 'global_power';
        const badge = badgeMap[faction] || badgeMap.global_power;

        const tooltipHtml = `
          <div class="map-leaflet-tooltip empire-tooltip" style="min-width: 220px; max-width: 310px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px;">
              <span class="tooltip-badge" style="background: ${badge.bg}; color: ${badge.color}; border: 1px solid ${badge.border}; font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 3px;">${badge.text}</span>
              <span style="font-size: 0.72rem; color: #94a3b8; font-family: var(--font-mono, monospace);">${empire.dateRange}</span>
            </div>
            <div class="tooltip-title" style="color: #ffd700; font-weight: 700; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.15rem; margin-bottom: 4px;">${empire.name}</div>
            
            <div style="font-size: 0.78rem; color: #cbd5e1; margin-bottom: 5px; display: grid; grid-template-columns: auto 1fr; gap: 2px 8px; line-height: 1.35;">
              <span style="color: #94a3b8;">👑 Capital:</span><strong style="color: #f1f5f9;">${empire.capital.name}</strong>
              <span style="color: #94a3b8;">👥 Est. Pop:</span><span style="color: #f1f5f9;">${empire.populationEstimate}</span>
              <span style="color: #94a3b8;">📐 Extent:</span><span style="color: #f1f5f9;">${empire.approximateArea}</span>
            </div>

            <div class="tooltip-relevance" style="color: #e2e8f0; font-size: 0.75rem; line-height: 1.4; border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 4px; margin-top: 4px;">
              <strong style="color: #ffd700;">Chapter Relevance:</strong> ${relevance}
            </div>
            ${empire.biblicalIntersection && empire.biblicalIntersection !== relevance ? `
              <div style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed rgba(255, 255, 255, 0.1); font-size: 0.72rem; color: #93c5fd; line-height: 1.3;">
                <strong>✦ Scripture Connection:</strong> ${empire.biblicalIntersection}
              </div>
            ` : ''}
            <div class="tooltip-cta" style="margin-top: 5px; color: #38bdf8; font-size: 0.72rem; border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 4px;">
              Click kingdom to view historical dossier in drawer &rarr;
            </div>
          </div>
        `;

        this.bindManagedTooltip(polygon, tooltipHtml, { direction: 'top', offset: [0, -10] });
        this.empireLayerGroup.addLayer(polygon);

        // Prominent Imperial Capital Pin / Label
        if (empire.capital && empire.capital.coords) {
          let dirClass = '';
          if (empire.id === 'philistia' || empire.id === 'phoenicia' || (empire.capital.coords.lng < 35.1 && empire.capital.coords.lat < 32.0)) {
            dirClass = 'label-west';
          } else if (empire.id === 'judah' || empire.id === 'edom_kingdom') {
            dirClass = 'label-south';
          } else if (empire.id === 'israel_kingdom') {
            dirClass = 'label-north';
          }

          const labelClass = `capital-marker-label ${dirClass}`.trim();
          const isFocalRealm = empire.factionCategory === 'covenant' || empire.factionCategory === 'israel';
          const capZIndex = isFocalRealm ? 1500 : 1200;

          const capIcon = L.divIcon({
            className: 'leaflet-capital-marker',
            html: `
              <div class="capital-marker-dot" style="background: ${empire.color}; border: 1.5px solid #ffffff; box-shadow: 0 0 8px ${empire.color}; width: 8px; height: 8px; border-radius: 50%;"></div>
              <div class="${labelClass}">${empire.capital.name}</div>
            `,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });
          const capMarker = L.marker([empire.capital.coords.lat, empire.capital.coords.lng], {
            icon: capIcon,
            zIndexOffset: capZIndex
          });

          capMarker.on('click', () => {
            if (this.options.onSelectEmpire) {
              this.options.onSelectEmpire(empire);
            }
          });

          const capitalTooltipHtml = `
            <div class="map-leaflet-tooltip capital-tooltip" style="min-width: 220px; max-width: 300px;">
              <span class="tooltip-badge" style="background: ${badge.bg}; color: ${badge.color}; border: 1px solid ${badge.border}; font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 3px;">CAPITAL · ${badge.text}</span>
              <div style="color: #ffd700; font-weight: 700; font-size: 1.05rem; margin: 3px 0 2px;">${empire.capital.name}</div>
              <div style="color: #cbd5e1; font-size: 0.78rem;">Imperial Seat of ${empire.name}</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 3px;">👥 Population: ${empire.populationEstimate}</div>
              <div style="font-size: 0.75rem; color: #94a3b8;">📐 Kingdom Extent: ${empire.approximateArea}</div>
              <div style="font-size: 0.73rem; color: #38bdf8; margin-top: 4px; border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 4px;"><strong>✦ Biblical Connection:</strong> ${empire.biblicalIntersection}</div>
            </div>
          `;

          this.bindManagedTooltip(capMarker, capitalTooltipHtml, { direction: 'top', offset: [0, -12] });
          this.empireLayerGroup.addLayer(capMarker);
        }
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

        const routeTooltipHtml = `
          <div class="map-leaflet-tooltip">
            <strong>${route.name}</strong><br/>
            <span>${route.scriptureRef}</span>
          </div>
        `;
        this.bindManagedTooltip(polyline, routeTooltipHtml, { direction: 'top' });

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
          const stopTooltipHtml = `<strong>${stop.name}</strong>${stop.note ? `<br/><em>${stop.note}</em>` : ''}`;
          this.bindManagedTooltip(dot, stopTooltipHtml, { direction: 'top', offset: [0, -6] });
          this.routeLayerGroup.addLayer(dot);
        }
      }
    }

    // 3. Biblical Cities
    if (this.layers.cities) {
      for (const city of BIBLICAL_CITIES) {
        // Skip if this city is already prominently rendered as an active imperial capital
        if (activeCapitalNames.has(city.name.toLowerCase())) {
          continue;
        }

        const cityIcon = L.divIcon({
          className: 'leaflet-city-marker',
          html: `<div class="city-marker-dot"></div><div class="city-marker-label">${city.name}</div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5]
        });

        const marker = L.marker([city.coords.lat, city.coords.lng], {
          icon: cityIcon,
          zIndexOffset: 500
        });

        const cityTooltipHtml = `
          <div class="map-leaflet-tooltip">
            <span class="tooltip-badge">BIBLICAL CITY</span>
            <strong>${city.name}</strong><br/>
            <em>&ldquo;${city.hitchcockMeaning}&rdquo;</em><br/>
            <small>${city.scriptureAnchor}</small>
          </div>
        `;
        this.bindManagedTooltip(marker, cityTooltipHtml, { direction: 'top', offset: [0, -8] });

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
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([item.displayCoords.lat, item.displayCoords.lng], {
          icon: goldIcon,
          zIndexOffset: 1600
        });

        const siteTooltipHtml = `
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
        `;
        this.bindManagedTooltip(marker, siteTooltipHtml, { direction: 'top', offset: [0, -14] });

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
