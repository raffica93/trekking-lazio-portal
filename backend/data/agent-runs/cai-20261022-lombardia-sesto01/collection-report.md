# CAI Sesto Calende — bounded collection

- Run: `cai-20261022-lombardia-sesto01`
- Source: `cai-sesto-calende-9216044` (CAI Sesto Calende, Lombardia)
- Scope: one explicit official URL, one document maximum, concurrency 1, 120 s source budget. No test, classification, import or database operation was run.
- Result: orchestrator `collection=partial`, `files=ready`, `database=pending`; the run lock was released.

## Requested document and evidence

Requested URL: `https://caisestocalende.it/calendario-sezionale/`. The cached document URL is the same; the cache metadata does not expose an HTTP status or a separate final/redirect URL. Content type is `text/html; charset=UTF-8`; body is 121,924 bytes, SHA-256 `28e233dbfc840dca1b19c3eaf849daef385651d7a9fbea71b7f04b2f9b43bde8`. Cache URL-key is `acb375feb79fc9914cb75d845b2376df21e192219ba44815e41de8b8a9b20aa3`.

The page title and heading are “Calendario Sezionale” (browser title: “Calendario Sezionale – CAI Sesto Calende”). The page body lists three recent posts: “Family C.A.I.: tra i boschi di Sesto Calende in cerca di castagne” dated 25 October 2026; a film-documentary event dated 21 October 2026; and “Escursionismo & Yoga: un’unica esperienza sul sentiero del Grande Est” dated 10 October 2026. It also links the official 2026 programme PDF: `https://caisestocalende.it/wp-content/uploads/2026/01/Libretto-Programma-2026-CAI-SESTO-CALENDE.pdf`.

The configured deterministic extractor returned `method=null` and 0 extracted events for this HTML. This is not evidence of an empty calendar. The annual PDF is already present in the source history as a `pdf-ocr` document with 29 extracted rows; this continuation did not fetch it again or follow child links. The run status retains one `discovery-limit` candidate against the requested calendar page, but does not persist that candidate’s exact URL, so it is not asserted that the PDF is the exact queued candidate. The source remains partial, with its prior manual-QA issue on the annual PDF preserved.

## Catalog and status reconciliation

The public event catalog has 3,371 rows before and after. Selecting Sesto rows by event ID prefix `cai-sesto-calende-9216044-` gives 18 rows before and after, with 0 added, 0 removed, and 0 changed. Canonically sorted row SHA-256 is `ca5c58cb7feb133ece4c08bbd3f6e484e8730734adce3a8edbc7d5830ad2a0bc` both before and after. No event fields, editorial fields, or coordinates changed.

The catalog file’s bytes changed from SHA-256 `2ccd818d964d938b0e480e4aee62410c1991b7b9220a32727d7798aebfeb920d` to `fe97cc678c460b12a70974c40704cde60603c95bdcd471eafc6d1a82948b13d0` due to regenerated source/metadata; event rows stayed identical. Backend and frontend mirrors are byte-identical after collection. The sections registry is unchanged at SHA-256 `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`. Status SHA-256 changed from `62915cc7f83687e8e00d0158249df10ab6421555cbb13ff2282de29bfd0f719e` to `ca73169ddd2203b1e6ab2fe61a4ca4f2f8384ae3544166386601135aa8c2dad7`; backend/frontend status mirrors match.

## Run artifacts

- `manifest.json`: SHA-256 `813864b712c7a5fc04b0c44f9ea7433654fb57737674fd11616a6582c5c8af36`; it records the post-collection catalog, sections, and status hashes.
- `state.json`: SHA-256 `25fae0f0ea28be8d8ef658498c9d062ef96df5c8304bcbbefbb14f2f2b248648`.
- `source-page.html`: copied from the URL-keyed cache without modification; SHA-256 `28e233dbfc840dca1b19c3eaf849daef385651d7a9fbea71b7f04b2f9b43bde8`.
