# CAI Potenza Picena — bounded continuation 01

- Run: `cai-20261022-marche-potenzapicena01`
- Source: `cai-potenza-picena-9228014` (Marche)
- Checkout: `codex/cai-orchestrator-luna` at `f4d86ea67c1037820c62a5da9ead6d761e183152`
- Scope: one explicit official URL, concurrency 1, `SCRAPE_MAX_DOCUMENTS=1`, `SCRAPE_SOURCE_BUDGET_MS=120000`.
- Orchestrator result: collection `partial`, files `ready`, database `pending`; no database access or write.

The requested URL `https://www.caipotenzapicena.it/attivita2026` resolved to the same-host canonical page `https://www.caipotenzapicena.it/attivita-temp`. Its HTML body is 654,389 bytes, SHA-256 `410c8d0f4dba157c141e7a56029ad32fd7ff9852dd217395895b637d14a4b96d`. The cache metadata records `text/html; charset=UTF-8` and ETag `W/"a9821ff6b5833d95c97e8f4285d1a81a"`; the run artifacts do not persist the HTTP response code. The production extractor records `method: null` and `events: 0` for this document. The cached response title is `attivita temp | My Site`; extraction did not establish a readable calendar, so zero extracted events is not evidence of an empty calendar.

| Sections checked | Complete | Partial | Unreachable | New verified events | Exact duplicate IDs excluded | Open issues |
|---:|---:|---:|---:|---:|---:|---|
| 1 | 0 | 1 | 0 | 0 | 0 | `discovery-limit`: 11 candidates remain on the official calendar URL |

The source still has one existing catalog row: `cai-potenza-picena-9228014-548230c7292d`, “Ferrata ‘Bertona’ Gran Sasso”, dated 2026-10-24. It was unchanged by this run. Its location remains `Località da verificare`; no coordinates are present. The source status reports one catalog excursion and `extractedEvents: 2` across the preserved document history; the requested page contributed zero extracted rows. No cooldown or new HTTP failure is recorded.

Catalog comparison against the run's starting HEAD: 0 added, 0 removed, 0 changed event rows. Backend/frontend mirrors are byte-identical. No tests, classification, import, commit, or push were run.

Manifest SHA-256: `2d5dd8ebca32ea25fdf52a84679cf553f42475d4791845cf875b509dfed39fa1`
State SHA-256: `5ec1fc1d2d3b4667a7e2bc1d1231130c2efdb1c99afc045e976fbad57a663a84`
Backend excursions SHA-256: `163cd1b6bdcaa397f6c295e21c8e1f2256daf8508b4dfc94d421c9e23a9a7272`
Backend scrape-status SHA-256: `8f679a56555de7ce8fe5ef799ae6039de8902e8eecd81763924d580cc46584f8`
