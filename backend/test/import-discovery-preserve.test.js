const test = require('node:test');
const assert = require('node:assert/strict');
const { sectionToRow, sectionUpsertRow } = require('../scripts/import-supabase');

test('sectionUpsertRow omits discovery_status and primary_url so registry sync cannot reset them', () => {
  const section = {
    id: 'colleferro',
    organizer: 'CAI Colleferro',
    region: 'Lazio',
    directoryId: 1,
    status: 'calendar-found',
    calendarUrls: ['https://caicolleferro.it/?p=2522'],
    primary_url: 'https://caicolleferro.it/?p=2522'
  };
  const full = sectionToRow(section, { status: 'unsupported', eventCount: 0 }, '2026-09-06T12:00:00Z');
  assert.equal(full.discovery_status, 'calendar-found');

  const upsert = sectionUpsertRow(section, { status: 'unsupported', eventCount: 0 }, '2026-09-06T12:00:00Z');
  assert.equal('discovery_status' in upsert, false);
  assert.equal('primary_url' in upsert, false);
  assert.equal(upsert.scrape_status, 'unsupported');
  assert.equal(upsert.event_count, 0);
  assert.equal(upsert.id, 'colleferro');
});
