# CAI Somma Lombardo — Blinnenhorn bounded collection

- Run: `cai-20261022-lombardia-somma-blinnenhorn01`
- Source: `cai-somma-lombardo-9216065` (CAI Somma Lombardo, Lombardia)
- Scope: one explicit official PDF, one document maximum, concurrency 1, 120 s source budget. No discovery/retry, tests, classification, import, or database operation.
- Orchestrator result: `collection=partial`, `files=ready`, `database=pending`; one requested document is in status and the run lock is released.

## Document evidence

Requested URL and cache metadata URL both record `https://www.caisomma.it/wp-content/uploads/pdf/Escursioni/2026/Rifugio%20Somma%20-%20Blinnenhorn%20(EE).pdf`. The source's official website is `https://www.caisomma.it/`; registry `calendarEvidence` binds this exact path on the apex host to CAI Somma's official pages. The cache metadata does not record an HTTP status or redirect target, so neither is asserted.

The cached response is `application/pdf`, 760,092 bytes, SHA-256 `c9f7cab19bc7993fb7e3db8e4dc39ebb8aa29039c98cc27dd3a1cc016af4e1af`; ETag `"b991c-6577e57df1f00"`, Last-Modified `Sun, 26 Jul 2026 07:13:32 GMT`. It is a one-page flyer titled “Rifugio CAI Somma (2.561 m) - Blinnenhorn (3.374 m)”, with printed location “Riale — Alta Val Formazza (VB)”. Text describes a two-day route from the Morasco dam via Rifugio CAI Somma to Blinnenhorn, approximately 25 km total. It gives an enrolment deadline of 25 July 2026, but no date for the outing. The parser records `pdf-text`, 0 events. The deadline and `/2026/` URL are not treated as an event date; no event row or coordinate was created.

## Status and catalog reconciliation

The Somma source remains `partial`. This run adds the bounded flyer to document history and preserves the existing issue on the separate SIEL programme PDF (`download-aborted`); it did not retry that URL or the SIEL summary PDF. Status continues to report 14 source excursions / 13 extracted events from existing evidence, with no event extracted from this flyer.

The public catalog has 3,371 rows before and after. Matching event IDs with prefix `cai-somma-lombardo-9216065-` gives 14 rows before and after, 0 added, 0 removed, and 0 changed. Canonically sorted row SHA-256 is `d1bda6df13a6c636cafa6de1acc802d6b7c7467f0364828fb7e6d85ffc8fca36` both before and after. No editorial or geographic fields changed. The catalog file changed only in generated/source metadata: before SHA-256 `fe97cc678c460b12a70974c40704cde60603c95bdcd471eafc6d1a82948b13d0`, after `e855def2d86a75a6ca4e42244ef0eee676bad554e17c5a4f5d8c051653ec8cbf`.

Backend/frontend mirrors are byte-identical after collection: excursions `e855def2d86a75a6ca4e42244ef0eee676bad554e17c5a4f5d8c051653ec8cbf`; status `38974cb253655f582fbc8f21afc232dd5cc9d64a11a34845c4111c5123fe16a6`; sections unchanged at `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`. Pre-run excursions hash was `fe97cc678c460b12a70974c40704cde60603c95bdcd471eafc6d1a82948b13d0`; pre-run status hash was `ca73169ddd2203b1e6ab2fe61a4ca4f2f8384ae3544166386601135aa8c2dad7`.

## Run artifacts

- `manifest.json`: SHA-256 `7d1be91a308365001813f21ec6456613d2db20d444dc02e5df5c9851f60a34e7`; manifest hashes match generated public files.
- `state.json`: SHA-256 `2a566c12e6b65783580ff469bd9b08cd2d60aa6bdc86f0eb37d756a0a3a50e4f`.
- `source-document.pdf`: byte-for-byte copy of the URL-keyed cache body, SHA-256 `c9f7cab19bc7993fb7e3db8e4dc39ebb8aa29039c98cc27dd3a1cc016af4e1af`.
- `source-evidence.json`: bounded evidence fields and explicit missing-date assessment.
