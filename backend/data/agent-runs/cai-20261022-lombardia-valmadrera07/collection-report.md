# Collection report — cai-20261022-lombardia-valmadrera07

- Checkpoint before run: branch `codex/cai-orchestrator-luna`, HEAD/origin `e65379e4791bddbb92f8898767f0951135a04173`.
- Selected source: `cai-valmadrera-9216081` (CAI Valmadrera, Lombardia), concurrency 1.
- Exact continuation URL: `https://organizzazione.cai.it/sez-valmadrera/wp-content/uploads/sites/56/2026/03/Calendario-attivita-2026_rev.04_16-03-2026.pdf`.
- Limits: `SCRAPE_MAX_DOCUMENTS=1`, `SCRAPE_SOURCE_BUDGET_MS=180000`; one `init` and one `collect`, no retry.
- Run created `2026-10-22T20:09:17.609Z`; collection finished `2026-10-22T20:09:25.398Z`.
- No test, DB, import, geolocation, commit, or push was performed.

## Fetch and extraction

- Exactly one source/document was scheduled and reached. Source result: `ok`, no issues, 21 future catalog rows after reconciliation. No other source was selected or collected.
- The single conditional request completed successfully through the inherited proxy. The scraper does not persist the HTTP response status in its run state. PDF body and metadata mtimes remained `2026-10-22 19:13:57 UTC` after this run, consistent with a conditional `304` cache validation; the exact response code is therefore not independently attested in the receipt.
- Cached body: 375,821 bytes, `application/pdf`, ETag `"5bc0d-64d5366879de8"`, Last-Modified `Wed, 18 Mar 2026 21:47:38 GMT`, SHA-256 `f3939cb69b55824e4db4026d989acea993a58e7fa81671d8c7a3093d3b4103e9`.
- Adapter VERSION 11 extraction cache was generated at `backend/node_modules/.cache/cai/events-4df9b5654ea5431fbf4e7d3f482187558653ee7874cb76ff2a1200f320a86f5f.json`, SHA-256 `ace32941f10beb7e3a04cd9d6afc6581c95e14d2923bfa136b5aaa4a2b02e578`.
- Deterministic method: `pdf-text`; 65 event rows extracted from the annual document. No coordinates or location values were inferred or added.

## Catalog reconciliation

Compared with the checkpoint catalog (`git show HEAD:backend/data/excursions.json`), global local-file count changed from 3,345 to 3,359. Valmadrera changed from 7 to 21 records: 14 new IDs, 0 removed IDs, and 0 existing IDs changed. This is file-level reconciliation, not a DB or live-map query.

| New event ID | Date | Source title |
|---|---|---|
| `cai-valmadrera-9216081-f703dad1d860` | 2026-10-04 | Scuola PIACCO CORSO ARRAMPICATA |
| `cai-valmadrera-9216081-7ee9657bb99a` | 2026-10-10 | Scuola PIACCO CORSO ARRAMPICATA |
| `cai-valmadrera-9216081-6442e365d70b` | 2026-10-11 | GITA SOCIALE MEDIA MONTAGNA Presolana |
| `cai-valmadrera-9216081-a3ea38de9baf` | 2026-10-17 | Alp. Giovanile Uscita corso |
| `cai-valmadrera-9216081-b371db7515b3` | 2026-10-17 | RACCONTAMI LA MONTAGNA |
| `cai-valmadrera-9216081-c6ae7cf56593` | 2026-10-18 | Alp. Giovanile Uscita corso |
| `cai-valmadrera-9216081-ad57bfc6c54c` | 2026-10-18 | VIVI IL MOREGALLO |
| `cai-valmadrera-9216081-4d26b7d6c929` | 2026-10-25 | Scuola PIACCO CORSO ARRAMPICATA |
| `cai-valmadrera-9216081-ddb3aaccfc1a` | 2026-11-01 | GITA SOCIALE MEDIA MONTAGNA Valmalenco |
| `cai-valmadrera-9216081-d13c059bceac` | 2026-11-08 | Scuola PIACCO CORSO ARRAMPICATA |
| `cai-valmadrera-9216081-6975b0f54bff` | 2026-11-14 | Scuola PIACCO CORSO ARRAMPICATA |
| `cai-valmadrera-9216081-7df15329595b` | 2026-11-15 | Scuola PIACCO CORSO ARRAMPICATA |
| `cai-valmadrera-9216081-d55106a9ebce` | 2026-11-22 | GITA CULTURALE Enogastronomica |
| `cai-valmadrera-9216081-10a7c964644a` | 2026-12-04 | CENA SOCIALE |

Oct 24 is blank in the official month grid; the course is dated Oct 25. All added rows retain unknown location/coordinate quality.

## Run state, manifest, and outputs

The selected Valmadrera source is `ok`. Overall orchestrator state is `collection=partial`, `files=ready`, `database=pending` because the persisted national coverage registry still includes unrelated incomplete sections; this one-source run did not schedule them.

Manifest: `backend/data/agent-runs/cai-20261022-lombardia-valmadrera07/manifest.json`, SHA-256 `80338c4a5952334c28cb8dc7ce436e6b0d8ea0aea9309046356e7909bc3a9335`.

Run state: `backend/data/agent-runs/cai-20261022-lombardia-valmadrera07/state.json`, SHA-256 `f54437f765a93c5affb604b478f5c778bec07f4152308e069b2ba4ed63564140`.

Manifested and copied catalog outputs:

- `backend/data/excursions.json` and `frontend/public/excursions.json`: SHA-256 `6e46cec85daae67e6da0a98afb36d4fbf72b3790b2246dfcdf3837ea9a0ff99b`.
- `backend/data/cai-sections.json`: SHA-256 `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`.
- `backend/data/scrape-status.json` and `frontend/public/scrape-status.json`: SHA-256 `da7fa46626cfd3c7e29cc59e0eb66c85f2374a70d0d325a68caba38308dd8450`.

No additional sections or URLs were attempted. No DB writes were made; import remains pending.
