// Manual geometry diagnostic only. Assertions live in tests/data-integrity-selfcheck.ts.
import { BIBLICAL_ROUTES } from '../src/data/ancientMapData.ts';

// Exact Sea of Galilee water polygon
const GALILEE_WATER_POLYGON = [
  { lat: 32.905, lng: 35.568 },
  { lat: 32.898, lng: 35.602 },
  { lat: 32.885, lng: 35.632 },
  { lat: 32.860, lng: 35.648 },
  { lat: 32.825, lng: 35.645 },
  { lat: 32.795, lng: 35.633 },
  { lat: 32.765, lng: 35.610 },
  { lat: 32.730, lng: 35.588 },
  { lat: 32.708, lng: 35.575 },
  { lat: 32.715, lng: 35.558 },
  { lat: 32.735, lng: 35.542 },
  { lat: 32.768, lng: 35.530 },
  { lat: 32.805, lng: 35.524 },
  { lat: 32.845, lng: 35.520 },
  { lat: 32.870, lng: 35.532 },
  { lat: 32.885, lng: 35.555 },
  { lat: 32.905, lng: 35.568 }
];

function pointInPolygon(pt: { lat: number; lng: number }, poly: Array<{ lat: number; lng: number }>) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].lng, yi = poly[i].lat;
    const xj = poly[j].lng, yj = poly[j].lat;
    const intersect = ((yi > pt.lat) !== (yj > pt.lat))
      && (pt.lng < (xj - xi) * (pt.lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function lineIntersectsPolygon(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }, poly: Array<{ lat: number; lng: number }>) {
  for (let step = 1; step < 100; step++) {
    const t = step / 100;
    const lat = p1.lat + (p2.lat - p1.lat) * t;
    const lng = p1.lng + (p2.lng - p1.lng) * t;
    if (pointInPolygon({ lat, lng }, poly)) {
      return { intersects: true, lat, lng };
    }
  }
  return { intersects: false, lat: 0, lng: 0 };
}

function lineIntersectsBox(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }, box: { minLat: number; maxLat: number; minLng: number; maxLng: number }) {
  for (let step = 1; step < 100; step++) {
    const t = step / 100;
    const lat = p1.lat + (p2.lat - p1.lat) * t;
    const lng = p1.lng + (p2.lng - p1.lng) * t;
    if (lat >= box.minLat && lat <= box.maxLat && lng >= box.minLng && lng <= box.maxLng) {
      return { intersects: true, lat, lng };
    }
  }
  return { intersects: false, lat: 0, lng: 0 };
}

const deadSeaBox = { minLat: 31.050, maxLat: 31.780, minLng: 35.390, maxLng: 35.570 };

console.log('--- CHECKING ALL ROUTES CROSSING SEA OF GALILEE ---');
for (const route of BIBLICAL_ROUTES) {
  const points = (route.path && route.path.length > 0)
    ? route.path
    : route.stops.map(s => s.coords);
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const check = lineIntersectsPolygon(p1, p2, GALILEE_WATER_POLYGON);
    if (check.intersects) {
      // Check if it is an intentional Gospel boat crossing on Sea of Galilee
      const isBoatCrossing = route.id === 'jesus-galilean-ministry' && (
        (p1.lng >= 35.50 && p2.lng >= 35.60) || // Tiberias to Gadarenes crossing
        (p1.lng >= 35.60 && p2.lng >= 35.60) || // Eastern shore coastal boat travel
        (p1.lng >= 35.60 && p2.lng <= 35.58)    // Bethsaida to Capernaum return crossing
      );
      if (!isBoatCrossing) {
        console.log(`Route [${route.id}] "${route.name}": Segment [${p1.lat}, ${p1.lng}] -> [${p2.lat}, ${p2.lng}] cuts through Sea of Galilee at [${check.lat.toFixed(3)}, ${check.lng.toFixed(3)}]!`);
      }
    }
  }
}

console.log('--- CHECKING ALL ROUTES CROSSING DEAD SEA ---');
for (const route of BIBLICAL_ROUTES) {
  const points = (route.path && route.path.length > 0)
    ? route.path
    : route.stops.map(s => s.coords);
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const check = lineIntersectsBox(p1, p2, deadSeaBox);
    if (check.intersects) {
      console.log(`Route [${route.id}] "${route.name}": Segment [${p1.lat}, ${p1.lng}] -> [${p2.lat}, ${p2.lng}] cuts through Dead Sea at [${check.lat.toFixed(3)}, ${check.lng.toFixed(3)}]!`);
    }
  }
}
