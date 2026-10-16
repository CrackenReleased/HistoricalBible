/**
 * src/engine/ancientMap.ts
 * 60FPS Matte Canvas Cartographic Engine for HistoricalBible.com
 * Renders the Ancient Near East & Mediterranean with real-world geodetic coordinates.
 * Features:
 * - High-DPI canvas rendering
 * - Silky smooth Pan & Zoom (Mouse drag, Touch drag, Wheel zoom)
 * - Animated camera focus transitions
 * - Dynamic layers: Archaeological Discoveries, World Empires, Biblical Routes, Cities & Waterways
 * - Interactive hover tooltips and selection callbacks
 */

import {
  MAP_BOUNDS,
  WATER_FEATURES,
  ARCHAEOLOGICAL_SITES,
  BIBLICAL_CITIES,
  BIBLICAL_ROUTES,
  WORLD_EMPIRES_GEO,
  REGION_PRESETS,
  type GeoCoordinate,
  type ArchaeologicalSite,
  type BiblicalCity,
  type BiblicalRoute,
  type WorldEmpireRegion,
  type MapRegionPreset
} from '../data/ancientMapData';

export interface AncientMapOptions {
  container: HTMLElement;
  compact?: boolean; // True when rendered inside the study desk panel
  initialRegion?: string;
  onSelectSite?: (site: ArchaeologicalSite) => void;
  onSelectCity?: (city: BiblicalCity) => void;
}

export class AncientMapCanvas {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: AncientMapOptions;

  // Viewport / Camera Transform
  private panX = 0;
  private panY = 0;
  private zoom = 1.0;
  private minZoom = 0.75;
  private maxZoom = 9.0;

  // Interaction State
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragMoved = false;

  // Hover & Selection State
  private hoveredSite: ArchaeologicalSite | null = null;
  private hoveredCity: BiblicalCity | null = null;
  private selectedSiteId: string | null = null;
  private highlightedFigureId: string | null = null;

  // Layer Visibility
  public layers = {
    archaeology: true,
    empires: true,
    routes: true,
    cities: true,
    rivers: true,
  };

  // UI Elements
  private tooltipEl: HTMLElement;
  private controlsEl: HTMLElement;
  private resizeObserver: ResizeObserver | null = null;
  private animFrameId: number | null = null;

  constructor(options: AncientMapOptions) {
    this.options = options;
    this.container = options.container;

    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.container.style.backgroundColor = '#080c11';

    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.cursor = 'grab';
    this.container.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not supported');
    this.ctx = ctx;

    // Tooltip Element
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'ancient-map-tooltip';
    this.tooltipEl.style.position = 'absolute';
    this.tooltipEl.style.pointerEvents = 'none';
    this.tooltipEl.style.opacity = '0';
    this.tooltipEl.style.transition = 'opacity 0.15s ease';
    this.tooltipEl.style.zIndex = '20';
    this.container.appendChild(this.tooltipEl);

    // Controls Element
    this.controlsEl = document.createElement('div');
    this.controlsEl.className = 'ancient-map-controls';
    this.container.appendChild(this.controlsEl);
    this.buildControls();

    this.initCanvasSize();
    this.bindEvents();

    if (options.initialRegion) {
      this.jumpToPreset(options.initialRegion);
    } else {
      this.resetView();
    }
  }

  private initCanvasSize(): void {
    const dpr = window.devicePixelRatio || 1;
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || (this.options.compact ? 420 : 640);

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
  }

  private buildControls(): void {
    this.controlsEl.innerHTML = `
      <div class="map-btn-group" role="group" aria-label="Map zoom controls">
        <button type="button" class="map-ctrl-btn" id="map-zoom-in" title="Zoom In" aria-label="Zoom in">+</button>
        <button type="button" class="map-ctrl-btn" id="map-zoom-out" title="Zoom Out" aria-label="Zoom out">&minus;</button>
        <button type="button" class="map-ctrl-btn" id="map-reset-view" title="Reset View" aria-label="Reset view">&#x21bb;</button>
      </div>
    `;

    this.controlsEl.querySelector('#map-zoom-in')?.addEventListener('click', () => {
      this.zoomAt(this.container.clientWidth / 2, this.container.clientHeight / 2, 1.35);
    });
    this.controlsEl.querySelector('#map-zoom-out')?.addEventListener('click', () => {
      this.zoomAt(this.container.clientWidth / 2, this.container.clientHeight / 2, 0.75);
    });
    this.controlsEl.querySelector('#map-reset-view')?.addEventListener('click', () => {
      this.resetView();
    });
  }

  public resetView(): void {
    const w = this.container.clientWidth || 600;
    const h = this.container.clientHeight || 420;
    this.zoom = this.options.compact ? 1.15 : 1.0;
    this.panX = w / 2;
    this.panY = h / 2;
    this.render();
  }

  public jumpToPreset(presetId: string): void {
    const preset = REGION_PRESETS.find(p => p.id === presetId) || REGION_PRESETS[0];
    this.animateToCoords(preset.center, preset.zoom);
  }

  public focusOnFigure(figureId: string): void {
    this.highlightedFigureId = figureId;

    // Find any archaeological site linked to this figure
    const site = ARCHAEOLOGICAL_SITES.find(s => s.figureId === figureId);
    if (site) {
      this.selectedSiteId = site.id;
      this.animateToCoords(site.coords, this.options.compact ? 3.0 : 3.5);
      if (this.options.onSelectSite) {
        this.options.onSelectSite(site);
      }
      return;
    }

    // Otherwise check for routes or cities associated with figure
    const route = BIBLICAL_ROUTES.find(r => r.figureId === figureId);
    if (route && route.stops.length > 0) {
      const midStop = route.stops[Math.floor(route.stops.length / 2)];
      this.animateToCoords(midStop.coords, 2.2);
      return;
    }

    const city = BIBLICAL_CITIES.find(c => c.figureIds?.includes(figureId));
    if (city) {
      this.animateToCoords(city.coords, 2.8);
      return;
    }

    this.resetView();
  }

  public animateToCoords(coords: GeoCoordinate, targetZoom: number): void {
    const w = this.container.clientWidth || 600;
    const h = this.container.clientHeight || 420;

    // Convert target coordinates to normalized projected coordinates
    const p = this.projectGeoToNormalized(coords);

    const startZoom = this.zoom;
    const startPanX = this.panX;
    const startPanY = this.panY;

    // In projected space: canvasX = panX + (normX - 0.5) * baseWidth * zoom
    // We want target coords to appear at (w / 2, h / 2)
    const baseW = Math.max(w, 800);
    const baseH = Math.max(h, 500);

    const targetPanX = w / 2 - (p.x - 0.5) * baseW * targetZoom;
    const targetPanY = h / 2 - (p.y - 0.5) * baseH * targetZoom;

    const duration = 500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - t, 3);

      this.zoom = startZoom + (targetZoom - startZoom) * ease;
      this.panX = startPanX + (targetPanX - startPanX) * ease;
      this.panY = startPanY + (targetPanY - startPanY) * ease;

      this.render();

      if (t < 1) {
        this.animFrameId = requestAnimationFrame(animate);
      }
    };

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = requestAnimationFrame(animate);
  }

  /**
   * Projects WGS84 (lat, lng) to normalized (0..1, 0..1) coordinate space
   */
  private projectGeoToNormalized(coord: GeoCoordinate): { x: number; y: number } {
    const x = (coord.lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
    // Invert latitude because canvas Y increases downwards
    const y = (MAP_BOUNDS.maxLat - coord.lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
    return { x, y };
  }

  /**
   * Projects normalized coordinate to Canvas screen pixel (x, y)
   */
  private normalizedToScreen(normX: number, normY: number): { x: number; y: number } {
    const w = this.container.clientWidth || 600;
    const h = this.container.clientHeight || 420;
    const baseW = Math.max(w, 800);
    const baseH = Math.max(h, 500);

    const screenX = this.panX + (normX - 0.5) * baseW * this.zoom;
    const screenY = this.panY + (normY - 0.5) * baseH * this.zoom;
    return { x: screenX, y: screenY };
  }

  /**
   * Inverse projection: Screen pixel (x, y) to GeoCoordinate (lat, lng)
   */
  private screenToGeo(screenX: number, screenY: number): GeoCoordinate {
    const w = this.container.clientWidth || 600;
    const h = this.container.clientHeight || 420;
    const baseW = Math.max(w, 800);
    const baseH = Math.max(h, 500);

    const normX = (screenX - this.panX) / (baseW * this.zoom) + 0.5;
    const normY = (screenY - this.panY) / (baseH * this.zoom) + 0.5;

    const lng = MAP_BOUNDS.minLng + normX * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng);
    const lat = MAP_BOUNDS.maxLat - normY * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);
    return { lat, lng };
  }

  private geoToScreen(coord: GeoCoordinate): { x: number; y: number } {
    const norm = this.projectGeoToNormalized(coord);
    return this.normalizedToScreen(norm.x, norm.y);
  }

  private zoomAt(clientX: number, clientY: number, factor: number): void {
    const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom * factor));
    if (newZoom === this.zoom) return;

    // Zoom centered on the cursor
    this.panX = clientX - (clientX - this.panX) * (newZoom / this.zoom);
    this.panY = clientY - (clientY - this.panY) * (newZoom / this.zoom);
    this.zoom = newZoom;
    this.render();
  }

  private bindEvents(): void {
    // Mouse drag
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragMoved = false;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
      this.canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.dragMoved = true;
        this.panX = e.clientX - this.dragStartX;
        this.panY = e.clientY - this.dragStartY;
        this.render();
        return;
      }

      // Hover detection
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.checkHover(mouseX, mouseY);
    });

    window.addEventListener('mouseup', (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
        if (!this.dragMoved) {
          const rect = this.canvas.getBoundingClientRect();
          this.handleClick(e.clientX - rect.left, e.clientY - rect.top);
        }
      }
    });

    // Wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      this.zoomAt(clientX, clientY, factor);
    }, { passive: false });

    // Touch support (1 finger pan, 2 finger pinch zoom)
    let initialTouchDist = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.dragMoved = false;
        this.dragStartX = e.touches[0].clientX - this.panX;
        this.dragStartY = e.touches[0].clientY - this.panY;
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        initialTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        this.dragMoved = true;
        this.panX = e.touches[0].clientX - this.dragStartX;
        this.panY = e.touches[0].clientY - this.dragStartY;
        this.render();
      } else if (e.touches.length === 2 && initialTouchDist > 0) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = currentDist / initialTouchDist;
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const rect = this.canvas.getBoundingClientRect();
        this.zoomAt(midX - rect.left, midY - rect.top, factor);
        initialTouchDist = currentDist;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (this.isDragging && !this.dragMoved && e.changedTouches.length === 1) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.changedTouches[0];
        this.handleClick(touch.clientX - rect.left, touch.clientY - rect.top);
      }
      this.isDragging = false;
      initialTouchDist = 0;
    });

    // Resize observer
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.initCanvasSize();
        this.render();
      });
      this.resizeObserver.observe(this.container);
    }
  }

  private checkHover(mouseX: number, mouseY: number): void {
    let hoveredSite: ArchaeologicalSite | null = null;
    let hoveredCity: BiblicalCity | null = null;

    if (this.layers.archaeology) {
      for (const site of ARCHAEOLOGICAL_SITES) {
        const pt = this.geoToScreen(site.coords);
        const dist = Math.hypot(mouseX - pt.x, mouseY - pt.y);
        if (dist <= 14) {
          hoveredSite = site;
          break;
        }
      }
    }

    if (!hoveredSite && this.layers.cities) {
      for (const city of BIBLICAL_CITIES) {
        const pt = this.geoToScreen(city.coords);
        const dist = Math.hypot(mouseX - pt.x, mouseY - pt.y);
        if (dist <= 10) {
          hoveredCity = city;
          break;
        }
      }
    }

    if (hoveredSite !== this.hoveredSite || hoveredCity !== this.hoveredCity) {
      this.hoveredSite = hoveredSite;
      this.hoveredCity = hoveredCity;
      this.canvas.style.cursor = (hoveredSite || hoveredCity) ? 'pointer' : 'grab';
      this.updateTooltip(mouseX, mouseY);
      this.render();
    }
  }

  private updateTooltip(mouseX: number, mouseY: number): void {
    if (this.hoveredSite) {
      const site = this.hoveredSite;
      this.tooltipEl.innerHTML = `
        <div class="map-tooltip-badge">SURVIVING ARTIFACT &middot; ${site.ancientRegion.toUpperCase()}</div>
        <div class="map-tooltip-title">${site.artifactName}</div>
        <div class="map-tooltip-sub">${site.name} (${site.modernCountry}) &middot; ${site.artifactDate}</div>
        <div class="map-tooltip-ref">${site.scriptureRef}</div>
        <div class="map-tooltip-cta">Click to explore details &rarr;</div>
      `;
      this.tooltipEl.style.left = `${mouseX + 16}px`;
      this.tooltipEl.style.top = `${mouseY - 24}px`;
      this.tooltipEl.style.opacity = '1';
    } else if (this.hoveredCity) {
      const city = this.hoveredCity;
      this.tooltipEl.innerHTML = `
        <div class="map-tooltip-badge">BIBLICAL CITY &middot; ${city.region.toUpperCase()}</div>
        <div class="map-tooltip-title">${city.name}</div>
        <div class="map-tooltip-meaning">&ldquo;${city.hitchcockMeaning}&rdquo;</div>
        <div class="map-tooltip-ref">${city.scriptureAnchor}</div>
      `;
      this.tooltipEl.style.left = `${mouseX + 16}px`;
      this.tooltipEl.style.top = `${mouseY - 24}px`;
      this.tooltipEl.style.opacity = '1';
    } else {
      this.tooltipEl.style.opacity = '0';
    }
  }

  private handleClick(mouseX: number, mouseY: number): void {
    if (this.layers.archaeology) {
      for (const site of ARCHAEOLOGICAL_SITES) {
        const pt = this.geoToScreen(site.coords);
        const dist = Math.hypot(mouseX - pt.x, mouseY - pt.y);
        if (dist <= 16) {
          this.selectedSiteId = site.id;
          if (this.options.onSelectSite) {
            this.options.onSelectSite(site);
          }
          this.render();
          return;
        }
      }
    }

    if (this.layers.cities) {
      for (const city of BIBLICAL_CITIES) {
        const pt = this.geoToScreen(city.coords);
        const dist = Math.hypot(mouseX - pt.x, mouseY - pt.y);
        if (dist <= 12) {
          if (this.options.onSelectCity) {
            this.options.onSelectCity(city);
          }
          return;
        }
      }
    }
  }

  public render(): void {
    const w = this.container.clientWidth || 600;
    const h = this.container.clientHeight || 420;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // 1. Ancient Landmass Background & Cartographic Grid
    this.renderLandmass(ctx, w, h);

    // 2. Water Bodies & Seas
    this.renderSeas(ctx);

    // 3. Rivers & Lakes
    if (this.layers.rivers) {
      this.renderRivers(ctx);
    }

    // 4. World Empires Territories
    if (this.layers.empires) {
      this.renderEmpires(ctx);
    }

    // 5. Biblical Routes & Journeys
    if (this.layers.routes) {
      this.renderRoutes(ctx);
    }

    // 6. Biblical Cities
    if (this.layers.cities) {
      this.renderCities(ctx);
    }

    // 7. Archaeological Discoveries & Inscriptions
    if (this.layers.archaeology) {
      this.renderArchaeologicalSites(ctx);
    }

    // 8. Scale & Cartographic Compass Rose
    this.renderCompassAndScale(ctx, w, h);
  }

  private renderLandmass(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // Deep stone parchment background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, Math.max(w, h));
    bgGrad.addColorStop(0, '#111823');
    bgGrad.addColorStop(0.65, '#0c1219');
    bgGrad.addColorStop(1, '#070a0e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle latitude / longitude graticules
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.04)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);

    for (let lat = 26; lat <= 44; lat += 4) {
      const p1 = this.geoToScreen({ lat, lng: MAP_BOUNDS.minLng });
      const p2 = this.geoToScreen({ lat, lng: MAP_BOUNDS.maxLng });
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    for (let lng = 12; lng <= 52; lng += 6) {
      const p1 = this.geoToScreen({ lat: MAP_BOUNDS.minLat, lng });
      const p2 = this.geoToScreen({ lat: MAP_BOUNDS.maxLat, lng });
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  private renderSeas(ctx: CanvasRenderingContext2D): void {
    for (const sea of WATER_FEATURES.seas) {
      if (sea.polygon.length < 3) continue;

      ctx.beginPath();
      const first = this.geoToScreen(sea.polygon[0]);
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < sea.polygon.length; i++) {
        const pt = this.geoToScreen(sea.polygon[i]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();

      // Deep aquatic slate fill
      ctx.fillStyle = '#060a10';
      ctx.fill();

      // Illuminated coastline rim
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Subtle label for major seas if zoomed in enough
      if (this.zoom > 1.2 && sea.name === 'Mediterranean Sea') {
        const labelPt = this.geoToScreen({ lat: 34.5, lng: 28.0 });
        ctx.save();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.font = 'italic 500 13px "EB Garamond", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('THE GREAT SEA (MEDITERRANEAN)', labelPt.x, labelPt.y);
        ctx.restore();
      }
    }
  }

  private renderRivers(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = '#22526e';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const river of WATER_FEATURES.rivers) {
      if (river.path.length < 2) continue;

      ctx.beginPath();
      const start = this.geoToScreen(river.path[0]);
      ctx.moveTo(start.x, start.y);

      for (let i = 1; i < river.path.length; i++) {
        const pt = this.geoToScreen(river.path[i]);
        ctx.lineTo(pt.x, pt.y);
      }

      ctx.lineWidth = river.name.includes('Jordan') ? Math.max(1.8, 1.2 * this.zoom) : Math.max(2.2, 1.5 * this.zoom);
      ctx.stroke();

      // River label when zoomed
      if (this.zoom > 1.8 && river.path.length > 2) {
        const midIndex = Math.floor(river.path.length / 2);
        const midPt = this.geoToScreen(river.path[midIndex]);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.font = 'italic 11px "EB Garamond", Georgia, serif';
        ctx.fillText(river.name, midPt.x + 8, midPt.y);
      }
    }
    ctx.restore();
  }

  private renderEmpires(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const empire of WORLD_EMPIRES_GEO) {
      if (empire.approximateBounds.length < 3) continue;

      ctx.beginPath();
      const first = this.geoToScreen(empire.approximateBounds[0]);
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < empire.approximateBounds.length; i++) {
        const pt = this.geoToScreen(empire.approximateBounds[i]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();

      ctx.fillStyle = empire.fillColor;
      ctx.fill();

      ctx.strokeStyle = empire.color;
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Empire Name Label in Territory
      const capPt = this.geoToScreen(empire.capital.coords);
      ctx.fillStyle = empire.color;
      ctx.font = '600 11px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(empire.name.toUpperCase(), capPt.x, capPt.y - 12);
    }

    ctx.restore();
  }

  private renderRoutes(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const route of BIBLICAL_ROUTES) {
      if (route.stops.length < 2) continue;

      ctx.beginPath();
      const first = this.geoToScreen(route.stops[0].coords);
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < route.stops.length; i++) {
        const pt = this.geoToScreen(route.stops[i].coords);
        ctx.lineTo(pt.x, pt.y);
      }

      ctx.strokeStyle = route.color;
      ctx.lineWidth = 2.2;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Render route waypoints
      for (const stop of route.stops) {
        const pt = this.geoToScreen(stop.coords);
        ctx.fillStyle = route.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private renderCities(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const city of BIBLICAL_CITIES) {
      const pt = this.geoToScreen(city.coords);

      // Only show secondary cities at higher zoom levels
      if (city.prominence === 2 && this.zoom < 1.4) continue;

      const isHovered = this.hoveredCity?.id === city.id;

      // City Dot
      ctx.fillStyle = isHovered ? '#f0ede6' : '#94a3b8';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isHovered ? 4.5 : 3.0, 0, Math.PI * 2);
      ctx.fill();

      // City Name
      ctx.fillStyle = isHovered ? '#f0ede6' : 'rgba(226, 232, 240, 0.75)';
      ctx.font = isHovered
        ? '600 12px "EB Garamond", Georgia, serif'
        : '500 11px "EB Garamond", Georgia, serif';
      ctx.textAlign = 'left';
      ctx.fillText(city.name, pt.x + 6, pt.y + 3);
    }

    ctx.restore();
  }

  private renderArchaeologicalSites(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const site of ARCHAEOLOGICAL_SITES) {
      const pt = this.geoToScreen(site.coords);
      const isHovered = this.hoveredSite?.id === site.id;
      const isSelected = this.selectedSiteId === site.id;
      const isFigureHighlight = this.highlightedFigureId && site.figureId === this.highlightedFigureId;

      // Outer Pulsing Gold Halo
      if (isHovered || isSelected || isFigureHighlight) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.22)';
        ctx.fill();

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Main Gold Marker Ring
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#ffffff' : '#d4af37';
      ctx.fill();
      ctx.strokeStyle = '#090c10';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center Core
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#090c10';
      ctx.fill();

      // Label
      if (this.zoom > 1.3 || isHovered || isSelected || isFigureHighlight) {
        ctx.fillStyle = isSelected ? '#ffd700' : '#f0ede6';
        ctx.font = '600 11px "Inter", -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(site.artifactName, pt.x, pt.y - 12);
      }
    }

    ctx.restore();
  }

  private renderCompassAndScale(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.save();

    // Scale Bar (approximate miles based on current zoom)
    const scaleWidthKm = Math.round(400 / this.zoom);
    const p1 = { x: 24, y: h - 24 };
    const p2 = { x: 24 + 100, y: h - 24 };

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.moveTo(p1.x, p1.y - 4);
    ctx.lineTo(p1.x, p1.y + 4);
    ctx.moveTo(p2.x, p2.y - 4);
    ctx.lineTo(p2.x, p2.y + 4);
    ctx.stroke();

    ctx.fillStyle = '#d4af37';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`~${scaleWidthKm} km`, p1.x + 30, p1.y - 6);

    // North Indicator
    const compassX = w - 32;
    const compassY = 36;
    ctx.fillStyle = '#d4af37';
    ctx.font = '600 12px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', compassX, compassY - 10);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(compassX, compassY - 8);
    ctx.lineTo(compassX - 5, compassY + 8);
    ctx.lineTo(compassX, compassY + 4);
    ctx.lineTo(compassX + 5, compassY + 8);
    ctx.closePath();
    ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  public destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
