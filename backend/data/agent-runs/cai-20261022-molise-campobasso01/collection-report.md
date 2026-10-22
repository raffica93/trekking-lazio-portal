# CAI Campobasso bounded calendar refresh — 22 ottobre 2026

- Run: `cai-20261022-molise-campobasso01`; started from checkpoint `ca964c3`; source `cai-campobasso-9236001`.
- Scope: one official index URL `https://caicampobasso.it/calendario-delle-attivita/`, max 1 document/120 s/concurrency 1.
- Collection status: `partial`; files ready, database pending. One existing record changed only in `link`, `sourceDocument`, and `description`; all editorial and geographic fields remained unchanged. No DB query or write.

## Source and delta

The official HTML index body changed from hash `ce4421de6c30de30d0d50ce79627b65f6e62932ca519cb0c5e03ad4dea7acbbc` (118 extracted rows, last recorded 19 October) to `5b97e1aa0639efcebafbba3153c03dc0ee00d432b527f276c4d0dc08ee2363ed` (127 rows). Response HTTP status is not persisted. The two new catalog rows are:

- `cai-campobasso-9236001-8e0c09de00c9` — “PARCO NAZIONALE DELLA SILA: I Giganti della Sila, Lago Ariamàcina e Pietra dell’Altare” (16–18 October 2026; past at collection time).
- `cai-campobasso-9236001-a99c427d4321` — “PNALM: Lago Vivo – Fonte degli Uccelli” (6 December 2026).

Raw HTML is committed as `source-index.html` (252,380 bytes, SHA-256 `5b97e1aa0639efcebafbba3153c03dc0ee00d432b527f276c4d0dc08ee2363ed`); exact visible evidence is recorded in `source-evidence.json` and candidate rows in `candidate-input.json`. The supplemental `evidence-manifest.json` hashes those three artifacts. Independent importer review matched the two titles/dates against raw HTML; both are explicitly marked excursionism (difficulty E).

Catalog: 3,364→3,366 unique IDs; +2/-0. The only existing event row changed was `cai-campobasso-9236001-0a903f7ee19c` (13 December lunch), with source/link/description fields only. No coordinates were added; locations remain unverified.

## Discovery counter correction

The initial run output replaced the PDF issue “37 candidates remain” with “1 candidate remains”, even though only the HTML index was processed. Read-only code diagnosis traced this to continuation candidates being tagged with the configured base PDF URL and merged last-write-wins under the same `(code,url)` key. The fixture-backed correction was published at `d16ebc0` and passed the focused 11/11 scrape-status tests plus full backend 205/205; six public JSON hashes were unchanged during tests. The test preserves same-scope 12→4 behavior while verifying prior PDF=37 and current index-local residual=1 remain distinct.

The status file is reconciled accordingly: the PDF retains 37 residual candidates; a separate issue on the HTML index records 1 locally discovered candidate whose exact target URL was not persisted. Neither count proves the whole source complete; source remains `partial`. No retry or PDF fetch was performed.

## Checks and hashes

Importer QA: PASS for source body, two new records, and limited existing-row update; HOLD only on discovery completeness, now represented as separate scopes. Backend `npm test`: 205/205 after collection and code patch. Six public JSON files matched before/after tests.

Collection manifest SHA-256: `be53777def101bac5f73e37aeca8b96b72c637c85a64e657723c48b3762fa667`. Evidence manifest SHA-256: `2acd0a294dd98b4a5f7564bf1edff2a3cc0632f27791c8f230305b6364545cd3`. Source evidence SHA-256: `7042a498eb9911ffaee2f1f5e40dafbeed829346536622167944cbd7f73ab0ad`; candidate input SHA-256: `a0cab9771df021bd96c7baca7fcab0c170bab0cf1137cba1a7bded35ef14d700`.

Database remains pending until the file checkpoint is published and verified. Mercury classification, DB insert, and receipt have not run.
