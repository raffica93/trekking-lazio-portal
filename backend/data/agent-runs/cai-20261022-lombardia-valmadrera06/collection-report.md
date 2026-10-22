# Collection report — cai-20261022-lombardia-valmadrera06

- Source: `cai-valmadrera-9216081` (CAI Valmadrera, Lombardia)
- Checkpoint before run: `codex/cai-orchestrator-luna` at `f00a1e4eb4eaea4a2eb916578ba1d6dce7e3d377`
- Run created: `2026-10-22T19:42:28.063Z`; collection completed: `2026-10-22T19:42:44.573Z`
- Collection scope: exactly this one selected source, concurrency 1, `SCRAPE_MAX_DOCUMENTS=8`, `SCRAPE_SOURCE_BUDGET_MS=180000`, and the eight explicit source URL continuations below. No database/import, geolocation, tests, commit, or push was performed.
- Outcome: `collection=partial`, `files=ready`, `database=pending`. The pipeline reached all 8/8 requested URLs. The source remains partial because discovery stopped at the hard document limit with 19 candidates remaining on the official calendar PDF URL. No additional source was scheduled or attempted by this run.

## Requested documents reached

| # | URL | Method | Extracted rows | SHA-256 |
|---:|---|---|---:|---|
| 1 | https://organizzazione.cai.it/sez-valmadrera/eventi/oggi/?ical=1 | ics | 1 | `4a5c0789fd86b0b5f10816781fab878ea0fd54651e09f15a2f0e0cdee5dd749f` |
| 2 | https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?tribe-bar-date=2026-10-22 | html-calendar | 1 | `5ca1f84227b0f7bc8a70748196fc67cd5aec8e93b47285ef962a994a9f60abad` |
| 3 | https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-23/?ical=1 | ics | 1 | `55cd36f5cc5ee51a37ef01b2c874cef8a745042d528b22210c3cb456e98becf3` |
| 4 | https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-23/?outlook-ical=1 | ics | 1 | `2d7a26ca854c47789c20474c7023af127e983b915c490e21312d15063c5dd66f` |
| 5 | https://organizzazione.cai.it/sez-valmadrera/eventi/mese/2026-10/ | html-calendar | 4 | `419c4f3b49084bf59e98397a04d4775f4557facc866e803aba34b453a6b1a536` |
| 6 | https://organizzazione.cai.it/sez-valmadrera/attivita/ | — | 0 | `b81e0bc8671b211551a95c786ce276a612d93d724fce05e575608568ca34ebcc` |
| 7 | https://organizzazione.cai.it/sez-valmadrera/attivita/escursioni/ | — | 0 | `cd2eb827c5040aad55f2b67409abdc6832a3a7f4ca9991b5db8f2be599bb7aee` |
| 8 | https://organizzazione.cai.it/sez-valmadrera/attivita/gite-sociali-di-scialpinismo/ | — | 0 | `c59b7ff1e44e2852384fa6fc8acf54c00c846fe6f7edfe9bb1f5471bebe8433f` |

## Event and catalog delta

- The eight fetched documents yielded 8 extracted rows and 7 unique catalog records; one duplicate row was excluded during reconciliation.
- Comparing the current catalog with the checkpoint commit's `backend/data/excursions.json`: Valmadrera remains at 7 records, with 0 new record IDs and 0 removed IDs.
- Updated fields:
  - `cai-valmadrera-9216081-2e6836d55db9`: `sourceDocument` changed from `https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-22/?ical=1/` to `https://organizzazione.cai.it/sez-valmadrera/eventi/oggi/?ical=1`.
  - `cai-valmadrera-9216081-f5b0c93802a9`: `sourceDocument` changed from `https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-18/` to `https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?tribe-bar-date=2026-10-22`.
  - `cai-valmadrera-9216081-93f8dd640820`: `sourceDocument` changed from `https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?eventDisplay=past` to `https://organizzazione.cai.it/sez-valmadrera/eventi/mese/2026-10/`.
  - `cai-valmadrera-9216081-08f80e8dc9a5`: `sourceDocument` changed from `https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?eventDisplay=past` to `https://organizzazione.cai.it/sez-valmadrera/eventi/mese/2026-10/`.
  - `cai-valmadrera-9216081-e2177dd44e1a`: `sourceDocument` changed from `https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-18/` to `https://organizzazione.cai.it/sez-valmadrera/eventi/mese/2026-10/`; `description` expanded from a truncated to a longer source excerpt.
- All remaining event fields are unchanged. No location or coordinate fields were written; the section's existing uncertain locations and unknown coordinate quality remain as they were.
- The generated catalog currently contains 3,345 excursions overall; this is a local file count, not a database or live-map query.

## Residual work and verification

- Remaining discovery queue: 19 candidates, recorded against `https://organizzazione.cai.it/sez-valmadrera/wp-content/uploads/sites/56/2026/03/Calendario-attivita-2026_rev.04_16-03-2026.pdf`; collection status is partial. No retry or expansion was performed.
- No HTTP/source error was recorded for the eight requested documents. No separate source was attempted.
- Backend `npm test` was run after collection: 186/186 passed. Hashes of the backend/frontend catalog copies were identical before and after the test run; read-only SHA-256 verification confirmed the three manifest output files match `manifest.json`.
- Manifest: `backend/data/agent-runs/cai-20261022-lombardia-valmadrera06/manifest.json`, SHA-256 `f673039b1a8b2286067637a9ddb524c04868656bc1a6e6505b2ac6252934d64d`.
- Manifested output hashes:
  - `backend/data/excursions.json`: `bb0a6a511a8bb033ca5611508cb731aa933d88d377d9075fe0f3b08c13d1264f`
  - `backend/data/cai-sections.json`: `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`
  - `backend/data/scrape-status.json`: `1e23da5325c270c8344a1280f1f09d8ffc1d983b6f6a259b97b49534315faaf7`
- Run state: `backend/data/agent-runs/cai-20261022-lombardia-valmadrera06/state.json`, SHA-256 `fa591cf1518d99234684474b66bea5b19b8cf113c96d809b6879c4db9306668f`.
