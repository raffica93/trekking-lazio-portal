# Coding Conventions

**Analysis Date:** 2026-08-29

## Naming Patterns

**Files:**
- Use Angular suffixes for application components and services: `*.component.ts`, `*.service.ts`, `*.model.ts`.
- Use lowercase CommonJS module names in `backend/` and `index.ts` barrels in `frontend/libs/ui/`.

**Functions:**
- Use camelCase verbs, e.g. `readCachedExcursions`, `parseCaiRomaHtml`, `filterByArea`, and `updateMarkers`.
- Mark internal Angular helpers `private`; use explicit `: void` where already established.

**Variables:**
- Use camelCase for mutable/local values and UPPER_SNAKE_CASE for backend constants such as `CAI_ROMA_URL` and `DATA_FILE`.

**Types:**
- Use PascalCase interfaces/classes such as `Excursion`, `ExcursionService`, and `MapComponent`.

## Code Style

**Formatting:**
- TypeScript generally uses single quotes, trailing commas in multiline metadata/config, and two-space indentation.
- Backend JavaScript uses single quotes, semicolons, and two-space indentation.
- Prettier 3 is installed in `frontend/package.json`, but no repository Prettier configuration or formatting script is present.

**Linting:**
- `site/eslint.config.mjs` enables Next.js core-web-vitals and TypeScript rules.
- No frontend Angular ESLint target is defined in `frontend/angular.json`; TypeScript strictness supplies the main static guard.

## Import Organization

**Order:**
1. Framework/platform imports (`@angular/*`, `node:*`, React/Next).
2. Third-party libraries (`leaflet`, `axios`, `cheerio`, `luxon`).
3. Local application modules and components.

**Path Aliases:**
- Use `@spartan-ng/helm/*` aliases for local UI libraries as configured in `frontend/tsconfig.json`.
- Use relative imports for application-specific modules under `frontend/src/app/`.

## Error Handling

**Patterns:**
- Catch filesystem/cache errors and degrade to an empty cache in `backend/server.js`.
- Translate unavailable excursion data to HTTP 503 instead of returning stale-shaped errors.
- Scheduled ingestion throws on empty results and sets `process.exitCode` in `backend/scripts/scrape.js`.
- Angular subscriptions use an explicit `error` callback and always clear `loading`.

## Logging

**Framework:** console.

**Patterns:**
- Log operational events at process boundaries: server startup, scrape changes, scrape failures, and frontend request failures.
- Do not place high-volume logs inside row/marker loops.

## Comments

**When to Comment:**
- Comments explain operational intent or browser/library workarounds, as in `site/vite.config.ts` and `frontend/src/app/map.component.ts`.
- Avoid retaining generated placeholder commentary in active application files; `frontend/src/app/app.html` is currently unused boilerplate.

**JSDoc/TSDoc:**
- Not used. Prefer clear names and small functions unless a parser rule needs a documented contract.

## Function Design

**Size:**
- Parser logic is decomposed into `cellLines`, `parseDate`, `stableId`, and `getApproximateCoords` in `backend/scraper.js`.
- Continue extracting focused helpers when UI or parsing methods grow.

**Parameters:**
- Use injectable options for nondeterminism, demonstrated by the `now` option to `parseCaiRomaHtml`.
- Use typed Angular inputs and service return values.

**Return Values:**
- Scraper functions return normalized arrays/records; missing or malformed rows are skipped.
- API failures return stable JSON error objects with appropriate status codes.

## Module Design

**Exports:**
- Backend exports only testable/public functions through `module.exports`.
- Angular UI primitives re-export symbols from `frontend/libs/ui/*/src/index.ts`.

**Barrel Files:**
- Use barrels for reusable local UI libraries, not for the small application module directory.

---

*Convention analysis: 2026-08-29*
