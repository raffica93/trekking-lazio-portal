# CAI regional collection report — Valmadrera

- Run: `cai-20261022-lombardia-valmadrera03`
- Source: `cai-valmadrera-9216081` (official CAI Valmadrera)
- Region: Lombardia
- Collection: existing CAI orchestrator; one source; concurrency 1; max 20 documents; budget 180,000 ms; no failed-source retry.
- Branch checkpoint before collection: `2e4b63b7b7e621dd55f716473cea5c596719e8e6`.
- Orchestrator state: `collection=partial`, `files=ready`, `database=pending`.

## Section result

| Sections checked | Complete | Partial | Unreachable | Documents processed | Events verified this run | Exact duplicate IDs excluded | Failures resolved | Failures open | Next step |
|---:|---:|---:|---:|---:|---|---:|---|---|---|
| 1 | 0 | 1 | 0 | 20 | 0 new/changed; 7 existing source events returned; 19 extracted rows across documents | 0 catalog duplicate IDs; per-document overlap suppression is not exposed | Five of the seven earlier residual URLs were reached; no HTTP failures observed | 23 discovery candidates remain; the two earlier residual URLs `/eventi/oggi/` and `/eventi/elenco/?eventDisplay=past` remain unvisited | One bounded follow-up on this source with max 40 documents/240 s, then reassess the remaining queue |

The source has 7 event rows in the catalog. All 7 were already present unchanged at the Git baseline. The complete catalog remains 3,345 rows with 3,345 unique IDs: 0 added, 0 removed, 0 changed. The collector reported 19 extracted rows across documents and 7 source events after consolidation. Row-level extraction IDs are not included in the orchestrator output, so this report does not claim an exact count of cross-document duplicates suppressed. The catalog has zero duplicate IDs.

The first 12 documents repeat the initial registry seeds on every new run. Run02 therefore repeated the same 12 documents and left the then-reported 7 candidates unchanged. The deterministic crawler has no persisted cursor. Run03 increased the bounded document budget to reach more of the queue; it reached five of the earlier seven candidates, and those pages exposed additional dates/details, leaving 23 queued candidates. Run02 is superseded and was not checkpointed as a separate output snapshot; do not rely on its manifest for the current files.

No zero-event claim is made: the section is partial and 23 candidate documents remain. No event coordinate or place attribution was added; existing records retain “Località da verificare”. No DB query or write occurred.

## Earlier residual URLs checked

Reached: `/attivita/escursioni/`, `/attivita/incontri/`, `/eventi`, `/eventi/elenco/`, `/eventi/mese/`.

Still unvisited from that queue: `/eventi/oggi/`, `/eventi/elenco/?eventDisplay=past`.

The next queue reconstructed offline from cached official pages contains 17 dated pages (`/eventi/2026-09-28/` through `/eventi/2026-10-14/`), the two unvisited pages above, and four event-detail URLs. Those dates are historical as of 2026-10-22, but the calendar pages will be checked rather than assumed empty. No prior HTTP failure/cooldown is recorded for these queue URLs.

## Documents processed

Counts are extracted rows per document, not unique events.

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
| unsupported/no extraction | 0 | `https://organizzazione.cai.it/sez-valmadrera/attivita/escursioni/` |
| unsupported/no extraction | 0 | `https://organizzazione.cai.it/sez-valmadrera/attivita/incontri/` |
| html-calendar | 1 | `https://organizzazione.cai.it/sez-valmadrera/eventi/` |
| html-calendar | 1 | `https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/` |
| html-calendar | 4 | `https://organizzazione.cai.it/sez-valmadrera/eventi/mese/` |
| ics | 1 | `https://organizzazione.cai.it/sez-valmadrera/eventi/mese/?ical=1` |
| ics | 1 | `https://organizzazione.cai.it/sez-valmadrera/eventi/mese/?outlook-ical=1` |
| html-calendar | 3 | `https://organizzazione.cai.it/sez-valmadrera/eventi/mese/2026-09/` |

## Reconciliation and verification

- Catalog: 3,345 unique IDs before and after; no event row changed.
- Backend/frontend copies: byte-identical for `excursions.json`, `cai-sections.json`, and `scrape-status.json`.
- Manifest: `manifest.json` seals the three output files; its recorded SHA-256 entries will be independently checked before checkpoint.
- DB: pending; no query or write; no import because catalog delta is zero.
- Backend tests are run after collection; no tests were run concurrently with collection.
- This report and its hash are tracked separately from the orchestrator's three-file manifest and included in the Git checkpoint.
