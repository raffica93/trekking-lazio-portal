# Codebase Concerns

**Analysis Date:** 2026-08-29

## Tech Debt

**Duplicate/ambiguous frontend roots:**
- Issue: `frontend/` is the deployed Angular portal while untracked `site/` is a separate Next/Vinext placeholder.
- Files: `frontend/src/app/app.ts`, `site/app/page.tsx`, `compose.yaml`, `.github/workflows/ci-release.yml`.
- Impact: Future work can target the wrong UI; only Angular is tested and deployed.
- Fix approach: Explicitly select the canonical frontend, then remove/archive or fully integrate the other root.

**Generated Angular boilerplate retained:**
- Issue: `frontend/src/app/app.html` and `frontend/src/app/app.css` contain the generated starter UI, while `frontend/src/app/app.ts` uses inline template/styles.
- Files: `frontend/src/app/app.html`, `frontend/src/app/app.css`, `frontend/src/app/app.ts`.
- Impact: Misleading dead code and unnecessary maintenance surface.
- Fix approach: Delete unused files after confirming no template/style URL references.

**Duplicated excursion schema:**
- Issue: Backend object construction and frontend TypeScript interface are not validated from one source.
- Files: `backend/scraper.js`, `frontend/src/app/excursion.model.ts`.
- Impact: Silent client breakage when a producer field changes.
- Fix approach: Add a shared JSON schema/runtime validator or contract tests.

## Known Bugs

**Area filters do not model provinces:**
- Symptoms: Buttons labeled Roma, Viterbo, Latina, and Rieti perform substring matching on `organizer` or `location`; many excursions use mountain-area names and all organizers are `CAI Roma`.
- Files: `frontend/src/app/app.ts`.
- Trigger: Select a province whose name is absent from the scraped location.
- Workaround: Use "Tutte" and inspect the full list.

**Approximate coordinates collapse unknown trips onto Rome:**
- Symptoms: Unknown locations share the default marker at `[41.891, 12.492]`.
- Files: `backend/scraper.js`.
- Trigger: Any title/location absent from the fixed `locations` table.
- Workaround: Follow the source link for the real location.

## Security Considerations

**Popup HTML injection:**
- Risk: External scraped strings are interpolated into HTML passed to Leaflet `bindPopup`.
- Files: `frontend/src/app/map.component.ts`, producer data in `backend/scraper.js`.
- Current mitigation: None beyond source trust.
- Recommendations: Build popup content with DOM text nodes or escape all external values.

**Open CORS default:**
- Risk: `process.env.CORS_ORIGIN || true` permits broad cross-origin access when no origin is configured.
- Files: `backend/server.js`.
- Current mitigation: Endpoint is read-only and public.
- Recommendations: Document public API intent or restrict production origins explicitly.

**External links:**
- Risk: Excursion links open a new tab without an explicit `rel="noopener noreferrer"`.
- Files: `frontend/src/app/excursion-card.component.ts`.
- Current mitigation: Modern browsers commonly isolate `_blank`, but explicit protection is preferable.
- Recommendations: Add `rel` and validate allowed URL protocols/domains.

## Performance Bottlenecks

**Synchronous cache read per request:**
- Problem: `fs.readFileSync` and JSON parsing block the Node event loop for every `/api/excursions` call.
- Files: `backend/server.js`.
- Cause: Simplicity of file-backed cache access.
- Improvement path: Load/validate cache at startup and refresh it on file change or on a bounded timer.

**Full marker rebuild:**
- Problem: Every filter change removes and recreates every Leaflet marker and refits bounds.
- Files: `frontend/src/app/map.component.ts`.
- Cause: No marker identity/diff layer.
- Improvement path: Key markers by excursion ID and update only additions/removals if dataset size grows.

## Fragile Areas

**CAI HTML scraper:**
- Files: `backend/scraper.js`, `backend/test/scraper.test.js`.
- Why fragile: It only scans the first two tables and relies on column count, Italian headings, and fixed cell positions.
- Safe modification: Preserve HTML fixtures for every observed source layout and keep empty-result protection in the scheduled script.
- Test coverage: One happy-path row; no multi-table, malformed, year-boundary, relative/invalid link, or upstream-change cases.

**Map lifecycle:**
- Files: `frontend/src/app/map.component.ts`.
- Why fragile: The global DOM ID `map` assumes a single instance and the component never destroys the Leaflet map.
- Safe modification: Use an element reference and implement teardown before introducing rerenders/routes.
- Test coverage: None.

## Scaling Limits

**File-backed data:**
- Current capacity: Suitable for the current small public excursion feed.
- Limit: Each request reparses the full JSON file; coordinated writes or multiple data sources have no abstraction.
- Scaling path: Memory-cache validated records first; adopt durable storage only when editing/query requirements justify it.

## Dependencies at Risk

**Vinext beta / parallel site toolchain:**
- Risk: `site/package.json` uses `vinext` beta, Vite 8, Wrangler, and a generated hosting scaffold without a lockfile.
- Impact: Reproducibility and maintenance cost if this becomes the canonical UI.
- Migration plan: Either commit/test/own the toolchain or remove it from the product repository.

## Missing Critical Features

**Loading error state:**
- Problem: The Angular UI logs request errors but shows the same empty-state message used for a legitimate empty schedule.
- Blocks: Users cannot distinguish service outage from no upcoming excursions.

**Data provenance detail:**
- Problem: The UI says "CAI Lazio" while the scraper and organizer are specifically CAI Roma.
- Files: `frontend/src/app/app.ts`, `backend/scraper.js`.
- Blocks: Accurate user understanding of coverage.

## Test Coverage Gaps

**Express API and cache behavior:**
- What's not tested: `/health`, cache-first responses, live fallback, 503 behavior, response headers, malformed cache handling.
- Files: `backend/server.js`.
- Risk: Deployment-critical behavior can regress unnoticed.
- Priority: High.

**Frontend map, filters, and error handling:**
- What's not tested: province filtering semantics, marker rendering/cleanup, external links, and failed HTTP requests.
- Files: `frontend/src/app/app.ts`, `frontend/src/app/map.component.ts`, `frontend/src/app/excursion-card.component.ts`.
- Risk: Core discovery interactions can fail while smoke tests remain green.
- Priority: High.

---

*Concerns audit: 2026-08-29*
