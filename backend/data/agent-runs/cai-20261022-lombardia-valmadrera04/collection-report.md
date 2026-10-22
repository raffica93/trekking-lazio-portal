# CAI regional collection report — Valmadrera

- Run: `cai-20261022-lombardia-valmadrera04`
- Source: `cai-valmadrera-9216081` (official CAI Valmadrera)
- Region: Lombardia
- Collection: existing CAI orchestrator; one source; concurrency 1; max 40 documents; budget 240,000 ms; no failed-source retry.
- Branch checkpoint before collection: `c012026eded2265d317c784dcfdced6928f5b90a`.
- Orchestrator state: `collection=partial`, `files=ready`, `database=pending`.

## Section result

| Sections checked | Complete | Partial | Unreachable | Documents processed | Events verified this run | Exact duplicate IDs excluded | Failures resolved | Failures open | Next step |
|---:|---:|---:|---:|---:|---|---:|---|---|---|
| 1 | 0 | 1 | 0 | 40 | 0 new/changed; 7 existing source events returned; 41 extracted rows across documents | 0 catalog duplicate IDs; per-document overlap suppression is not exposed | Discovery queue reduced from 23 to 12; no HTTP failures observed | 12 discovery candidates remain | After QA/tests/checkpoint, one bounded follow-up on the same source; leave partial if the queue remains |

The source has 7 event rows in the catalog, all already present unchanged at the Git baseline. The complete catalog remains 3,345 rows with 3,345 unique IDs: 0 added, 0 removed, 0 changed. The collector reported 41 extracted rows across documents and 7 source events after consolidation. Row-level extraction IDs are not included in the orchestrator output, so this report does not claim an exact count of cross-document duplicates suppressed. The catalog has zero duplicate IDs.

Run04 processed 20 additional documents after replaying the same 20-document prefix. It reached daily calendar pages from 2026-09-28 through 2026-10-17 and reduced the saved discovery backlog from 23 to 12. These pages are dated historical entries for the current date 2026-10-22; that does not establish the contents of unvisited pages or prove the section calendar complete. No HTTP failure occurred in the sample. No event coordinate or place attribution was added; existing records retain “Località da verificare”. No DB query or write occurred.

The 12 candidates in the saved queue, in order, are:

1. `/eventi/2026-10-18/`
2. `/eventi/2026-10-19/`
3. `/eventi/2026-10-20/`
4. `/eventi/2026-10-21/`
5. `/eventi/2026-10-22/`
6. `/eventi/2026-10-23/`
7. `/eventi/oggi/`
8. `/eventi/elenco/?eventDisplay=past`
9. `/evento/escursione-media-montagna-laghi-acquafraggia/`
10. `/evento/escursione-media-montagna-capanna-sciora/`
11. `/evento/escursione-media-montagna-sasso-canale/`
12. `/evento/escursione-media-montagna-rifugio-olmo-presolana/`

All 12 are on the official `https://organizzazione.cai.it/sez-valmadrera/` host and had no recorded prior failure. The two depth-1 calendar pages may discover more URLs; the next run must keep a document/time limit and report the actual queue.

## Reconciliation and verification

- Catalog: 3,345 unique IDs before and after; no event row changed.
- Backend/frontend copies: byte-identical for `excursions.json`, `cai-sections.json`, and `scrape-status.json`.
- Manifest: `manifest.json` seals the three output files; its recorded SHA-256 entries are independently checked before checkpoint.
- DB: pending; no query or write; no import because catalog delta is zero.
- Backend tests are run after collection; no tests run concurrently with collection.
- This report and its hash are tracked separately from the orchestrator's three-file manifest and included in the Git checkpoint.
