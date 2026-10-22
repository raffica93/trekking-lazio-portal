# Collection report — CAI Caserta

- Run: `cai-20261022-campania-caserta-index01`; source `cai-caserta-9238006`; orchestrator state `collection=partial`, `files=ready`, `database=pending`.
- Scope: exactly one explicit official URL, concurrency 1, maximum 1 document, 120 s source budget: `https://www.caicaserta.it/escursioni.html`. No linked PDFs, discovery follow-ups, tests, classification, import, or DB activity occurred.
- The cached body requested and canonical URL are identical. It is an HTML page with title “Cai Caserta - Club Alpino Italiano” and heading “Escursioni, avvisi, programmi”. Cache metadata records `text/html`, `7179` bytes, Last-Modified `Tue, 13 Oct 2026 16:56:31 GMT`, and body SHA-256 `bb3bf1b613641c692e434db5496e461858509686bd2600b0cf299b80dd6ce039`. HTTP status was not persisted.
- The page is an official excursion/program index with links to the section calendar PDF, general 2026 program PDF, and detail/locandina documents. The deterministic extractor returned `method=null`, 0 event candidates. This is not evidence of an empty or complete calendar. The explicit document cap prevented fetching child PDFs.
- The source remains `partial`; status contains 4 prior documents plus this index (5 documents total). It retains the annual PDF `discovery-limit` with 5 candidates and its prior `Via_Francigena_Castelli_Romani.pdf` OCR failure; the index itself adds a separate `discovery-limit` of 1 candidate. No issue was cleared. The summary CLI printed `unsupported (50 excursions)`, while persisted status is `partial`; report uses persisted status and does not call the source complete.
- Catalog comparison against baseline `16204f085ae88c110fde2d5335bec7c228e074e4` used event-ID prefix `event.id startsWith cai-caserta-9238006-`: 50 rows before and after, 0 added, 0 removed, 0 changed; canonical sorted-row SHA-256 `1bc3d52b28218c621596dfbeb21e00a7b90bdb9fa2b0e0c4b405557498cb3b74` is identical. Total catalog rows remain 3366; 0 event-row delta. Full excursions JSON SHA changed from `704ea8322b02b6ce479338df3855da7974ed25d94bfabffe5536d721b3bb88d2` to `d3e8e73a66063319c606fbe921695f08f4336ca50dc0ebfb3f69cd29d34f426f` due generated metadata/source hash only; `generatedAt` changed from `2026-10-22T22:50:43.768Z` to `2026-10-22T22:59:45.039Z`, and the Caserta source hash changed from `f6998d81a962d63700ae897c5035901139be5ec22feb142ae49f76b662d7a94a` to `2ca2ef01ab8b72dc6457142f4805d6630b8733ade633359babed85f5acf71cbf`. Sections JSON is unchanged. Scrape-status SHA changed from `a58baf3e0e6d71730a6ecc70bbbbd85215d531afe5f57508647fa98d59cbad71` to `dfd5fd676ec87d5b3e4897cbd067ed86875707ec6fb326364609e0dca3adc3e3` to record the index document and its remaining candidate; source status stays partial.
- Backend/frontend mirrors for excursions, sections, and scrape-status are byte-identical. No coordinates or event fields changed. No database writes.

## Public JSON hashes

| File | Baseline SHA-256 | After run SHA-256 |
|---|---|---|
| excursions (backend and frontend mirror) | `704ea8322b02b6ce479338df3855da7974ed25d94bfabffe5536d721b3bb88d2` | `d3e8e73a66063319c606fbe921695f08f4336ca50dc0ebfb3f69cd29d34f426f` |
| cai-sections (backend and frontend mirror) | `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b` | `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b` |
| scrape-status (backend and frontend mirror) | `a58baf3e0e6d71730a6ecc70bbbbd85215d531afe5f57508647fa98d59cbad71` | `dfd5fd676ec87d5b3e4897cbd067ed86875707ec6fb326364609e0dca3adc3e3` |

The orchestrator `manifest.json` and `state.json` were not edited after collection; hashes are recorded in `evidence-manifest.json`.
