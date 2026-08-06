# Agents

This project uses the Payload CMS skill at `.agents/skills/payload/`.
Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.

This app is a **satellite site** that consumes live stock from Eagle Motor City over HTTP — no local stock persistence. See the workspace root [`../AGENTS.md`](../AGENTS.md) for the full cross-project architecture, authentication setup, and local dev workflow.

**Related project:** [`../eagle-motor-city/AGENTS.md`](../eagle-motor-city/AGENTS.md) — Eagle Motor City mothership that ingests and serves stock data.

**Live reference:** https://www.eagleford.co.za/

## Stock (satellite — no local persistence)

- Fetches live stock from Motor City via `@/lib/motor-city-stock` (`fetchStock`, `getCachedStock`)
- For filter UIs, call Motor City's `GET /api/stock/[dealerCode]/filters` endpoint — see [`../eagle-motor-city/AGENTS.md`](../eagle-motor-city/AGENTS.md) for query params and response shape
- Admin view: **Live Stock** link in the Payload sidebar (below nav groups)
- Requires env: `MOTOR_CITY_STOCK_API_URL`, `MOTOR_CITY_STOCK_API_KEY`
- Auth header: `Authorization: stock-api-clients API-Key <key>`
- Stock requests return all enabled dealer feeds from Motor City (no brand-key scoping on the Ford side)
- Data is cached in Next.js only — do **not** create stock collections or write to the Ford database
- HTTP layer uses timeout + bounded retry (`fetchMotorCityJson`); successful responses keep `next: { revalidate: 300 }` / `unstable_cache`
- Failures report to Sentry (`captureStockFetchEvent`); archive UI soft-fails filters when the list still loads
- Dev server runs on port **3001** (Motor City runs on 3000)

### Motor City API key (required — not inventable)

1. Start Eagle Motor City (`cd ../eagle-motor-city && pnpm dev` → http://localhost:3000)
2. Admin → **Stock → Stock API Clients** → create client e.g. "Eagle Ford" → generate key
3. Copy into this project's `.env` as `MOTOR_CITY_STOCK_API_KEY` (same key for stock reads and site-form leads)

## CMS LMS leads (via Motor City)

- Opt-in per form in Payload admin: **Forms → [form] → CMS LMS Lead Injection**
- Enabled forms POST normalized leads to Motor City `POST /api/leads/site-forms` (same stock API key)
- Motor City owns CMS LMS credentials and the actual LMS push — this site never calls CMS LMS directly
- Implementation: `src/lib/motor-city-leads/`
- **Skill:** `.cursor/skills/porting-forms-to-satellite/` documents how Ford forms / LMS / email patterns were rolled out to sibling satellites. CMS seed upserts were removed; edit forms in admin going forward.
- **Lead paths audited:** Payload form-submissions (form block + multi-step uploads) are the only LMS opt-in source. There are no webhook-originated LMS lead routes on this satellite.
- **Durability:** form-submission documents are the durable store. On transient Motor City failures the submission is marked `pending_retry` with `motorCityLeadNextRetryAt` / attempt count. `extLeadRef` is the form-submission id (idempotent on Motor City).
- **Retries:** short in-request backoff (up to 3 attempts), then Payload jobs (`forwardMotorCityLead` + `sweepMotorCityLeads` every 5 minutes on queue `motor-city-leads`). Production needs `CRON_SECRET` and the `lead-jobs` sidecar in `docker-compose.prod.yml` polling `/api/payload-jobs/run?queue=motor-city-leads`.
- **Sentry:** failures report via `captureLeadForwardEvent` with scrubbed context (no contact PII / API keys).

## Branding / theming

Configurable tokens live in:

- `src/styles/base.css` — CSS variables (Ford deep blue primary palette; `--color-primary-*` scale at ~265deg hue)
- `src/app/(frontend)/globals.css` — `--font-brand` / Tailwind theme wiring
- `src/app/(frontend)/layout.tsx` — Ford F-1 webfonts (`src/assets/fonts/FordF-1-*.woff2`; `--font-ford-f1`, body class `font-ford`)
- `src/constants/site.ts` — site name / OG defaults (`DEFAULT_OG_IMAGE_PATH` → `/og-default.png`)
- Header/Footer/Settings globals in Payload for logos, nav, contact
- Search indexing is gated by `ALLOW_SEARCH_INDEXING=true` (staging stays noindex). See `src/constants/crawlerPolicy.ts`.

## Analytics / Google Tag Manager

Configured in Payload **Settings → Analytics** (`enableGoogleTagManager` + `googleTagManagerId`). No `NEXT_PUBLIC_GTM_ID` env var — the container ID lives in CMS.

- When enabled, GTM **always loads** via `ConsentAwareGoogleTagManager`. Consent Mode (not mount gating) controls ads/analytics storage.
- Consent defaults are set `denied` in a `beforeInteractive` script in `src/app/(frontend)/layout.tsx`. `PrivacyProvider` / `updateGoogleConsent` grant or keep denied after the banner (or auto-grant for non-EU visitors).
- Client-side SPA events (App Router does not fire GTM History Change reliably):
  - `page_view` — `{ event, page_path }` on route changes (`GTMPageView`)
  - `form_submit` — `{ event, form_id, form_name }` on successful form submit (`FormBlockClient`)
  - `cta_click` — `{ event, cta_name, cta_location, cta_href }` via delegated clicks on `[data-gtm-cta]` / `data-gtm-cta-location` (`GTMCtaClickTracker`)
- Components: `src/components/analytics/ConsentAwareGoogleTagManager.tsx`, `GTMPageView.tsx`, `GTMCtaClickTracker.tsx`
- **GTM UI:** add Custom Event triggers for `page_view`, `form_submit`, and `cta_click` (do not rely on History Change alone).
- **Skill:** `.cursor/skills/adding-gtm/` is the rollout playbook for sibling Eagle satellites (Mazda/Suzuki/Mahindra) — copy this Ford reference implementation, do not invent a divergent pattern.

## Vehicle Catalog Hierarchy

Three tiers — only vehicles and models have public pages:

| Collection         | Role                                               | Public URL                                     |
| ------------------ | -------------------------------------------------- | ---------------------------------------------- |
| `vehicles`         | Range/family (e.g. Next Level Ranger)              | `/vehicles/{vehicleSlug}`                      |
| `vehicle-models`   | Trim/series (e.g. Ranger Sport, XLT)               | `/vehicles/{vehicleSlug}/{modelSlug}`          |
| `vehicle-variants` | Configuration (e.g. 2.0 SiT Double Cab XL 4x2 6MT) | **No page** — listed in-page on the model page |

- Variants use slugs unique **per model**, not globally.
- Specials link to `vehicleVariant`; public href goes to the parent model page (optionally `#variant-{slug}`).
- Model page templates live in `vehicle-model-templates` and are selected per model via the sidebar **Page Template** field (`template`).

## Block Creation Rules

### Vehicle Template Blocks

- Use this pattern for vehicle-page template sections whose data comes from the active vehicle.
- Create files under `src/lib/blocks/vehicle-<name>-block/` with:
  - `<Name>Block.ts` for Payload block config
  - `components/<Name>BlockComponent.tsx` for render entry
  - optional `components/<Name>.tsx` for extracted UI
- Keep block schema minimal (`fields: []`) unless editors must configure content manually.
- In render components, read vehicle data from `meta.vehicle` (`BlockRenderMeta`) and return `null` if absent.
- Vehicle blocks that list trims should query `vehicle-models` for the active vehicle.
- Register every new vehicle block in:
  - `src/lib/blocks/index.ts`
  - `src/lib/blocks/RenderBlocks.tsx` (`payload-types` import, `BlockComponentMap`, and `blockComponents`)
  - `src/lib/blocks/section-block/blockRefs.ts` (`allBlockRefs` — required for the block to appear in section/template pickers)
- If schema changes add a new block interface/slug, run `pnpm generate:types`.

### Vehicle Model Template Blocks

- Use this pattern for model (trim) page sections whose data comes from the active model, parent vehicle, and optionally a variant context.
- Create files under `src/lib/blocks/vehicle-model-<name>-block/` with the same split as vehicle blocks.
- Keep block schema minimal (`fields: []`) unless editors must configure content manually.
- In render components, read from `meta.vehicleModel` and (when needed) `meta.vehicle` or `meta.vehicleVariant`; return `null` if required data is absent.
- Use `vehicle-model-variants` (or similar) to list configurations on the model page — variants have no dedicated routes.
- Register every new vehicle-model block in the same three places as vehicle blocks (`index.ts`, `RenderBlocks.tsx`, `blockRefs.ts`).
- Model pages render at `/vehicles/{vehicleSlug}/{modelSlug}`.

### Normal Blocks

- Use this pattern for reusable content blocks that editors configure directly.
- Define explicit editor-managed fields in the block config.
- Include meaningful `labels` and a logical `admin.group`; add admin thumbnail/label components when useful.
- Place files under `src/lib/blocks/<name>-block/` with clear split between schema and UI components.
- Register in:
  - `src/lib/blocks/index.ts`
  - `src/lib/blocks/RenderBlocks.tsx`
  - `src/lib/blocks/section-block/blockRefs.ts` (`allBlockRefs` — required for the block to appear in section/template pickers)
- Run `pnpm generate:types` after block schema changes.

### Quick Checklist

- Create block config + component(s)
- Register in block index, renderer map, and `section-block/blockRefs.ts`
- Regenerate Payload types if schema changed
- Verify rendering on frontend and visibility in Payload admin block picker

## Deployment

### Overview

Promotion path (always prefer this):

```
feature/fix branch → PR → develop → PR → staging → PR → main → GitHub Actions deploy.yml → VPS (Docker) → eagleford.co.za
```

- **`develop`** — integration branch; all feature/fix PRs target this.
- **`staging`** — Git promotion gate only (no separate staging deploy environment).
- **`main`** — production; merging here triggers deploy.

Hotfixes should still prefer the full path; skip steps only for production emergencies.

`eagle-ford-dev.tallmancode.co.za` is a 301 redirect to production (not a live staging stack).

### VPS layout

| Resource | Value |
|---|---|
| App port | `127.0.0.1:4411` (nginx proxies to this) |
| Mongo port | `127.0.0.1:4422` |
| Docker compose file | `docker-compose.prod.yml` |
| Deploy script | `scripts/docker-deploy-prod.sh` |
| Live site | `https://www.eagleford.co.za` |

Nginx (aaPanel) serves two vhosts from the same VPS:
- `www.eagleford.co.za` + apex → proxy to `:4411`
- `eagle-ford-dev.tallmancode.co.za` → 301 redirect to `https://www.eagleford.co.za` (config: `deploy/nginx/eagle-ford-dev.redirect.conf`)

### GitHub Actions — `ci.yml` + `deploy.yml`

**CI** (`.github/workflows/ci.yml`): runs on pull requests targeting `develop`, `staging`, or `main` — lint, TypeScript check, and integration tests.

**Deploy** (`.github/workflows/deploy.yml`): triggered by **push to `main`** (i.e. promotion merge) and `workflow_dispatch`.

The deploy workflow:
1. SSH into the VPS
2. `git reset --hard origin/main` in the app directory
3. Uploads `.env` from the `APP_ENV` secret
4. Force-applies production env overrides (URL, indexing, Sentry env, Motor City URL)
5. Runs `scripts/docker-deploy-prod.sh` → builds Docker image → starts `app` + `mongo`
6. Health-checks `http://127.0.0.1:4411/api/health`

**Manual re-deploy** (no code change): Actions → Deploy Production → Run workflow → optionally tick `skip_rebuild`.

### GitHub Environment — `production`

All deploy secrets live in the **`production`** environment (branch-scoped to `main`).

| Secret | Description |
|---|---|
| `SSH_KEY` | Private key for VPS SSH access |
| `SSH_HOST` | VPS IP or hostname |
| `SSH_USER` | SSH user (must be in `docker` group) |
| `APP_ENV` | Full `.env` content uploaded to VPS on each deploy |
| `SSH_PORT` | Optional — defaults to `22` |
| `APP_DIR` | Optional — defaults to `/www/wwwroot` |

### `APP_ENV` secret (required contents)

```env
NEXT_PUBLIC_SERVER_URL=https://www.eagleford.co.za

DATABASE_URL=mongodb://mongo:27017/eagle-ford-dev
BUILD_DATABASE_URL=mongodb://127.0.0.1:4422/eagle-ford-dev

PAYLOAD_SECRET=<secret>
CRON_SECRET=<secret>
PREVIEW_SECRET=<secret>
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=<secret>

MOTOR_CITY_STOCK_API_URL=https://www.eaglemotorcity.co.za
MOTOR_CITY_STOCK_API_KEY=<key from Motor City live admin>

SMTP_HOST=za-smtp-outbound-1.mimecast.co.za
SMTP_PORT=587
SMTP_USER=noreply@eaglemc.co.za
SMTP_PASS=<password>

SENTRY_DSN=<dsn>
NEXT_PUBLIC_SENTRY_DSN=<dsn>
SENTRY_AUTH_TOKEN=<token>
SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production

ALLOW_SEARCH_INDEXING=true
```

Key points:
- `MOTOR_CITY_STOCK_API_KEY` must come from the **live** Motor City admin (`www.eaglemotorcity.co.za/admin → Stock → Stock API Clients`). Dev keys from the staging Motor City instance will not work.
- `SMTP_PORT=587` uses STARTTLS — the Nodemailer adapter is configured to enforce TLS upgrade automatically.
- Form/SMTP send failures (e.g. Mimecast `535` / `EAUTH`) report to Sentry via `captureEmailSendEvent` (scrubbed; no `SMTP_PASS`, recipient addresses, or message bodies).
- The workflow force-overwrites `NEXT_PUBLIC_SERVER_URL`, `ALLOW_SEARCH_INDEXING`, `SENTRY_ENVIRONMENT`, `NEXT_PUBLIC_SENTRY_ENVIRONMENT`, and `MOTOR_CITY_STOCK_API_URL` on every deploy as a safety net.

### Lead jobs sidecar

The `lead-jobs` service in `docker-compose.prod.yml` polls `/api/payload-jobs/run?queue=motor-city-leads` every 60 seconds to retry pending Motor City lead forwards. It requires `CRON_SECRET` in the env and will exit on startup if the secret is missing.

### Docker build notes

The image is built with `--secret id=env,src=.env --network=host` so `BUILD_DATABASE_URL` (pointing at the host-published Mongo port `4422`) is reachable during the Next.js build phase.

### Debugging production (Docker MCP)

A read-only Docker MCP server named **`docker-prod-motor-city`** (Cursor may show it as `user-docker-prod-motor-city`) connects to the **Motor City** production VPS Docker daemon over SSH. Use it when stock/leads issues need live container or runtime checks on the mothership (compose/ps, logs, health) instead of guessing from code alone.

Full details: [`../eagle-motor-city/AGENTS.md`](../eagle-motor-city/AGENTS.md) → **Debugging production (Docker MCP)**. Config lives in the developer’s global Cursor MCP (`~/.cursor/mcp.json`), not in this repo.

## Cursor Cloud specific instructions

Standard commands live in `README.md` / `package.json` (`pnpm dev`, `pnpm lint`, `pnpm test:int`, `pnpm build`). Notes below are only the non-obvious startup caveats for this cloud environment.

- **MongoDB is required and not auto-started.** The startup update script only runs `pnpm install`; it does not start services. Start Mongo before running the app or `pnpm test:int`: `sudo mongod --dbpath /var/lib/mongodb --bind_ip 127.0.0.1 --port 27017` (run it in a persistent tmux session). Verify with `mongosh --eval "db.runCommand({ ping: 1 })"`.
- **`.env` is git-ignored and must exist.** Copy `.env.example` to `.env` and set at minimum `DATABASE_URL=mongodb://127.0.0.1:27017/eagle-ford`, `PAYLOAD_SECRET`, and `NEXT_PUBLIC_SERVER_URL=http://localhost:3001`.
- **Dev server runs on port 3001** (`pnpm dev`), not 3000 — the `README.md` port 3000 reference is stale. Admin UI is at `/admin`.
- **Fresh DB has no pages**, so `/` returns 404 until content exists. Create the first admin user at `/admin` (create-first-user flow), then add a Page. A published page renders at its slug (e.g. `/hello-world`). Developer role: **Settings → Diagnostics → Force Sentry Test Error** to verify Sentry in production.
- **The Nodemailer `ECONNREFUSED 127.0.0.1:587` error is harmless** in local/cloud dev — SMTP is optional and unconfigured. It appears during `generate:types`, `test:int`, and dev server startup but does not affect functionality.
- **Motor City stock API is a separate project** (`../eagle-motor-city`, not in this workspace) expected on port 3000. Stock/showroom features (`/showroom/*`, Live Stock admin view) will not return live data without it; the rest of the CMS/site works fine. The stock integration tests mock this API, so `pnpm test:int` passes without it.
