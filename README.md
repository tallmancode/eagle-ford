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
4. Open [http://localhost:3000](http://localhost:3000) for the website
5. Open [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS

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

## Seeding

Use the **Seed** button in the admin dashboard to populate the database with sample content, forms, and vehicle data. Seeded content uses Eagle Ford branding.

## Project structure

- `src/app/(frontend)/` — Public website routes
- `src/app/(payload)/` — Payload admin and API routes
- `src/collections/` — CMS collections (pages, blogs, vehicles, etc.)
- `src/globals/` — CMS globals (header, footer, settings)
- `src/lib/blocks/` — Layout builder blocks
- `src/constants/site.ts` — Site name and metadata constants

## Branding

Site branding is centralized in `src/constants/site.ts`:

- `SITE_NAME` — default site title (`Eagle Ford`)
- `formatPageTitle()` — consistent page title format (`Page Title | Eagle Ford`)
- `DEFAULT_OG_DESCRIPTION` — default Open Graph description

## Production

```bash
pnpm build
pnpm start
```

See the [Payload deployment docs](https://payloadcms.com/docs/production/deployment) for hosting guidance.

## Payload CMS

This project uses Payload CMS for content management. See the [Payload documentation](https://payloadcms.com/docs) for details on collections, fields, hooks, and plugins.
