export interface GeoPoint {
  lat: number;
  lng: number;
}

const GOLDEN_ANGLE = 137.508 * Math.PI / 180;
const GROUP_DECIMALS = 3;
const BASE_RADIUS_M = 180;
const RING_SIZE = 6;
const EARTH_M = 6_378_137;

export function overlapKey(lat: number, lng: number): string {
  return `${lat.toFixed(GROUP_DECIMALS)},${lng.toFixed(GROUP_DECIMALS)}`;
}

export function offsetMeters(lat: number, lng: number, meters: number, angle: number): [number, number] {
  const dLat = (Math.sin(angle) * meters / EARTH_M) * (180 / Math.PI);
  const dLng = (Math.cos(angle) * meters / (EARTH_M * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);
  return [lat + dLat, lng + dLng];
}

export function spreadOverlapping(points: GeoPoint[]): Array<[number, number]> {
  const hubs = new Map<string, GeoPoint>();
  const counts = new Map<string, number>();

  return points.map((point) => {
    const key = overlapKey(point.lat, point.lng);
    if (!hubs.has(key)) {
      hubs.set(key, point);
    }
    const count = counts.get(key) ?? 0;
    counts.set(key, count + 1);
    const hub = hubs.get(key)!;
    if (count === 0) {
      return [hub.lat, hub.lng];
    }
    const radius = BASE_RADIUS_M * Math.ceil(count / RING_SIZE);
    return offsetMeters(hub.lat, hub.lng, radius, count * GOLDEN_ANGLE);
  });
}
