/**
 * src/engine/egoGraph.ts
 * 60FPS 2D Matte Canvas Ego-Graph Inspector for HistoricalBible.com
 * Renders 1-hop and 2-hop neighborhoods for Biblical Figures and Names.
 * Styling: Untarnished Bronze, Olive Branch Green, Muted Stone on dark ink.
 */

export interface EgoNode {
  id: string;
  title: string;
  subtitle?: string;
  type: 'figure' | 'name' | 'verse' | 'contemporary';
  hop: 0 | 1 | 2;
  degree: number;
  weight?: number;
  x?: number;
  y?: number;
  radius?: number;
}

export interface EgoEdge {
  source: string;
  target: string;
  weight: number;
}

export interface EgoGraphData {
  centerId: string;
  centerTitle: string;
  nodes: EgoNode[];
  edges: EgoEdge[];
}

export interface EgoGraphOptions {
  onSelectNode: (node: EgoNode) => void;
  maxHops?: 1 | 2;
}

export class EgoGraphCanvas {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: EgoGraphOptions;
  private data: EgoGraphData | null = null;
  private nodes: Array<EgoNode & { x: number; y: number; radius: number }> = [];
  private edges: EgoEdge[] = [];
  private hoveredNodeId: string | null = null;
  private maxHops: 1 | 2 = 2;

  // Pan & Zoom
  private panX = 0;
  private panY = 0;
  private zoom = 1;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragMoved = false;

  private tooltip: HTMLElement;
  private controls: HTMLElement;

  constructor(container: HTMLElement, options: EgoGraphOptions) {
    this.container = container;
    this.options = options;
    this.maxHops = options.maxHops ?? 2;

    this.container.style.position = 'relative';
    this.container.style.userSelect = 'none';

    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '340px';
    this.canvas.style.display = 'block';
    this.canvas.style.cursor = 'grab';
    this.canvas.style.borderRadius = '4px';
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', 'Interactive 2D network graph');

    // Tooltip overlay
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'ego-graph-tooltip';
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.pointerEvents = 'none';
    this.tooltip.style.display = 'none';
    this.tooltip.style.zIndex = '10';
    this.tooltip.style.background = '#141a22';
    this.tooltip.style.border = '1px solid #c5a059';
    this.tooltip.style.borderRadius = '4px';
    this.tooltip.style.padding = '6px 10px';
    this.tooltip.style.fontSize = '12px';
    this.tooltip.style.color = '#f0ede6';
    this.tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
    this.tooltip.style.maxWidth = '220px';

    // Controls overlay (Hop toggle & Reset)
    this.controls = document.createElement('div');
    this.controls.className = 'ego-graph-controls';
    this.controls.style.position = 'absolute';
    this.controls.style.top = '8px';
    this.controls.style.right = '8px';
    this.controls.style.display = 'flex';
    this.controls.style.gap = '6px';
    this.controls.style.zIndex = '5';

    const hopsBtn = document.createElement('button');
    hopsBtn.type = 'button';
    hopsBtn.className = 'btn-small';
    hopsBtn.textContent = this.maxHops === 2 ? '2-Hop' : '1-Hop';
    hopsBtn.title = 'Toggle 1-hop or 2-hop neighborhood expansion';
    hopsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.maxHops = this.maxHops === 2 ? 1 : 2;
      hopsBtn.textContent = this.maxHops === 2 ? '2-Hop' : '1-Hop';
      if (this.data) this.render(this.data);
    });

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn-small';
    resetBtn.textContent = 'Center';
    resetBtn.title = 'Reset graph position & zoom';
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetView();
    });

    this.controls.appendChild(hopsBtn);
    this.controls.appendChild(resetBtn);

    container.innerHTML = '';
    container.appendChild(this.canvas);
    container.appendChild(this.tooltip);
    container.appendChild(this.controls);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D Canvas context unavailable');
    this.ctx = ctx;

    this.bindEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  public resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width || 400;
    const h = rect.height || 340;

    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
  }

  public resetView(): void {
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1;
    this.draw();
  }

  public setMaxHops(hops: 1 | 2): void {
    this.maxHops = hops;
    const hopsBtn = this.controls.querySelector('button');
    if (hopsBtn) hopsBtn.textContent = hops === 2 ? '2-Hop' : '1-Hop';
    if (this.data) this.render(this.data);
  }

  public render(data: EgoGraphData): void {
    this.data = data;
    const width = this.canvas.clientWidth || 400;
    const height = this.canvas.clientHeight || 340;
    const cx = width / 2;
    const cy = height / 2;

    const filteredNodes = data.nodes.filter((n) => n.hop <= this.maxHops);
    const validNodeIds = new Set(filteredNodes.map((n) => n.id));

    const hop0 = filteredNodes.filter((n) => n.hop === 0);
    const hop1 = filteredNodes.filter((n) => n.hop === 1);
    const hop2 = filteredNodes.filter((n) => n.hop === 2);

    // Initial radial placement
    const positioned: Array<EgoNode & { x: number; y: number; radius: number }> = [];

    // Center Node (Hop 0)
    for (const n of hop0) {
      positioned.push({
        ...n,
        x: cx,
        y: cy,
        radius: 11
      });
    }

    // Hop 1 Nodes (Radius ~80-100px)
    const r1 = Math.min(width, height) * 0.28;
    const n1 = hop1.length;
    hop1.forEach((n, idx) => {
      const angle = (2 * Math.PI * idx) / Math.max(1, n1) - Math.PI / 2;
      // Stagger slightly if dense
      const rad = n1 > 8 && idx % 2 === 1 ? r1 * 1.15 : r1;
      positioned.push({
        ...n,
        x: cx + Math.cos(angle) * rad,
        y: cy + Math.sin(angle) * rad,
        radius: 7.5
      });
    });

    // Hop 2 Nodes (Radius ~145-165px)
    if (this.maxHops === 2 && hop2.length > 0) {
      const r2 = Math.min(width, height) * 0.44;
      const n2 = hop2.length;
      hop2.forEach((n, idx) => {
        const angle = (2 * Math.PI * idx) / Math.max(1, n2) - Math.PI / 2;
        const rad = n2 > 12 && idx % 2 === 1 ? r2 * 1.1 : r2;
        positioned.push({
          ...n,
          x: cx + Math.cos(angle) * rad,
          y: cy + Math.sin(angle) * rad,
          radius: 5
        });
      });
    }

    // Lightweight spring relaxation pass to untangle overlapping labels
    for (let iter = 0; iter < 12; iter++) {
      for (let i = 0; i < positioned.length; i++) {
        if (positioned[i].hop === 0) continue;
        for (let j = i + 1; j < positioned.length; j++) {
          const dx = positioned[i].x - positioned[j].x;
          const dy = positioned[i].y - positioned[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = positioned[i].radius + positioned[j].radius + 26;
          if (dist < minDist) {
            const overlap = (minDist - dist) / 2;
            const nx = (dx / dist) * overlap * 0.5;
            const ny = (dy / dist) * overlap * 0.5;
            if (positioned[i].hop > 0) {
              positioned[i].x += nx;
              positioned[i].y += ny;
            }
            if (positioned[j].hop > 0) {
              positioned[j].x -= nx;
              positioned[j].y -= ny;
            }
          }
        }
      }
    }

    this.nodes = positioned;
    this.edges = data.edges.filter(
      (e) => validNodeIds.has(e.source) && validNodeIds.has(e.target)
    );

    this.draw();
  }

  private bindEvents(): void {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragMoved = false;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
      this.canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const nextX = e.clientX - this.dragStartX;
        const nextY = e.clientY - this.dragStartY;
        if (Math.abs(nextX - this.panX) > 3 || Math.abs(nextY - this.panY) > 3) {
          this.dragMoved = true;
        }
        this.panX = nextX;
        this.panY = nextY;
        this.draw();
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (
        mouseX < 0 ||
        mouseY < 0 ||
        mouseX > rect.width ||
        mouseY > rect.height
      ) {
        if (this.hoveredNodeId !== null) {
          this.hoveredNodeId = null;
          this.tooltip.style.display = 'none';
          this.canvas.style.cursor = 'grab';
          this.draw();
        }
        return;
      }

      // Convert mouse coords to graph space
      const gx = (mouseX - this.panX - rect.width / 2) / this.zoom + rect.width / 2;
      const gy = (mouseY - this.panY - rect.height / 2) / this.zoom + rect.height / 2;

      let hit: (EgoNode & { x: number; y: number; radius: number }) | null = null;
      for (const n of this.nodes) {
        const dx = gx - n.x;
        const dy = gy - n.y;
        if (Math.sqrt(dx * dx + dy * dy) <= n.radius + 6) {
          hit = n;
          break;
        }
      }

      if (hit && hit.id !== this.hoveredNodeId) {
        this.hoveredNodeId = hit.id;
        this.canvas.style.cursor = 'pointer';
        this.showTooltip(hit, e.clientX, e.clientY);
        this.draw();
      } else if (!hit && this.hoveredNodeId !== null) {
        this.hoveredNodeId = null;
        this.tooltip.style.display = 'none';
        this.canvas.style.cursor = 'grab';
        this.draw();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.canvas.style.cursor = this.hoveredNodeId ? 'pointer' : 'grab';
      }
    });

    this.canvas.addEventListener('click', () => {
      if (this.dragMoved) return;
      if (this.hoveredNodeId) {
        const clicked = this.nodes.find((n) => n.id === this.hoveredNodeId);
        if (clicked && clicked.hop !== 0) {
          this.options.onSelectNode(clicked);
        }
      }
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      this.zoom = Math.min(2.5, Math.max(0.6, this.zoom * zoomFactor));
      this.draw();
    }, { passive: false });
  }

  private showTooltip(
    node: EgoNode,
    clientX: number,
    clientY: number
  ): void {
    const containerRect = this.container.getBoundingClientRect();
    const x = clientX - containerRect.left + 14;
    const y = clientY - containerRect.top + 14;

    let typeBadge = 'Biblical Name';
    if (node.type === 'figure') typeBadge = 'Historical Profile';
    else if (node.type === 'contemporary') typeBadge = 'Secular Contemporary';
    else if (node.type === 'verse') typeBadge = 'Scripture Passage';

    let detail = '';
    if (node.weight !== undefined && node.weight > 0) {
      detail = `<div style="color: #c5a059; margin-top: 2px;">${node.weight} shared verse${node.weight === 1 ? '' : 's'}</div>`;
    } else if (node.degree > 0) {
      detail = `<div style="color: #c5a059; margin-top: 2px;">${node.degree} connection${node.degree === 1 ? '' : 's'}</div>`;
    }

    if (node.subtitle) {
      detail += `<div style="color: #a89f91; font-size: 11px; margin-top: 3px;">${node.subtitle}</div>`;
    }

    this.tooltip.innerHTML = `
      <div style="font-weight: 600; color: #fbf8f1;">${node.title}</div>
      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #8c7a6b;">${typeBadge}</div>
      ${detail}
      ${node.hop !== 0 ? '<div style="font-size: 10px; color: #719e9b; margin-top: 4px;">Click to pivot graph ↗</div>' : ''}
    `;

    this.tooltip.style.left = `${Math.min(x, containerRect.width - 230)}px`;
    this.tooltip.style.top = `${Math.min(y, containerRect.height - 80)}px`;
    this.tooltip.style.display = 'block';
  }

  private draw(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.ctx.clearRect(0, 0, width, height);

    // Subtle dark ink parchment background with radial gradient
    const bgGradient = this.ctx.createRadialGradient(
      width / 2, height / 2, 20,
      width / 2, height / 2, Math.max(width, height) / 1.4
    );
    bgGradient.addColorStop(0, '#10151c');
    bgGradient.addColorStop(1, '#070a0e');
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, width, height);

    if (this.nodes.length === 0) {
      this.ctx.fillStyle = '#8c7a6b';
      this.ctx.font = '13px "Inter", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Select a person or name to explore connections', width / 2, height / 2);
      return;
    }

    this.ctx.save();
    // Apply pan & zoom centered on viewport
    this.ctx.translate(this.panX + width / 2, this.panY + height / 2);
    this.ctx.scale(this.zoom, this.zoom);
    this.ctx.translate(-width / 2, -height / 2);

    const nodeMap = new Map(this.nodes.map((n) => [n.id, n]));

    // 1. Draw Edges
    for (const edge of this.edges) {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) continue;

      const isConnectedToHover =
        this.hoveredNodeId === s.id || this.hoveredNodeId === t.id;

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(t.x, t.y);

      if (isConnectedToHover) {
        this.ctx.strokeStyle = '#e0b96b';
        this.ctx.lineWidth = 2.2;
      } else {
        const alpha = Math.min(0.55, Math.max(0.18, (edge.weight || 1) * 0.08));
        this.ctx.strokeStyle = `rgba(197, 160, 89, ${alpha})`;
        this.ctx.lineWidth = Math.min(2.5, 0.8 + (edge.weight || 1) * 0.15);
      }
      this.ctx.stroke();
    }

    // 2. Draw Nodes
    for (const n of this.nodes) {
      const isHovered = this.hoveredNodeId === n.id;
      const isConnectedToHover =
        this.edges.some(
          (e) =>
            (e.source === this.hoveredNodeId && e.target === n.id) ||
            (e.target === this.hoveredNodeId && e.source === n.id)
        );

      // Node aura / glow for center and hovered nodes
      if (n.hop === 0 || isHovered) {
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
        this.ctx.fillStyle = n.hop === 0 ? 'rgba(197, 160, 89, 0.22)' : 'rgba(224, 185, 107, 0.28)';
        this.ctx.fill();
      }

      // Main Node circle
      this.ctx.beginPath();
      this.ctx.arc(
        n.x,
        n.y,
        isHovered ? n.radius + 2.5 : n.radius,
        0,
        Math.PI * 2
      );

      if (n.hop === 0) {
        this.ctx.fillStyle = '#C5A059'; // Untarnished gold center
      } else if (n.hop === 1) {
        this.ctx.fillStyle = isConnectedToHover ? '#719E9B' : '#5E826B'; // Olive/sage 1-hop
      } else {
        this.ctx.fillStyle = isConnectedToHover ? '#B3A696' : '#8C7A6B'; // Muted stone 2-hop
      }
      this.ctx.fill();

      // Border ring
      this.ctx.lineWidth = isHovered ? 2 : 1.2;
      this.ctx.strokeStyle = isHovered ? '#FFFFFF' : '#141A22';
      this.ctx.stroke();

      // Labels
      const shouldDrawLabel = n.hop <= 1 || isHovered || isConnectedToHover;
      if (shouldDrawLabel) {
        this.ctx.font =
          n.hop === 0
            ? '600 13px "Cinzel", Georgia, serif'
            : isHovered
            ? '600 11px "Inter", sans-serif'
            : '500 10.5px "Inter", sans-serif';

        this.ctx.fillStyle =
          n.hop === 0
            ? '#FBF8F1'
            : isHovered
            ? '#FFFFFF'
            : isConnectedToHover
            ? '#E6DFD3'
            : '#D0C8B8';

        this.ctx.textAlign = 'center';
        this.ctx.fillText(n.title, n.x, n.y - n.radius - 5);
      }
    }

    this.ctx.restore();
  }
}
