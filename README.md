# Eagle Ford

Website for Eagle Ford dealership, powered by [Payload CMS](https://payloadcms.com) and [Next.js](https://nextjs.org).

## Tech stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **CMS:** Payload CMS 3 with MongoDB
- **Testing:** Vitest (integration), Playwright (e2e)

## Development

1. Copy environment variables: `cp .env.example .env`
2. Install dependencies: `pnpm install`
3. Start the dev server: `pnpm dev`
4. Open [http://localhost:3001](http://localhost:3001) for the website
5. Open [http://localhost:3001/admin](http://localhost:3001/admin) for the CMS

Changes in `./src` are reflected automatically during development.

### Useful commands

| Command               | Description                         |
| --------------------- | ----------------------------------- |
| `pnpm dev`            | Start development server            |
| `pnpm build`          | Production build                    |
| `pnpm start`          | Run production server               |
| `pnpm lint`           | Run ESLint                          |
| `pnpm lint:fix`       | Auto-fix lint issues                |
| `pnpm format:write`   | Format with Prettier                |
| `pnpm generate:types` | Regenerate Payload TypeScript types |
| `pnpm test`           | Run integration and e2e tests       |
| `pnpm test:int`       | Run Vitest integration tests        |
| `pnpm test:e2e`       | Run Playwright e2e tests            |

## Diagnostics

Developer role: **Settings → Diagnostics → Force Sentry Test Error** to confirm Sentry receives events in production (`SENTRY_DSN` required).

## Project structure

- `src/app/(frontend)/` — Public website routes
- `src/app/(payload)/` — Payload admin and API routes
- `src/collections/` — CMS collections (pages, vehicles, etc.)
- `src/globals/` — CMS globals (header, footer, settings)
- `src/lib/blocks/` — Layout builder blocks
- `src/components/analytics/` — GTM loaders and SPA event trackers (`page_view`, `form_submit`, `cta_click`)
- `src/constants/site.ts` — Site name and metadata constants

Google Tag Manager is enabled in CMS **Settings → Analytics**. See [AGENTS.md](AGENTS.md#analytics--google-tag-manager) for Consent Mode, dataLayer events, and GTM Custom Event trigger setup.

## Branding

Site branding is centralized in `src/constants/site.ts`:

- `SITE_NAME` — default site title (`Eagle Ford`)
- `formatPageTitle()` — consistent page title format (`Page Title | Eagle Ford`)
- `DEFAULT_OG_DESCRIPTION` — default Open Graph description

## Production deployment

Merging a PR to `main` automatically triggers the **Deploy Production** GitHub Actions workflow, which SSH-deploys to the VPS and rebuilds the Docker image.

| What | Where |
|---|---|
| Live site | https://www.eagleford.co.za |
| VPS app port | `127.0.0.1:4411` |
| Docker stack | `docker-compose.prod.yml` |
| Workflow file | `.github/workflows/deploy.yml` |

### Deploy flow

```
feature/fix → PR → develop → PR → staging → PR → main → Actions deploy.yml → VPS Docker build → live
```

Staging deploys to https://ford-stg.tallmancode.co.za (Basic Auth). Feature/fix PRs target `develop`. See workspace AGENTS.md.

### Manual re-deploy

Actions → **Deploy Production** → **Run workflow** → optionally tick **Skip rebuild** (for config-only changes that don't need a full image rebuild).

### Secrets

All secrets live in the **`production`** GitHub Environment (branch-scoped to `main`). See [AGENTS.md](AGENTS.md#deployment) for the full secret reference and `APP_ENV` contents.

### Local Docker build (VPS script reference)

```bash
# Start Mongo first, then build and run:
./scripts/docker-deploy-prod.sh
```

## Payload CMS

This project uses Payload CMS for content management. See the [Payload documentation](https://payloadcms.com/docs) for details on collections, fields, hooks, and plugins.
