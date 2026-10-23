# CAI Fivizzano — bounded 2026 calendar sample

Run ID: `cai-20261023-toscana-fivizzano-calendar01`  
Region/source: Toscana / `cai-fivizzano-9226019`  
Selection checkpoint: `316f03b2b98ef56f2222b37f816180992d5b54e4`  
Scope: one official URL, max 1 document, 120-second source budget, concurrency 1. The annual PDF/OCR queue was not retried or followed.

## Collection and coverage

| Sezioni controllate | Complete | Partial | Unreachable | Eventi estratti/verificati | Nuovi ID | Duplicati semantici esclusi | Fallimenti risolti | Fallimenti aperti |
|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 0 | 1 | 0 | 10 source rows | 5 raw new IDs | 1 | 0 | Annual PDF OCR failure and discovery-limit 8; selected page discovery-limit 1 |

The source returned `method=html-calendar`, 10 extracted rows, 12 current catalog rows, and remains `partial`. Requested and final URL are both `https://www.caifivizzano.it/calendario-uscite/`. The cached body is 148,307 bytes, SHA-256 `a4e350268783bc1fe3a0ed37a1e75269d8559fd53e204ca9194c21250e3d11f0`. The run does not persist HTTP status; no 200/304 assertion is made. The annual PDF OCR failure and its discovery-limit 8 remain open on a separate URL.

## Independent file QA and semantic deduplication

Importer verified all sealed files and backend/frontend mirrors. Against the selection checkpoint, the catalog changed from 3,371 to 3,376 rows/unique IDs: 5 new IDs, 0 removals, and 2 existing rows changed only in `sourceDocument`. Existing titles, dates, editorial status, covers, location and coordinates are preserved. All new records have null latitude/longitude, `Località da verificare`, and no verified coordinate quality.

The five raw additions and dispositions are:

| ID suffix | Title/date | File disposition |
|---|---|---|
| `25b520da9498` | Monte Sumbra da Capanne di Careggine — 2026-10-25 | Keep as candidate; official card/date and detailed route description are evidenced |
| `4ac183446fc1` | Anello del Mont’Alto per cresta Sud e Monte Sullioni per cresta Sud-Est — 2026-11-01 | Keep as candidate; official card/date and detailed route description are evidenced |
| `9ad6725f7fbe` | Lago Padule al Passo del Cerreto — 2026-10-10 | Keep for classification review; official title/date but only sparse Montagnaterapia description |
| `eba39ba9cdc6` | Climbing Day – Inaugurazione Falesia Antipasto — 2026-10-31 | Keep for classification; official description identifies a climbing event at Falesia Antipasto |
| `5b1c92eec5ec` | Sentieristica per tutti – Lunigiana Skyrace — 2026-10-17 | **Exclude from classification/import** as semantic duplicate of existing `cai-fivizzano-9226019-b759d3dd85b0`: same date, event URL and description, punctuation-only title difference |

Only the four nonduplicate IDs above are eligible for the separate Mercury classification delta. The two existing rows `…-8cf43c159190` and `…-fc2dd59b3a86` changed only `sourceDocument`; they are not part of the insert-only DB delta and must not trigger an update to existing DB rows.

The evidence sidecar `source-evidence.json` records the cached URL/body hash, exact calendar-card date/title excerpts, byte/line locators, JSON-LD excerpts, description excerpts, existing-row comparisons, and the duplicate disposition. Sidecar SHA-256: `271b59accbe13aaede80d87640467f4564db27a62d9fc57fd810574757ea7709`. The full raw HTML stays in the local cache, not in the run directory. Importer QA confirms the body hash/size/URL and all corrected sidecar locators. HTTP status is not persisted.

## Tests and delivery state

Backend `npm test`: 206/206 passed after collection. SHA-256 values of all six backend/frontend public JSON files were identical before and after the test suite; mirror copies match. No DB query/write occurred. Mercury has not yet been called. The classification, QA, remote checkpoint, targeted DB delivery, reconciliation and receipt are separate pending stages.

Run status: `collection=partial`, `files=ready`, `database=pending`. Collection manifest SHA-256 `ef3c89c5388536e5c83b349bcd948c3f1301457fba948a8bc38445fb877356d0`; run state SHA-256 `1193e2e49852690eb3ccb3fc04779501fa95fc9300f6ab85d9848077631a26c9`.

## Next step

Checkpoint catalog, status, manifest, report and evidence sidecar to the remote branch. Then classify only the four nonduplicate IDs in an isolated run using requested model `inception/mercury-decide` via the Decisions API. Importer must independently validate the sealed classification output. Do not import until that output and this file checkpoint are remote; use targeted insert-only delta import, preserve all existing/admin fields, then reconcile and publish a receipt. Keep Fivizzano partial until its annual PDF/candidate queue is resolved; zero extracted rows in that separate failed PDF would not prove complete coverage.
