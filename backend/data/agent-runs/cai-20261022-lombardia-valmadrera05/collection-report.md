# CAI Valmadrera collection report — `cai-20261022-lombardia-valmadrera05`

Collection date: 2026-10-22 (UTC timestamps in the run state). Source: official CAI Valmadrera site, `cai-valmadrera-9216081`. This is one bounded continuation of the Lombardia region, not a declaration that the section calendar is complete.

## Scope and result

The orchestrator ran with concurrency 1, a 180-second limit, a maximum of 20 documents, and a source-scoped explicit URL continuation. The 12 requested official URLs were:

1. `https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-18/`
2. `https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-19/`
3. `https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-20/`
4. `https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-21/`
5. `https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-22/`
6. `https://organizzazione.cai.it/sez-valmadrera/eventi/2026-10-23/`
7. `https://organizzazione.cai.it/sez-valmadrera/eventi/oggi/`
8. `https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?eventDisplay=past`
9. `https://organizzazione.cai.it/sez-valmadrera/evento/escursione-media-montagna-laghi-acquafraggia/`
10. `https://organizzazione.cai.it/sez-valmadrera/evento/escursione-media-montagna-capanna-sciora/`
11. `https://organizzazione.cai.it/sez-valmadrera/evento/escursione-media-montagna-sasso-canale/`
12. `https://organizzazione.cai.it/sez-valmadrera/evento/escursione-media-montagna-rifugio-olmo-presolana/`

All 12 requested URLs were reached. The bounded run processed 20 documents total (the 12 explicit targets plus 8 discovered calendar/ICS documents) and recorded 34 per-document extraction rows. The source remains `partial`: discovery reports 38 candidate documents not yet checked. No HTTP/download/OCR failure was recorded in this run. The source's seven already-known events remain present; no evidence supports declaring the calendar empty or the section complete.

## Event and catalog reconciliation

Compared with the checked-out catalog at the start of this run, the catalog still has 3,345 unique IDs: 0 additions, 0 removals, and 5 existing records with field changes. All five changes are to `sourceDocument` values on official `organizzazione.cai.it` pages. Two of those records also have shorter parser-produced descriptions (367→209 and 357→200 characters); no title, event date, end date, administrative status, cover photo, location, latitude, longitude, or coordinate provenance changed. The run produced no new event to import.

Exact duplicate IDs excluded: 0. Duplicate/overlap counts among document-level extraction rows are not exposed by this collector report, so semantic duplicate suppression cannot be independently quantified here. No event or coordinate was inferred or added. No database query or write was performed. The separate classification checkpoint remains complete; this run does not justify reimporting its already-classified rows.

## Files, validation, and checkpoint state

Run state is `collection=partial`, `files=ready`, `database=pending` (no DB import was indicated). Manifest verification covers the three produced files:

| File | SHA-256 |
|---|---|
| `backend/data/excursions.json` | `e26bb7a555cd2675fd6f7f5066a6a9971c629f440d33046265d6d425641b6508` |
| `backend/data/cai-sections.json` | `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b` |
| `backend/data/scrape-status.json` | `1f48d29478ce32ef3f239b10306dc571e0276eb7901204cdb1b7be77cca8abc3` |

The corresponding frontend public copies remain byte-identical after verification and tests. Manifest SHA-256: `f88571727bbbcda6dceec0c5205f3da7dfdc95c4c1a70897444daf33f092e2a2`. Backend `npm test` after the collection and report: 186/186 passed. SHA-256 values for the four backend/frontend catalog files are unchanged by the test run. No database import, deployment, merge, or scheduler action is part of this run.

## Coverage and next step

| Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---:|---:|---:|---:|---|---|---|---|---|
| 1 | 0 | 1 | 0 | 7 eventi già presenti; 0 nuovi | 0 ID catalogo; overlap tra estrazioni non esposto | 12 URL bersaglio e 8 documenti scoperti raggiunti senza errori HTTP | 38 candidati discovery non verificati; completezza calendario non dimostrata | Analizzare la coda in sola lettura e scegliere un singolo campione mirato o documentare la fonte come parziale |

Non sono stati aggiornati conteggi regionali globali: i totali del 20 ottobre restano uno snapshot storico, non una query di copertura attuale.
