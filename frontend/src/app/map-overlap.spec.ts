import { overlapKey, spreadOverlapping } from './map-overlap';

function metersBetween(a: [number, number], b: [number, number]): number {
  const toRad = (value: number) => value * Math.PI / 180;
  const earth = 6_378_137;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const sin = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.asin(Math.min(1, Math.sqrt(sin)));
}

describe('map overlap', () => {
  it('keeps the first pin on the real point and fans the rest ~180 m away', () => {
    const hub = { lat: 42.473, lng: 12.987 };
    const positions = spreadOverlapping([hub, hub, hub]);

    expect(positions[0]).toEqual([hub.lat, hub.lng]);
    expect(metersBetween(positions[0], positions[1])).toBeGreaterThan(150);
    expect(metersBetween(positions[0], positions[1])).toBeLessThan(220);
    expect(metersBetween(positions[1], positions[2])).toBeGreaterThan(50);
  });

  it('groups near-duplicate geocodes on the same flower', () => {
    const a = { lat: 42.4731, lng: 12.9872 };
    const b = { lat: 42.4734, lng: 12.9871 };
    expect(overlapKey(a.lat, a.lng)).toBe(overlapKey(b.lat, b.lng));

    const positions = spreadOverlapping([a, b]);
    expect(positions[0]).toEqual([a.lat, a.lng]);
    expect(metersBetween(positions[0], positions[1])).toBeGreaterThan(150);
  });

  it('does not spread pins that are already a kilometre apart', () => {
    const a = { lat: 42.47, lng: 12.98 };
    const b = { lat: 42.48, lng: 12.99 };
    expect(overlapKey(a.lat, a.lng)).not.toBe(overlapKey(b.lat, b.lng));

    const positions = spreadOverlapping([a, b]);
    expect(positions[0]).toEqual([a.lat, a.lng]);
    expect(positions[1]).toEqual([b.lat, b.lng]);
  });

  it('widens the ring after six overlapping pins', () => {
    const hub = { lat: 41.891, lng: 12.492 };
    const points = Array.from({ length: 8 }, () => hub);
    const positions = spreadOverlapping(points);
    expect(metersBetween(positions[0], positions[7])).toBeGreaterThan(300);
    expect(metersBetween(positions[0], positions[7])).toBeLessThan(450);
  });
});
