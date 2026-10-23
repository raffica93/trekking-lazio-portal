# CAI Premana residual continuation 02

- Run: `cai-20261022-lombardia-premana02`
- Source: `cai-premana-9216089` (Lombardia)
- Base checkpoint: `ba079704bac2524f87a22140d59b390ff30f8e5c`
- Scope: exactly two official continuation URLs, max 2 documents, 120-second source budget, concurrency 1.
- URLs: `/eventi/oggi/` and `/eventi/elenco/?eventDisplay=past` on `https://organizzazione.cai.it/sez-premana/`.
- The first page parsed 0 events; the second parsed 9 historical events, none upcoming. No event was added or coordinate inferred.
- New body hashes: `60828a153751dc22a7bf1a511b1f2b9cb61f95a1766177dfd8da091eb251305a` and `86f727b6394002a0f743e89285b2c434ac1257e8d2178100dcc78f182f4a2955`.
- Manifest SHA-256: `4b00cb7e88e787e93cf47d08960c80ecf48dfc8e1e42d11cc29669070206990d`.
- Run state SHA-256: `4e6c2a3aa9b93dfb6413f6045458254105ce0bb346e73a815062a79b605b99e6`.

## Verification

The orchestrator records `collection=partial`, `files=ready`, `database=pending`. The nested single-source CLI printed `unsupported` for this two-URL slice, while the persisted source status remains `partial`; this is consistent with the limited sample containing no upcoming events and unresolved discovery work. The existing 40-document source history was preserved, with no URLs added or removed. Two old body hashes were refreshed. The queue indicator advanced from 2 to 4 candidate documents, but the run does not persist the exact four URLs.

Against the previous published checkpoint, the catalog remains 3,359 IDs with 0 added, 0 removed, 0 changed event rows. Global generated/coverage metadata and Premana's document hashes/issues changed. Backend/frontend catalog and status copies are byte-identical.

Collector and independent importer QA PASS. No new source ID or classification exists; no database query or write was needed. Backend `npm test` passed 197/197 after collection; all four catalog/status hashes were stable during tests.

| Sections checked | Complete | Partial | Unreachable | Verified events | Duplicate IDs excluded | Failures resolved | Open failures | Next step |
|---:|---:|---:|---:|---|---:|---|---|---|
| 1 | 0 | 1 | 0 | 9 past source rows reviewed; 0 upcoming, 0 new IDs | 0 | Two exact residual URLs fetched and parsed within budget | Queue grew 2→4, but exact next URLs are not persisted; this source has no safe targeted continuation at present | Stop Premana to avoid replay/no-progress; select a different workable Lombardia source |

This run does not establish an empty future calendar or complete coverage. It did not repeat or alter any database delivery.
