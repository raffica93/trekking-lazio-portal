# CAI Cesena Escursionismo Adattato sample

- Run: `cai-20261022-emilia-cesena-escursionismo01`
- Source: `cai-cesena-9224012` (CAI Cesena, Emilia-Romagna)
- Scope: one explicit official URL; max 1 document; 120 s budget; concurrency 1.
- Requested URL: `https://www.caicesena.com/images/download/2026/programma_2026_escursionismo_adattato_cai_cesena.jpg`
- Command sequence: `SCRAPE_MAX_DOCUMENTS=1 SCRAPE_SOURCE_BUDGET_MS=120000 npm run orchestrate -- init --run cai-20261022-emilia-cesena-escursionismo01 --source cai-cesena-9224012 --source-url 'https://www.caicesena.com/images/download/2026/programma_2026_escursionismo_adattato_cai_cesena.jpg' --concurrency 1`; then `SCRAPE_MAX_DOCUMENTS=1 SCRAPE_SOURCE_BUDGET_MS=120000 npm run orchestrate -- collect --run cai-20261022-emilia-cesena-escursionismo01`.

The cached body is a 685,319-byte JPEG, SHA-256 `6c11893a0b371c51650c39a8275a777d13bc06f29dc0f9204fd6aaf6bc72702c`; content type `image/jpeg`, `Last-Modified: Wed, 10 Jun 2026 11:58:14 GMT`. The extractor ran `image-ocr` and recorded zero event rows. No raw OCR transcript is persisted. The cached poster itself is headed “Sezione C.A.I. di Cesena — Escursionismo Adattato”, “Gruppo Montagnaterapia ‘Diego Brighi’”, “La montagna per tutti”. It lists 2026 outing dates including 24 October, 7 November, and 21 November, but does not pair these dates with individual outing destinations/titles. The parser result is therefore not a complete set of event records; no event or coordinates were inferred from the poster.

Source remains `partial`, with 6 existing catalog events and `extractedEvents: 0`. Existing issues remain: OCR failure on the second-half Giovani PDF, annual-PDF discovery limit 7, and index continuation discovery limit 1. This run added a document record with method `image-ocr`, 0 events, and no new source issue. No other URLs were fetched or followed.

Catalog comparison against local `HEAD` immediately before the run: 3,366 event rows / unique IDs before and after; 0 added, 0 removed, 0 changed. The 6 Cesena-prefixed rows remain unchanged; sorted-row SHA-256 before and after is `35c5ef388c346150eb5974def5e7a79cf215084c228b5761728f44d84c18ade6`. No event duplicates were emitted or excluded because extraction produced zero rows. Catalog metadata was regenerated; backend/frontend excursions and scrape-status mirrors are byte-identical. Excursions JSON SHA-256 before/after: `8a6c0c12565be024e083282691e9108b022e6710663a3f01d45cd12f93ce2f82` → `85d5482519433df06d2e15d2db3deb651309ac52945671607bb954170f40c2ad`; scrape-status JSON SHA-256 before/after: `1c9e7d46ada4e2ce9ace39125c28219d103c428e725aedd26fe2c9686a11ecc8` → `90e1e6a62de6e059d02f7853681a8a1c6a4a1551966076cccfe378ef61c47dcc`. Run state is `collection: partial`, `files: ready`, `database: pending`. No tests, DB, or import were run.

## Artifacts

- Manifest: `manifest.json`, SHA-256 `8caa9bc863d6f8be297e6eff362ddcb43eecc2413700a577da048d7b447f6925`.
- Run state: `state.json`, SHA-256 `87056fdf3c04fa24806d4ccba42c9bec4953074f54c8ba3970b1978c2e2e34d1`.
- Report: `collection-report.md`.
- Cached source body: `backend/node_modules/.cache/cai/fe214068a6ad01e4d148fd54a732f49d32f388386944e77a5f58d9533631e3c0.bin`.
