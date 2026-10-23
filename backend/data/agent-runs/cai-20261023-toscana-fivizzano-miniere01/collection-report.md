# CAI Fivizzano — single event-page sample

Run ID: `cai-20261023-toscana-fivizzano-miniere01`  
Source: `cai-fivizzano-9226019`  
Requested scope: one official URL, max 1 document, 120-second source budget, concurrency 1. No discovered child URL was followed.

## Result

The requested page was recognized as `html-calendar` and yielded one event record. The page identifies **Le miniere di Calcaferro**, dated 6 September 2026, and visibly marks it `Expired!`. Since collection ran on 23 October 2026, the event was not added to the upcoming catalog. The body description says the Family CAI outing visits the old mines and that details would be provided in a flyer; it gives no location address or coordinates. Nothing was inferred from the section headquarters.

The cached response metadata records the requested URL, `text/html; charset=UTF-8`, 78,848 bytes and body SHA-256 `964450e315da16e5a176b174462eac8b9f446b9475222ea766cb0756749e3b27`. HTTP status and final/canonical URL are not persisted, so neither is asserted. The exact cache entry and line locators are recorded in `source-evidence.json`.

| Sezioni controllate | Complete | Partial | Unreachable | Eventi verificati dalla pagina | Nuovi ID | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti |
|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 0 | 1 | 0 | 1 record estratto, scaduto | 0 | 0 | 0 | PDF OCR failure; discovery-limit 8 sul PDF, 1 sul calendario e 1 sulla pagina selezionata |

## Catalog and source status

Comparing the catalog at the pre-run hash with the output, both contain 3,376 event rows; the CAI Fivizzano ID prefix selects 12 rows before and after. There are 0 additions, 0 removals and 0 changed rows. The sorted Fivizzano-row hash is unchanged: `052158f0d916607fe02a746b29c0027d44a39239fd6a16fa282d1c48a04c9905`. Algorithm: select rows with IDs starting `cai-fivizzano-9226019-`, sort ascending by `id`, serialize the array with Node.js `JSON.stringify`, encode as UTF-8, then compute SHA-256. No administrative, location or coordinate field changed.

The backend and frontend excursion mirrors are byte-identical at SHA-256 `4ae1e9adcc484df585fa81b24313780172ef381c149a921dd2a13a541d84a197`. The previous PDF and calendar document history remains, and the selected page is added as the third document. The source status remains `partial`; its existing PDF OCR failure and discovery-limit queues remain open, and the bounded page adds a further discovery-limit of 1. The status lists 11 extracted events across its successful document history, while the catalog retains 12 Fivizzano rows; these are different counters and neither implies the page added a row.

The regenerated catalog metadata changed `generatedAt`, the selected-source coverage (`parsed` 1→0, `unsupported` 0→1), and Fivizzano's source hash; event rows did not change. The scraper summary printed `unsupported (12 excursions)`, while the per-document status records the selected HTML page as `html-calendar` with one event. This report preserves both recorded outcomes and treats the section as partial.

## Sealed files and limits

The orchestrator manifest covers the generated backend catalog, section registry and scrape-status. Its SHA-256 is recorded in `evidence-manifest.json`. The pre-run scrape-status hash was `687b6babc658b9ebcc232d27a1829a2ded8a9fc123f13447dc67db0900e94108`; the post-run backend/frontend mirror hash is `9cd4cfdf45105b327ab8bfae069ad7cf877bd4e801e911efc8e6cd77af05ad29`. Section-registry mirrors remain byte-identical at `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`. No test, classification, database operation, import or commit was run for this sample.

Run state: `collection=partial`, `files=ready`, `database=pending`. No event is eligible for classification or import from this expired page. Continue the source only through a separately bounded, checkpointed sample; do not treat this page as resolving the open PDF or calendar discovery queues.
