# Collection report — `cai-20261022-piemonte-pinasca02`

- Repository checkpoint at collection start: `4175eb9702021e9d6fda771db82bee5122bf8bd4` on `codex/cai-orchestrator-luna`; this run has not yet been committed.
- Source: CAI Pinasca (`cai-pinasca-9212062`), official calendar `https://www.caipinasca.it/index.php/calendario-gite`.
- Bounded request: one explicit URL, one source, concurrency 1, 120 s budget. Cached official HTML body 45,803 bytes, SHA-256 `523217b200fbcd9dedff73699ef0416fa336c754b1f775c26d2a8e09312bda5a`; HTTP status was not persisted, so the report does not infer 200 vs 304.
- HTML calendar extraction: 27 raw event rows. The merged source documents report PDF text extraction 0 + HTML 27, so `extractedEvents=27`; four rows fall in the catalog's retained date window. The run02 status merge fix is covered by fixture-backed tests in `backend/test/scrape-status.test.js` and commit `4175eb9702021e9d6fda771db82bee5122bf8bd4`.

| Sections checked | Complete | Partial | Unreachable | Verified event candidates | Exact duplicate IDs excluded | Failures resolved | Failures open |
|---:|---:|---:|---:|---:|---:|---|---|
| 1 | 0 | 1 | 0 | 4 new catalog IDs (27 rows extracted) | 0 | Aggregate `extractedEvents` recomputation verified by test | Official 2026 PDF OCR failed; discovery-limit has 1 candidate remaining |

The catalog changed from 3,360 to 3,364 unique IDs: +4, -0, 0 existing event rows changed. The candidate titles and dates are `[CAI Family] Cena a Casa Canada in notturna (Val Lemina)` (2026-10-03), `[Escursionismo] Passeggiata nelle Langhe + cantina e pranzo in agriturismo` (2026-10-18), `[Escursionismo] Bivacco Giraudo da Ceresole Reale (Valle Orco)` (2026-10-25), and `[Festa] Cena di chiusura dell’anno` (2026-11-22). The October 3 and 18 dates are past at collection time; they remain in the source's catalog date window but are not presented here as upcoming map events. The official source document is preserved for all four rows. Location remains unverified and no coordinates were added.

Source status is `partial`, not complete: the accessible HTML calendar is not proof that the remaining PDF/discovery queue is exhausted. OCR failure and the one-candidate discovery limit are retained. Backend/frontend copies of excursions, sections, and scrape status are byte-identical.

After collection, backend `npm test` passed 204/204. SHA-256 values for all six public catalog/status files matched before and after the suite; the canonical excursions copies are `d8063c5ea5f51e3ffe6a809c9e6a41686986f3023ad8ab8798b2c59f575e5c91`, scrape-status copies are `c341dcc7789be59e3e6a3d5173be86b61f970e207a384c785e4852b27b366d23`, and section copies are `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`.

Collection manifest SHA-256: `4bec0f0bf1067f7ef6b1075b7d9341892e8c7bc2b6df9d0b4f4857b5d9848182`. Run state SHA-256: `41152f0bbab9a88058df8fdb0fa6496da7e1c9bcd71623d45448e5695f9dd42c`. State is `collection=partial`, `files=ready`, `database=pending`; no database query or write occurred during collection or classification.
