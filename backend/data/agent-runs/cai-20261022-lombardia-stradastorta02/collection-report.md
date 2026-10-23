# Collection report — cai-20261022-lombardia-stradastorta02

- Checkpoint at start: `4313f5159231874d59bbbc41ac641fbdb6087313` on `codex/cai-orchestrator-luna`.
- Source: `cai-strada-storta-9116052` (only selected source).
- Explicit continuation URL: `https://stradastorta.it/new/eventi/` (same-host canonical document URL: `https://stradastorta.it/eventi/`).
- Limits: concurrency 1, `SCRAPE_MAX_DOCUMENTS=1`, `SCRAPE_SOURCE_BUDGET_MS=120000`; one `init` and one `collect`.
- Run state: collection `partial`, files `ready`, database `pending`; no classification, import, DB write, tests, or commit.

The cached response body for the requested URL is 215,977 bytes with SHA-256 `2ef8ff6949919ba58b018f056f4e2250bd8cfc4ea4915a3328ca69ca7519c90d`, unchanged from the pre-run cache. The redirected calendar document is recorded with method `html-calendar` and six extracted event cards. The adapter does not persist HTTP response status, so this run's artifacts cannot distinguish a 304 response from a 200 response with identical bytes. No second attempt was made.

The source remains partial because the bounded continuation did not exhaust discovery; the scrape status retains a `discovery-limit` issue. The source status reports seven excursions after collection. Relative to checkpoint HEAD, six existing source rows remain and one candidate was added:

- `cai-strada-storta-9116052-01a8ce10aa39` — “Monte Pisello – Rifugio Alpe Piazza”, 2026-10-25. The visible title and description record the changed destination; location remains “Località da verificare”, with no coordinates.

Five existing event rows had only source-document/description provenance updates from the current calendar page. Their IDs, titles, dates, category, location, coordinates, and other fields were preserved. No rows were removed. The candidate remains unclassified and the partial run is not import-ready.

The four canonical catalog copies are byte-identical between backend and frontend. The three files recorded in the run manifest have these SHA-256 values:

- `backend/data/excursions.json`: `052c4369dec21e21c7192334f26715bfbdbb452a1853a6f759a5818c9d6e2b69`
- `backend/data/cai-sections.json`: `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`
- `backend/data/scrape-status.json`: `0468b20fe63c3fc947a11d749504a94560b52276370188eb0f6446de224db4e6`

Manifest SHA-256: `dd28cd5f998acc65a20fd1043d5434c78652fe7fb527f9a1fd1b2febe15e3f10`.
