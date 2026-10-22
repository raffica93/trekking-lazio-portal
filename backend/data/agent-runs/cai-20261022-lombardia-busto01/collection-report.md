# Collection report — CAI Busto Arsizio

- Run: `cai-20261022-lombardia-busto01` (2026-10-22).
- Scope: one explicit URL, concurrency 1, maximum 1 document, 120 s source budget; no tests, classification, database work, or import.
- Requested official URL: `https://www.caibustoarsizio.it/attivita-invernali/`.
- The same-host redirect resolved to `https://www.caibustoarsizio.it/attivita-invernali-2-2/`. Cached response metadata records HTML, 84,865 bytes, SHA-256 `b2aac6385f990517826d45c218588f34875b1e2a6e0a01c650f59520e771acc6`.
- Page title: “Attività invernali 2026 - CAI”. Listed activities run from 7 December 2025 through 22 March 2026; all listed dates had passed by 2026-10-22. The page says “Altre uscite verranno programmate in seguito” but contains no 2027 calendar.
- The source remains `partial`; one discovery candidate remains. The zero future rows from this page do not establish complete calendar coverage.
- Busto catalog delta: 1 existing row before and after; no rows added, removed, or changed. No DB writes.
- The run manifest seals the three catalog files; this report is a separate run artifact and does not alter that manifest.
