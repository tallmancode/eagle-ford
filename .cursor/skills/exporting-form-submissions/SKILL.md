---
name: exporting-form-submissions
description: Flatten Payload form-submissions to staff-friendly CSV for Google Sheets — list columns, import-export plugin, and flatten hooks. Use when adding or fixing form submission export across Eagle sites.
---

# Exporting Form Submissions (CSV)

Use when admins need to download **Form Submissions** as a flat CSV (Google Sheets) without JSON blobs or nested `submissionData` paths.

**Reference implementation:** `eagle-ford` (`src/lib/form-submissions/`, `src/components/admin/export/`).

## What admins get

List columns (all sites — `formSubmissionListAdmin`):

| Column | Source |
|--------|--------|
| Form | Relationship title |
| First Name / Last Name / Phone / Email | `submissionData` answers (field names must match) |
| Created At | Payload timestamp |

Export CSV pivots every form answer into its own column, plus upload fields as URLs/filenames.

## Rollout checklist (per brand)

1. **Copy modules** (from Ford):
   - `src/lib/form-submissions/contactFields.ts`
   - `src/lib/form-submissions/flattenSubmissionExport.ts`
   - `src/components/admin/export/patchExportCollectionFields.ts`
   - `src/components/admin/export/SyncExportPreview.tsx`

2. **Dependencies** (`package.json`):
   - `@payloadcms/plugin-import-export` (same Payload version as the app)
   - `@payloadcms/translations` (for export preview UI)

3. **`plugins/index.ts`**
   - `formSubmissionOverrides.admin` → `formSubmissionListAdmin`
   - `fields` → `withFormSubmissionExportFieldTweaks` + `getFormSubmissionContactFields()` + brand lead status fields
   - `hooks.beforeChange` → include `denormalizeSubmissionContactFields`
   - `importExportPlugin` with `flattenFormSubmissionExportBatch` on `form-submissions`

4. **Motor City only:** also export `site-form-leads` and `meta-leads` (already flat collections).

5. **Regenerate import map** after adding `SyncExportPreview`:

   ```powershell
   pnpm generate:importmap
   ```

6. **Verify**
   - Admin → Form Submissions list shows contact columns (legacy rows use `afterRead` fallback)
   - Admin → Form Submissions → Export → CSV preview has one column per answer
   - `pnpm test:int -- tests/int/flatten-submission-export.int.spec.ts` (Ford has tests)

## Do not

- Export raw `submissionData` / `submissionUploads` arrays to CSV (disable in field picker via `withFormSubmissionExportFieldTweaks`).
- Rely on virtual-only fields without `afterRead` fallback — list view breaks for existing submissions.
- Merge to `main` until reviewed — **do not deploy** unless the user asks.

## Column preferences

Payload stores per-user column visibility in the browser. If **Created At** is missing, use the list **Columns** menu to re-enable it; `defaultColumns` only applies to fresh preferences.
