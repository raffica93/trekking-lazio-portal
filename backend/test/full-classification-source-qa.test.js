'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { verifyReadyClassificationRun } = require('../scripts/import-supabase');

const runId = 'cai-map-20261022-full01';
const runDir = path.resolve(__dirname, `../data/agent-runs/${runId}/output`);
const fixture = require('./fixtures/cai-map-20261022-full01-source-qa.json');

test('full classification source QA preserves candidates and excludes only verified non-trekking', () => {
  assert.equal(fixture.runId, runId);
  const verified = verifyReadyClassificationRun({ manifestPath: path.join(runDir, 'manifest.json') });
  const catalog = require(path.join(runDir, 'classified-catalog.json'));
  const eventsById = new Map(catalog.excursions.map((event) => [event.id, event]));
  const candidateCounts = { trekking: 0, non_trekking: 0, da_verificare: 0 };
  const effectiveCounts = { trekking: 0, non_trekking: 0, da_verificare: 0 };
  const confirmedNonTrekking = new Set(Object.keys(fixture.verifiedNonTrekking));

  assert.equal(verified.rows.length, 3336);
  for (const row of verified.rows) {
    candidateCounts[row.candidate_decision] += 1;
    effectiveCounts[row.decision] += 1;
    assert.equal(row.model_requested, 'inception/mercury-decide');
    assert.equal(row.response_model, 'inception/mercury-decide-20260930');
    assert.equal(row.model_attested, true);
    assert.equal(row.model_version, row.response_model);
    if (row.review_metadata) assert.match(row.review_metadata.evidence_url, /^https?:\/\//);
    if (row.candidate_decision === 'non_trekking') {
      assert.ok(row.review_metadata, `${row.source_id} needs a source review before exclusion`);
      if (!confirmedNonTrekking.has(row.source_id)) {
        assert.notEqual(row.decision, 'non_trekking', `${row.source_id} lacks confirmed exclusion evidence`);
      }
    }
    if (row.decision === 'non_trekking') {
      assert.ok(confirmedNonTrekking.has(row.source_id), `${row.source_id} is not in the evidence fixture`);
      assert.equal(row.review_metadata?.reviewer_role, 'cai-collector');
      assert.equal(row.review_metadata?.evidence_url, fixture.verifiedNonTrekking[row.source_id]);
    }
  }

  assert.deepEqual(candidateCounts, fixture.candidateCounts);
  assert.deepEqual(effectiveCounts, fixture.effectiveCounts);
  for (const [id, expected] of Object.entries(fixture.additionalReviewed)) {
    const row = verified.rows.find((item) => item.source_id === id);
    assert.equal(row?.decision, expected.decision);
    assert.equal(row?.review_metadata?.evidence_url, expected.evidenceUrl);
  }
  for (const [id, evidenceUrl] of Object.entries(fixture.verifiedTrekking)) {
    const row = verified.rows.find((item) => item.source_id === id);
    const event = eventsById.get(id);
    assert.equal(row?.decision, 'trekking');
    assert.equal(row?.category, 'a piedi');
    assert.equal(row?.review_metadata?.reviewer_role, 'cai-collector');
    assert.equal(row?.review_metadata?.evidence_url, evidenceUrl);
    assert.equal(row?.candidate_decision, event.classification.decision);
    assert.ok(row?.review_metadata?.evidence.length > 0);
  }
});
