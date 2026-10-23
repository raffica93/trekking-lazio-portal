# CAI Cesena official-index sample

- Run: `cai-20261022-emilia-cesena-index01`
- Source: `cai-cesena-9224012` (CAI Cesena, Emilia-Romagna)
- Collection scope: one explicit URL, max 1 document, 120 s source budget, concurrency 1.
- Requested URL: `https://www.caicesena.com/index.php/programma-attivita`
- Canonical URL: same as requested URL in the persisted document record; no redirect was recorded.
- Command: `SCRAPE_MAX_DOCUMENTS=1 SCRAPE_SOURCE_BUDGET_MS=120000 npm run orchestrate -- init --run cai-20261022-emilia-cesena-index01 --source cai-cesena-9224012 --source-url 'https://www.caicesena.com/index.php/programma-attivita' --concurrency 1`, followed by `SCRAPE_MAX_DOCUMENTS=1 SCRAPE_SOURCE_BUDGET_MS=120000 npm run orchestrate -- collect --run cai-20261022-emilia-cesena-index01`.

The single document was cached as HTML, 33,413 bytes, body SHA-256 `292708d5ddddb26a9e412d30777ac7bfb47efc22fc51af71ea27c5642b8bc9c9`. The cache records content type `text/html; charset=utf-8` and `Last-Modified: Thu, 22 Oct 2026 23:18:05 GMT`. The persisted parser result is `method: null`, `events: 0`; no HTTP status code was persisted. The body title is “Programma attività - CAI Cesena” and headings include “Programma Attività” and “Prossimi eventi - link calendario attività”. Therefore zero parser rows are not evidence of an empty calendar. No discovered links were followed.

The section remains `partial` with 6 catalog records and `extractedEvents: 0`. Existing issues remain: the CAI Giovani second-half PDF OCR failure and 7 candidates on the annual PDF. The targeted index adds a separate `discovery-limit` issue with 1 candidate remaining. Run state is `collection: partial`, `files: ready`, `database: pending`.

Catalog comparison against local `HEAD` before collection: 3,366 rows and 3,366 unique IDs before and after; 0 added, 0 removed, 0 changed. The 6 Cesena-prefixed rows are unchanged, with canonical sorted-row SHA-256 `35c5ef388c346150eb5974def5e7a79cf215084c228b5761728f44d84c18ade6` before and after. The catalog JSON metadata was regenerated: `generatedAt` and `sourceHashes` changed; `source`, `sources`, `classifiedAt`, and `coverage` did not. Backend/frontend excursions and scrape-status mirrors are byte-identical. No database access or writes occurred.

## Run artifacts

- Orchestrator manifest: `manifest.json`, SHA-256 `e373ca59a7c19fdbeda66cae44c0a7d7b4575fbaaa920b5a3ed9a91441f00041`.
- Run state: `state.json`, SHA-256 `f23d9c5d5df718d256bf9febd153298b4bffbea027c10b8deddb79a398c842a8`.
- Scrape-status source record document hash: `292708d5ddddb26a9e412d30777ac7bfb47efc22fc51af71ea27c5642b8bc9c9`.
- Cache body: `backend/node_modules/.cache/cai/1b0e89a5649f626d49d9e5c5f6c791d9f05963ff47f9ed5153c53af0ec115a84.bin`.
