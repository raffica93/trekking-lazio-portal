# Codebase Structure

**Analysis Date:** 2026-08-29

## Directory Layout

```text
trekking-lazio-portal/
├── .github/workflows/       # CI, release, and scheduled data refresh
├── backend/                 # Express API, scraper, cache, and Node tests
│   ├── data/                # Versioned excursion cache
│   ├── scripts/             # Executable maintenance scripts
│   └── test/                # Backend tests
├── frontend/                # Deployed Angular SPA and Nginx image
│   ├── libs/ui/             # Local Spartan/Helm UI primitives
│   ├── public/              # Static assets
│   └── src/app/             # Portal components, model, and service
├── site/                    # Untracked React/Vinext/OpenAI Sites placeholder
├── compose.yaml             # Local production-like assembly
└── README.md                # Operator-facing setup and automation notes
```

## Directory Purposes

**`backend/`:**
- Purpose: publish excursion JSON and maintain the CAI Roma cache.
- Key files: `backend/server.js`, `backend/scraper.js`, `backend/scripts/scrape.js`.

**`frontend/src/app/`:**
- Purpose: application-specific Angular UI.
- Key files: `app.ts`, `excursion.service.ts`, `excursion.model.ts`, `map.component.ts`, `excursion-card.component.ts`.

**`frontend/libs/ui/`:**
- Purpose: reusable low-level UI primitives generated/adapted from Spartan/Helm.
- Imports are exposed through aliases declared in `frontend/tsconfig.json`.

**`site/`:**
- Purpose: independent generated Sites scaffold with a placeholder screen.
- It is currently untracked and absent from `compose.yaml` and `.github/workflows/ci-release.yml`.

## Key File Locations

**Entry Points:**
- `frontend/src/main.ts`: Angular bootstrap.
- `backend/server.js`: Express process.
- `backend/scripts/scrape.js`: scheduled/manual cache refresh.
- `site/app/page.tsx`: prototype page.

**Configuration:**
- `frontend/angular.json`: Angular build/test configuration.
- `frontend/tsconfig.json`: strict TypeScript and UI aliases.
- `frontend/proxy.conf.json`: development API proxy.
- `frontend/nginx.conf`: production API proxy and SPA fallback.
- `compose.yaml`: service topology.
- `.github/workflows/`: CI/CD automation.

**Core Logic:**
- `backend/scraper.js`: source parsing, stable IDs, dates, and approximate coordinates.
- `frontend/src/app/app.ts`: loading and filtering.
- `frontend/src/app/map.component.ts`: map projection.

**Testing:**
- `backend/test/scraper.test.js`: scraper parser test.
- `frontend/src/app/app.spec.ts`: Angular root smoke/render tests.

## Naming Conventions

**Files:**
- Angular app modules/components use lowercase dot-separated names, such as `excursion-card.component.ts`.
- Backend executable/module files use lowercase names, such as `server.js` and `scraper.js`.
- Local UI libraries use `hlm-*.ts` and expose public APIs through `src/index.ts`.

**Directories:**
- Feature/runtime roots are lowercase (`backend`, `frontend`, `site`).
- UI libraries are grouped by component name under `frontend/libs/ui/`.

## Where to Add New Code

**New portal feature:**
- Application logic/component: `frontend/src/app/`.
- Shared domain shape: update `frontend/src/app/excursion.model.ts` and the producer in `backend/scraper.js` together.
- Tests: co-locate Angular specs under `frontend/src/app/` and backend tests under `backend/test/`.

**New reusable UI primitive:**
- Implementation: `frontend/libs/ui/<component>/src/lib/`.
- Public export: `frontend/libs/ui/<component>/src/index.ts`.
- Alias: add to `frontend/tsconfig.json` if introducing a new package path.

**New API capability:**
- Small route: `backend/server.js`.
- Reusable extraction/domain logic: a dedicated module under `backend/`, with tests under `backend/test/`.

**Utilities:**
- Keep frontend-only helpers near `frontend/src/app/` until reuse justifies a `frontend/libs/` package.
- Keep ingestion utilities in `backend/scraper.js` or a focused backend module.

## Special Directories

**`backend/data/`:**
- Purpose: generated but version-controlled runtime cache.
- Generated: Yes, by `backend/scripts/scrape.js`.
- Committed: Yes.

**`frontend/libs/ui/`:**
- Purpose: local design-system primitives.
- Generated: Partly scaffolded via `frontend/components.json` conventions.
- Committed: Yes.

**`site/`:**
- Purpose: generated hosting scaffold/prototype.
- Generated: Yes.
- Committed: No at analysis time.

---

*Structure analysis: 2026-08-29*
