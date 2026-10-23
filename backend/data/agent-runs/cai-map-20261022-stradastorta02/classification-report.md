# Delta classification report — cai-map-20261022-stradastorta02

- Regional source run: `cai-20261022-lombardia-stradastorta02`.
- Input: `backend/data/agent-runs/cai-20261022-lombardia-stradastorta02/candidate-input.json`, SHA-256 `339bac6cd1e4a8cd4e42cb0a1f8f83015d13a27ccbc465925279961bd22af076`.
- Input scope: one newly extracted source ID, `cai-strada-storta-9116052-01a8ce10aa39`.
- Classifier run: ready, 1 processed / 1 total, 0 errors; concurrency 1, rate limit 1000 ms.
- Requested model: `inception/mercury-decide`. Attested response model and model version: `inception/mercury-decide-20260930`. `modelAttested=true`; policy `cai-trekking-v2`. The provider response did not expose an HTTP status in the sealed run state; none is claimed here.
- Effective output: `da_verificare` / `altro`; confidence `0.7486867849562652`, probability `0.8324578566375102` (kept separate). `mapEligible=false` in the strict confirmed-trekking view. No source QA override was applied.
- The official page establishes an activity on 2026-10-25 and reports a destination change, while the visible title and stale event link disagree. Location remains unverified and coordinates are null; do not infer a destination from the title or link.
- Independent importer QA: PASS. `verifyReadyClassificationRun` accepted the single-ID sealed manifest, input/output hashes, alignment and zero-error state. Al momento della validazione classifier il DB non era stato interrogato o modificato; il successivo inserimento delta è documentato in `delta-import-receipt.json` e `delta-import-report.md`.
- Importer contract: after this file checkpoint and pre-write read, use only `--delta-only --manifest` for this one source ID. Insert missing place/classification rows only; conflict-ignore and reconcile; no updates to the five existing rows, no deletes, no general catalog import. The admin/geographic fields remain under verification.

## Sealed classifier artifacts

- Manifest SHA-256: `bbee2f819c7841796d44a301934c5ef8fb62171d08fdafd0817908a1422fc1f2`.
- State SHA-256: `7633506ce5df59f489b171b9feed821eeaed0b295e507b30dcae39e548746d3a`.
- Classified output SHA-256: `1cdf39c31f0b7c6ff8fa213072a6b1d03ce50c4d36ae205c6ca1ed181ac68e50`.
- File checkpoint: `12b073fb469a209217ed149c00657a1f7e19e0a3`, remoto verificato.
- Successiva consegna DB delta-only: 1 place e 1 classification inseriti, prima-query assente, joined post-query 1/1, 0 mismatch/update/delete; vedi la ricevuta separata `delta-import-receipt.json` (SHA-256 `bef3ff50b4266d0486eb343f9c281fdb96ea3a14b2f6a07727be57e2d00acf32`).
