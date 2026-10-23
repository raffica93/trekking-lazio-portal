# Campobasso delta import receipt

- Status: completed after narrowly scoped fingerprint recovery.
- Classification run: `cai-map-20261022-campobasso01`.
- Collection run: `cai-20261022-molise-campobasso01`.
- Repository checkpoint: `31d81eafdb6def6b9cb376b575f194ca92b87612` on `codex/cai-orchestrator-luna`.
- Classifier manifest SHA-256: `80d7f646b0c12cdd35943248429243fad7c364c554f4c03e0dfce52d84733925`.
- Classifier input SHA-256: `a0cab9771df021bd96c7baca7fcab0c170bab0cf1137cba1a7bded35ef14d700`.
- Classifier output SHA-256: `d6e54aa214d648b4b6d9351d417a0dd7fb10fe01ea80e0bae0dd148b863038fd`.
- Collection manifest SHA-256: `be53777def101bac5f73e37aeca8b96b72c637c85a64e657723c48b3762fa667`; source HTML SHA-256: `5b97e1aa0639efcebafbba3153c03dc0ee00d432b527f276c4d0dc08ee2363ed`.
- Project: `snwzxegtqnnuvlawnpgl`. All database operations used the authorized Supabase MCP; no shell network or database credentials were used.

## Preflight and inserts

Initial read-only checks at `2026-10-22 22:30:02.621876+00` found both source IDs absent from `places` and `place_classifications`; protected-field digests were the empty-set sentinel `md5('[]') = d751713988987e9331980363e24189ce`. The exact source-ID/generated-slug conflict query at `22:30:21.913236+00` returned none. Schema inspection at `22:30:08.548795+00` confirmed unique `places.source_id`, primary-key `place_classifications.source_id`, the FK with `ON DELETE RESTRICT`, and all required columns. An immediate repeated pre-write query at `22:31:58.136473+00` again found zero target rows and the same empty digests.

At `2026-10-22 22:32:35.931546+00`, one bounded insert-only CTE inserted exactly the two sealed place rows with `status=published`, then their two classifications, using `ON CONFLICT DO NOTHING`. It reported two place inserts and two classification inserts, with zero place updates and deletes. Both new place rows retain `Località da verificare`; latitude, longitude, coordinates quality and geo evidence are null.

## Payload transcription incident and recovery

The first post-write joined query at `22:32:45.5105+00` found both place rows correct and Sila classification matching. The Lago Vivo classification had the correct decision (`da_verificare`), category, scores, rationale, evidence, model attestation and null review metadata, but its manually transcribed fingerprint was truncated to `6c7e6187d9094c7c2f355be269040c5996069de1c877eaef70` instead of the sealed fingerprint `6c7e6187d9094c7c2f355be269040c5996069de1c877eaefb4fc1ff0e015160a`.

A read-only pre-update comparison at `22:33:19.303563+00` confirmed the exact truncated value and that every other classification field matched the sealed output; the place row remained correct, with no review/admin override. A compare-and-swap update then changed only `place_classifications.fingerprint` for that one source ID, guarded by the exact prior fingerprint and all other expected classification fields. It returned the Lago Vivo source ID. No `places` field was updated; no rows were deleted.

The final joined query at `2026-10-22 22:33:30.892756+00` verified both place rows and both classifications against the sealed input. Result: 2 joined rows, 0 missing places, 0 missing classifications, 0 protected-field/geography mismatches, 0 classification mismatches. The final Lago Vivo fingerprint equals the sealed value. No override metadata is present.

The incident is recorded in `delta-import-receipt.json` and `.agents/cai/FAILURES.json`. This receipt distinguishes the initial two inserts from the one-field corrective classification update. The correction did not modify the source decision or any editorial/geographic place data.
