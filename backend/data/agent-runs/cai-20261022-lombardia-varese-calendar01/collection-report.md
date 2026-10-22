# CAI Varese calendarannual01 — collection review

- Run: `cai-20261022-lombardia-varese-calendar01`
- Baseline: remote checkpoint `2c3a5d82304c63b1277a91e08df7bf2edd441951`
- Scope: one explicit official URL, one document maximum, 120 s budget, concurrency 1; no iCal discovery or database work.
- Requested URL: `https://www.caivarese.it/calendarioannuale`
- Orchestrator: `collection=partial`, `files=ready`, `database=pending`; run folder contains the sealed state/manifest and this review, with no raw `source-page` sidecar.

## Document evidence and limit

The request-keyed cache entry for the requested URL is `backend/node_modules/.cache/cai/d0686bc332e9b91ef146fbf163d684572b07c6ede0282ab7d9101eb52b0d3be4.json`. It records final URL `https://www.caivarese.it/wp-content/uploads/2025/02/A4-CAI_Calendar2025.pdf`, content type `application/pdf`, 3,208,298 bytes and body SHA-256 `ce93c4c3b0cfeff2da1f94641a43dc698920c7440ef959e4af5812ae285f09ce`. The body hash and byte count match the cache `.bin`; the pre-existing catalog status also records this same PDF as `pdf-text`, with 58 extracted rows.

The cache schema does not retain HTTP status or distinguish a 200 response from 304 revalidation. The run does not preserve the body under its own directory. Therefore the final document identity is observed from the request-keyed cache metadata and prior parser status; the HTTP status and a fresh body transfer are **not attested**. The final document is the 2025 PDF, so this run does not establish a current 2026 annual calendar or a correctly read empty calendar.

## Delta and QA

- National catalog: 3,371 unique IDs before/after; 0 added, 0 removed, 0 changed.
- Varese: 58 source rows before/after; 0 added, 0 removed, 0 changed.
- New events verified: 0; duplicates excluded: 0; no classification candidates or DB delta.
- Open source issues retained: Varese iCal HTTP 503 and the separate iCal `discovery-limit` (93 candidates). Neither was retried.
- Independent importer QA: catalog/manifest hashes valid; collection evidence held as incomplete for freshness; no DB query/write.
- Backend tests after collection: 205/205 passed. SHA-256 for all six backend/frontend public JSON files was identical before and after tests; `frontend/public/excursions.json` was not modified by the test suite.

## Disposition

Keep Varese partial and do not report zero events as source completion. No classification, import, coordinates or catalog content change is accepted. Before revisiting this URL, add focused evidence tests/recording for requested URL, final URL, HTTP status (including 304), and run-scoped body hash; otherwise continue to a distinct, preflighted Lombardia source. Mercury classification was not needed because there was no verified delta.

## Sealed outputs

- Manifest SHA-256: `c4e31bb73fc0a1417d9fc0efe7a87a901974ad4d32dd84d72369c49a8b8b45ae`
- State SHA-256: `535f0bf825e9b07b9e56da7e64371e142d4fa23cf8597a9574cc1efd97cbc69f`
- Backend/frontend excursions mirror SHA-256: `97743da9536cc552db3caf6e11c0762ab3598dd330e185cd2a8a76a851fd1c0b`
- Backend/frontend scrape-status mirror SHA-256: `f8a5ea5622deb843e352a930a9c7e3a171bb5cb625ed091d16a213bdc615577e`
