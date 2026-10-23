# CAI Pesaro official homepage bounded sample

- Run: `cai-20261023-marche-pesaro-homepage01`
- Region/source: Marche / `cai-pesaro-9228006`
- Requested URL: `https://caipesaro.it/`
- Scope: one explicit source URL, `SCRAPE_MAX_DOCUMENTS=1`, source budget 120,000 ms, concurrency 1. The run selected only this URL seed. The redirect chain/request count was not persisted, so this report does not assert exactly one HTTP exchange.
- Result: collection `partial`, files `ready`, database `pending`; zero extracted or verified events and zero catalog delta. This is a failed homepage discovery attempt, not evidence of an empty calendar.
- Failure: scraper rejected a redirect outside the registered official HTTPS host `caipesaro.it` before retaining the response body. HTTP status, `Location`/final URL, and body are not present in the run artifacts. The status entry still has the legacy `url` value `http://www.caipesaro.it/`; do not infer the redirect destination from it.
- Catalog integrity: `backend/data/excursions.json` and `frontend/public/excursions.json` both SHA-256 `10e8fdbba313be8c8b49d3cf2dd9c465590b0d99986bde45560df0a3ee8ad2c7`; `backend/data/cai-sections.json` and its frontend mirror both SHA-256 `992e32565ed65031f95873b7dd83fc82b8feba66daa4aebd59cfe6ea277d6100`. No event/catalog rows were added, removed, or changed.
- Status integrity: backend and frontend `scrape-status.json` match byte for byte, SHA-256 `5cc2ae7caefa2f9f8c7876f433a7516423e6ebe9bbd05ce99903feb05f7b5391`. Semantic status changes are Pesaro's failed attempt plus the two directory-only website refreshes already present for S. Benedetto del Tronto and Sarnano; their prior documents/history remain.
- Independent importer QA: PASS for manifest/hash, catalog and mirrors; HOLD for request evidence because no response-body evidence, HTTP status, or final URL was persisted. Manifest SHA-256 `7bec2799fcf3791d0004e9577334621e6161f2b7b1061e7d703cd4e928a10267`; state SHA-256 `9703deff0e9dbda34557e43b0e6105203c138631827e653d51b5ed3f3d5125e4`.
- Verification: backend `npm test` 214/214 passed after collection. The checked public catalog/registry files remain identical across backend/frontend mirrors; no catalog delta is present after tests.
- Database: no read, migration, write, import, or receipt; no verified delta exists.
- Next: checkpoint these artifacts, then resolve the redirect using exact official-host evidence before considering a new bounded request. Preserve the source as partial until a readable calendar/feed is verified. Do not mark zero events or import this run.
