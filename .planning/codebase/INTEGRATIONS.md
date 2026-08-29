# External Integrations

**Analysis Date:** 2026-08-29

## APIs & External Services

**Excursion source:**
- CAI Roma public web page - scraped by `backend/scraper.js` from the URL exported as `CAI_ROMA_URL`.
  - Client: `axios` with a 15-second timeout.
  - Parser: `cheerio`; the first two HTML tables are treated as timetable sources.
  - Auth: none; public content.

**Mapping:**
- OpenStreetMap raster tiles - requested directly by Leaflet in `frontend/src/app/map.component.ts`.
  - Client: `leaflet`.
  - Auth: none.

**Web assets:**
- Leaflet CSS from unpkg and Inter font from Google Fonts in `frontend/src/index.html`.

## Data Storage

**Databases:**
- None in the deployed Angular/Express application.
- The optional `site/` toolchain can bind Cloudflare D1 from `site/vite.config.ts`, but its hosting binding is not used by application code.

**File Storage:**
- `backend/data/excursions.json` is the committed scheduled cache.
- `backend/scripts/scrape.js` writes a temporary sibling file and atomically renames it into place.
- The optional `site/` toolchain can bind Cloudflare R2, with no application reads or writes currently present.

**Caching:**
- File-backed excursion cache only; no memory, CDN, or distributed cache abstraction.

## Authentication & Identity

**Auth Provider:**
- Not applicable. The portal and `/api/excursions` endpoint are public.

## Monitoring & Observability

**Error Tracking:**
- No external error tracking detected.

**Logs:**
- Console logging in `backend/server.js`, `backend/scripts/scrape.js`, `frontend/src/main.ts`, and `frontend/src/app/app.ts`.
- Docker health check calls `GET /health` as configured in `compose.yaml`.

## CI/CD & Deployment

**Hosting:**
- Docker images are published to GitHub Container Registry by `.github/workflows/ci-release.yml`.
- Local/host deployment is assembled by `compose.yaml`.
- `site/` contains an untracked OpenAI Sites/Cloudflare Workers prototype, independent of the Docker application.

**CI Pipeline:**
- Pull requests test and build both applications.
- Pushes to `main` and tags publish frontend and backend containers.
- `.github/workflows/refresh-data.yml` refreshes excursion data daily at 04:17 UTC and commits changed cache data.

## Environment Configuration

**Required env vars:**
- None for the default Compose path.
- Optional `PORT` and `CORS_ORIGIN` customize the backend.

**Secrets location:**
- GitHub Actions uses repository-provided credentials for GHCR; no credential values are stored in mapped documentation.
- Ignored `.env*` files may supply local configuration and were not read.

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- Scheduled HTTP GET to CAI Roma during cache refresh or live fallback scraping.
- Browser tile requests to OpenStreetMap and asset requests to unpkg/Google Fonts.

---

*Integration audit: 2026-08-29*
