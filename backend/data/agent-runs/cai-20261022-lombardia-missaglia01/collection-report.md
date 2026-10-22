# CAI Missaglia bounded continuation 01 — 22 October 2026

Run `cai-20261022-lombardia-missaglia01` read one official target from CAI Missaglia (`cai-missaglia-9216150`):

`https://www.caimissaglia.it/gite.php`

The run used the persisted orchestrator, one selected URL, concurrency 1, `SCRAPE_MAX_DOCUMENTS=1`, and `SCRAPE_SOURCE_BUDGET_MS=120000`. The cached HTML response is 27,983 bytes with SHA-256 `7d79468fa1afc8e581eb032c7492424b54bc4cac63a1633cd635f54717f9451c`. Offline review found an old page headed “Edizione 2014”, with links/news from 2024 and no current 2026/27 calendar shown. The production HTML parser recognizes the page and extracts one event, “Vacanza-Trekking Sardegna”, dated 15 June 2024; the temporal filter correctly excludes it as past. This is not evidence that the current calendar is empty.

The source remains `partial`: its historical issue for the official `gite.php` URL advanced from 41 to 1 remaining candidate, and the single targeted page cannot resolve that residual. The prior OCR failure on `https://www.caimissaglia.it/file/AlpGiovani/AndiamoMontagna.pdf` is preserved (page 21; OCR failed/time budget exceeded). Existing manual QA says that page is first-aid training text, not an event calendar. The run also preserves the single read page plus the existing PDF document history.

| Sources checked | Complete | Partial | Unreachable | Verified current events | Past rows extracted | New IDs | Duplicate IDs excluded | Failures resolved | Failures open |
|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 1 | 0 | 1 | 0 | 0 | 1 (2024-06-15; correctly filtered) | 0 | 0 | Discovery backlog reduced 41→1; stale event filtered | One discovery candidate remains; current calendar not found; PDF OCR failure persists |

Catalog comparison against commit `7204642efea0630bed21f6db1d7a576f1db71b15`: 3,359 unique events before and after; 0 added, 0 removed, 0 changed event rows. Registry count is unchanged. Only Missaglia source metadata/status changed (`unsupported`→`partial`); status history retains the previous OCR/manual-QA issues. Backend/frontend catalog and status copies are byte-identical.

Importer performed read-only QA and approved this as a partial sample. The run state is `collection=partial`, `files=ready`, `database=pending`. There is no event delta to classify or import; no DB query or write was made. Backend `npm test` passed 201/201 after collection, and manifest hashes still match after testing. No coordinate was added or inferred.

Manifest SHA-256: `9f73e0a51f0cec7a7794e14b943ec9e235d7b50ecac93acf274d09e4a4d92b04`

The run is a file checkpoint candidate, not complete source coverage. After checkpoint, continue with another Lombardia source or recover the remaining exact candidate from cache; do not repeat this same page as evidence of completion.
