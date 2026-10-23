# CAI Pavullo Calendario 2026 sample

- Run: `cai-20261022-emilia-pavullo-calendar01`
- Source: `cai-pavullo-nel-frignano-9224020` (CAI Pavullo nel Frignano, Emilia-Romagna)
- Scope: one explicit URL; max 1 document; 120 s source budget; concurrency 1.
- Requested URL: `https://www.caipavullo.it/calendario-2026/`
- Commands: `SCRAPE_MAX_DOCUMENTS=1 SCRAPE_SOURCE_BUDGET_MS=120000 npm run orchestrate -- init --run cai-20261022-emilia-pavullo-calendar01 --source cai-pavullo-nel-frignano-9224020 --source-url 'https://www.caipavullo.it/calendario-2026/' --concurrency 1`; then `SCRAPE_MAX_DOCUMENTS=1 SCRAPE_SOURCE_BUDGET_MS=120000 npm run orchestrate -- collect --run cai-20261022-emilia-pavullo-calendar01`.

The official page was cached as HTML, 109,118 bytes, body SHA-256 `dec0ec970504f29cd15a1b9b3949d613e9834bb42ae000b39128793d5e7ff138`, content type `text/html; charset=UTF-8`. The parser used `html-calendar` and recorded 23 extracted rows. The page title and heading say “Calendario 2026”, and its top line reads “23 Ottobre 2026”; the table header separately says “ESCURSIONISMO – ALPINISMO 2025”. This is an explicit year-label inconsistency. The representative new rows’ weekday labels match 2026 (e.g. DOM 04/10, DOM 11/10, SAB 17/10, DOM 25/10, DOM 01/11), not 2025, supporting but not erasing the table-header discrepancy. No raw intermediate parser transcript is persisted.

Catalog delta against local `HEAD` immediately before collection: 3,366 rows / unique IDs before and 3,371 after; 5 added, 0 removed, 0 changed. Existing CAI Pavullo rows grew from 17 to 22 with no preexisting row changed. The parser produced 23 rows; 5 resulted in new unique catalog IDs. The manifest/status do not persist an exact duplicate-exclusion count, so the remaining 18 extracted rows are not labeled as duplicates here. The 5 new rows are:

| Event ID | Source title | Parsed date |
|---|---|---|
| `cai-pavullo-nel-frignano-9224020-195cdeaaefee` | MONTE HOABONTI E MONTE COLA DE. L.Toni – G.Boilini EE | 2026-10-04 |
| `cai-pavullo-nel-frignano-9224020-911b3fb35e48` | Via Alpinistica Spigolo Bianco – Malcesine DE. R..Corsini – A.Piccioli A – III, IV obbl. | 2026-10-11 |
| `cai-pavullo-nel-frignano-9224020-0d5f7b164d74` | ANELLO DEI COLLI – CASTELVETRO E LEVIZZANO DE. G.Lorenzi – R.Corsini T – G.Giovani | 2026-10-17 |
| `cai-pavullo-nel-frignano-9224020-ed6b83da6a5f` | LAGO TERZO E LAGO DELLA NINFA DE. L. Biolchini – N.Andreoli E | 2026-10-25 |
| `cai-pavullo-nel-frignano-9224020-201b098e6e08` | ANELLO DEL COLBRICON DE. C.Lazzarini – F.Fulgeri EE | 2026-11-01 |

The first three parsed dates precede the collection date (2026-10-22); retain that fact for downstream eligibility review. The new rows have no latitude/longitude. No existing coordinates or editorial fields were changed. Source remains `partial`, with 22 source catalog records and aggregate `extractedEvents: 108`; prior PDF-cultural timeout and iCal discovery-limit 5 remain, and this explicit continuation adds discovery-limit 1 on the target page. Run state is `collection: partial`, `files: ready`, `database: pending`. No other URLs were followed; no tests, DB or import were run.

## Catalog hashes

- Excursions JSON before/after: `85d5482519433df06d2e15d2db3deb651309ac52945671607bb954170f40c2ad` → `2ccd818d964d938b0e480e4aee62410c1991b7b9220a32727d7798aebfeb920d`.
- Scrape-status JSON before/after: `90e1e6a62de6e059d02f7853681a8a1c6a4a1551966076cccfe378ef61c47dcc` → `62915cc7f83687e8e00d0158249df10ab6421555cbb13ff2282de29bfd0f719e`.
- Backend/frontend excursions mirrors match; backend/frontend scrape-status mirrors match.
- Canonical sorted CAI Pavullo row SHA-256 before: `f2fe3737f864ba0a8915c3f271c143e03814fa3296efeb4bf30033ec8404232c`; after: `9dde60548820a580a92e804d1ca236ad8139a3d173683bf2ccf9501a21cbe8c5`.

## Run artifacts

- Orchestrator manifest: `manifest.json`, SHA-256 `d62d10c601192773fa611f2eeaf955198ca5d417fb597c5fb0e23f4ba8004686`.
- Run state: `state.json`, SHA-256 `4dbc20630333abb003e9728b197ee75f00c8c5a763f5a66454e52d412d75ffff`.
- Collection report: `collection-report.md`.
- Cached source body: `backend/node_modules/.cache/cai/bad543ae0b7b7b33e2b6db711e7e6f4428db5a0640450d7a6bd0497a7dd33e43.bin`.
