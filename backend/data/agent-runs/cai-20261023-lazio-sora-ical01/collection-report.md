# CAI Sora iCalendar bounded sample

- Run: `cai-20261023-lazio-sora-ical01`
- Source: `sora` (CAI Sora, Lazio).
- Requested URL: `https://www.caisora.it/sito/events/?ical=1` (exact HTTPS official-host URL registered in `calendarUrls`/`calendarEvidence`; max1 document/120s/concurrency1/no discovery).
- Collection state: `partial`; files ready; database pending.

The exact requested URL is present in cache metadata with content type `text/calendar; charset=UTF-8`, 271 bytes, and body SHA-256 `0346bed3656c05f04bea29859d384ae9f97a835cd7cac16082f98d3738977906`, matching the scrape-status document hash. The body is a syntactically complete iCalendar 2.0 `VCALENDAR`, `METHOD:PUBLISH`, named “CAI - Sezione di Sora”, with one BEGIN/END VCALENDAR and zero BEGIN/END VEVENT components. The parser reports `method=ics`, zero events, and `no-upcoming`; that result is supported for this feed. HTTP status and final URL were not persisted.

The source as a whole remains `partial`: the annual PDF has a prior OCR failure and discovery-limit 9; the programme announcement has discovery-limit 1 and links to that PDF. Neither was fetched again. This run establishes that this particular iCal feed is empty; it does not establish that the full 2026 programme has no events.

## Catalog comparison

| Measure | Before | After | Delta |
|---|---:|---:|---:|
| National catalog rows / unique IDs | 3,376 / 3,376 | 3,376 / 3,376 | 0 |
| Sora rows | 10 | 10 | 0 |
| Added / removed / changed rows | — | — | 0 / 0 / 0 |
| Feed events verified / semantic duplicates excluded | — | — | 0 / 0 |

Sorted Sora row-set SHA-256 before and after: `57a2e514ff0b3b8686cb3a989db56d14a16d1c501c8d4e8b38a9dae29f98e302`. All ten existing Sora IDs and all event/editorial/geographic fields are unchanged. No classification candidates, coordinates, query or DB write. There were 0 failure resolutions and 3 open issue records: PDF OCR, PDF discovery-limit 9, announcement discovery-limit 1.

## Validation

Importer QA: PASS for cache/body, source URL, manifest and catalog; feed-level `no-upcoming` supported; whole-section coverage HOLD. Backend `npm test`: 206/206 after collection. Six public JSON hashes were unchanged by tests and backend/frontend mirrors are byte-identical. No tests ran concurrently with collection.

## Run artifacts

- `manifest.json` SHA-256: `d75735c328f45790c1e57ad8749d3a639fbef93364ce1877a0b277484a8d5474`
- `state.json` SHA-256: `f2df60351bad72c744ff8348788e5882ba1527dc7579e56daa4872f32b43ea83`
- `source-evidence.json` SHA-256: `5df5c5c30c4f3b1de603404817bbaa4e75723094c3a3d2211d4be16cb54dcce6`
- Public mirror seals and catalog delta: `evidence-manifest.json`.
