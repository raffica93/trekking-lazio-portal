# Classification report — `cai-map-20261022-pinasca02`

The isolated classifier input contains exactly the four new Pinasca IDs from `cai-20261022-piemonte-pinasca02`; the input SHA-256 is `85b20198a72956266751a9b13ca86fd9b6e59b3b3a1db4d342d108432f460edf`. Run state: ready, 4/4 completed, 0 errors; policy `cai-trekking-v2`, concurrency 1, 1000 ms minimum start interval.

| Decision | Category | Rows |
|---|---|---:|
| trekking | a piedi | 2 |
| non_trekking | sociale/culturale | 2 |
| da_verificare | — | 0 |
| errors | — | 0 |

Mercury requested model: `inception/mercury-decide`. All four output records attest response/model version `inception/mercury-decide-20260930`; this is the provider-returned snapshot, not a substituted requested model. `modelAttested=true` and `method=mercury-decide` on each result. The two dinners are classified non-trekking; the two explicitly labeled excursions are trekking. Source fields, administrative/editorial fields, location, and coordinate fields match the sealed input; no coordinates were added. The importer’s independent QA is recorded separately in the handoff/checkpoint.

Output SHA-256: `133d5a7b7aba43ebd27b51481a128fb6d80b2f591fdad525c2f8d8779883fdae`. Classifier manifest SHA-256: `3dd59a810621ede84d09b4b3bb7bed0b0c766bc1c215f86ef2245defd881ffd5`. No DB query or write occurred in this run.
