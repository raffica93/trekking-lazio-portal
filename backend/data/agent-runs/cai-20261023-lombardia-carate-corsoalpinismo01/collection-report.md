# CAI Carate Brianza corsoalpinismo01 — collection and parser review

- Run: `cai-20261023-lombardia-carate-corsoalpinismo01`
- Baseline: remote checkpoint `6b2852264cbdae4134d2cf071cf0473fb3d92a5b`
- Scope: one explicit same-host PDF URL, max1 document/120s/concurrency1; no discovery expansion, test/import/DB during collection.
- Requested URL: `https://www.caicaratebrianza.it/download/5-scuola-di-alpinismo/7-corsi-di-alpinismo?download=609:volantino-63-corso-di-alpinismo-2026`
- Final URL from request-keyed cache: `https://www.caicaratebrianza.it/phocadownload/Scuola_di_alpinismo/2026/Volantino%2063%20Corso%20Alpinismo%202026%20Rev.03.pdf`
- PDF: 928,543 bytes, SHA-256 `05117835947e634494ceea7eea854398af8e3f839a62cce9fc55d8c5e8edfd8c`; content type PDF. Cache does not retain HTTP status; no 200/304 claim is made.

## Source parsing and candidate disposition

The source text contains `04/05-lug Arrampicata in ambiente I.N.A. Colombo Antonio I.A.L. Scotti Matteo`. The original extraction represented this as `2026-05-04` and omitted the end date. It was rejected as an import/classification candidate. The independent importer found that the final PDF URL/hash was already in the source document history at baseline, with one extracted row; the run added no course row to the catalog and its directory initially contained only state and manifest.

The accepted parser correction is deliberately narrow: `DD/DD-meseAbbrev` maps both numbers to days in the trailing month. Offline parsing of the cached PDF now yields title `Arrampicata in ambiente I.N.A. Colombo Antonio I.A.L. Scotti Matteo`, dates 2026-07-04 through 2026-07-05, 2 days, no coordinates. Numeric `12/10` remains 12 October. This corrected course is in the past as of 2026-10-23, so it does not become a current catalog candidate. Mercury classification and DB import were not run.

The source remains partial: annual-program discovery-limit 344 and a separate gym-page timeout are preserved, not retried. The catalog is unchanged at 3,371 unique IDs; six Carate rows before/after, 0 adds/removes/changes, 0 new/upcoming events verified, 0 duplicate IDs excluded, 0 coordinates and 0 DB writes. Mirror checks passed.

## Verification

- Fixture: `backend/test/fixtures/cai-carate-2026-course-date-abbreviation.json`, minimized from the official PDF text and identifying requested/final URLs plus source PDF SHA.
- Regression test: `Carate course flyer parses an abbreviated month range without changing numeric day/month dates`.
- Deterministic parser cache version: 13 → 14.
- Correction commit: `e277de52b9d311edc7b46b40512a6ee59f6d1901`.
- Focused tests: 2/2 passed. Backend suite after collection and correction: 206/206 passed.
- Six backend/frontend public JSON hashes were identical before and after the backend test suite; `frontend/public/excursions.json` was not written by tests.
- Importer QA: sealed file hashes/mirrors PASS; import eligibility HOLD/no delta. No database query or write.

## Sealed outputs

- Manifest SHA-256: `45abd2f4694eae5a01e6367bfddc2a04aab551d59ab38dc6a371ba925d363300`
- Run-state SHA-256: `f8872ff3d15ee17665442fddd8df189de43a3de200aaba9700dee93e239a5218`
- Backend/frontend excursions mirror SHA-256: `418a3b133e4a0107ff2f0725580f220b215f2dca3d876c9b991b8ac9d071b18f`
- Backend/frontend scrape-status mirror SHA-256: `c8f8eeedae48eac9db1c6516cc606fd750a7a1964c8d87feb4c28b29aae80057`
