# CAI regional collection report — Valmadrera

- Run: `cai-20261022-lombardia-valmadrera01`
- Source: `cai-valmadrera-9216081` (official CAI Valmadrera)
- Region: Lombardia
- Collection command: existing CAI orchestrator, source-only; concurrency 1; max 12 documents; source budget 120,000 ms; no `--retry-failed`
- Started after remote checkpoint `d696840b0e16d586ee9378db4a12c71197fa4128`.
- Orchestrator state: `collection=partial`, `files=ready`, `database=pending`.

## Section result

| Sections checked | Complete | Partial | Unreachable | Documents processed | Events verified this run | Exact duplicate IDs excluded | Failures resolved | Failures open | Next step |
|---:|---:|---:|---:|---:|---:|---:|---|---|---|
| 1 | 0 | 1 | 0 | 12 | 0 new/changed; 7 existing source events returned | 0 catalog duplicate IDs; per-document overlap suppression is not exposed by the run output | Discovery backlog fell from 24 to 7 candidates in the saved status; no HTTP failure was observed in this sample | One `discovery-limit` issue remains with 7 candidates; exact outcomes for those unvisited documents are unknown | Continue with another bounded Valmadrera sample after this file checkpoint, unless the source changes |

The source has 7 event rows in the catalog. All 7 were already present unchanged at the Git baseline, and the complete catalog remains 3,345 rows with 3,345 unique IDs: 0 added, 0 removed, 0 changed. The collector reported 8 extracted rows across documents and 7 source events after consolidation. Row-level extraction IDs are not included in the orchestrator output, so this report does not claim an exact count of cross-document duplicates suppressed. The catalog has zero duplicate IDs.

No zero-event claim is made: the section is partial and 7 candidate documents remain. No event coordinate or place attribution was added; the existing records retain “Località da verificare”. No DB query or write occurred.

## Documents processed

All 12 documents below are represented in the source status. Counts are extracted rows per document, not unique events.

| Method | Extracted rows | URL |
|---|---:|---|
| pdf-text | 0 | `https://organizzazione.cai.it/sez-valmadrera/wp-content/uploads/sites/56/2026/03/Calendario-attivita-2026_rev.04_16-03-2026.pdf` |
| ics | 1 | `https://organizzazione.cai.it/sez-valmadrera/eventi/?ical=1` |
| ics | 1 | `https://organizzazione.cai.it/sez-valmadrera/?post_type=tribe_events&ical=1&eventDisplay=list` |
| ics | 1 | `https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?ical=1` |
| unsupported/no extraction | 0 | `https://organizzazione.cai.it/sez-valmadrera/attivita/calendario-attivita-2024/` |
| html-calendar | 1 | `https://organizzazione.cai.it/sez-valmadrera/eventi/` |
| html-calendar | 2 | `https://organizzazione.cai.it/sez-valmadrera/attivita/valma-street-block-2026/` |
| unsupported/no extraction | 0 | `https://organizzazione.cai.it/sez-valmadrera/attivita/` |
| html-calendar | 1 | `https://organizzazione.cai.it/sez-valmadrera/` |
| wordpress-events | 0 | `https://organizzazione.cai.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100` |
| ics | 1 | `https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?outlook-ical=1` |
| unsupported/no extraction | 0 | `https://organizzazione.cai.it/sez-valmadrera/attivita/gite-sociali-di-scialpinismo/` |

## Reconciliation and verification

- Catalog: 3,345 unique IDs before and after; no event row changed.
- Backend/frontend copies: byte-identical for `excursions.json`, `cai-sections.json`, and `scrape-status.json`.
- Manifest: `manifest.json` seals the three output files; its recorded SHA-256 entries were independently checked.
- DB: pending; no query or write; no import requested because catalog delta is zero.
- Backend tests, run only after collection: 178 passed, 0 failed. Output catalog hashes remained unchanged through tests.
- This report and its hash are tracked separately from the orchestrator's three-file manifest and included in the Git checkpoint.
