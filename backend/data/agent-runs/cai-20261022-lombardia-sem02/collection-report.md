# CAI S.E.M. bounded continuation 02 — 22 October 2026

Run `cai-20261022-lombardia-sem02` retried only the official S.E.M. 2026 programme PDF after the source-status merge correction was published at code commit `c43b32101de52739bab3237f5bddf3eb343b788b`:

`https://www.caisem.org/sezione/gitesociali/pdf/GiteSEM2026.pdf?ed1601`

The run used `npm run orchestrate -- init/collect`, one source URL, concurrency 1, `SCRAPE_MAX_DOCUMENTS=1`, and `SCRAPE_SOURCE_BUDGET_MS=120000`. The current PDF was read successfully. The parser produced 33 extracted rows, reconciled to the same 14 S.E.M. catalog events already present. No event IDs were added, removed, or changed. No duplicate catalog IDs were found; duplicate source-row count is not separately exposed by this adapter.

The source remains partial. Its 40-document history is preserved, and the previous `discovery-limit` on the PDF remains with the exact count of 12 candidate documents remaining. This continuation read only one bounded PDF; it does not prove the residual discovery queue was exhausted. Source status is refreshed at `2026-10-22T21:33:08.998Z`.

| Sources checked | Complete | Partial | Unreachable | Verified events | New IDs | Duplicate IDs excluded | Failures resolved | Failures open |
|---:|---:|---:|---:|---:|---:|---:|---|---|
| 1 | 0 | 1 | 0 | 14 existing; 33 extracted rows | 0 | 0 | sem01 status regression corrected in code and fixture-tested | 12 discovery candidates remain |

Catalog comparison against commit `10178cd4c78fa4f0d74fda7ee87a5ca6b65cbc52`: 3,359 unique IDs before and after; 0 added, 0 removed, 0 changed event rows. Registry count is 838 before and after. The S.E.M. source status and metadata were refreshed; other source coverage was not recalculated. Backend/frontend excursion and status copies are byte-identical.

The run state is `collection=partial`, `files=ready`, `database=pending`. Importer performed read-only QA and approved the manifest/state/status: all three manifest SHA-256 values match the working files. No classification or DB delivery is needed because the event delta is zero. Backend `npm test` passed 201/201 after collection; the catalog/status hashes still match the manifest afterward. No DB query/write, merge, deploy, or scheduled job was run.

Manifest SHA-256: `cc2edad797f5ced938dbad2ebf013a14504c1eecd0681f7026dfc3216357485f`

Checkpoint commit: pending file checkpoint; verify the remote ref and manifest/report/state blobs before treating these files as shared.

Next: select a different workable official Lombardia source by read-only preflight. S.E.M. stays partial until its exact residual candidate URLs are recoverable; do not repeat this same one-PDF continuation as evidence of completion.
