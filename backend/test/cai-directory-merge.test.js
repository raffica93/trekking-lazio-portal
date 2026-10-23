const { test } = require('node:test');
const assert = require('node:assert/strict');
const { assertCompleteSubsections, mergeDirectorySections } = require('../scripts/cai-directory-merge');
const { canonicalRegion, directoryOnlyRegion, directorySubsectionTargets, selectDirectoryRegion } = require('../scripts/cai-directory-region');
const fixture = require('./fixtures/cai-directory-merge.json');

test('directory refresh preserves curated non-Lazio config and adds new sections', () => {
  const { sections, ambiguities } = mergeDirectorySections(fixture.fresh, fixture.previous);
  const curated = sections.find(section => section.id === 'cai-example-curated');
  const added = sections.find(section => section.id === 'new-section');

  assert.equal(sections.length, fixture.fresh.length + 2);
  assert.equal(ambiguities.length, 1);
  assert.equal(curated.municipality, 'Località Aggiornata');
  assert.equal(curated.website, 'https://directory-site.example/');
  assert.deepEqual(curated.calendarUrls, ['https://cai-curated.example/calendario-2026.pdf']);
  assert.deepEqual(curated.calendarEvidence, [{ url: 'https://cai-curated.example/calendario-2026.pdf', label: 'Programma 2026' }]);
  assert.equal(curated.url, 'https://cai-curated.example/calendario-2026.pdf');
  assert.equal(curated.kind, 'pdf');
  assert.equal(curated.template, 'pdf-programma');
  assert.equal(curated.extractor, 'deterministic');
  assert.equal(curated.enabled, true);
  assert.equal(curated.status, 'calendar-found');
  assert.equal(curated.legacyId, 'cai-example-curated');
  assert.deepEqual(curated.customConfig, { rateLimitMs: 1250 });
  assert.deepEqual(curated.headquartersCoordinates, { latitude: 44.4, longitude: 9.1 });
  assert.deepEqual(added.calendarUrls, []);
  assert.equal(added.status, 'pending-discovery');
  assert.equal(added.website, 'https://cai-new.example/');
  const orphan = sections.find(section => section.id === 'old-orphan');
  assert.deepEqual(orphan.calendarUrls, ['https://orphan.example/programma.ics']);
  assert.deepEqual(orphan.calendarEvidence, [{ url: 'https://orphan.example/programma.ics', label: 'Calendario' }]);
  assert.deepEqual(orphan.headquartersCoordinates, { latitude: 44.8, longitude: 9.8 });
});

test('ambiguous identity is reported without transfer while the old curated record is retained', () => {
  const { sections, ambiguities, retainedPreviousIds, ambiguousPreviousIds } = mergeDirectorySections(fixture.fresh, fixture.previous);
  const ambiguous = sections.filter(section => section.id.startsWith('generated-ambiguous-'));
  assert.equal(ambiguities.length, 1);
  assert.deepEqual(ambiguities[0], {
    key: 'identity:liguria:cai-identita-ambigua',
    freshIds: ['generated-ambiguous-a', 'generated-ambiguous-b'],
    previousIds: ['old-ambiguous-a']
  });
  assert.deepEqual(ambiguous.map(section => section.calendarUrls), [[], []]);
  assert.deepEqual(ambiguous.map(section => section.status), ['pending-discovery', 'pending-discovery']);
  assert.deepEqual(retainedPreviousIds, ['old-ambiguous-a', 'old-orphan']);
  assert.deepEqual(ambiguousPreviousIds, ['old-ambiguous-a']);
  const retained = sections.find(section => section.id === 'old-ambiguous-a');
  assert.deepEqual(retained.calendarUrls, ['https://ambiguous-a.example/calendar/']);
  assert.deepEqual(retained.calendarEvidence, [{ url: 'https://ambiguous-a.example/calendar/', label: 'Programma' }]);
  assert.deepEqual(retained.customConfig, { extractor: 'curated' });
});

test('directory refresh fails closed when any subsection endpoint failed', () => {
  const previous = fixture.previous.map(section => ({ ...section }));
  assert.throws(
    () => assertCompleteSubsections([{ id: 'parent-1', error: 'HTTP 503' }]),
    /directory incomplete.*existing registry retained/i
  );
  assert.doesNotThrow(() => assertCompleteSubsections([]));
  assert.deepEqual(previous, fixture.previous);
});

test('directory-only region selection canonicalizes names and preserves all other regions unchanged', () => {
  assert.equal(canonicalRegion('  lIgUrIa  '), 'Liguria');
  assert.equal(directoryOnlyRegion(['node', 'script', '--directory-only', '--region', 'liguria']), 'liguria');
  const selection = selectDirectoryRegion(fixture.regionFilter.directory, ' liguria ');
  assert.equal(selection.region, 'Liguria');
  assert.deepEqual(selection.sections.map(section => section.id), ['liguria-parent', 'liguria-child']);
  assert.deepEqual(selection.parents.map(section => section.id), ['liguria-parent']);
  assert.deepEqual(directorySubsectionTargets(selection.sections).map(section => section.id), ['liguria-parent']);

  const { sections } = mergeDirectorySections(selection.sections, fixture.regionFilter.previous);
  const otherRegionOutput = sections.filter(section => section.region === 'Lombardia');
  const otherRegionBefore = fixture.regionFilter.previous.filter(section => section.region === 'Lombardia');
  assert.deepEqual(otherRegionOutput, otherRegionBefore);
});

test('regional directory merge cannot match a cross-region directoryId collision', () => {
  const prior = fixture.crossRegionCollision.previous[0];
  const { sections, ambiguities, retainedPreviousIds, ambiguousPreviousIds } = mergeDirectorySections(
    fixture.crossRegionCollision.fresh,
    fixture.crossRegionCollision.previous,
    { scopeRegion: 'Liguria' }
  );
  const fresh = sections.find(section => section.id === 'fresh-liguria');
  const retained = sections.find(section => section.id === 'curated-lombardia-shared');
  assert.deepEqual(fresh.calendarUrls, []);
  assert.equal(fresh.status, 'pending-discovery');
  assert.deepEqual(retained, prior);
  assert.deepEqual(ambiguities, [{
    key: 'directoryId:shared-123:cross-region',
    freshIds: ['fresh-liguria'],
    previousIds: ['curated-lombardia-shared']
  }]);
  assert.deepEqual(retainedPreviousIds, ['curated-lombardia-shared']);
  assert.deepEqual(ambiguousPreviousIds, ['curated-lombardia-shared']);
});

test('directory-only region rejects absent, unknown, and parentless selections', () => {
  assert.throws(() => directoryOnlyRegion(['node', 'script', '--directory-only']), /requires exactly one --region/i);
  assert.throws(() => directoryOnlyRegion(['node', 'script', '--directory-only', '--region']), /non-empty --region/i);
  assert.throws(() => directoryOnlyRegion(['node', 'script', '--directory-only', '--region', 'Liguria', '--region', 'Lazio']), /exactly one --region/i);
  assert.throws(() => selectDirectoryRegion(fixture.regionFilter.directory, 'Sicilia'), /unknown directory region/i);
  assert.throws(() => selectDirectoryRegion([{ region: 'Liguria', sectionType: 'subsection', parentSectionId: 'missing' }], 'Liguria'), /no parent sections/i);
});
