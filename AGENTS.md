# Agents

This project uses the Payload CMS skill at `.agents/skills/payload/`.
Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.

This app is a **satellite site** that consumes live stock from Eagle Motor City over HTTP — no local stock persistence. See the workspace root [`../AGENTS.md`](../AGENTS.md) for the full cross-project architecture, authentication setup, and local dev workflow.

**Related project:** [`../eagle-motor-city/AGENTS.md`](../eagle-motor-city/AGENTS.md) — Eagle Motor City mothership that ingests and serves stock data.

## Stock (satellite — no local persistence)

- Fetches live stock from Motor City via `@/lib/motor-city-stock` (`fetchStock`, `getCachedStock`)
- For filter UIs, call Motor City's `GET /api/stock/[dealerCode]/filters` endpoint — see [`../eagle-motor-city/AGENTS.md`](../eagle-motor-city/AGENTS.md) for query params and response shape
- Admin view: **Live Stock** link in the Payload sidebar (below nav groups)
- Requires env: `MOTOR_CITY_STOCK_API_URL`, `MOTOR_CITY_STOCK_API_KEY`, `MOTOR_CITY_STOCK_BRAND_KEY=ford`
- Data is cached in Next.js only — do **not** create stock collections or write to the Ford database
- Dev server runs on port **3001** (Motor City runs on 3000)

## Block Creation Rules

### Vehicle Template Blocks

- Use this pattern for vehicle-page template sections whose data comes from the active vehicle.
- Create files under `src/lib/blocks/vehicle-<name>-block/` with:
  - `<Name>Block.ts` for Payload block config
  - `components/<Name>BlockComponent.tsx` for render entry
  - optional `components/<Name>.tsx` for extracted UI
- Keep block schema minimal (`fields: []`) unless editors must configure content manually.
- In render components, read vehicle data from `meta.vehicle` (`BlockRenderMeta`) and return `null` if absent.
- Register every new vehicle block in:
  - `src/lib/blocks/index.ts`
  - `src/lib/blocks/RenderBlocks.tsx` (`payload-types` import, `BlockComponentMap`, and `blockComponents`)
  - `src/lib/blocks/section-block/blockRefs.ts` (`allBlockRefs` — required for the block to appear in section/template pickers)
- If schema changes add a new block interface/slug, run `pnpm generate:types`.

### Vehicle Model Template Blocks

- Use this pattern for model detail page sections whose data comes from the active model (and parent vehicle).
- Create files under `src/lib/blocks/vehicle-model-<name>-block/` with the same split as vehicle blocks.
- Keep block schema minimal (`fields: []`) unless editors must configure content manually.
- In render components, read from `meta.vehicleModel` and (when needed) `meta.vehicle`; return `null` if required data is absent.
- Register every new vehicle-model block in the same three places as vehicle blocks (`index.ts`, `RenderBlocks.tsx`, `blockRefs.ts`).
- Model page templates live in the `vehicle-model-templates` collection and are selected on the parent vehicle via the sidebar **Model Page Template** field (`modelTemplate`). All models under that vehicle share the same layout.
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
