<!-- refreshed: 2026-08-29 -->
# Architecture

**Analysis Date:** 2026-08-29

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│ Angular standalone SPA (`frontend/src/app/`)                │
│ list/cards + filters + Leaflet map                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ GET /api/excursions
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Nginx reverse proxy (`frontend/nginx.conf`)                 │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Express API (`backend/server.js`)                           │
│ cache-first read; live scrape fallback                      │
└───────────────┬───────────────────────────┬─────────────────┘
                ▼                           ▼
 `backend/data/excursions.json`   CAI Roma (`backend/scraper.js`)
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Angular root | Fetch, retain, filter, and compose the main screen | `frontend/src/app/app.ts` |
| Excursion service | Typed HTTP boundary for `/api/excursions` | `frontend/src/app/excursion.service.ts` |
| Excursion card | Present excursion metadata and external details link | `frontend/src/app/excursion-card.component.ts` |
| Map | Own Leaflet lifecycle, markers, popups, and viewport | `frontend/src/app/map.component.ts` |
| Express API | Health check, cached data reads, live-scrape fallback | `backend/server.js` |
| Scraper | Parse CAI HTML into stable `Excursion` records | `backend/scraper.js` |
| Cache updater | Safely refresh the committed JSON cache | `backend/scripts/scrape.js` |

## Pattern Overview

**Overall:** Small cache-first three-tier web application with scheduled ingestion.

**Key Characteristics:**
- The public UI is a single standalone Angular component tree with no routed screens.
- Express exposes read-only JSON and delegates extraction to a pure-ish parser module.
- Scheduled GitHub Actions materialize third-party data into a versioned JSON cache.
- `site/` is a separate, unintegrated React/Vinext placeholder rather than another layer of the deployed system.

## Layers

**Presentation:**
- Location: `frontend/src/app/` and `frontend/libs/ui/`.
- Depends on: Angular, RxJS, Leaflet, local Spartan/Helm UI primitives.

**HTTP boundary:**
- Location: `frontend/src/app/excursion.service.ts`, `frontend/nginx.conf`, and `backend/server.js`.
- The browser uses a relative `/api` URL; Nginx or the Angular dev proxy selects the backend.

**Ingestion/domain transformation:**
- Location: `backend/scraper.js`.
- Converts unstable table markup into the stable shape mirrored by `frontend/src/app/excursion.model.ts`.

**Persistence:**
- Location: `backend/data/excursions.json` and `backend/scripts/scrape.js`.
- A committed JSON file is the primary runtime data source.

## Data Flow

### Primary Request Path

1. `App.ngOnInit()` requests excursions through `ExcursionService` in `frontend/src/app/app.ts`.
2. `/api/excursions` is proxied to Express by `frontend/nginx.conf` or `frontend/proxy.conf.json`.
3. `readCachedExcursions()` synchronously parses `backend/data/excursions.json`.
4. Express returns cached records, or invokes `scrapeCaiRoma()` when the cache is empty.
5. Angular renders cards and passes the same filtered array to the Leaflet component.

### Scheduled Refresh

1. `.github/workflows/refresh-data.yml` invokes `npm run scrape` daily.
2. `backend/scripts/scrape.js` fetches and parses CAI Roma.
3. Changed data is written atomically to `backend/data/excursions.json`.
4. GitHub Actions commits the change to `main`, triggering image publication.

**State Management:**
- Component-local arrays and flags in `frontend/src/app/app.ts`; no global store.

## Key Abstractions

**Excursion contract:**
- TypeScript interface: `frontend/src/app/excursion.model.ts`.
- Producer: object construction in `backend/scraper.js`.
- There is no shared schema or runtime validation between producer and consumer.

**Scraper parser:**
- `parseCaiRomaHtml()` in `backend/scraper.js` accepts HTML plus an injectable clock, enabling deterministic parser tests.

## Entry Points

**Frontend:** `frontend/src/main.ts` bootstraps the standalone `App`.

**Backend:** `backend/server.js` starts Express only when executed directly, allowing test imports.

**Data refresh:** `backend/scripts/scrape.js` is the CLI entry point for scheduled ingestion.

**Prototype site:** `site/app/page.tsx` renders only a build-in-progress placeholder.

## Architectural Constraints

- **Threading:** Node's single event loop; synchronous cache reads occur per API request.
- **Global state:** Leaflet map/marker instances are component fields in `frontend/src/app/map.component.ts`.
- **Schema coupling:** Backend and frontend independently define the excursion record.
- **Data source coupling:** Parsing assumes CAI Roma table position and Italian month/date formatting.

## Anti-Patterns

### Raw external strings in Leaflet popup HTML

**What happens:** Scraped title and organizer values are interpolated into HTML in `frontend/src/app/map.component.ts`.
**Why it's wrong:** A compromised or malformed upstream page can inject markup into the popup.
**Do this instead:** Build popup DOM nodes with text content or escape values before binding.

### Parallel application roots

**What happens:** `frontend/` is the deployed portal while untracked `site/` is an unrelated Next/Vinext placeholder.
**Why it's wrong:** Tooling and ownership are ambiguous, and CI does not validate the second root.
**Do this instead:** Choose one product frontend or document and isolate the prototype explicitly.

## Error Handling

**Strategy:** Graceful public-service degradation.

**Patterns:**
- Scrape failures become HTTP 503 responses in `backend/server.js`.
- An empty scheduled scrape aborts without replacing the last cache in `backend/scripts/scrape.js`.
- The frontend logs request errors and stops the loading spinner in `frontend/src/app/app.ts`.

## Cross-Cutting Concerns

**Logging:** Console only.
**Validation:** Parser guards and array checks; no shared runtime schema.
**Authentication:** None; all capabilities are public/read-only.

---

*Architecture analysis: 2026-08-29*
