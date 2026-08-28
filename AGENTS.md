# Agents

**Payload CMS skill (canonical — workspace root only):** [`../.agents/skills/payload/SKILL.md`](../.agents/skills/payload/SKILL.md) — open `eagle-motor-company.code-workspace` so shared `.agents` is visible. Reference: [`../.agents/skills/payload/reference/`](../.agents/skills/payload/reference/). Brand `.agents/skills/payload/` is a pointer/legacy folder only — do not treat a local `SKILL.md` as canonical. Single-folder open: still use `../.agents/skills/payload/` on disk (sibling of this repo under Eagle Motor Company).

This app is a **satellite site** that consumes live stock from Eagle Motor City over HTTP — no local stock persistence. See the workspace root [`../AGENTS.md`](../AGENTS.md) for the full cross-project architecture, authentication setup, and local dev workflow.

**Related project:** [`../eagle-motor-city/AGENTS.md`](../eagle-motor-city/AGENTS.md) — Eagle Motor City mothership that ingests and serves stock data.

**Live reference:** https://www.eagleford.co.za/

## Stock (satellite — no local persistence)

- Fetches live stock from Motor City via `@/lib/motor-city-stock` (`fetchStock`, `getCachedStock`)
- For filter UIs, call Motor City's `GET /api/stock/[dealerCode]/filters` endpoint — see [`../eagle-motor-city/AGENTS.md`](../eagle-motor-city/AGENTS.md) for query params and response shape
- Admin view: **Live Stock** in the Payload sidebar under **Data Management**
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

## Form submission metrics API (read by Motor City)

Motor City’s admin dashboard pulls all form submissions (not only LMS) via:

- `GET /api/form-submissions/metrics`
- `GET /api/form-submissions/feed`
- Auth: `Authorization: Bearer <FORM_SUBMISSIONS_API_KEY>`
- Set `FORM_SUBMISSIONS_API_KEY` in this project’s `.env` / `APP_ENV`, and the matching `FORM_METRICS_EAGLE_FORD_*` values on Motor City

## CMS LMS leads (via Motor City)

- Opt-in per form in Payload admin: **Forms → [form] → CMS LMS Lead Injection**
- Enabled forms POST normalized leads to Motor City `POST /api/leads/site-forms` (same stock API key)
- Motor City owns CMS LMS credentials and the actual LMS push — this site never calls CMS LMS directly
- Implementation: `src/lib/motor-city-leads/`
- **Skill:** workspace `.cursor/skills/eagle-forms-lms-email/` — edit forms in admin; LMS floors / Mimecast / Motor City `POST /api/leads/site-forms` contract.
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

- **Live production only:** GTM, dataLayer events (`page_view` / `enquiry_submitted` / `cta_click`), Consent Mode updates, and the Facebook pixel run only when `NODE_ENV=production` **and** `ALLOW_SEARCH_INDEXING=true`. Staging and local/dev stay silent even if CMS GTM is enabled (`data-analytics="live"` on `<html>` is the client marker).
- When enabled on live, GTM **always loads** via `ConsentAwareGoogleTagManager`. Consent Mode (not mount gating) controls ads/analytics storage.
- Consent defaults are set `denied` in a `beforeInteractive` script in `src/app/(frontend)/layout.tsx`. `PrivacyProvider` / `updateGoogleConsent` grant or keep denied after the banner (or auto-grant for non-EU visitors).
- Client-side SPA events (App Router does not fire GTM History Change reliably):
- `page_view` — `{ event, page_path }` on route changes including query-string updates (`GTMPageView`)
- `enquiry_submitted` — `{ event, form_name, form_id, department, submission_id, gclid?, … }` on successful form submit (`FormBlockClient` / `pushEnquirySubmitted`). `form_id` comes from the form’s CMS **External ID** field (`forms.external_id`); `form_name` is the stable marketing slug from title matching.
- `cta_click` — `{ event, cta_name, cta_location, cta_href }` via delegated clicks on `[data-gtm-cta]` / `data-gtm-cta-location` (`GTMCtaClickTracker`)
- Last-touch ad attribution (`gclid` / `_gcl_aw` cookie / UTMs) captured client-side (`eagle-ford:attribution`, 90-day TTL) via `AttributionCapture` (Suspense-wrapped in layout), stored on form-submissions and forwarded to Motor City LMS via site-form-leads. A new ad click overwrites the stored gclid within the window.
- Forms: set **External ID** on each enquiry form in admin (e.g. `general_enquiry`, `sell_your_car`) — unique, sent to GTM as `form_id`.
- CTA Button / Button (v2) blocks have **Track click in Google Tag Manager** (`trackAsCta`, default on).
- Components: `src/components/analytics/ConsentAwareGoogleTagManager.tsx`, `GTMPageView.tsx`, `GTMCtaClickTracker.tsx`
- **GTM UI:** add Custom Event triggers for `page_view`, `enquiry_submitted`, and `cta_click` (do not rely on History Change or native Form Submit).
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

### v2 blocks and styling fields

New block work that needs editor-controlled layout lives under `src/lib/blocks/v2` (not v1 `src/lib/fields/layout-field`).

- Styling field factories + apply helpers: `@/lib/blocks/v2` (`PaddingField`, `StyleFields`, `applyStyles`, …)
- Brand defaults: `src/lib/blocks/v2/theme.ts` (copy the folder to another brand and edit this file)
- Skill: workspace `.cursor/skills/eagle-v2-styling-fields/`
- Do not mix v2 fields into existing Section/Row unless a migration is requested

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

Ship path (workspace `.cursor/rules/git-promotion-flow.mdc` + root `AGENTS.md` infrastructure map):

```
feature/fix → PR → develop → PR → staging → PR → main → deploy
```

- Merge to **`staging`** → manual **Deploy Staging** workflow → `https://ford-stg.tallmancode.co.za` (Basic Auth)
- Merge to **`main`** → `.github/workflows/deploy.yml` → live site
- Full VPS layout, compose names, and access control: workspace root [`../AGENTS.md`](../AGENTS.md)

### VPS layout (this brand)

| Resource        | Production                                                         | Staging                                                                                        |
| --------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| APP_DIR         | `/www/wwwroot/eagle/ford/production`                               | `/www/wwwroot/eagle/ford/staging`                                                              |
| App port        | `127.0.0.1:4411`                                                   | `127.0.0.1:5411`                                                                               |
| Mongo port      | `127.0.0.1:4422`                                                   | `127.0.0.1:5422`                                                                               |
| Compose project | `eagle-ford-production`                                            | `eagle-ford-staging`                                                                           |
| Hostname        | live domain                                                        | `ford-stg.tallmancode.co.za`                                                                   |
| Docker compose  | `docker-compose.prod.yml`                                          | same file + env ports                                                                          |
| Migrate runbook | [`docs/vps-migrate-production.md`](docs/vps-migrate-production.md) | —                                                                                              |
| Nginx conf      | —                                                                  | [`deploy/nginx/ford-stg.tallmancode.co.za.conf`](deploy/nginx/ford-stg.tallmancode.co.za.conf) |

Staging is Basic Auth protected. Satellite staging uses `MOTOR_CITY_STOCK_API_URL=http://127.0.0.1:5511`.

### GitHub Actions / secrets

- **CI** — `pull_request` to `develop` / `staging` / `main`
- Environments **staging** / **production**: `SSH_*`, `APP_DIR`, `APP_ENV`
- To enable AI SEO generation, include `ANTHROPIC_API_KEY` in `APP_ENV` (optional `ANTHROPIC_SEO_MODEL`, `AI_SEO_MONTHLY_BUDGET_USD`)
- Staging overrides force `https://ford-stg.tallmancode.co.za`, ports `5411`/`5422`, `MOTOR_CITY_STOCK_API_URL=http://127.0.0.1:5511`
- Health: `http://127.0.0.1:4411/api/health` (prod) / `5411` (staging); `lead-jobs` sidecar required

## Cursor Cloud specific instructions

Standard commands live in `README.md` / `package.json` (`pnpm dev`, `pnpm lint`, `pnpm test:int`, `pnpm build`). Notes below are only the non-obvious startup caveats for this cloud environment.

- **MongoDB is required and not auto-started.** The startup update script only runs `pnpm install`; it does not start services. Start Mongo before running the app or `pnpm test:int`: `sudo mongod --dbpath /var/lib/mongodb --bind_ip 127.0.0.1 --port 27017` (run it in a persistent tmux session). Verify with `mongosh --eval "db.runCommand({ ping: 1 })"`.
- **`.env` is git-ignored and must exist.** Copy `.env.example` to `.env` and set at minimum `DATABASE_URL=mongodb://127.0.0.1:27017/eagle-ford`, `PAYLOAD_SECRET`, and `NEXT_PUBLIC_SERVER_URL=http://localhost:3001`.
- **Dev server runs on port 3001** (`pnpm dev`), not 3000 — the `README.md` port 3000 reference is stale. Admin UI is at `/admin`.
- **Fresh DB has no pages**, so `/` returns 404 until content exists. Create the first admin user at `/admin` (create-first-user flow), then add a Page. A published page renders at its slug (e.g. `/hello-world`). Developer role: **Settings → Diagnostics → Force Sentry Test Error** to verify Sentry in production. The same tab shows **AI SEO usage** (token counts, estimated spend, remaining monthly budget). `ANTHROPIC_API_KEY` lives in env / `APP_ENV`, not in the CMS. After a deploy that hoists page blocks, run `pnpm migrate:section-top-level` so existing pages keep Content data.
- **The Nodemailer `ECONNREFUSED 127.0.0.1:587` error is harmless** in local/cloud dev — SMTP is optional and unconfigured. It appears during `generate:types`, `test:int`, and dev server startup but does not affect functionality.
- **Motor City stock API is a separate project** (`../eagle-motor-city`, not in this workspace) expected on port 3000. Stock/showroom features (`/showroom/*`, Live Stock admin view) will not return live data without it; the rest of the CMS/site works fine. The stock integration tests mock this API, so `pnpm test:int` passes without it.
