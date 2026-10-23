# CAI Cesena bounded activity-page sample

- Run: `cai-20261023-emilia-romagna-cesena-attivita01`
- Source: `cai-cesena-9224012` (CAI Cesena, Emilia-Romagna).
- Requested URL: `https://www.caicesena.com/index.php/attivita` (one explicit official-host URL; max 1 document, 120 s budget, concurrency 1, no child discovery).
- Previously read sibling route: `https://www.caicesena.com/index.php/programma-attivita`; this run did not request that route.
- Collection state: `partial`; files generated; database pending.

The persisted status records the requested URL with document hash `63bd28a27c8e0f85b5b431c1e8dd88dd0ecb41d09ba4fed5c166a48a924237bc`, `events: 0` and `method: null`. It does not persist HTTP status, content type, response bytes, source body, or a recoverable cache object. Importer independently confirmed the body is unavailable in this checkout and the sibling cache location checked. The metadata hash is not treated as a verified body SHA-256. Therefore the content attribution is **HOLD** and zero extracted rows are not evidence that the calendar is empty. The source remains partial; the existing OCR failure and discovery-limit issues are preserved, with one discovery-limit issue recorded for this route.

## Catalog comparison

| Measure | Before | After | Delta |
|---|---:|---:|---:|
| National catalog rows | 3,376 | 3,376 | 0 |
| Unique source IDs | 3,376 | 3,376 | 0 |
| Cesena rows | 6 | 6 | 0 |
| Added / removed / changed rows | — | — | 0 / 0 / 0 |
| Verified events / semantic duplicates excluded | — | — | 0 / 0 |

Sorted Cesena row-set SHA-256 before and after: `35c5ef388c346150eb5974def5e7a79cf215084c228b5761728f44d84c18ade6`. All six existing Cesena rows and all administrative/geographic fields are unchanged. No classification, coordinate, or DB candidate was created. No DB query or write occurred.

## Validation

Importer QA: file integrity PASS; source-content attribution HOLD. The run manifest hashes match the public files; backend/frontend excursions, sections and scrape-status mirrors are byte-identical. Backend `npm test`: 206/206 passed after collection. Six public JSON SHA-256 values were unchanged by tests. No tests ran concurrently with collection.

## Run artifacts

- `manifest.json` SHA-256: `fac455d43a27e0c481290615a3fa0fcb6fc51b59395643f80676562aba2fd8d6`
- `state.json` SHA-256: `1459a291193ec93e6443cc5089d9bab9a80599284a4155d3887a1d808032ef75`
- `source-evidence.json` SHA-256: `2819264d155fb072f9134cffa56b276221fab86759ba3ff28b57c32ef73b7f19`
- Public mirrors are recorded in `evidence-manifest.json`.
