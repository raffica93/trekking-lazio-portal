# CAI Belpasso — bounded program-page sample

Run ID: `cai-20261023-sicilia-belpasso-programma01`  
Region/source: Sicilia / `cai-belpasso-9246010` (CAI Belpasso)  
Selection checkpoint: `1695a0864d3c51625b5f984bc71f9a44dbd8e3c2`  
Baseline: 3,371 catalog IDs at the selection checkpoint.  
Scope: one exact official URL, one document maximum, 120-second source budget, concurrency 1. No child URL, PDF, iCal, database, or classification work was included.

## Result

| Sezioni controllate | Complete | Partial | Unreachable | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti |
|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 0 | 1 | 0 | 0 | 0 | 0 | Program-page parser returned `method=null`/`unsupported`; discovery-limit 1; separate 2026 brochure OCR failure and iCal discovery-limit 7 remain open |

The requested and final URL were both `https://organizzazione.cai.it/sez-belpasso/programma-attivita-sociale-2026/`. The cached response is `text/html; charset=UTF-8`, 153,764 bytes, body SHA-256 `03521e393d4f0245db58098b3a6e273c43f5db9370f1984022`. The run state does not record HTTP status; no 200/304 claim is made. The worker produced zero extracted rows (`method=null`). This is an unsupported/unreadable parser result, not evidence that the calendar is empty. The separate brochure PDF and iCal failures were not retried or followed.

## File and catalog verification

Importer QA independently checked the manifest and all three sealed hashes. Backend/frontend mirrors are byte-identical. Against the selection checkpoint: 3,371 rows and 3,371 unique IDs before and after; Belpasso had 0 rows before and after; 0 additions, 0 removals, 0 event-row changes, and 0 duplicate IDs. Only scrape metadata changed (generated time, Belpasso source hash and coverage status). No title, editorial status, cover, location, or coordinate was changed. No event candidate exists to classify or import.

Run state is `collection=partial`, `files=ready`, `database=pending`. No DB query or write occurred. No Mercury request was made. The live HTTP status was not captured, and no current map/database totals are asserted.

## Sealed files

Manifest SHA-256: `7d6bfb50ddd7030dd3d8223e77a57554436829df6da94d1280228fa07cc8e435`

| File | SHA-256 |
|---|---|
| `backend/data/excursions.json` | `69763ba43b0fa94e1327c8d55dcd906b57e37a542e518f8b62aa4c1f02143b2b` |
| `backend/data/cai-sections.json` | `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b` |
| `backend/data/scrape-status.json` | `8514b0407f9e23b5ae535c360017eeb5316f02638f686a29712da58633fd1c5b` |

Manifest/state integrity QA: PASS. Backend `npm test`: 206/206 pass after collection. SHA-256 of all six backend/frontend public JSON files was identical before and after tests; catalog mirrors match. No import was required.

## Offline source review

The collector reviewed only the cached HTML body (same SHA above), with no network or child-link fetch. The page title/H1 is “Programma attività sociale 2026” (`article h1.entry-title.wp-block-heading`). The article is general information about activity categories. Its second content paragraph states: “La scheda illustrativa con il programma dettagliato di ogni gita o attività … sarà affisso nella bacheca sociale e sul gruppo Facebook CAI Belpasso e sul gruppo Whatsapp nei dieci giorni precedenti la data dell’attività” (`article .entry-content p:nth-of-type(2)`). It contains no dates, event rows, tables, calendar markup, or JSON-LD `Event` records. The `method=null` result is appropriate for this page; no deterministic parser patch or fixture is warranted. This conclusion applies only to the information page, not to the annual brochure or section calendar as a whole.

## Next step

After this file checkpoint, preflight a distinct Sicilia official-host URL. Do not infer events from the zero-row result, retry the PDF/iCal, or treat this information page as evidence of complete calendar coverage.
