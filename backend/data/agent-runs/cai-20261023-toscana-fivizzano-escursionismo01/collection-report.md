# CAI Fivizzano — bounded Escursionismo page sample

Run ID: `cai-20261023-toscana-fivizzano-escursionismo01`  
Source: `cai-fivizzano-9226019`  
Scope: exact official URL `https://www.caifivizzano.it/escursionismo/`, max 1 document, 120-second source budget, concurrency 1. No discovered child URL was fetched.

## Collection result

The page was recognized as `html-calendar` and yielded one event record. It contains a calendar heading for 2026 and a card for **Anello Zanego – La Serra- Tellaro**, 15 November 2026. JSON-LD supplies the full date, title and outing description; it states difficulty E, 300 m ascent, 9 km and 4 hours. The description names Zanego, Tellaro and La Serra in the Parco naturale Montemarcello, while the page's JSON-LD place fields are empty. The event's separate detail URL was not fetched, and no coordinates were added.

The extracted record matches existing catalog ID `cai-fivizzano-9226019-2d592e7a1731` exactly, including title, dates, description and `sourceDocument`. It is an existing-row corroboration: 0 new IDs, 0 removals, 0 changed rows, and no additional duplicate exclusion.

The requested URL's cache metadata records `text/html; charset=UTF-8`, 138,701 bytes and SHA-256 `a78ad2e426a35f61944ea0768217a3ebf260b7bcf77632ceab896e5eb4b6490e`. HTTP status and canonical/final URL are not persisted, so neither is asserted. See `source-evidence.json` for the cache entry and source locators.

| Sezioni controllate | Complete | Partial | Unreachable | Eventi verificati dalla pagina | Nuovi ID | Righe esistenti corroborate | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 0 | 1 | 0 | 1 | 0 | 1 | 0 | 0 | Annual PDF OCR failure; discovery-limit 8 sul PDF, 1 sul calendario, 1 sulla pagina Miniera e 1 sulla pagina categoria |

## Catalog and status

The catalog has 3,376 rows before and after this run; the CAI Fivizzano ID prefix selects 12 rows before and after. There are no row additions, removals or changes. The sorted Fivizzano-row SHA-256 is `052158f0d916607fe02a746b29c0027d44a39239fd6a16fa282d1c48a04c9905`: select IDs starting `cai-fivizzano-9226019-`, sort ascending by `id`, serialize with Node.js `JSON.stringify`, UTF-8 encode and compute SHA-256. The corroborated event row's SHA-256 is `1b23109177824b6f4f830f8d3baf96175009e7985666e80a1bf831a238a574ea` both before and after.

The backend/frontend excursion mirror is byte-identical at SHA-256 `d02a525382f6d7b31c571a49c0ced7c9ed292b5e67ba138ee060b4adbca4fa83`. The scrape-status mirror is byte-identical at `7124e29edc1af941451e3e757b4fca4b5dc868ebc6d60b846a523c69a0270e49`; the section registry mirror remains identical at `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`. The pre-run hashes were `4ae1e9adcc484df585fa81b24313780172ef381c149a921dd2a13a541d84a197` for excursions and `9cd4cfdf45105b327ab8bfae069ad7cf877bd4e801e911efc8e6cd77af05ad29` for scrape-status. Catalog row content is unchanged; generated metadata/source hash and coverage metadata were refreshed.

The source remains `partial`; its existing OCR and discovery issues remain open, and this one-document run records one additional discovery-limit candidate on `/escursionismo/`. Source status now has 12 catalog rows and 12 extracted events over its document history; the selected document contributes one corroborating event. No classification, import, database operation, test or commit was performed for this run.

Run state: `collection=partial`, `files=ready`, `database=pending`. This page does not resolve the annual PDF/OCR or calendar discovery queues.
