# Delta delivery receipt — cai-20261022-emilia-pavullo-deliver01

The one-row sealed manifest was importer-validated before the write (one aligned source ID; requested Mercury alias and attested snapshot accepted). The CLI importer could not initialize because this runtime does not expose `SUPABASE_URL`; the authorized Supabase MCP bridge executed the exact importer-generated `toPlaceRow` and `classificationToRow` payloads. Both inserts used `ON CONFLICT (source_id) DO NOTHING`; no update or delete was issued.

- Source checkpoint: `5697dcd688a6217a6cc98e1a8794540c8ddeab13`
- Delivery manifest SHA-256: `8adc520ba07591f3e00c815579c4157a3a8027e8d3ab1fc1d11108d7f55ca24e`
- Place before: 4,422 rows; target absent at 2026-10-22 23:40:29 UTC. Place after: 4,423 rows.
- Classification target absent before; after: 3,354 rows. One target classification inserted and independently joined/verified.
- Inserted: `cai-pavullo-nel-frignano-9224020-195cdeaaefee` — 1 place + 1 classification. Skipped/missing: 0. Existing preserved: 0. Updates/deletes: 0.
- All 35 mapped place fields and 17 classification fields match the importer transformation. The inserted row is published with its source title; cover, latitude, longitude, geo evidence and coordinates quality remain null; location remains “Località da verificare”.
- The other four candidate IDs were absent from the delivery manifest because semantic identity/category remains uncertain; no DB action was attempted for them.
- Execution time: 2026-10-22 23:41:09 UTC; joined verification: 2026-10-22 23:41:36 UTC.

Machine receipt: `delta-import-receipt.json`.
