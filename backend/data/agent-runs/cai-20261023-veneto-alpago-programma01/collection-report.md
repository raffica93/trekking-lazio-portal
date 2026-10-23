# CAI Alpago — bounded Programma page sample

Run ID: `cai-20261023-veneto-alpago-programma01`  
Source: `cai-alpago-9220065`  
Requested scope: `https://www.caialpago.it/programma-2/`, max 1 document, 120-second source budget, concurrency 1. No discovery/child target was authorized.

## Collection result and evidence limits

The orchestrator completed with `collection=partial`, `files=ready`, `database=pending`; its raw output reports 3 excursions and a 3,376-row upcoming catalog. Those 3 reported excursions are not attributable to the requested URL, so this run establishes 0 new verified coverage and 0 new IDs. The source remains partial with discovery-limit issues on `/programma-2-3/` (72 candidates) and `/programma-2-2/` (1 candidate).

The requested `/programma-2/` URL is not represented as a distinct document in the merged status. The status retains `https://www.caialpago.it/programma-2-2/` with `method=html-calendar`, `events=3`, body SHA-256 `9d452cd1f3ddd48c805eb3789dfd965fbb9f26d814f26b9293bbe8b7c203079b`; the matching cached body is 67920 bytes, `text/html; charset=UTF-8`. Per-request HTTP status and canonical/final URL are not persisted, so I do not assert that this cached body is the direct response to `/programma-2/`. Literal excerpts and byte offsets for the cached status document are recorded in `source-evidence.json`.

The pre-existing `/programma-2-2/` body is titled “Programma” and lists dated October 2026 entries, including “Sabato 17 Ottobre 2026 Escursione ai Lastoi de Formin (2657)” and “Domenica 25 Ottobre 2026 Castagnata”. These excerpts describe that baseline document only; they do not prove the requested `/programma-2/` response or new coverage. No coordinates were inferred. The two 17 October Lastoi records remain separate existing IDs and in review as a possible semantic duplicate; do not merge without stronger evidence.

## Catalog comparison

| Sezioni controllate | Complete | Partial | Unreachable | Event rows emitted | New IDs | Removed IDs | Existing Alpago rows | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 0 | 1 | 0 | 3 raw / 0 attributable | 0 | 0 | 3 | 0 | 0 | discovery-limit 72 on `/programma-2-3/`; discovery-limit 1 on `/programma-2-2/` |

All three IDs were present in the saved `cai-map-20261022-full01/input.json` before this run and remain present. Importer QA against the remote catalog baseline confirms descriptions were already identical; they are not deltas. Two existing rows have only `link` and `sourceDocument` changes from `/programma-2-3/` to `/programma-2-2/`, corroborated by cards in the pre-existing `/programma-2-2/` body. Titles, dates, organizer, location, region and null coordinates are unchanged. These source-reference updates do not establish a response to `/programma-2/`, new IDs, or new coverage. The catalog has 3,376 rows before and after; its file SHA changed from `c66e963a9d025dfb1184492362cd3235051f04e0318f88f1985b0d81951e2f03` to `15bea073870174d2bdabb197efa87442e420863aaab0a44b738358036ed18f0f` as generated metadata/coverage were refreshed. Current Alpago rows SHA-256 is `65e28549165c3b5c959340091cf8192a569bef8230a6547a7f2bc7c571a86e07` (prefix filter, ascending id, Node.js JSON.stringify then UTF-8 SHA-256); the pre-run map input rows use the separate saved-snapshot hash `5b58d54b0700b2fe2df99ad22d411185116a6d663c37e97b4c2752dddb16dfbf` and are not byte-comparable because they use a different schema.

Backend/frontend mirrors are byte-identical after collection: excursions `15bea073870174d2bdabb197efa87442e420863aaab0a44b738358036ed18f0f`, sections `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`, scrape status `1b838428e048acef4c44b80eda0beffbd9583a916614632153feb1fcbd2f6903`. At collection completion no classification, import, database access, or test had run.

## Post-collection verification

The independent importer review passed artifact integrity, catalog comparison, and mirror checks, with a HOLD on attributing the emitted rows to the requested `/programma-2/` URL. It found no verified new IDs or coverage; no classification or DB delivery is applicable. It confirmed the two `link`/`sourceDocument` changes are supported by the pre-existing `/programma-2-2/` body. The ambiguous Lastoi records remain separate.

After collection stopped, `npm test` in `backend` passed 206/206 on checkpoint code `f95b9e5`. All six public JSON hashes before and after tests were identical (excursions `15bea073870174d2bdabb197efa87442e420863aaab0a44b738358036ed18f0f`, sections `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`, status `1b838428e048acef4c44b80eda0beffbd9583a916614632153feb1fcbd2f6903`); backend/frontend mirrors are byte-identical. No database query or write occurred.
