const test = require('node:test');
const assert = require('node:assert/strict');
const { slugify, toPlaceRow } = require('../scripts/import-supabase');

test('toPlaceRow preserves public excursion data and uses a stable unique slug', () => {
  const row = toPlaceRow({
    id: 'roma-2026-09-monte-terminillo',
    title: 'Monte Terminillo – Cresta',
    date: '2026-09-12',
    category: 'EE',
    link: 'http://example.com/terminillo',
    organizer: 'CAI Roma',
    location: 'Monti Reatini',
    region: 'Lazio',
    lat: 42.473,
    lng: 12.987,
    distanceKm: 14.5,
    privateCar: true
  }, 'draft');

  assert.equal(row.slug, 'monte-terminillo-cresta-roma-2026-09-monte-terminillo');
  assert.equal(row.external_url, 'https://example.com/terminillo');
  assert.equal(row.status, 'draft');
  assert.equal(row.distance_km, 14.5);
  assert.equal(row.private_car, true);
});

test('slugify normalizes Italian accents', () => {
  assert.equal(slugify('Cima dell’Àquila'), 'cima-dell-aquila');
});
