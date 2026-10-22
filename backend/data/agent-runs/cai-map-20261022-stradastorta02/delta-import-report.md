# Delta import receipt — cai-map-20261022-stradastorta02

Status: **completed**, one source ID delivered to project `snwzxegtqnnuvlawnpgl` using a single data-modifying CTE with conflict-ignore inserts only. No general catalog import, DDL, updates, or deletes were run.

- Source commit: `12b073fb469a209217ed149c00657a1f7e19e0a3`
- Sealed manifest SHA-256: `bbee2f819c7841796d44a301934c5ef8fb62171d08fdafd0817908a1422fc1f2`
- Input SHA-256: `339bac6cd1e4a8cd4e42cb0a1f8f83015d13a27ccbc465925279961bd22af076`
- Output SHA-256: `1cdf39c31f0b7c6ff8fa213072a6b1d03ce50c4d36ae205c6ca1ed181ac68e50`

Before delivery, an exact-ID joined query returned no rows in either table. A second exact-ID preflight immediately before the insert-only statement also returned no rows. The atomic statement returned `places_inserted=1`, `places_present_after=1`, and `classifications_inserted=1`. Its final same-statement count of the classification table was zero because a Postgres data-modifying CTE's writes are not visible to a sibling base-table scan under that statement snapshot; a separate post-statement joined SELECT then verified one matching place/classification row. The initial CTE attempt had a SQL target-column arity error and was rejected before any mutation; the exact-ID preflight remained empty before the successful statement.

The joined post-query matched the sealed candidate: `decision=candidate_decision=da_verificare`, effective/candidate category `altro`, confidence `0.748686784956265`, probability `0.83245785663751`, method `mercury-decide`, requested model `inception/mercury-decide`, response/model version `inception/mercury-decide-20260930`, attested `true`, policy `cai-trekking-v2`, and fingerprint `881cfbd8d2df9e36664b0db142d0a6921b7f00da1e00cb361400f01bf790f31d`.

Inserted place fields matched the importer transformation: title `Monte Pisello – Rifugio Alpe Piazza`, date/date_end `2026-10-25`, status `published`, location `Località da verificare`, coordinates and coordinate quality null, and geo evidence null. The place was inserted only when absent; both inserts used `ON CONFLICT (source_id) DO NOTHING`. Counts: 1 input/1 inserted/0 existing/0 skipped places; 1 eligible classification/1 inserted/0 preserved/0 skipped/0 mismatch. Updates=0; deletes=0.

Machine-readable receipt: `delta-import-receipt.json`.
