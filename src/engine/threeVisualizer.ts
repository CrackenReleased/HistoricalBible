/**
 * Three.js 3D GPU-Accelerated Scripture Arc & Loom Visualizer
 * Renders the 1,189 chapters of the Bible as an orbital ring in 3D space,
 * with 3D parabolic/bezier arcs connecting cross-referenced passages.
 * Powered by WebGL vertex buffers, additive blending, and smooth orbital camera.
 */
import * as THREE from 'three';
import { CrossRefLink } from '../store/localFirstStore';

export interface ChapterCoord3D {
  index: number;
  book: string;
  chapter: number;
  position: THREE.Vector3;
  color: THREE.Color;
}

export class ThreeVisualizer {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private arcGroup: THREE.Group;
  private nodeGroup: THREE.Group;
  private isRunning: boolean = false;
  private animationId: number | null = null;
  private chapterCoords: Map<string, ChapterCoord3D> = new Map();

  // Camera Orbit Controls State
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private rotationSpeed = 0.005;
  private targetRotation = { x: 0.25, y: 0 };

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x08090d, 0.0015);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 4000);
    this.camera.position.set(0, 350, 750);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.arcGroup = new THREE.Group();
    this.nodeGroup = new THREE.Group();
    this.scene.add(this.arcGroup);
    this.scene.add(this.nodeGroup);

    this.setupLighting();
    this.setupEventListeners();
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xd4af37, 1.2);
    dirLight.position.set(100, 400, 200);
    this.scene.add(dirLight);
  }

  private setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize);

    const el = this.renderer.domElement;
    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    el.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * this.rotationSpeed;
      this.targetRotation.x += deltaY * this.rotationSpeed;
      this.targetRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 2.2, this.targetRotation.x));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.position.z += e.deltaY * 0.5;
      this.camera.position.z = Math.max(200, Math.min(1800, this.camera.position.z));
    }, { passive: false });
  }

  private onWindowResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  /**
   * Builds the 3D Canonical Ribbon Ring (all 1,189 chapters laid out in an elliptical orbit)
   */
  public buildCanonRing(chapters: Array<{ osis: string; book: string; chapter: number; division: string; color: string }>) {
    // Clear existing
    while (this.nodeGroup.children.length > 0) {
      this.nodeGroup.remove(this.nodeGroup.children[0]);
    }
    this.chapterCoords.clear();

    const radiusX = 420;
    const radiusZ = 320;
    const total = chapters.length;

    const nodeGeometry = new THREE.SphereGeometry(2.2, 8, 8);

    chapters.forEach((ch, i) => {
      const angle = (i / total) * Math.PI * 2;
      const x = Math.cos(angle) * radiusX;
      const z = Math.sin(angle) * radiusZ;
      const y = -40;

      const pos = new THREE.Vector3(x, y, z);
      const color = new THREE.Color(ch.color);

      this.chapterCoords.set(ch.osis, {
        index: i,
        book: ch.book,
        chapter: ch.chapter,
        position: pos,
        color
      });

      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(nodeGeometry, mat);
      mesh.position.copy(pos);
      this.nodeGroup.add(mesh);
    });
  }

  /**
   * Renders 3D Spline Arcs between connected passages
   */
  public renderArcs(links: CrossRefLink[], maxArcs: number = 8000) {
    // Clear existing arcs
    while (this.arcGroup.children.length > 0) {
      const child = this.arcGroup.children[0] as THREE.Line;
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else {
        child.material.dispose();
      }
      this.arcGroup.remove(child);
    }

    const displayedLinks = links.slice(0, maxArcs);
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    const positions: number[] = [];
    const colors: number[] = [];

    displayedLinks.forEach((link) => {
      const src = link.s || link.from;
      const tgt = link.t || link.to;
      if (!src || !tgt) return;

      // Extract chapter osis (e.g., "Gen.1.1" -> "Gen.1")
      const fromParts = src.split('.');
      const toParts = tgt.split('.');
      const fromCh = `${fromParts[0]}.${fromParts[1]}`;
      const toCh = `${toParts[0]}.${toParts[1]}`;

      const coordA = this.chapterCoords.get(fromCh);
      const coordB = this.chapterCoords.get(toCh);

      if (!coordA || !coordB) return;

      const pA = coordA.position;
      const pB = coordB.position;

      // Arc height proportional to distance
      const dist = pA.distanceTo(pB);
      const height = Math.min(320, dist * 0.45);
      const midPoint = new THREE.Vector3()
        .addVectors(pA, pB)
        .multiplyScalar(0.5);
      midPoint.y += height;

      // Quadratic Bezier Curve in 3D
      const curve = new THREE.QuadraticBezierCurve3(pA, midPoint, pB);
      const points = curve.getPoints(12);

      for (let j = 0; j < points.length - 1; j++) {
        const pt1 = points[j];
        const pt2 = points[j + 1];

        positions.push(pt1.x, pt1.y, pt1.z);
        positions.push(pt2.x, pt2.y, pt2.z);

        // Gradient from color A to color B
        const t1 = j / (points.length - 1);
        const t2 = (j + 1) / (points.length - 1);

        const c1 = coordA.color.clone().lerp(coordB.color, t1);
        const c2 = coordA.color.clone().lerp(coordB.color, t2);

        colors.push(c1.r, c1.g, c1.b);
        colors.push(c2.r, c2.g, c2.b);
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const lineSegments = new THREE.LineSegments(geometry, lineMaterial);
    this.arcGroup.add(lineSegments);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = () => {
    if (!this.isRunning) return;
    this.animationId = requestAnimationFrame(this.animate);

    // Smooth rotational inertia
    this.scene.rotation.y += (this.targetRotation.y - this.scene.rotation.y) * 0.08;
    this.scene.rotation.x += (this.targetRotation.x - this.scene.rotation.x) * 0.08;

    // Gentle continuous cosmic drift
    if (!this.isDragging) {
      this.targetRotation.y += 0.0006;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    this.stop();
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
