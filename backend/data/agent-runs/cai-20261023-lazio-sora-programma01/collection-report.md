# CAI Sora bounded programme-announcement sample

- Run: `cai-20261023-lazio-sora-programma01`
- Source: `sora` (CAI Sora, Lazio).
- Requested official URL: `https://www.caisora.it/sito/programma-escursionistico-2026-2/` (max 1 document, 120 s, concurrency 1, no child discovery).
- Collection state: `partial`; files ready; database pending.

The cached HTML is 75,149 bytes, content type `text/html`, SHA-256 `59df2257b67d462f64ffe2eee243f28c02310d0ec52c135349bed3576c9ea742`; this matches the document hash recorded in scrape-status for the requested URL. The page title is “Programma Escursionistico 2026” and the article is dated 17 January 2026. Its text announces that the 2026 programme is online and links “QUI” to `http://www.caisora.it/sito/wp-content/uploads/2026/02/2026.pdf`. That linked PDF is the distinct URL with a pre-existing OCR failure and discovery-limit 9, so it was not followed or retried. HTTP status and final URL were not persisted. The parser returned `method=null` and zero rows for this announcement page; this is not evidence that the underlying calendar is empty.

## Catalog comparison

| Measure | Before | After | Delta |
|---|---:|---:|---:|
| National catalog rows / unique IDs | 3,376 / 3,376 | 3,376 / 3,376 | 0 |
| Sora rows | 10 | 10 | 0 |
| Added / removed / changed rows | — | — | 0 / 0 / 0 |
| Events verified / semantic duplicates excluded | — | — | 0 / 0 |

Sorted Sora row-set SHA-256 before and after: `57a2e514ff0b3b8686cb3a989db56d14a16d1c501c8d4e8b38a9dae29f98e302`. All ten existing Sora rows and their editorial/geographic fields are unchanged. No coordinates, classification or DB candidate were produced. No DB query/write occurred. The source remains partial: PDF OCR failure, PDF discovery-limit 9, and a new discovery-limit 1 on the announcement URL; no failures were resolved.

## Validation

Importer QA: file integrity PASS and catalog diff PASS; source-content interpretation HOLD for event coverage because the article links to a separate programme PDF. Run manifest hashes match the public files; backend/frontend excursions, sections and status mirrors are byte-identical. Backend `npm test`: 206/206 after collection. Six public JSON hashes were unchanged by tests. No tests ran concurrently with collection.

## Run artifacts

- `manifest.json` SHA-256: `dc7f33fc5539548b66ff4aad9d494520df6a4dd50e37cfbb651430eb22a1dad7`
- `state.json` SHA-256: `75f503ae185ee9738852eb89e903b7842b3314f8512d7a4501a0edb424098637`
- `source-evidence.json` SHA-256: `ec52d8929e3702d09c7455025995d51426d0e4ca241e53365535017e958f1837`
- Public mirror hashes and seals: `evidence-manifest.json`.
