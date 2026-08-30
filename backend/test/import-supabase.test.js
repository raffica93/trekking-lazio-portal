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

test('toPlaceRow never leaves a doubled separator after truncating a title slug', () => {
  const row = toPlaceRow({
    id: 'roma-27d73203ebd1',
    title: 'Costone (2271) - Monte Morrone (2141) — Da Piani di Pezza per il Costone fino a La Vena',
    date: '2026-10-10',
    category: 'EE',
    link: 'https://example.com',
    location: 'Velino-Sirente e Duchessa',
    lat: 42.17,
    lng: 13.38
  }, 'draft');

  assert.match(row.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});
