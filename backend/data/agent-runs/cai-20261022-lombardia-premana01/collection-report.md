# CAI Premana bounded continuation 01

- Run: `cai-20261022-lombardia-premana01`
- Source: `cai-premana-9216089` (Lombardia)
- Base checkpoint: `dcbee9e305c0e0ad0a5dc950a8fd67b339134e3c`
- Scope: one official HTML continuation URL, one source, max 12 documents, 120-second source budget, concurrency 1.
- URL: `https://organizzazione.cai.it/sez-premana/eventi/elenco/`
- Cached HTML body SHA-256: `bb4917edd3d73e08bf1ad047b79b27dac503b10f853e83a5ee0d7b8e66c6a3c` (167,423 bytes).
- The official page JSON-LD identifies “CENA SOCIALE”, 24 October 2026, location `PREMANA`; no coordinates were added or inferred.
- Manifest SHA-256: `abf50e4b5e4cd5532755beb85c9446836c03b26b7bead244e42e5ce4e868f6d4`.
- State SHA-256: `383dab5910e8f7420b1df83bca9d864579f5de5c94f0cec674b620670257a652`.

## Verification

The section remains partial. Its status history retains 40 of 40 prior document URLs and the source has one feed link skipped by policy plus discovery-limit issues; the residual count shown by the run fell from 10 candidates to 2. All candidates have not been verified, so this is not a complete calendar read.

The catalog remains at 3,359 unique IDs: no IDs added or removed and no duplicate IDs. One preexisting row, `cai-premana-9216089-b4e7ad624a0a` (“CENA SOCIALE”, 2026-10-24), changed only `sourceDocument` from the official iCal URL to the official HTML listing URL. Title, date, event link, location, coordinates, and all other row fields are unchanged. Backend/frontend catalog and scrape-status copies are byte-identical.

Collector and independent importer QA both PASS. No new source ID exists, so there is no classification or database delta to deliver; no DB query or write was made. Run state is `collection=partial`, `files=ready`, `database=pending`.

Backend `npm test`: 197/197 passed after collection completed. The four backend/frontend catalog/status hashes matched before and after tests. No tests ran in parallel with collection.

| Sections checked | Complete | Partial | Unreachable | Verified events | Duplicate IDs excluded | Failures resolved | Open failures | Next step |
|---:|---:|---:|---:|---|---:|---|---|---|
| 1 | 0 | 1 | 0 | 1 existing official event verified; 0 new catalog IDs | 0 | Residual discovery queue reduced 10→2 | 2 candidate documents remain; source stays partial | Inspect the local discovery/cache evidence and continue only if the remaining two URLs can be targeted without replaying the same queue |

This run did not repeat or alter the Valmadrera delivery. No event, coordinate, or place was invented.
