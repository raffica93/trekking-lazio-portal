# Testing Patterns

**Analysis Date:** 2026-08-29

## Test Framework

**Runner:**
- Vitest 4 through Angular's `@angular/build:unit-test` builder.
- Config: the `test` target in `frontend/angular.json` and compiler inputs in `frontend/tsconfig.spec.json`.
- Node.js built-in `node:test` for backend tests.

**Assertion Library:**
- Vitest/Jasmine-compatible globals for Angular specs.
- `node:assert/strict` for backend tests.

**Run Commands:**
```bash
cd frontend && npm test -- --watch=false
cd backend && npm test
cd frontend && npm run build
```

## Test File Organization

**Location:**
- Angular specs are co-located with application code, currently `frontend/src/app/app.spec.ts`.
- Backend tests are separate under `backend/test/`, currently `backend/test/scraper.test.js`.

**Naming:**
- Frontend: `*.spec.ts`.
- Backend: `*.test.js`.

**Structure:**
```text
frontend/src/app/<subject>.spec.ts
backend/test/<subject>.test.js
```

## Test Structure

**Suite Organization:**
```typescript
describe('App', () => {
  beforeEach(async () => TestBed.configureTestingModule(...).compileComponents());
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('should ...', () => { /* arrange, detect changes, assert */ });
});
```

**Patterns:**
- Angular tests configure standalone imports through `TestBed`.
- HTTP requests are intercepted and flushed with `HttpTestingController`.
- Backend parser tests inject a fixed Luxon clock and use inline HTML fixtures.

## Mocking

**Framework:** Angular HTTP testing providers; no separate backend mocking library.

**Patterns:**
```typescript
const request = TestBed.inject(HttpTestingController).expectOne('/api/excursions');
request.flush([]);
```

**What to Mock:**
- Browser HTTP calls at the Angular service boundary.
- Network retrieval when testing `scrapeCaiRoma`; test parsing directly with stored/inline HTML.

**What NOT to Mock:**
- Pure parser behavior in `parseCaiRomaHtml`.
- Angular component creation and DOM rendering in smoke tests.

## Fixtures and Factories

**Test Data:**
```javascript
const result = parseCaiRomaHtml(html, {
  now: DateTime.fromISO('2026-08-29', { zone: 'Europe/Rome' })
});
```

**Location:**
- The only HTML fixture is inline in `backend/test/scraper.test.js`; no shared fixture directory exists.

## Coverage

**Requirements:** None enforced in package scripts or CI.

**View Coverage:**
```bash
# No committed coverage command; add explicit runner configuration before relying on a report.
```

## Test Types

**Unit Tests:**
- Parser happy path and Angular root creation/heading render.

**Integration Tests:**
- Angular root test integrates HttpClient testing with child component compilation.
- No Express route integration tests are present.

**E2E Tests:**
- Not used.

## Common Patterns

**Async Testing:**
```typescript
await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
```

**Error Testing:**
```text
Not established. Add parser malformed-input cases and Express 503/cache-fallback cases under `backend/test/`.
```

---

*Testing analysis: 2026-08-29*
