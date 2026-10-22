# CAI Cernusco bounded continuation 03

- Run: `cai-20261022-lombardia-cernusco03`
- Source: `cai-cernusco-sul-naviglio-9216051` (Lombardia)
- Checkpoint code: `a015865283f0097d22036a9d75f4e0e17cd94bbb`
- Scope: one official 2026 PDF, one source, max 1 document, 120-second source budget, concurrency 1.
- Document: `https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf`
- Document SHA-256: `654a51f8d310cd6b65ad6e99a5a74ef05165a18d6e6411f6e21e9389720aa291` (5,853,583 bytes).
- Extraction cache: deterministic VERSION 12, key `cf273a867bdc9017520ba45384febe343ae377ee2ecb7b2fd467326f042f08b2`; `pdf-ocr`, recognized, 8 extracted events. The stale v11 cache remains preserved and was not reused.
- Manifest SHA-256: `c9164d3839dd1abebc62e9262fb40aca590fe7812e4f7c33e8a76c35ea2bba14`.
- State SHA-256 before this report: `218b54ee8afce0a9bb4dd1113715668165bf3eeb6b9adf7006f441bfffe6b7c2`.

## Verification

The source remains `partial`: 36 document-history rows and all 3 prior issues are retained. This continuation read only the explicitly selected PDF; it did not claim that the source calendar is complete. The extracted 25 October row is the existing “Alpe Devero (VB)” entry with the official PDF as `sourceDocument`; the false OCR ID `cai-cernusco-sul-naviglio-9216051-cb33842fc3c2` is absent from the catalog. No coordinates were added.

Against the published catalog at `a015865`, the catalog remains 3,359 unique IDs: 0 added, 0 removed, 1 existing row changed. Only the description of `cai-cernusco-sul-naviglio-9216051-61c82c9856f6` gained the PDF text “PROGRAMMA Accompagnamento durante le escursioni, 13 Dicembre - Giornata della Montagna”. Its title, status, cover, database ID, coordinates, location source, and region are unchanged; every other event row is byte-equivalent after JSON comparison. Backend/frontend excursions and scrape-status copies are byte-identical.

Collector QA and independent importer QA both PASS. The import delta is empty: no classification request, database insert, update, or query was needed. Run state is `collection=partial`, `files=ready`, `database=pending`; this is a file checkpoint only, not a database delivery. The partial source has 3 retained issues: two non-calendar oEmbed links skipped by policy and one historical Outlook iCal timeout. No retry was made for that unrelated URL.

Backend `npm test`: 197/197 passed after collection completed. SHA-256 of all four backend/frontend catalog/status files matched before and after tests. `git diff --check` passed. No collection ran in parallel with tests.

| Sections checked | Complete | Partial | Unreachable | Verified events | Duplicate IDs excluded | Failures resolved | Open failures | Next step |
|---:|---:|---:|---:|---|---:|---|---|---|
| 1 | 0 | 1 | 0 | 4 existing Cernusco catalog IDs retained; 0 new IDs | 0 | v11 stale OCR extraction bypassed by v12 cache key; false ID removed from run output | 3 historical issues remain; 36 documents retained | Publish this file checkpoint, then choose a different workable Lombardia source; do not retry the historical timeout before cooldown/evidence |

No DB rows were delivered by this run. It does not repeat or alter the already reconciled Valmadrera delta.
