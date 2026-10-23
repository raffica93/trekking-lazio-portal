# Delta DB delivery — Pinasca02

Status **completed** for exactly four source IDs, using one atomic insert-only CTE through Supabase MCP on project `snwzxegtqnnuvlawnpgl`. The CTE used allowlisted rows produced by the sealed importer transformations (`validateImportEvents(..., 'published')` and the verified `classificationToRow` output), with `ON CONFLICT (source_id) DO NOTHING` for both tables. No general import, DDL, update, or delete was run.

## Provenance

- Checkpoint commit: `90f7f7a41d6896ccf154d67c66b0399e5dcd1240`
- Collection run: `cai-20261022-piemonte-pinasca02`
- Collection manifest SHA-256: `4bec0f0bf1067f7ef6b1075b7d9341892e8c7bc2b6df9d0b4f4857b5d9848182`
- Classification run: `cai-map-20261022-pinasca02`
- Classification manifest SHA-256: `3dd59a810621ede84d09b4b3bb7bed0b0c766bc1c215f86ef2245defd881ffd5`
- Classification input SHA-256: `85b20198a72956266751a9b13ca86fd9b6e59b3b3a1db4d342d108432f460edf`
- Classification output SHA-256: `133d5a7b7aba43ebd27b51481a128fb6d80b2f591fdad525c2f8d8779883fdae`

The exact-ID preflight immediately before the successful write found 0/4 places and 0/4 classifications. The successful statement timestamp was `2026-10-22 22:14:25.13088+00`; it returned 4 place inserts, 4 places available, and 4 classification inserts. Supabase MCP did not return a timestamp for the preflight SELECT, so no precise preflight clock time is asserted here. A preceding CTE attempt failed before mutation because a null `review_metadata` expression was inferred as text; a fresh preflight still found all four IDs absent, and the successful statement cast the value to jsonb.

The separate joined verification at `2026-10-22 22:15:18.267267+00` returned exactly four joined rows. Every allowlisted place and classification field matched the sealed importer transformation (numeric confidence/probability comparison tolerance `1e-12`); no missing IDs or mismatches remained. All four inserted places are `published`; locations remain `Località da verificare`; latitude, longitude, coordinates quality, and geo evidence are null. Protected editorial and geographic snapshots are recorded by SHA-256 in the machine receipt. Since the preflight found no rows, the before snapshots are empty (`SHA-256 []`); no existing administrative fields could be overwritten. Updates=0, deletes=0 in both tables.

Mercury counts: 2 `trekking` / `a piedi`, 2 `non_trekking` / `sociale/culturale`, 0 `da_verificare`. Requested model `inception/mercury-decide`; provider response/model version `inception/mercury-decide-20260930`; model attested true; policy `cai-trekking-v2`.

Machine receipt: `delta-import-receipt.json`.
