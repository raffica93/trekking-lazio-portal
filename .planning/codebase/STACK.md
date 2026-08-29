# Technology Stack

**Analysis Date:** 2026-08-29

## Languages

**Primary:**
- TypeScript 5.9 - Angular application under `frontend/src/`, local UI primitives under `frontend/libs/`, and the separate React prototype under `site/`.
- JavaScript (CommonJS) - Express API, CAI scraper, scheduled cache writer, and Node tests under `backend/`.

**Secondary:**
- CSS/Tailwind CSS 4 - global styles in `frontend/src/styles.css`, inline Angular templates, and `site/app/globals.css`.
- HTML and Nginx configuration - Angular shell in `frontend/src/index.html` and SPA/API routing in `frontend/nginx.conf`.

## Runtime

**Environment:**
- Node.js 22 - selected by both Dockerfiles and `.github/workflows/ci-release.yml`.
- Browser runtime - Angular 21 client with Leaflet map rendering.
- Nginx unprivileged Alpine - production serving and reverse proxy for the Angular app.

**Package Manager:**
- npm 10.9.4 declared by `frontend/package.json`; npm is also used for `backend/` and `site/`.
- Lockfiles are committed for `frontend/` and `backend/`; `site/` currently has no committed lockfile and is untracked.

## Frameworks

**Core:**
- Angular 21.2 - standalone frontend bootstrapped from `frontend/src/main.ts`.
- Express 5.2 - JSON API and health endpoint in `backend/server.js`.
- Leaflet 1.9 - interactive map in `frontend/src/app/map.component.ts`.
- Next.js 16 / React 19 through Vinext - separate placeholder site in `site/`, not wired into the main deployment.

**Testing:**
- Vitest 4 via Angular's unit-test builder for `frontend/src/app/app.spec.ts`.
- Node built-in test runner for `backend/test/scraper.test.js`.

**Build/Dev:**
- Angular CLI/build 21.2, TypeScript strict mode, Tailwind CSS 4, PostCSS, Docker Compose, and GitHub Actions.
- Vinext 1 beta, Vite 8, Wrangler 4, and the OpenAI Sites Vite plugin are isolated to `site/`.

## Key Dependencies

**Critical:**
- `axios` and `cheerio` - fetch and parse the public CAI Roma timetable in `backend/scraper.js`.
- `luxon` - locale-independent excursion date parsing and filtering.
- `cors` - API cross-origin policy configured in `backend/server.js`.
- `rxjs` and Angular HttpClient - frontend API access in `frontend/src/app/excursion.service.ts`.
- `@spartan-ng/brain` plus local Helm primitives - cards, buttons, and class composition under `frontend/libs/ui/`.

**Infrastructure:**
- `nginxinc/nginx-unprivileged` - serves static Angular output and proxies `/api/`.
- GitHub Container Registry - frontend/backend images published by `.github/workflows/ci-release.yml`.

## Configuration

**Environment:**
- Backend reads `PORT` and `CORS_ORIGIN` in `backend/server.js`; no environment file content was inspected.
- Frontend development proxies `/api` to port 3000 through `frontend/proxy.conf.json`.

**Build:**
- Angular options and production budgets live in `frontend/angular.json`.
- TypeScript aliases for local UI primitives live in `frontend/tsconfig.json`.
- Production containers are defined by `frontend/Dockerfile`, `backend/Dockerfile`, and `compose.yaml`.

## Platform Requirements

**Development:**
- Node.js 22, npm, and optionally Docker Compose.

**Production:**
- Two containers: Nginx frontend on port 8080 and Express backend on port 3000.
- The `site/` Cloudflare/OpenAI Sites prototype is a distinct deployment path and is not part of `compose.yaml` or CI.

---

*Stack analysis: 2026-08-29*
