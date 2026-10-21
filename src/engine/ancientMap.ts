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
import { getArtifactDisplay, isArtifactReviewed } from '../data/evidenceReceipts';

import {
  ARCHAEOLOGICAL_SITES,
  BIBLICAL_CITIES,
  BIBLICAL_ROUTES,
  WORLD_EMPIRES_GEO,
  CHRONOLOGICAL_ERAS,
  GRANULAR_TIMELINE_FILTERS,
  REGION_PRESETS,
  WATER_FEATURES,
  CONTESTED_FRONTIER_ZONES,
  calculatePolygonGeodesicArea,
  doPolygonsOverlap,
  type GeoCoordinate,
  type ArchaeologicalSite,
  type BiblicalCity,
  type BiblicalRoute,
  type BiblicalRouteStop,
  type WorldEmpireRegion,
  type ContestedFrontierZone,
  type ChronologicalEra,
  type GranularTimelineFilter,
  type BiblicalGeographicEntity,
  type FactionType
} from '../data/ancientMapData';

export interface AncientMapOptions {
  container: HTMLElement;
  compact?: boolean;
  initialEraId?: string;
  /** Atlas-only presentation; companion maps retain their defaults. */
  readingMode?: boolean;
  initialLayers?: Partial<Record<'archaeology' | 'empires' | 'routes' | 'cities' | 'rivers', boolean>>;
  onSelectSite?: (site: ArchaeologicalSite) => void;
  onSelectCity?: (city: BiblicalCity) => void;
  onSelectEmpire?: (empire: WorldEmpireRegion) => void;
  onSelectRouteStop?: (route: BiblicalRoute, stop?: BiblicalRouteStop, stopIndex?: number) => void;
  onEraChange?: (era: ChronologicalEra) => void;
  onGranularFilterChange?: (filter: GranularTimelineFilter | null) => void;
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

/**
 * Smooths polygon coordinates using Chaikin's corner-cutting algorithm.
 * Converts angular, low-vertex borders into organic, curvilinear historical frontiers.
 */
export function smoothPolygonCoordinates(coords: GeoCoordinate[], iterations: number = 2): GeoCoordinate[] {
  if (!coords || coords.length < 3) return coords || [];
  let current = coords;
  for (let iter = 0; iter < iterations; iter++) {
    const next: GeoCoordinate[] = [];
    const len = current.length;
    for (let i = 0; i < len; i++) {
      const p0 = current[i];
      const p1 = current[(i + 1) % len];
      next.push({
        lat: 0.75 * p0.lat + 0.25 * p1.lat,
        lng: 0.75 * p0.lng + 0.25 * p1.lng
      });
      next.push({
        lat: 0.25 * p0.lat + 0.75 * p1.lat,
        lng: 0.25 * p0.lng + 0.75 * p1.lng
      });
    }
    current = next;
  }
  return current;
}

export { calculatePolygonGeodesicArea };

export class AncientMapCanvas {
  public map: L.Map;
  private container: HTMLElement;
  private options: AncientMapOptions;

  // Active Layers
  private tileLayer: L.TileLayer;
  private waterLayerGroup: L.LayerGroup;
  private empireLayerGroup: L.LayerGroup;
  private siteLayerGroup: L.LayerGroup;
  private routeLayerGroup: L.LayerGroup;
  private cityLayerGroup: L.LayerGroup;
  private tileOfflineNoticeShown = false;

  // Active Chronological State
  public activeEra: ChronologicalEra;
  public showAllSites: boolean = false;
  public activeGranularFilterId: string | null = null;
  public activeRouteOverrideIds: string[] | null = null;
  public activeRouteStopSelection: { routeId: string; stopIndex: number } | null = null;
  public focusedStopOnly = false;
  private routeStopMarkersMap: Map<string, L.Marker[]> = new Map();
  private activeFocusMarker: L.Marker | null = null;

  // Layer Toggles
  public layers: Record<string, boolean> = {
    archaeology: true,
    empires: true,
    routes: true,
    cities: true,
    rivers: true,
  };

  constructor(options: AncientMapOptions) {
    this.options = options;
    Object.assign(this.layers, options.initialLayers);
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
    const initialZoom = options.compact ? 5 : initialEra.focusZoom;
    const initialCenter = options.compact ? [32.3, 35.6] : [initialEra.focusCenter.lat, initialEra.focusCenter.lng];

    this.map = L.map(this.container, {
      center: initialCenter as L.LatLngExpression,
      zoom: initialZoom,
      minZoom: 2,
      maxZoom: 15,
      zoomControl: false, // We render custom zoom controls
      attributionControl: !!options.readingMode
    });

    if (this.map.attributionControl) {
      this.map.attributionControl.setPrefix('<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">Leaflet</a>');
    }

    // 2. High-Resolution Basemap: Esri World Dark Gray Base (clean, dark, watermark-free)
    this.tileLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 15,
      maxNativeZoom: 13,
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
    }).addTo(this.map);

    this.tileLayer.on('tileerror', () => {
      if (!this.tileOfflineNoticeShown) {
        this.tileOfflineNoticeShown = true;
        const badge = document.createElement('div');
        badge.className = 'map-offline-tile-badge';
        badge.style.cssText = 'position:absolute;bottom:10px;left:10px;z-index:900;background:rgba(15,23,42,0.88);border:1px solid rgba(212,175,55,0.4);color:#cbd5e1;font-size:11px;padding:4px 8px;border-radius:4px;pointer-events:none;';
        badge.textContent = 'Offline Vector Cartography Mode (Base tiles unreachable)';
        this.container.appendChild(badge);
      }
    });

    // 3. Dedicated 4-Tier Interactive Z-Ordered Map Panes:
    // Tier 1 (Topmost): Points & Items (Stops: 620, Sites & Capitals: 580, Cities: 550)
    // Tier 2: Paths & Linear Features (Routes & Roads: 480, Rivers & Streams: 460)
    // Tier 3: Smaller Regions & Inland Lakes (Lakes: 420)
    // Tier 4 (Bottom-most): Macro Region Polygons (Empires & Kingdoms: 390, Ocean Typography: 370)
    // Overlays: Tooltips (750), Popups (800)
    const createManagedPane = (name: string, zIndex: number, extraClass?: string): HTMLElement => {
      const pane = this.map.getPane(name) || this.map.createPane(name);
      pane.style.zIndex = String(zIndex);
      if (extraClass) pane.classList.add(extraClass);
      return pane;
    };
    createManagedPane('waterPane', 370, 'leaflet-water-pane');
    createManagedPane('empirePane', 390, 'leaflet-empire-pane');
    createManagedPane('lakePane', 420, 'leaflet-lake-pane');
    createManagedPane('riverPane', 460, 'leaflet-river-pane');
    createManagedPane('routePane', 480, 'leaflet-route-pane');
    createManagedPane('cityPane', 550, 'leaflet-city-pane');
    createManagedPane('capitalPane', 570, 'leaflet-capital-pane');
    createManagedPane('routeStopPane', 620, 'leaflet-routeStop-pane');
    createManagedPane('sitePane', 620, 'leaflet-site-pane');
    createManagedPane('tooltipPane', 750, 'leaflet-tooltip-pane');
    createManagedPane('popupPane', 800, 'leaflet-popup-pane');

    // 4. Layer Groups
    this.waterLayerGroup = L.layerGroup().addTo(this.map);
    this.empireLayerGroup = L.layerGroup().addTo(this.map);
    this.routeLayerGroup = L.layerGroup().addTo(this.map);
    this.cityLayerGroup = L.layerGroup().addTo(this.map);
    this.siteLayerGroup = L.layerGroup().addTo(this.map);

    // 5. Custom On-Map UI: Ornate Compass Rose + Controls + Year HUD
    this.buildCompassRose();
    this.buildControls();
    this.buildYearHud();

    // 6. Zero-Collision Event Handlers
    this.map.on('movestart', () => this.closeActiveTooltip());
    this.map.on('zoomstart', () => this.closeActiveTooltip());
    this.map.on('click', () => this.closeActiveTooltip());
    this.map.on('zoomend moveend viewreset', () => {
      this.syncZoomClasses();
      this.scheduleLabelDeconfliction();
    });
    this.map.on('tooltipopen', (e: L.TooltipEvent) => {
      this.constrainTooltipToViewport(e.tooltip);
    });
    this.container.addEventListener('mouseleave', () => this.closeActiveTooltip());

    // 7. Initial Render
    this.renderActiveEra();

    // Handle container resize
    setTimeout(() => {
      this.map.invalidateSize();
      this.scheduleLabelDeconfliction();
    }, 200);

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        if (this.map) {
          this.map.invalidateSize();
          this.scheduleLabelDeconfliction();
        }
      });
      resizeObserver.observe(this.container);
    }
  }

  private syncZoomClasses(): void {
    const zoom = this.map ? this.map.getZoom() : 5;
    this.container.classList.toggle('map-zoom-detailed', zoom >= 8);
    this.container.classList.toggle('map-zoom-macro', zoom < 6);
  }

  // Singleton Active Tooltip Tracking across all layers
  private activeTooltipLayer: L.Layer | null = null;
  private activeHoveredPolygon: { poly: L.Polygon; defaultStyle: L.PathOptions } | null = null;
  private labelDeconflictTimer: number | null = null;

  // ---------------------------------------------------------------------------
  // External Floating Callout & Pointer Line
  // (Prevents popups from trapping inside the map or covering the cursor)
  // ---------------------------------------------------------------------------
  private static sharedCalloutEl: HTMLElement | null = null;
  private static sharedConnectorSvg: SVGSVGElement | null = null;
  private activeCalloutLayer: L.Layer | null = null;

  private getOrCreateExternalCallout(): { card: HTMLElement; svg: SVGSVGElement } {
    if (!AncientMapCanvas.sharedCalloutEl) {
      const card = document.createElement('div');
      card.id = 'map-external-floating-callout';
      card.className = 'map-external-callout leaflet-tooltip map-leaflet-tooltip';
      card.setAttribute('role', 'tooltip');
      card.setAttribute('aria-hidden', 'true');
      card.style.display = 'none';
      document.body.appendChild(card);
      AncientMapCanvas.sharedCalloutEl = card;
    }

    if (!AncientMapCanvas.sharedConnectorSvg) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('id', 'map-callout-connector-svg');
      svg.setAttribute('class', 'map-callout-connector-svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.position = 'fixed';
      svg.style.inset = '0';
      svg.style.width = '100vw';
      svg.style.height = '100vh';
      svg.style.pointerEvents = 'none';
      svg.style.zIndex = '99998';
      svg.style.display = 'none';
      svg.innerHTML = `
        <defs>
          <filter id="map-callout-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path class="map-connector-curve" fill="none" stroke="#d4af37" stroke-width="1.8" stroke-dasharray="4, 3" filter="url(#map-callout-glow)" />
        <circle class="map-connector-dot" r="4.5" fill="#ffd700" stroke="#ffffff" stroke-width="1.5" />
        <circle class="map-connector-ring" r="9" fill="none" stroke="#ffd700" stroke-width="1.2" opacity="0.6" />
        <polygon class="map-connector-arrow" fill="#ffd700" />
      `;
      document.body.appendChild(svg);
      AncientMapCanvas.sharedConnectorSvg = svg;
    }

    return { card: AncientMapCanvas.sharedCalloutEl, svg: AncientMapCanvas.sharedConnectorSvg };
  }

  public showExternalCallout(contentHtml: string, clientX: number, clientY: number, accentColor?: string): void {
    if (typeof document === 'undefined') return;
    const { card, svg } = this.getOrCreateExternalCallout();
    card.innerHTML = contentHtml;
    card.style.display = 'block';
    card.setAttribute('aria-hidden', 'false');
    svg.style.display = 'block';

    const curve = svg.querySelector('.map-connector-curve') as SVGPathElement;
    const dot = svg.querySelector('.map-connector-dot') as SVGCircleElement;
    const ring = svg.querySelector('.map-connector-ring') as SVGCircleElement;
    const arrow = svg.querySelector('.map-connector-arrow') as SVGPolygonElement;

    const col = (accentColor && !['#fb923c', '#60a5fa', '#38bdf8'].includes(accentColor.toLowerCase())) ? accentColor : '#d4af37';
    if (curve) curve.setAttribute('stroke', col);
    if (dot) dot.setAttribute('fill', col);
    if (ring) ring.setAttribute('stroke', col);
    if (arrow) arrow.setAttribute('fill', col);

    this.updateExternalCallout(clientX, clientY);
  }

  public updateExternalCallout(clientX: number, clientY: number): void {
    if (!AncientMapCanvas.sharedCalloutEl || !AncientMapCanvas.sharedConnectorSvg) return;
    if (AncientMapCanvas.sharedCalloutEl.style.display === 'none') return;

    const card = AncientMapCanvas.sharedCalloutEl;
    const svg = AncientMapCanvas.sharedConnectorSvg;
    const mapRect = this.container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const cardWidth = Math.min(320, cardRect.width || 300);
    const cardHeight = cardRect.height || 220;

    const spaceOnLeft = mapRect.left;
    let cardLeft: number;
    let cardTop: number;
    let anchorX: number;
    let anchorY: number;

    if (spaceOnLeft >= 260) {
      // Desktop / Companion Layout: Float the callout cleanly to the LEFT of the map container!
      // This covers the Scripture margin/edge on the left, leaving the entire map and cursor 100% uncovered!
      cardLeft = Math.max(16, mapRect.left - cardWidth - 18);
      cardTop = Math.max(70, Math.min(window.innerHeight - cardHeight - 20, clientY - (cardHeight / 2)));
      anchorX = cardLeft + cardWidth;
      anchorY = Math.max(cardTop + 24, Math.min(cardTop + cardHeight - 24, clientY));
    } else {
      // Mobile / Stacked Layout: Float directly beneath the map
      cardLeft = Math.max(12, Math.min(window.innerWidth - cardWidth - 12, mapRect.left));
      cardTop = Math.min(window.innerHeight - cardHeight - 12, mapRect.bottom + 12);
      anchorX = clientX;
      anchorY = cardTop;
    }

    card.style.left = `${cardLeft}px`;
    card.style.top = `${cardTop}px`;

    // Dynamic Leader Line from card anchor to cursor target
    const targetX = clientX;
    const targetY = clientY;

    const curve = svg.querySelector('.map-connector-curve') as SVGPathElement;
    const dot = svg.querySelector('.map-connector-dot') as SVGCircleElement;
    const ring = svg.querySelector('.map-connector-ring') as SVGCircleElement;
    const arrow = svg.querySelector('.map-connector-arrow') as SVGPolygonElement;

    if (curve) {
      if (spaceOnLeft >= 260) {
        // Horizontal Bezier curve from card right-edge to cursor with elegant arc lift
        const dx = targetX - anchorX;
        const arcLift = Math.min(24, Math.max(8, Math.abs(dx) * 0.08));
        const c1x = anchorX + (dx * 0.45);
        const c1y = anchorY - arcLift;
        const c2x = targetX - (dx * 0.45);
        const c2y = targetY - arcLift;
        curve.setAttribute('d', `M ${anchorX} ${anchorY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${targetX} ${targetY}`);
      } else {
        // Vertical curve from card top-edge to cursor
        const dy = targetY - anchorY;
        curve.setAttribute('d', `M ${anchorX} ${anchorY} C ${anchorX} ${anchorY + dy * 0.5}, ${targetX} ${targetY - dy * 0.5}, ${targetX} ${targetY}`);
      }
    }

    if (dot) {
      dot.setAttribute('cx', String(targetX));
      dot.setAttribute('cy', String(targetY));
    }
    if (ring) {
      ring.setAttribute('cx', String(targetX));
      ring.setAttribute('cy', String(targetY));
    }
    if (arrow) {
      if (spaceOnLeft >= 260) {
        arrow.setAttribute('points', `${targetX},${targetY} ${targetX - 7},${targetY - 4} ${targetX - 7},${targetY + 4}`);
      } else {
        arrow.setAttribute('points', `${targetX},${targetY} ${targetX - 4},${targetY + 7} ${targetX + 4},${targetY + 7}`);
      }
    }
  }

  public hideExternalCallout(): void {
    if (AncientMapCanvas.sharedCalloutEl) {
      AncientMapCanvas.sharedCalloutEl.style.display = 'none';
      AncientMapCanvas.sharedCalloutEl.setAttribute('aria-hidden', 'true');
    }
    if (AncientMapCanvas.sharedConnectorSvg) {
      AncientMapCanvas.sharedConnectorSvg.style.display = 'none';
    }
    this.activeCalloutLayer = null;
  }

  public closeActiveTooltip(): void {
    this.hideExternalCallout();
    if (this.activeHoveredPolygon) {
      try {
        this.activeHoveredPolygon.poly.setStyle(this.activeHoveredPolygon.defaultStyle);
      } catch {
        // Safe fallback
      }
      this.activeHoveredPolygon = null;
    }
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
    const isCompact = !!this.options.compact;

    if (isCompact) {
      const getAccent = (): string => {
        if (layer instanceof L.Polygon) {
          return (layer.options.color as string) || '#ffd700';
        }
        return '#ffd700';
      };

      layer.on('mouseover', (e: L.LeafletEvent) => {
        const mouseEvt = e as L.LeafletMouseEvent;
        const orig = mouseEvt.originalEvent;
        const cx = orig && orig.clientX ? orig.clientX : (this.container.getBoundingClientRect().left + 150);
        const cy = orig && orig.clientY ? orig.clientY : (this.container.getBoundingClientRect().top + 100);
        this.activeCalloutLayer = layer;
        this.showExternalCallout(content, cx, cy, getAccent());
      });

      layer.on('mousemove', (e: L.LeafletEvent) => {
        const mouseEvt = e as L.LeafletMouseEvent;
        if (mouseEvt.originalEvent && this.activeCalloutLayer === layer) {
          this.updateExternalCallout(mouseEvt.originalEvent.clientX, mouseEvt.originalEvent.clientY);
        }
      });

      layer.on('mouseout', () => {
        if (this.activeCalloutLayer === layer) {
          this.hideExternalCallout();
        }
      });

      layer.on('click', () => {
        this.hideExternalCallout();
      });
      return;
    }

    const defaultOptions: L.TooltipOptions = {
      className: 'map-leaflet-tooltip',
      opacity: 0.98,
      direction: 'top',
      offset: [0, -8],
      sticky: false,
      ...options
    };

    layer.bindTooltip(content, defaultOptions);

    // Hook Leaflet's internal _updatePosition so every position update is synchronously clamped inside the map viewport
    const tip = layer.getTooltip() as (L.Tooltip & { _updatePosition?: () => void; __clampedHooked?: boolean }) | undefined;
    if (tip && typeof tip._updatePosition === 'function' && !tip.__clampedHooked) {
      const origUpdatePosition = tip._updatePosition.bind(tip);
      tip.__clampedHooked = true;
      tip._updatePosition = () => {
        origUpdatePosition();
        this.constrainTooltipToViewport(tip);
      };
    }

    const updateVectorTooltipAnchor = (e: L.LeafletEvent): void => {
      const mouseEvt = e as L.LeafletMouseEvent;
      if (
        (layer instanceof L.Polygon || layer instanceof L.Polyline) &&
        mouseEvt.latlng &&
        this.map.getBounds().contains(mouseEvt.latlng)
      ) {
        const origEvt = mouseEvt.originalEvent;
        const isSyntheticOrigin = origEvt && origEvt.clientX === 0 && origEvt.clientY === 0;
        if (!isSyntheticOrigin) {
          layer.getTooltip()?.setLatLng(mouseEvt.latlng);
        }
      }
    };

    layer.on('mouseover', (e: L.LeafletEvent) => {
      if (this.activeHoveredPolygon && this.activeHoveredPolygon.poly !== layer) {
        try {
          this.activeHoveredPolygon.poly.setStyle(this.activeHoveredPolygon.defaultStyle);
        } catch {
          // ignore
        }
        this.activeHoveredPolygon = null;
      }
      if (this.activeTooltipLayer && this.activeTooltipLayer !== layer) {
        try {
          this.activeTooltipLayer.closeTooltip();
        } catch {
          // ignore
        }
      }
      this.activeTooltipLayer = layer;
      updateVectorTooltipAnchor(e);
      this.constrainTooltipToViewport(layer.getTooltip());
    });

    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
      layer.on('mousemove', (e: L.LeafletEvent) => {
        if (this.activeTooltipLayer === layer) {
          updateVectorTooltipAnchor(e);
          this.constrainTooltipToViewport(layer.getTooltip());
        }
      });
    }

    layer.on('tooltipopen', (e: L.LeafletEvent) => {
      const tipEvt = e as L.TooltipEvent;
      this.constrainTooltipToViewport(tipEvt.tooltip || layer.getTooltip());
    });

    layer.on('mouseout', () => {
      if (this.activeTooltipLayer === layer) {
        this.activeTooltipLayer = null;
      }
    });

    layer.on('click', () => {
      this.closeActiveTooltip();
    });
  }

  /**
   * Mathematically clamps any open Leaflet tooltip inside the visible map container bounds
   * so hover informationals never clip past top, bottom, left, or right edges.
   */
  public constrainTooltipToViewport(tooltip?: L.Tooltip | null): void {
    const activeTip = tooltip || this.activeTooltipLayer?.getTooltip();
    if (!activeTip) return;
    const el = activeTip.getElement();
    if (!el || !this.container) return;

    el.classList.remove('leaflet-tooltip-clamped');

    const mapRect = this.container.getBoundingClientRect();
    const tipRect = el.getBoundingClientRect();
    if (tipRect.width === 0 || tipRect.height === 0 || mapRect.width === 0 || mapRect.height === 0) {
      return;
    }

    const margin = 10;
    const match =
      el.style.transform.match(/translate3d\(\s*([-\d.]+)px,\s*([-\d.]+)px/i) ||
      el.style.transform.match(/translate\(\s*([-\d.]+)px,\s*([-\d.]+)px/i);
    if (!match) return;

    const baseX = parseFloat(match[1]);
    const baseY = parseFloat(match[2]);

    let dx = 0;
    let dy = 0;

    // If tooltip overflows top edge, flip below the anchor point when room exists
    const anchorLatLng = activeTip.getLatLng();
    if (tipRect.top < mapRect.top + margin && anchorLatLng) {
      const anchorPt = this.map.latLngToContainerPoint(anchorLatLng);
      if (anchorPt.y >= 0 && anchorPt.y <= mapRect.height) {
        const desiredTop = mapRect.top + anchorPt.y + 16;
        if (desiredTop + tipRect.height <= mapRect.bottom - margin) {
          dy = desiredTop - tipRect.top;
        }
      }
    }

    let projLeft = tipRect.left + dx;
    let projRight = tipRect.right + dx;
    let projTop = tipRect.top + dy;
    let projBottom = tipRect.bottom + dy;

    if (projLeft < mapRect.left + margin) {
      dx += mapRect.left + margin - projLeft;
    } else if (projRight > mapRect.right - margin) {
      dx -= projRight - (mapRect.right - margin);
    }

    if (projTop < mapRect.top + margin) {
      dy += mapRect.top + margin - projTop;
    } else if (projBottom > mapRect.bottom - margin) {
      dy -= projBottom - (mapRect.bottom - margin);
    }

    // Avoid overlapping top-left zoom controls when near the upper-left corner
    projLeft = tipRect.left + dx;
    projTop = tipRect.top + dy;
    projBottom = tipRect.bottom + dy;
    const controlsLeftClearance = 58;
    const controlsTopClearance = 175;
    if (
      projLeft < mapRect.left + controlsLeftClearance &&
      projTop < mapRect.top + controlsTopClearance &&
      mapRect.left + controlsLeftClearance + tipRect.width <= mapRect.right - margin
    ) {
      dx += mapRect.left + controlsLeftClearance - projLeft;
      projLeft = tipRect.left + dx;
    }

    // Avoid overlapping open #atlas-detail-drawer when hovering another marker while the drawer is open
    const drawerEl = document.getElementById('atlas-detail-drawer');
    if (drawerEl && !drawerEl.hidden) {
      const drawerRect = drawerEl.getBoundingClientRect();
      if (
        drawerRect.width > 0 &&
        projLeft < drawerRect.right + 10 &&
        tipRect.right + dx > drawerRect.left - 4 &&
        projBottom > drawerRect.top - 6 &&
        projTop < drawerRect.bottom + 6 &&
        drawerRect.right + 10 + tipRect.width <= mapRect.right - margin
      ) {
        dx += drawerRect.right + 10 - projLeft;
      }
    }

    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      const nextX = Math.round(baseX + dx);
      const nextY = Math.round(baseY + dy);
      el.style.transform = `translate3d(${nextX}px, ${nextY}px, 0px)`;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        el.classList.add('leaflet-tooltip-clamped');
      }
    }
  }

  public scheduleLabelDeconfliction(): void {
    this.deconflictMarkerLabels();
    if (this.labelDeconflictTimer !== null) {
      window.clearTimeout(this.labelDeconflictTimer);
    }
    this.labelDeconflictTimer = window.setTimeout(() => {
      this.deconflictMarkerLabels();
      this.labelDeconflictTimer = null;
    }, 60);
  }

  /**
   * Resolves screen-space collisions between gold artifact labels, capital labels, and city labels.
   */
  public deconflictMarkerLabels(): void {
    if (!this.container) return;
    const mapRect = this.container.getBoundingClientRect();
    if (mapRect.width === 0 || mapRect.height === 0) return;

    type Box = { left: number; right: number; top: number; bottom: number };
    const boxesOverlap = (a: Box, b: Box, pad = 2): boolean => {
      return !(
        a.right + pad <= b.left ||
        a.left - pad >= b.right ||
        a.bottom + pad <= b.top ||
        a.top - pad >= b.bottom
      );
    };

    const overlapArea = (a: Box, b: Box, pad = 2): number => {
      const xOverlap = Math.max(0, Math.min(a.right + pad, b.right) - Math.max(a.left - pad, b.left));
      const yOverlap = Math.max(0, Math.min(a.bottom + pad, b.bottom) - Math.max(a.top - pad, b.top));
      return xOverlap * yOverlap;
    };

    const occupied: Box[] = [];
    const addElementsToOccupied = (selector: string, expand = 0): void => {
      const els = this.container.querySelectorAll<HTMLElement>(selector);
      els.forEach(el => {
        const r = el.getBoundingClientRect();
        if (
          r.width > 0 &&
          r.height > 0 &&
          r.right >= mapRect.left &&
          r.left <= mapRect.right &&
          r.bottom >= mapRect.top &&
          r.top <= mapRect.bottom
        ) {
          occupied.push({
            left: r.left - expand,
            right: r.right + expand,
            top: r.top - expand,
            bottom: r.bottom + expand
          });
        }
      });
    };

    // Seed on-map HUD controls and high-priority interactive hitboxes first
    addElementsToOccupied('.ancient-map-controls', 4);
    addElementsToOccupied('.ornate-compass-rose', 4);
    addElementsToOccupied('.map-canvas-year-hud', 4);
    addElementsToOccupied('.leaflet-route-stop-marker .route-stop-core', 3);
    addElementsToOccupied('.leaflet-gold-marker .gold-coin-core', 4);
    addElementsToOccupied('.leaflet-capital-marker .capital-marker-dot', 2);

    // Deconflict route banner pills when multiple routes are shown simultaneously
    const routeBadges = Array.from(
      this.container.querySelectorAll<HTMLElement>('.leaflet-route-badge .route-badge-pill')
    );
    const placedBadges: Box[] = [];
    routeBadges.forEach((pill, badgeIdx) => {
      pill.classList.remove('label-hidden');
      pill.style.marginTop = '';
      const r0 = pill.getBoundingClientRect();
      if (r0.width === 0 || r0.height === 0) return;
      const badgeOffsets = [0, -18, 18, -34, 34];
      for (const dy of badgeOffsets) {
        pill.style.marginTop = dy ? `${dy}px` : '';
        const r = pill.getBoundingClientRect();
        const insideViewport =
          r.left >= mapRect.left + 6 &&
          r.right <= mapRect.right - 6 &&
          r.top >= mapRect.top + 6 &&
          r.bottom <= mapRect.bottom - 6;
        const collidesBadge = placedBadges.some(b => boxesOverlap(r, b, 4));
        if (insideViewport && !collidesBadge) {
          const box = { left: r.left - 3, right: r.right + 3, top: r.top - 3, bottom: r.bottom + 3 };
          placedBadges.push(box);
          occupied.push(box);
          return;
        }
      }
      // If more than 2 routes are visible in macro view and a secondary badge still collides with another badge, hide it cleanly
      if (routeBadges.length > 2 && badgeIdx > 0) {
        pill.classList.add('label-hidden');
      } else {
        pill.style.marginTop = '';
        const r = pill.getBoundingClientRect();
        const box = { left: r.left - 3, right: r.right + 3, top: r.top - 3, bottom: r.bottom + 3 };
        placedBadges.push(box);
        occupied.push(box);
      }
    });

    const goldLabels = Array.from(
      this.container.querySelectorAll<HTMLElement>('.leaflet-gold-marker .gold-coin-label')
    );
    const capitalLabels = Array.from(
      this.container.querySelectorAll<HTMLElement>('.leaflet-capital-marker .capital-marker-label')
    );
    const cityLabels = Array.from(
      this.container.querySelectorAll<HTMLElement>('.leaflet-city-marker .city-marker-label')
    );

    const dirClasses = ['label-west', 'label-north', 'label-south'];

    const placeLabel = (label: HTMLElement, canHide: boolean): void => {
      label.classList.remove('label-west', 'label-north', 'label-south', 'label-hidden');
      label.style.marginTop = '';
      label.style.marginLeft = '';

      const parentMarker = label.parentElement;
      if (parentMarker) {
        const pr = parentMarker.getBoundingClientRect();
        if (
          pr.right < mapRect.left ||
          pr.left > mapRect.right ||
          pr.bottom < mapRect.top ||
          pr.top > mapRect.bottom
        ) {
          return;
        }
      }

      const preferred = label.dataset.preferredDir || '';
      const candidates = Array.from(new Set([preferred, '', 'label-west', 'label-north', 'label-south']));

      let bestCandidate: { dir: string; mt: number; ml: number; score: number; rect: Box } | null = null;

      for (const dir of candidates) {
        label.classList.remove(...dirClasses);
        if (dir) label.classList.add(dir);

        const r = label.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;

        const insideViewport =
          r.left >= mapRect.left + 4 &&
          r.right <= mapRect.right - 4 &&
          r.top >= mapRect.top + 4 &&
          r.bottom <= mapRect.bottom - 4;

        const totalOverlap = occupied.reduce((sum, occ) => sum + overlapArea(r, occ, 2), 0);
        const penalty = totalOverlap + (insideViewport ? 0 : 10000);

        if (!bestCandidate || penalty < bestCandidate.score) {
          bestCandidate = {
            dir,
            mt: 0,
            ml: 0,
            score: penalty,
            rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom }
          };
        }

        if (insideViewport && totalOverlap === 0) {
          occupied.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
          return;
        }
      }

      if (canHide) {
        label.classList.add('label-hidden');
        return;
      }

      // High-priority label (gold artifact or capital): test vertical/horizontal nudges to guarantee zero overlap
      const nudges: Array<{ dir: string; mt: number; ml: number }> = [
        { dir: 'label-west', mt: -10, ml: -4 },
        { dir: 'label-west', mt: 10, ml: -4 },
        { dir: 'label-north', mt: -12, ml: 0 },
        { dir: 'label-south', mt: 12, ml: 0 },
        { dir: '', mt: -14, ml: 0 },
        { dir: '', mt: 14, ml: 0 },
        { dir: 'label-north', mt: -24, ml: 0 },
        { dir: 'label-south', mt: 24, ml: 0 },
        { dir: 'label-west', mt: -22, ml: -6 },
        { dir: 'label-west', mt: 22, ml: -6 },
        { dir: '', mt: -26, ml: 4 },
        { dir: '', mt: 26, ml: 4 }
      ];

      for (const nudge of nudges) {
        label.classList.remove(...dirClasses);
        if (nudge.dir) label.classList.add(nudge.dir);
        label.style.marginTop = `${nudge.mt}px`;
        label.style.marginLeft = `${nudge.ml}px`;

        const r = label.getBoundingClientRect();
        const insideViewport =
          r.left >= mapRect.left + 4 &&
          r.right <= mapRect.right - 4 &&
          r.top >= mapRect.top + 4 &&
          r.bottom <= mapRect.bottom - 4;
        const totalOverlap = occupied.reduce((sum, occ) => sum + overlapArea(r, occ, 2), 0);
        const penalty = totalOverlap + (insideViewport ? 0 : 10000);

        if (!bestCandidate || penalty < bestCandidate.score) {
          bestCandidate = {
            dir: nudge.dir,
            mt: nudge.mt,
            ml: nudge.ml,
            score: penalty,
            rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom }
          };
        }

        if (insideViewport && totalOverlap === 0) {
          occupied.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
          return;
        }
      }

      // In All-Eras macro view, if a label still collides after all nudges, hide it until zoomed in
      if ((this.activeEra.id === 'all' || this.showAllSites) && bestCandidate && bestCandidate.score > 0) {
        label.classList.add('label-hidden');
        return;
      }

      // Apply the lowest-overlap candidate
      label.classList.remove(...dirClasses);
      if (bestCandidate) {
        if (bestCandidate.dir) label.classList.add(bestCandidate.dir);
        label.style.marginTop = bestCandidate.mt ? `${bestCandidate.mt}px` : '';
        label.style.marginLeft = bestCandidate.ml ? `${bestCandidate.ml}px` : '';
        occupied.push(bestCandidate.rect);
      }
    };

    goldLabels.forEach(lbl => placeLabel(lbl, false));
    capitalLabels.forEach(lbl => placeLabel(lbl, false));

    // Now seed city dots and place lower-priority city labels
    addElementsToOccupied('.leaflet-city-marker .city-marker-dot', 1);
    cityLabels.forEach(lbl => placeLabel(lbl, true));
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
    const activeFilter = this.activeGranularFilterId
      ? GRANULAR_TIMELINE_FILTERS.find(f => f.id === this.activeGranularFilterId)
      : null;
    if (activeFilter) {
      this.yearHudEl.innerHTML = `
        <div class="hud-label">EPOCH: ${this.activeEra.name.toUpperCase()} · ${activeFilter.categoryLabel.toUpperCase()}</div>
        <div class="hud-year">${activeFilter.label} (${activeFilter.dateLabel})</div>
      `;
    } else {
      this.yearHudEl.innerHTML = `
        <div class="hud-label">EPOCH: ${this.activeEra.name.toUpperCase()}</div>
        <div class="hud-year">${this.activeEra.yearLabel}</div>
      `;
    }
  }

  public getVisibleRoutes(): BiblicalRoute[] {
    if (this.activeRouteOverrideIds !== null) {
      return BIBLICAL_ROUTES.filter(r => this.activeRouteOverrideIds!.includes(r.id));
    }
    if (this.activeEra.id === 'all') {
      return BIBLICAL_ROUTES;
    }
    return BIBLICAL_ROUTES.filter(r => this.activeEra.activeRouteIds.includes(r.id));
  }

  public setGranularFilter(filterId: string | null): void {
    this.closeActiveTooltip();
    if (!filterId || filterId === 'all-era') {
      this.activeGranularFilterId = null;
      this.activeRouteOverrideIds = null;
      this.activeRouteStopSelection = null;
      this.updateYearHud();
      this.renderActiveEra();
      this.map.flyTo(
        [this.activeEra.focusCenter.lat, this.activeEra.focusCenter.lng],
        this.activeEra.focusZoom,
        { duration: 1.0 }
      );
      if (this.options.onGranularFilterChange) {
        this.options.onGranularFilterChange(null);
      }
      return;
    }

    const filter = GRANULAR_TIMELINE_FILTERS.find(f => f.id === filterId);
    if (!filter) {
      // Allow passing a direct route ID as fallback
      const directRoute = BIBLICAL_ROUTES.find(r => r.id === filterId);
      if (!directRoute) return;
      this.activeGranularFilterId = directRoute.id;
      this.activeRouteOverrideIds = [directRoute.id];
      this.activeRouteStopSelection = { routeId: directRoute.id, stopIndex: 0 };
      this.updateYearHud();
      this.renderActiveEra();
      const firstStop = directRoute.stops[0];
      if (firstStop) {
        this.map.flyTo([firstStop.coords.lat, firstStop.coords.lng], 7, { duration: 1.0 });
      }
      if (this.options.onGranularFilterChange) {
        this.options.onGranularFilterChange(null);
      }
      return;
    }

    this.activeGranularFilterId = filter.id;
    this.activeRouteOverrideIds = [...filter.routeIds];
    const primaryRouteId = filter.routeIds[0];
    this.activeRouteStopSelection = primaryRouteId ? { routeId: primaryRouteId, stopIndex: 0 } : null;

    this.updateYearHud();
    this.renderActiveEra();

    this.map.flyTo(
      [filter.focusCenter.lat, filter.focusCenter.lng],
      filter.focusZoom,
      { duration: 1.1 }
    );

    if (this.options.onGranularFilterChange) {
      this.options.onGranularFilterChange(filter);
    }
  }

  public stepToRouteStop(routeId: string, stopIndex: number, openDetail = true): void {
    const route = BIBLICAL_ROUTES.find(r => r.id === routeId);
    if (!route || route.stops.length === 0) return;

    const clampedIdx = ((stopIndex % route.stops.length) + route.stops.length) % route.stops.length;
    const stop = route.stops[clampedIdx];
    this.activeRouteStopSelection = { routeId: route.id, stopIndex: clampedIdx };

    // Ensure the route is currently visible
    const visibleIds = this.getVisibleRoutes().map(r => r.id);
    if (!visibleIds.includes(route.id)) {
      const matchingFilter = GRANULAR_TIMELINE_FILTERS.find(
        f => f.routeIds.length === 1 && f.routeIds[0] === route.id
      ) || GRANULAR_TIMELINE_FILTERS.find(f => f.routeIds.includes(route.id));
      if (matchingFilter) {
        this.activeGranularFilterId = matchingFilter.id;
        this.activeRouteOverrideIds = [...matchingFilter.routeIds];
      } else {
        this.activeRouteOverrideIds = [route.id];
      }
      this.updateYearHud();
      this.renderActiveEra();
    } else {
      // Update active highlight class on stop markers
      const allCores = this.container.querySelectorAll<HTMLElement>('.route-stop-core');
      allCores.forEach(el => {
        const isCurrent = el.dataset.routeId === route.id && Number(el.dataset.stopIndex) === clampedIdx;
        el.classList.toggle('active-stop', isCurrent);
      });
    }

    this.closeActiveTooltip();
    const minStepZoom = route.id === 'thomas-parthia-india' || route.id === 'andrew-mark-missions' || route.id === 'paul-voyage-rome' ? 5 : 7;
    const targetZoom = Math.max(this.map.getZoom(), minStepZoom);
    this.map.flyTo([stop.coords.lat, stop.coords.lng], targetZoom, { duration: 0.75 });

    if (openDetail && this.options.onSelectRouteStop) {
      this.options.onSelectRouteStop(route, stop, clampedIdx);
    }
  }

  public setEra(eraId: string): void {
    const era = CHRONOLOGICAL_ERAS.find(e => e.id === eraId);
    if (!era) return;

    this.activeEra = era;
    this.activeGranularFilterId = null;
    this.activeRouteOverrideIds = null;
    this.activeRouteStopSelection = null;
    this.updateYearHud();
    this.renderActiveEra();

    // Position camera to era focus (calm non-animated transition in readingMode)
    if (this.options.readingMode) {
      this.map.setView([era.focusCenter.lat, era.focusCenter.lng], era.focusZoom, { animate: false });
    } else {
      this.map.flyTo(
        [era.focusCenter.lat, era.focusCenter.lng],
        era.focusZoom,
        { duration: 1.2 }
      );
    }

    if (this.options.onEraChange) {
      this.options.onEraChange(era);
    }
    if (this.options.onGranularFilterChange) {
      this.options.onGranularFilterChange(null);
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
    if (this.options.readingMode) {
      this.map.setView([preset.center.lat, preset.center.lng], targetZoom, { animate: false });
    } else {
      this.map.flyTo([preset.center.lat, preset.center.lng], targetZoom, { duration: 1.2 });
    }
  }

  public animateToCoords(coords: GeoCoordinate, zoom = 7): void {
    if (this.options.readingMode) {
      this.map.setView([coords.lat, coords.lng], zoom, { animate: false });
    } else {
      this.map.flyTo([coords.lat, coords.lng], zoom, { duration: 1.2 });
    }
  }

  public fitRoute(routeId: string): void {
    const route = BIBLICAL_ROUTES.find(r => r.id === routeId);
    if (!route?.stops.length) return;
    this.map.fitBounds(route.stops.map(s => [s.coords.lat, s.coords.lng] as L.LatLngTuple), { padding: [60, 60], maxZoom: 7, animate: false });
  }

  public highlightGeographicPlace(entity: BiblicalGeographicEntity): void {
    this.map.flyTo([entity.coords.lat, entity.coords.lng], Math.max(entity.zoom || 9, 8), { duration: 0.8 });

    if (this.activeFocusMarker) {
      this.map.removeLayer(this.activeFocusMarker);
      this.activeFocusMarker = null;
    }

    const focusIcon = L.divIcon({
      className: 'leaflet-geo-focus-marker',
      html: `
        <div class="geo-focus-ping"></div>
        <div class="geo-focus-core"></div>
        <div class="geo-focus-label">${entity.name}</div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    this.activeFocusMarker = L.marker([entity.coords.lat, entity.coords.lng], {
      icon: focusIcon,
      zIndexOffset: 3000
    }).addTo(this.map);

    // In full-screen reading mode, an in-map popup is helpful.
    // In compact companion mode (sidebar), a giant popup blocks the 300px map entirely.
    // The luminous marker marks the spot while the companion drawer beneath displays full details.
    if (!this.options.compact) {
      const popupContent = `
        <div class="map-tooltip-inner geo-callout-tooltip" style="min-width: 200px; max-width: 280px;">
          <span class="tooltip-badge">BIBLICAL GEOGRAPHY · ${entity.ancientRegion.toUpperCase()}</span>
          <div style="color: #d4af37; font-weight: 700; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.15rem; margin: 3px 0 2px;">${entity.name}</div>
          <p style="font-size: 0.78rem; color: #f1f5f9; margin: 4px 0 6px; line-height: 1.45;">${entity.note}</p>
          ${entity.scriptureRef ? `<div style="font-size: 0.72rem; color: #d4af37; border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 4px;"><strong>Scripture:</strong> ${entity.scriptureRef}</div>` : ''}
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
  }

  public resetView(): void {
    if (this.options.readingMode) {
      this.map.setView([this.activeEra.focusCenter.lat, this.activeEra.focusCenter.lng], this.activeEra.focusZoom);
      return;
    }
    this.setEra('all');
  }

  public focusOnFigure(figureId: string): void {
    const era = CHRONOLOGICAL_ERAS.find(e => e.id !== 'all' && e.activeFigureIds.includes(figureId));
    if (era && this.activeEra.id !== era.id) {
      this.activeEra = era;
      this.updateYearHud();
      this.renderActiveEra();
      if (this.options.onEraChange) {
        this.options.onEraChange(era);
      }
    }

    // Find matching site for this figure
    const site = ARCHAEOLOGICAL_SITES.find(s => s.figureId === figureId);
    if (site) {
      this.map.flyTo([site.coords.lat, site.coords.lng], 7, { duration: 1.0 });
      if (this.options.onSelectSite) {
        this.options.onSelectSite(site);
      }
      return;
    }

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
  /** Update temporal marks without rebuilding geography or disturbing the camera. */
  public renderRouteSelection(): void {
    this.closeActiveTooltip();
    this.routeLayerGroup.clearLayers();
    this.renderRoutes();
    this.deconflictMarkerLabels();
  }

  private renderRoutes(): void {
    // 2. Biblical Routes (Filtered by era or granular sub-timeline filter, rendered in dedicated routePane & routeStopPane above empires)
    this.routeStopMarkersMap.clear();
    if (this.layers.routes) {
      const routesToRender = this.getVisibleRoutes();

      const routeBannerCoords: Record<string, GeoCoordinate> = {
        'abraham-call': { lat: 35.65, lng: 39.95 },
        'jacob-padan-aram': { lat: 32.80, lng: 36.20 },
        'joseph-egypt': { lat: 30.85, lng: 32.20 },
        'jacob-joseph-egypt': { lat: 30.85, lng: 32.20 },
        'exodus-route': { lat: 29.35, lng: 33.35 },
        'joshua-conquest': { lat: 32.45, lng: 35.55 },
        'david-exile-throne': { lat: 31.42, lng: 35.15 },
        'elijah-elisha-ministry': { lat: 32.95, lng: 35.20 },
        'babylonian-deportation-daniel': { lat: 34.90, lng: 41.20 },
        'ezra-nehemiah-return': { lat: 33.25, lng: 44.80 },
        'john-baptist-ministry': { lat: 31.62, lng: 35.72 },
        'jesus-nativity-youth': { lat: 30.95, lng: 33.20 },
        'jesus-early-ministry': { lat: 32.25, lng: 35.10 },
        'jesus-galilean-ministry': { lat: 33.18, lng: 35.52 },
        'jesus-passion-resurrection': { lat: 31.82, lng: 34.78 },
        'peter-philip-missions': { lat: 31.50, lng: 33.80 },
        'paul-first-journey': { lat: 35.10, lng: 33.20 },
        'paul-second-journey': { lat: 42.65, lng: 23.50 },
        'paul-third-journey': { lat: 36.60, lng: 25.40 },
        'paul-voyage-rome': { lat: 36.10, lng: 16.50 },
        'john-seven-churches-patmos': { lat: 38.80, lng: 29.80 },
        'thomas-parthia-india': { lat: 24.50, lng: 62.50 },
        'andrew-mark-missions': { lat: 44.20, lng: 33.50 },
        'job-land-of-uz': { lat: 30.20, lng: 36.80 },
        'gideon-judges': { lat: 32.70, lng: 35.40 },
        'samson-judges': { lat: 31.60, lng: 34.75 },
        'ruth-boaz': { lat: 31.55, lng: 35.50 },
        'samuel-circuit': { lat: 32.10, lng: 34.90 },
        'saul-reign': { lat: 32.30, lng: 35.35 },
        'solomon-glory': { lat: 30.50, lng: 35.10 },
        'elijah-prophet': { lat: 32.85, lng: 35.45 },
        'elisha-ministry': { lat: 32.50, lng: 35.48 },
        'amos-prophet': { lat: 31.25, lng: 35.10 },
        'hosea-prophet': { lat: 32.65, lng: 35.25 },
        'jonah-prophet': { lat: 34.80, lng: 36.50 },
        'isaiah-ministry': { lat: 31.45, lng: 34.65 },
        'jeremiah-ministry': { lat: 31.40, lng: 34.70 },
        'daniel-exile': { lat: 32.80, lng: 43.80 },
        'ezekiel-exile': { lat: 32.00, lng: 45.10 },
        'esther-mordecai': { lat: 32.22, lng: 48.20 },
        'ezra-journey': { lat: 34.20, lng: 43.20 },
        'nehemiah-walls': { lat: 33.10, lng: 45.50 },
        'stephen-philip-deacons': { lat: 31.35, lng: 34.45 },
        'paul-conversion-early': { lat: 34.50, lng: 35.80 },
        'barnabas-mark': { lat: 35.50, lng: 33.50 },

      };

      const selectRouteStopHandler = (route: BiblicalRoute, stop?: BiblicalRouteStop, stopIndex?: number): void => {
        const idx = typeof stopIndex === 'number' ? stopIndex : 0;
        this.activeRouteStopSelection = { routeId: route.id, stopIndex: idx };
        const allCores = this.container.querySelectorAll<HTMLElement>('.route-stop-core');
        allCores.forEach(el => {
          const isCurrent = el.dataset.routeId === route.id && Number(el.dataset.stopIndex) === idx;
          el.classList.toggle('active-stop', isCurrent);
        });

        if (this.options.onSelectRouteStop) {
          this.options.onSelectRouteStop(route, stop, idx);
          return;
        }
        // Fallback inline popup for standalone embeds without a drawer callback
        const targetStop = stop || route.stops[0];
        const popupHtml = `
          <div class="map-tooltip-inner" style="min-width: 240px; max-width: 300px;">
            <span class="tooltip-badge" style="background: rgba(26, 22, 17, 0.95); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.45); font-family: var(--font-mono, monospace); font-size: 0.65rem; font-weight: 600; padding: 2px 7px; border-radius: 4px;">${route.name.toUpperCase()} · STOP ${idx + 1} OF ${route.stops.length}</span>
            <div style="color: #fdfbf7; font-weight: 700; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.15rem; margin: 4px 0 4px;">${idx + 1}. ${targetStop.name}</div>
            <div style="font-size: 0.76rem; color: #f5efe6; margin-bottom: 3px;"><strong>🗓️ When:</strong> ${targetStop.dateLabel}</div>
            <div style="font-size: 0.76rem; color: #d4af37; margin-bottom: 5px;"><strong>📖 Scripture:</strong> ${targetStop.scriptureRef}</div>
            <p style="font-size: 0.76rem; color: #e2e8f0; margin: 0; line-height: 1.4;">${targetStop.note}</p>
          </div>
        `;
        L.popup({ className: 'map-leaflet-popup', closeButton: true, autoClose: true })
          .setLatLng([targetStop.coords.lat, targetStop.coords.lng])
          .setContent(popupHtml)
          .openOn(this.map);
      };

      // Track placed stop coordinates across concurrent routes so shared cities (e.g., Bethabara or Jerusalem) do not stack directly on top of one another
      const placedStopCoords: GeoCoordinate[] = [];
      const getDeconflictedStopCoords = (raw: GeoCoordinate): GeoCoordinate => {
        let collisionCount = 0;
        for (const prev of placedStopCoords) {
          const dLat = prev.lat - raw.lat;
          const dLng = prev.lng - raw.lng;
          if (Math.sqrt(dLat * dLat + dLng * dLng) < 0.035) {
            collisionCount++;
          }
        }
        if (collisionCount === 0) {
          placedStopCoords.push(raw);
          return raw;
        }
        const angle = (collisionCount * 137.5 * Math.PI) / 180; // Golden-angle spiral separation
        const radius = 0.028 * Math.ceil(collisionCount / 2);
        const adjusted = {
          lat: raw.lat + Math.sin(angle) * radius,
          lng: raw.lng + (Math.cos(angle) * radius) / Math.cos((raw.lat * Math.PI) / 180)
        };
        placedStopCoords.push(adjusted);
        return adjusted;
      };

      for (const sourceRoute of routesToRender) {
        const route = this.options.readingMode ? { ...sourceRoute, color: '#c3a576' } : sourceRoute;
        const path = (route.path && route.path.length > 0)
          ? route.path.map(p => [p.lat, p.lng] as L.LatLngTuple)
          : route.stops.map(s => [s.coords.lat, s.coords.lng] as L.LatLngTuple);
        const isPatristicRoute = route.evidenceClass === 'EXTERNAL_HISTORICAL_ATTESTATION';
        const evidenceBadgeText = isPatristicRoute
          ? 'SCRIPTURE + PATRISTIC / HISTORICAL ATTESTATION'
          : `BIBLICAL JOURNEY · ${route.stops.length} STOPS`;

        // Sequence mode locates a place, not an invented interpolated position.
        if (!this.focusedStopOnly && !this.options.readingMode) {
        // Dark outer casing for high contrast against empire territories and terrain
        const casingLine = L.polyline(path, {
          pane: 'routePane',
          color: 'rgba(8, 12, 17, 0.85)',
          weight: 6.5,
          opacity: 0.85,
          interactive: false
        });
        this.routeLayerGroup.addLayer(casingLine);

        // Visible high-contrast route line
        const visiblePolyline = L.polyline(path, {
          pane: 'routePane',
          color: route.color,
          weight: 3.8,
          opacity: 0.96,
          dashArray: isPatristicRoute ? '5, 7' : '9, 6',
          interactive: false
        });
        this.routeLayerGroup.addLayer(visiblePolyline);

        // Wide 24px interactive hit-corridor in routePane (above empirePane) so hovering anywhere along the path never falls through to Roman Empire
        const hitCorridor = L.polyline(path, {
          pane: 'routePane',
          color: route.color,
          weight: 24,
          opacity: 0.01,
          className: `leaflet-route-hit-corridor route-corridor-${route.id}`,
          bubblingMouseEvents: false
        });

        hitCorridor.on('mouseover', () => {
          visiblePolyline.setStyle({ weight: 5.2, opacity: 1.0, dashArray: undefined });
        });
        hitCorridor.on('mouseout', () => {
          visiblePolyline.setStyle({ weight: 3.8, opacity: 0.96, dashArray: isPatristicRoute ? '5, 7' : '9, 6' });
        });
        hitCorridor.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          selectRouteStopHandler(route, route.stops[0], 0);
        });

        const routeTooltipHtml = `
          <div class="map-tooltip-inner route-tooltip" style="min-width: 240px; max-width: 315px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
              <span class="tooltip-badge" style="background: rgba(26, 22, 17, 0.95); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.45); font-family: var(--font-mono, monospace); font-size: 0.65rem; font-weight: 600; padding: 2px 7px; border-radius: 4px;">
                ${evidenceBadgeText}
              </span>
              <span style="font-size: 0.72rem; color: #f5efe6; font-family: var(--font-mono, monospace); font-weight: 600;">${route.dateRange}</span>
            </div>
            <div class="tooltip-title" style="color: #fdfbf7; font-weight: 700; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.15rem; margin-bottom: 4px;">
              ${route.name}
            </div>
            <div style="font-size: 0.76rem; color: #d8cfc0; margin-bottom: 5px; display: grid; grid-template-columns: auto 1fr; gap: 2px 8px; line-height: 1.35; background: rgba(22, 19, 15, 0.85); padding: 5px 8px; border-radius: 4px; border: 1px solid rgba(212, 175, 55, 0.2); border-left: 3px solid #d4af37;">
              <span style="color: #a89f91;">🧭 Traveler:</span><strong style="color: #f5efe6;">${route.travelerName}</strong>
              <span style="color: #a89f91;">📖 Scripture:</span><strong style="color: #d4af37;">${route.scriptureRef}</strong>
              ${route.attestationSource ? `<span style="color: #a89f91;">🏛️ Sources:</span><span style="color: #c99738; font-size: 0.72rem;">${route.attestationSource}</span>` : ''}
            </div>
            <div style="color: #e2e8f0; font-size: 0.76rem; line-height: 1.4; border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 4px;">
              ${route.summary}
            </div>
            <div class="tooltip-cta" style="margin-top: 5px; color: #c99738; font-size: 0.72rem; border-top: 1px dashed rgba(212, 175, 55, 0.2); padding-top: 4px;">
              Hover or click any numbered stop (1–${route.stops.length}) for dates &amp; events &rarr;
            </div>
          </div>
        `;
        this.bindManagedTooltip(hitCorridor, routeTooltipHtml, { direction: 'top', offset: [0, -10] });
        this.routeLayerGroup.addLayer(hitCorridor);

        // On-Map Route Title Banner Pill so the user immediately sees whose journey it is without hovering
        const bannerPos = routeBannerCoords[route.id] || route.stops[Math.floor(route.stops.length / 2)].coords;
        const badgeIcon = L.divIcon({
          className: `leaflet-route-badge route-badge-${route.id}`,
          html: `
            <div class="route-badge-pill" data-route-id="${route.id}" style="--route-color: ${route.color}; border-color: ${route.color};">
              <span class="route-badge-dot" style="background: ${route.color};"></span>
              <span class="route-badge-text">${route.shortBanner}</span>
            </div>
          `,
          iconSize: [230, 24],
          iconAnchor: [115, 12]
        });
        const badgeMarker = L.marker([bannerPos.lat, bannerPos.lng], {
          pane: 'routePane',
          icon: badgeIcon,
          zIndexOffset: 1380,
          bubblingMouseEvents: false
        });
        this.bindManagedTooltip(badgeMarker, routeTooltipHtml, { direction: 'top', offset: [0, -12] });
        badgeMarker.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          selectRouteStopHandler(route, route.stops[0], 0);
        });
        if (!this.options.readingMode) this.routeLayerGroup.addLayer(badgeMarker);
        }

        // Interactive Numbered Waypoint Stops (1..N) in routeStopPane above all polygons and lines
        const routeMarkers: L.Marker[] = [];
        route.stops.forEach((stop, stopIdx) => {
          if (this.focusedStopOnly && (this.activeRouteStopSelection?.routeId !== route.id || this.activeRouteStopSelection.stopIndex !== stopIdx)) return;
          const stopNum = stopIdx + 1;
          // Never move a reading-mode point away from its recorded place to fit a label.
          const displayCoords = this.options.readingMode ? stop.coords : getDeconflictedStopCoords(stop.coords);
          const isSelectedStop =
            this.activeRouteStopSelection?.routeId === route.id &&
            this.activeRouteStopSelection?.stopIndex === stopIdx;
          const stopEvidenceClass = stop.evidenceClass || route.evidenceClass || 'SCRIPTURE_TEXT';
          const isExternalStop = stopEvidenceClass === 'EXTERNAL_HISTORICAL_ATTESTATION';

          const stopIcon = L.divIcon({
            className: `leaflet-route-stop-marker route-stop-${route.id}-${stopNum}`,
            html: `
              <div class="route-stop-core ${isSelectedStop ? 'active-stop' : ''}" data-route-id="${route.id}" data-stop-index="${stopIdx}" style="--route-color: ${route.color}; border-color: ${route.color};">
                <span class="route-stop-num">${stopNum}</span>
              </div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });

          const stopMarker = L.marker([displayCoords.lat, displayCoords.lng], {
            pane: 'routeStopPane',
            icon: stopIcon,
            zIndexOffset: isSelectedStop ? 1550 : 1450,
            bubblingMouseEvents: false
          });

          const stopTooltipHtml = `
            <div class="map-tooltip-inner route-stop-tooltip" style="min-width: 235px; max-width: 310px;">
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap;">
                <span class="tooltip-badge" style="background: rgba(26, 22, 17, 0.95); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.45); font-family: var(--font-mono, monospace); font-size: 0.65rem; font-weight: 600; padding: 2px 7px; border-radius: 4px;">
                  ${route.name.toUpperCase()} · STOP ${stopNum} OF ${route.stops.length}
                </span>
              </div>
              <div class="tooltip-title" style="color: #fdfbf7; font-weight: 700; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.15rem; margin-bottom: 5px; line-height: 1.25;">
                Stop ${stopNum}: ${stop.name}
              </div>
              <div style="font-size: 0.76rem; color: #d8cfc0; margin-bottom: 6px; display: grid; grid-template-columns: auto 1fr; gap: 3px 8px; line-height: 1.4; background: rgba(22, 19, 15, 0.85); padding: 6px 9px; border-radius: 4px; border: 1px solid rgba(212, 175, 55, 0.22); border-left: 3px solid #d4af37;">
                <span style="color: #a89f91;">🗓️ When:</span><strong style="color: #f5efe6;">${stop.dateLabel}</strong>
                <span style="color: #a89f91;">🧭 Traveler:</span><span style="color: #f5efe6;">${route.travelerName}</span>
                <span style="color: #a89f91;">📖 Scripture:</span><strong style="color: #d4af37;">${stop.scriptureRef}</strong>
                ${isExternalStop && (stop.attestationSource || route.attestationSource) ? `<span style="color: #a89f91;">🏛️ Attestation:</span><span style="color: #c99738; font-size: 0.72rem;">${stop.attestationSource || route.attestationSource}</span>` : ''}
              </div>
              <div style="color: #e2e8f0; font-size: 0.77rem; line-height: 1.45;">
                ${stop.note}
              </div>
              <div class="tooltip-cta" style="margin-top: 6px; color: #c99738; font-size: 0.72rem; border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 5px; font-weight: 500;">
                Click waypoint to inspect full journey itinerary &amp; Scripture &rarr;
              </div>
            </div>
          `;

          this.bindManagedTooltip(stopMarker, stopTooltipHtml, { direction: 'top', offset: [0, -12] });
          stopMarker.on('click', (e: L.LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e);
            selectRouteStopHandler(route, stop, stopIdx);
          });

          routeMarkers.push(stopMarker);
          this.routeLayerGroup.addLayer(stopMarker);
        });
        this.routeStopMarkersMap.set(route.id, routeMarkers);
      }
    }

  }

  public renderActiveEra(): void {
    this.closeActiveTooltip();
    this.syncZoomClasses();
    this.empireLayerGroup.clearLayers();
    this.waterLayerGroup.clearLayers();
    this.routeLayerGroup.clearLayers();
    this.cityLayerGroup.clearLayers();
    this.siteLayerGroup.clearLayers();

    // 0. Biblical Waterways (Seas & Major Rivers)
    if (this.layers.rivers) {
      // Sort inland lakes by geodesic area descending so smaller lakes render on top in DOM
      const sortedSeas = [...WATER_FEATURES.seas].sort((a, b) => {
        return calculatePolygonGeodesicArea(b.polygon) - calculatePolygonGeodesicArea(a.polygon);
      });

      for (const sea of sortedSeas) {
        const latLngs = sea.polygon.map(pt => [pt.lat, pt.lng] as L.LatLngTuple);
        const defaultStyle: L.PathOptions = {
          pane: 'lakePane',
          color: 'rgba(56, 189, 248, 0.40)',
          fillColor: 'rgba(14, 116, 144, 0.14)',
          fillOpacity: 0.14,
          weight: 1.0,
          dashArray: undefined
        };
        const hoverStyle: L.PathOptions = {
          pane: 'lakePane',
          color: 'rgba(56, 189, 248, 0.90)',
          fillColor: 'rgba(14, 116, 144, 0.28)',
          fillOpacity: 0.28,
          weight: 1.8,
          dashArray: undefined
        };
        const seaPoly = L.polygon(latLngs, defaultStyle);
        seaPoly.on('mouseover', () => {
          seaPoly.setStyle(hoverStyle);
        });
        seaPoly.on('mouseout', () => {
          seaPoly.setStyle(defaultStyle);
        });

        const biblicalSubtitle = sea.biblicalLabel || 'Biblical Water Body';
        this.bindManagedTooltip(
          seaPoly,
          `<div class="map-tooltip-inner"><strong style="color: #e2d9c8; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.05rem;">${sea.name}</strong><br/><span style="font-size: 0.72rem; color: #a89f91; font-style: italic;">${biblicalSubtitle}</span></div>`,
          { direction: 'top' }
        );
        this.waterLayerGroup.addLayer(seaPoly);
      }

      for (const river of WATER_FEATURES.rivers) {
        const path = river.path.map(pt => [pt.lat, pt.lng] as L.LatLngTuple);
        const defaultStyle: L.PathOptions = {
          pane: 'riverPane',
          color: '#38bdf8',
          weight: 1.3,
          opacity: 0.50
        };
        const hoverStyle: L.PathOptions = {
          pane: 'riverPane',
          color: '#7dd3fc',
          weight: 2.2,
          opacity: 0.95
        };
        const riverLine = L.polyline(path, defaultStyle);
        riverLine.on('mouseover', () => {
          riverLine.setStyle(hoverStyle);
        });
        riverLine.on('mouseout', () => {
          riverLine.setStyle(defaultStyle);
        });

        const scriptureSub = river.scriptureAnchor ? `<br/><span style="font-size: 0.70rem; color: #d4af37; font-family: var(--font-mono, monospace);">${river.scriptureAnchor}</span>` : '';
        this.bindManagedTooltip(
          riverLine,
          `<div class="map-tooltip-inner"><strong style="color: #e2d9c8; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.02rem;">${river.name}</strong>${scriptureSub}<br/><span style="font-size: 0.72rem; color: #a89f91;">Biblical River Course</span></div>`,
          { direction: 'top' }
        );
        this.waterLayerGroup.addLayer(riverLine);
      }

      // Elegant Classical On-Water Typographic Annotations (rendered into waterPane)
      const waterLabels: Array<{
        title: string;
        sub?: string;
        coords: [number, number];
        regional?: boolean;
      }> = [
        { title: 'THE GREAT SEA', sub: 'MEDITERRANEAN SEA · YAM GADOL', coords: [33.8, 32.5] },
        { title: 'THE RED SEA', sub: 'YAM SUPH', coords: [27.0, 35.0] },
        { title: 'GULF OF SUEZ', coords: [28.65, 33.15], regional: true },
        { title: 'GULF OF AQABA', coords: [28.85, 34.72], regional: true },
        { title: 'SEA OF GALILEE', sub: 'CHINNERETH', coords: [32.815, 35.58], regional: true },
        { title: 'DEAD SEA', sub: 'THE SALT SEA', coords: [31.48, 35.48], regional: true },
        { title: 'PERSIAN GULF', sub: 'LOWER SEA', coords: [27.5, 51.5] },
        { title: 'BLACK SEA', coords: [42.8, 35.0] }
      ];

      for (const wLabel of waterLabels) {
        const waterIcon = L.divIcon({
          className: `leaflet-water-label${wLabel.regional ? ' water-label-regional' : ''}`,
          html: `
            <div class="water-label-title">${wLabel.title}</div>
            ${wLabel.sub ? `<div class="water-label-sub">${wLabel.sub}</div>` : ''}
          `,
          iconSize: [220, 36],
          iconAnchor: [110, 18]
        });
        const marker = L.marker(wLabel.coords, {
          pane: 'waterPane',
          icon: waterIcon,
          interactive: false
        });
        this.waterLayerGroup.addLayer(marker);
      }
    }

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
      // Deterministic Z-Index ordering by calculated geodesic area descending:
      // Macro empires (millions of km²) render FIRST (in background at DOM bottom).
      // Smaller focal kingdoms (Judah, Israel, Phoenicia, Moab, etc.) render LAST (in foreground on top).
      const sortedEmpires = [...targetEmpires].sort((a, b) => {
        return calculatePolygonGeodesicArea(b.approximateBounds) - calculatePolygonGeodesicArea(a.approximateBounds);
      });

      // Identify active empires that have contested boundaries or overlap with other active realms
      const activeEmpiresWithContestedBorders = new Set<string>();
      for (const empire of sortedEmpires) {
        if (empire.contestedBorder || empire.dashArray) {
          activeEmpiresWithContestedBorders.add(empire.id);
          continue;
        }
        for (const other of sortedEmpires) {
          if (other.id !== empire.id && doPolygonsOverlap(empire.approximateBounds, other.approximateBounds)) {
            activeEmpiresWithContestedBorders.add(empire.id);
            activeEmpiresWithContestedBorders.add(other.id);
          }
        }
      }

      const badgeMap: Record<FactionType, { text: string; bg: string; color: string; border: string }> = {
        covenant: { text: 'COVENANT NATION · ROYAL DAVIDIC LINE', bg: 'rgba(234, 179, 8, 0.2)', color: '#fde047', border: 'rgba(234, 179, 8, 0.5)' },
        israel: { text: 'NORTHERN KINGDOM · 10 TRIBES', bg: 'rgba(34, 197, 94, 0.2)', color: '#86efac', border: 'rgba(34, 197, 94, 0.5)' },
        hostile: { text: 'HOSTILE EMPIRE / ENEMY', bg: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: 'rgba(239, 68, 68, 0.5)' },
        allied: { text: 'ALLIED / FRIENDLY REGION', bg: 'rgba(212, 175, 55, 0.18)', color: '#d4af37', border: 'rgba(212, 175, 55, 0.45)' },
        global_power: { text: 'CONTEMPORARY WORLD CIVILIZATION', bg: 'rgba(192, 132, 252, 0.2)', color: '#e9d5ff', border: 'rgba(192, 132, 252, 0.5)' }
      };

      for (const empire of sortedEmpires) {
        const smoothed = smoothPolygonCoordinates(empire.approximateBounds, 2);
        const latLngs = smoothed.map(b => [b.lat, b.lng] as L.LatLngTuple);
        const isCompact = !!this.options.compact;
        const hasContestedBorder = activeEmpiresWithContestedBorders.has(empire.id);
        const dashStyle = hasContestedBorder ? (empire.dashArray || '6, 5') : undefined;

        // Soft Outer Cartographic Halo (Water-color border wash; dashed if boundary is contested/overlapping)
        const haloStyle: L.PathOptions = {
          pane: 'empirePane',
          color: empire.color,
          weight: isCompact ? 4.5 : 5.5,
          opacity: isCompact ? 0.18 : 0.25,
          dashArray: hasContestedBorder ? '8, 6' : undefined,
          fill: false,
          interactive: false,
          lineCap: 'round',
          lineJoin: 'round'
        };
        const closedLatLngs = latLngs.concat([latLngs[0]]);
        const halo = L.polyline(closedLatLngs, haloStyle);
        this.empireLayerGroup.addLayer(halo);

        const defaultStyle: L.PathOptions = {
          pane: 'empirePane',
          color: empire.color,
          fillColor: empire.fillColor || empire.color,
          fillOpacity: isCompact ? 0.10 : 0.14,
          weight: isCompact ? 1.4 : 1.6,
          opacity: isCompact ? 0.82 : 0.88,
          dashArray: dashStyle,
          lineCap: 'round',
          lineJoin: 'round'
        };
        const hoverStyle: L.PathOptions = {
          pane: 'empirePane',
          color: empire.color,
          fillColor: empire.fillColor || empire.color,
          fillOpacity: isCompact ? 0.22 : 0.26,
          weight: isCompact ? 2.2 : 2.6,
          opacity: 1.0,
          dashArray: dashStyle,
          lineCap: 'round',
          lineJoin: 'round'
        };

        const polygon = L.polygon(latLngs, defaultStyle);

        polygon.on('mouseover', () => {
          polygon.setStyle(hoverStyle);
          this.activeHoveredPolygon = { poly: polygon, defaultStyle };
        });
        polygon.on('mouseout', () => {
          polygon.setStyle(defaultStyle);
          if (this.activeHoveredPolygon?.poly === polygon) {
            this.activeHoveredPolygon = null;
          }
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
          <div class="map-tooltip-inner empire-tooltip" style="min-width: 220px; max-width: 300px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px; flex-wrap: wrap;">
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
              <div style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed rgba(212, 175, 55, 0.2); font-size: 0.72rem; color: #d4af37; line-height: 1.3;">
                <strong>✦ Scripture Connection:</strong> ${empire.biblicalIntersection}
              </div>
            ` : ''}
            <div class="tooltip-cta" style="margin-top: 5px; color: #c99738; font-size: 0.72rem; border-top: 1px dashed rgba(212, 175, 55, 0.2); padding-top: 4px; font-weight: 500;">
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
          const shortCapitalLabel = empire.capital.name.replace(/\s*\([^)]*\)/g, '').trim();

          const capIcon = L.divIcon({
            className: 'leaflet-capital-marker',
            html: `
              <div class="capital-marker-dot" style="background: ${empire.color}; border: 1.5px solid #ffffff; box-shadow: 0 0 8px ${empire.color}; width: 8px; height: 8px; border-radius: 50%;"></div>
              <div class="${labelClass}" data-preferred-dir="${dirClass}">${shortCapitalLabel}</div>
            `,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });
          const capMarker = L.marker([empire.capital.coords.lat, empire.capital.coords.lng], {
            pane: 'capitalPane',
            icon: capIcon,
            zIndexOffset: capZIndex
          });

          capMarker.on('click', () => {
            if (this.options.onSelectEmpire) {
              this.options.onSelectEmpire(empire);
            }
          });

          const capitalTooltipHtml = `
            <div class="map-tooltip-inner capital-tooltip" style="min-width: 220px; max-width: 290px;">
              <span class="tooltip-badge" style="background: ${badge.bg}; color: ${badge.color}; border: 1px solid ${badge.border}; font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 3px;">CAPITAL · ${badge.text}</span>
              <div style="color: #ffd700; font-weight: 700; font-size: 1.05rem; margin: 3px 0 2px;">${empire.capital.name}</div>
              <div style="color: #cbd5e1; font-size: 0.78rem;">Imperial Seat of ${empire.name}</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 3px;">👥 Population: ${empire.populationEstimate}</div>
              <div style="font-size: 0.75rem; color: #94a3b8;">📐 Kingdom Extent: ${empire.approximateArea}</div>
              <div style="font-size: 0.73rem; color: #d4af37; margin-top: 4px; border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 4px;"><strong>✦ Biblical Connection:</strong> ${empire.biblicalIntersection}</div>
            </div>
          `;

          this.bindManagedTooltip(capMarker, capitalTooltipHtml, { direction: 'top', offset: [0, -12] });
          this.empireLayerGroup.addLayer(capMarker);
        }
      }

      // 1.5. Canonical Contested / Argued Frontier Zones (Overlapping Disputed Borderlands)
      // Rendered with prominent dashed lines (dashArray: '6, 6') denoting shared/contested sovereignty.
      const isCompact = !!this.options.compact;
      const activeEmpireIds = new Set(targetEmpires.map(e => e.id));
      const relevantContestedZones = CONTESTED_FRONTIER_ZONES.filter(zone => {
        const isEraMatch = zone.eraIds.includes(this.activeEra.id) || zone.eraIds.includes('all');
        if (!isEraMatch) return false;
        return zone.claimedByEmpireIds.some(empId => activeEmpireIds.has(empId));
      });

      for (const zone of relevantContestedZones) {
        const smoothed = smoothPolygonCoordinates(zone.bounds, 2);
        const latLngs = smoothed.map(b => [b.lat, b.lng] as L.LatLngTuple);
        const closedLatLngs = latLngs.concat([latLngs[0]]);

        // Contested Outer Halo with Dashed Cartographic Stroke
        const contestedHalo = L.polyline(closedLatLngs, {
          pane: 'empirePane',
          color: '#f59e0b',
          weight: isCompact ? 5.0 : 6.0,
          opacity: 0.22,
          dashArray: '8, 6',
          fill: false,
          interactive: false,
          lineCap: 'round',
          lineJoin: 'round'
        });
        this.empireLayerGroup.addLayer(contestedHalo);

        // Contested Argued Territory Polygon with Distinctive Dashed Border
        const contestedPolyStyle: L.PathOptions = {
          pane: 'empirePane',
          color: '#f59e0b',
          fillColor: 'rgba(245, 158, 11, 0.14)',
          fillOpacity: isCompact ? 0.16 : 0.20,
          weight: isCompact ? 1.8 : 2.2,
          opacity: 0.95,
          dashArray: '6, 6',
          lineCap: 'round',
          lineJoin: 'round'
        };
        const contestedHoverStyle: L.PathOptions = {
          pane: 'empirePane',
          color: '#fbbf24',
          fillColor: 'rgba(251, 191, 36, 0.26)',
          fillOpacity: isCompact ? 0.28 : 0.32,
          weight: isCompact ? 2.6 : 3.0,
          opacity: 1.0,
          dashArray: '6, 6',
          lineCap: 'round',
          lineJoin: 'round'
        };

        const contestedPoly = L.polygon(latLngs, contestedPolyStyle);

        contestedPoly.on('mouseover', () => {
          contestedPoly.setStyle(contestedHoverStyle);
        });
        contestedPoly.on('mouseout', () => {
          contestedPoly.setStyle(contestedPolyStyle);
        });

        const claimingNames = zone.claimedByEmpireIds
          .map(id => WORLD_EMPIRES_GEO.find(e => e.id === id)?.name || id)
          .join(' · ');

        const contestedTooltipHtml = `
          <div class="map-tooltip-inner contested-tooltip" style="min-width: 240px; max-width: 320px;">
            <span class="tooltip-badge" style="background: rgba(245, 158, 11, 0.25); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.6); font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 3px;">⚔️ CONTESTED FRONTIER · ARGUED BORDERLAND</span>
            <div class="tooltip-title" style="color: #ffd700; font-weight: 700; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.15rem; margin-top: 3px; margin-bottom: 4px;">${zone.name}</div>
            <div style="font-size: 0.78rem; color: #f1f5f9; margin-bottom: 5px;">
              <strong style="color: #fbbf24;">Claimed By:</strong> ${claimingNames}
            </div>
            <div style="font-size: 0.74rem; color: #e2e8f0; line-height: 1.35; border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 4px;">
              <strong style="color: #ffd700;">✦ Biblical Record:</strong> ${zone.biblicalRecord}
            </div>
            <div style="font-size: 0.72rem; color: #a89f91; margin-top: 4px; line-height: 1.3;">
              <strong>Historical Setting:</strong> ${zone.historicalContext}
            </div>
            <div class="tooltip-cta" style="margin-top: 5px; color: #c99738; font-size: 0.72rem; border-top: 1px dashed rgba(212, 175, 55, 0.2); padding-top: 4px; font-weight: 500;">
              Dashed borders denote historically argued territorial sovereignty &rarr;
            </div>
          </div>
        `;

        this.bindManagedTooltip(contestedPoly, contestedTooltipHtml, { direction: 'top', offset: [0, -10] });
        this.empireLayerGroup.addLayer(contestedPoly);
      }
    }

    this.renderRoutes();

    // 3. Biblical Cities (Era-filtered so Greco-Roman/NT cities don't crowd Old Testament Levant)
    if (this.layers.cities) {
      const otEraIds = new Set([
        'patriarchs',
        'exodus',
        'judges',
        'united_monarchy',
        'divided_monarchy_prophets',
        '2kings_jehu',
        '2kings_fall_samaria',
        'assyrian_siege',
        'babylonian_exile',
        'persian_restoration'
      ]);
      const ntOnlyCityIds = new Set([
        'caesarea-maritima',
        'capernaum',
        'nazareth',
        'antioch-syria',
        'corinth',
        'athens',
        'rome',
        'ephesus'
      ]);

      for (const city of BIBLICAL_CITIES) {
        // Skip if this city is already prominently rendered as an active imperial capital
        if (activeCapitalNames.has(city.name.toLowerCase())) {
          continue;
        }
        if (!isAll && !this.showAllSites && otEraIds.has(this.activeEra.id) && ntOnlyCityIds.has(city.id)) {
          continue;
        }

        const cityIcon = L.divIcon({
          className: 'leaflet-city-marker',
          html: `<div class="city-marker-dot"></div><div class="city-marker-label">${city.name}</div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5]
        });

        const marker = L.marker([city.coords.lat, city.coords.lng], {
          pane: 'cityPane',
          icon: cityIcon,
          zIndexOffset: 500
        });

        const cityTooltipHtml = `
          <div class="map-tooltip-inner">
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
        const shortArtifactLabel = site.artifactName
          .replace(/\s*\([^)]*\)/g, '')
          .replace(/\s+of\s+(?:Sennacherib|Shalmaneser\s+III|Ur|Sargon\s+II)$/i, '')
          .trim();

        const goldIcon = L.divIcon({
          className: `leaflet-gold-marker ${isEraHighlight ? 'pulse' : ''}`,
          html: `
            <div class="gold-coin-core">
              <span class="core-inner">&#10022;</span>
            </div>
            ${isEraHighlight ? '<div class="gold-coin-halo"></div>' : ''}
            <div class="gold-coin-label">${shortArtifactLabel}</div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([item.displayCoords.lat, item.displayCoords.lng], {
          pane: 'sitePane',
          icon: goldIcon,
          zIndexOffset: 1600
        });

        const display = getArtifactDisplay(site);
        const siteTooltipHtml = `
          <div class="map-tooltip-inner gold-tooltip" style="min-width: 220px; max-width: 300px;">
            <span class="tooltip-badge">SURVIVING ARTIFACT · ${site.ancientRegion.toUpperCase()}</span>
            <div class="tooltip-title" style="color: #ffd700; font-weight: 700; font-family: var(--font-serif, 'EB Garamond', serif); font-size: 1.05rem; margin-bottom: 2px;">${site.artifactName}</div>
            <div style="color: #cbd5e1; font-size: 0.78rem; margin-bottom: 4px;">${site.name} · ${display.date} · ${isArtifactReviewed(site.id) ? 'Reviewed source' : 'Review pending'}</div>
            <div class="tooltip-scripture-connection" style="margin-top: 5px; padding: 5px 8px; background: rgba(212, 175, 55, 0.12); border-left: 2px solid #d4af37; border-radius: 3px; font-size: 0.74rem; color: #fef08a; line-height: 1.35;">
              <strong>✦ Scripture Connection:</strong><br/>
              ${display.connection}
            </div>
            <span class="tooltip-cta" style="margin-top: 6px; display: block; color: #c99738; font-size: 0.74rem; font-weight: 500;">Click to view discovery card in companion panel &rarr;</span>
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

    this.scheduleLabelDeconfliction();
  }

  public destroy(): void {
    this.map.remove();
  }
}
