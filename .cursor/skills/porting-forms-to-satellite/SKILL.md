---
name: porting-forms-to-satellite
description: >-
  Rebuild or upsert Payload CMS enquiry forms on Eagle satellites (Mazda,
  Suzuki, Mahindra) using Eagle Ford as the reference: form fixtures, upsert-by-title
  seed routes, department emails, LMS opt-in/mappings, and hidden vehicle context
  fields. Use when porting forms to a sibling brand, reseeding forms without
  duplicating docs, or aligning LMS/email patterns with Ford.
---

# Porting Forms to an Eagle Satellite

Eagle Ford is the **reference implementation**. Copy this skill into the sibling’s `.cursor/skills/`, then adapt fixtures — do not invent a divergent seed/LMS pattern.

Detailed tables (emails, dealers, form inventory): [reference.md](reference.md).

## When to use

- Porting or rebuilding enquiry forms on Mazda / Suzuki / Mahindra
- Adding upsert seed buttons so re-runs **overwrite by title** (never duplicate forms)
- Wiring CMS LMS lead injection + vehicle context fields
- Aligning From/To department emails with the brand matrix

## Architecture (copy from Ford)

| Piece | Ford path (relative after copy) | Role |
|-------|----------------------------------|------|
| Fixtures | `src/fixtures/form-fixtures/*.ts` | Form document shapes (fields, emails, LMS) |
| Email helpers | `src/fixtures/form-fixtures/formEmailHelpers.ts` | From + department To display names |
| Vehicle LMS fields | `src/fixtures/form-fixtures/vehicleLmsSeedFields.ts` | Hidden auto-filled VDP fields |
| Quote builder | `src/fixtures/form-fixtures/buildVehicleQuoteForm.ts` | Shared Used/New quote seed |
| Upsert seed | `src/lib/seed/createFormSeedRoute.ts` | Find-by-title → update or create |
| Seed routes | `src/app/(frontend)/next/create-*-form/route.ts` | Thin wrappers around `createFormSeedRoute` |
| Admin buttons | `src/lib/fields/seed-buttons/seedActions.ts` | `formSeedActions` labels/endpoints |
| LMS fields UI | `src/lib/motor-city-leads/formFields.ts` | Forms collection `lmsLeadInjection` group |
| LMS map | `src/lib/motor-city-leads/mapFormSubmission.ts` | Submission → Motor City lead body |
| LMS constants | `src/lib/motor-city-leads/constants.ts` | `siteKey`, brand defaults |
| Plugin wiring | `src/plugins/index.ts` | `getLmsLeadInjectionFields` + `injectFormSubmissionLead` |
| VDP context | `src/lib/stock-vehicle/buildVehicleFormContext.ts` | Prefill/hide vehicle LMS fields |

**Do not dump huge JSON into the sibling.** Copy/adapt TypeScript fixtures from Ford and brand-token strings.

## Non-negotiables

1. **Upsert by stable `title`** via `createFormSeedRoute` — overwrite existing forms; never create duplicates that break page/block/Settings references.
2. **LMS `source`:** always `EAGLE-DEALERWEBSITE` on every LMS-enabled form (override any brand-specific default in `constants.ts` if present).
3. **From email:** `"Eagle {Brand}" <noreply@eaglemc.co.za>` (Ford default; use brand-appropriate noreply only if the client already uses a different one).
4. **Email failure must not lose the submission.** Payload form-builder sends mail in `form-submissions` `afterChange` and **catches** send errors (`@payloadcms/plugin-form-builder` → `sendEmail` hook). Do not move sends into `beforeChange` or rethrow in a way that blocks create. Keep Sentry instrumentation that reports failures without preventing the catch from swallowing the error for the user response.
5. **Vehicle-related + LMS forms** include `vehicleLmsSeedFields` (or specials equivalents); frontend hides/prefills via form context (`buildVehicleFormContext` / specials context).

## Porting checklist

Copy and track:

```
Port progress:
- [ ] 1. Copy this skill to sibling `.cursor/skills/porting-forms-to-satellite/`
- [ ] 2. Confirm Motor City stock API key + site-forms leads work for this brand
- [ ] 3. Brand-token `formEmailHelpers.ts` (From + DEPARTMENT_EMAILS — see reference.md)
- [ ] 4. Update `motor-city-leads/constants.ts` (`MOTOR_CITY_SITE_KEY`, brand, default model)
- [ ] 5. Set `dealerRef` + floors from brand matrix; LMS source = EAGLE-DEALERWEBSITE
- [ ] 6. Copy/adapt fixtures + seed routes + `formSeedActions`
- [ ] 7. Replace brand copy (privacy label, email subjects, model lists)
- [ ] 8. Wire Settings showroom / new-vehicle quote forms if those Settings fields exist
- [ ] 9. Admin → Upsert each form (verify “updated” not duplicate creates)
- [ ] 10. Spot-check one LMS form + one email-only form end-to-end
```

## Brand tokens (summary)

Replace every `Eagle Ford` / `Ford` / `EC167` / `NEWFORD` / `eagle-ford` with the sibling equivalents.

| Token | Ford | Sibling action |
|-------|------|----------------|
| Display From | `"Eagle Ford" <noreply@eaglemc.co.za>` | `"Eagle {Brand}" <noreply@eaglemc.co.za>` |
| Sales To | Keep existing `sales@{brand-domain}` | Same domain address; display name `"Sales"` (or brand Sales) |
| Service / Parts / shared depts | See [reference.md](reference.md) | Use matrix addresses; display `"Service"`, `"Parts"`, etc. |
| CMS dealer code | `EC167` | Brand row in reference table |
| New-vehicle floor | `NEWFORD` | `NEWMAZDA` / `NEWSUZUKI` / `NEWMAHINDRA` |
| Used floor | `USED` | `USED` |
| Call centre | `CALLCENTRE` | All brands including Suzuki general enquiry |
| `MOTOR_CITY_SITE_KEY` | `eagle-ford` | `eagle-mazda` / `eagle-suzuki` / `eagle-mahindra` |
| `LMS_DEFAULT_BRAND` | `Ford` | Brand name string LMS expects |

**Sales:** keep that brand’s existing sales mailbox address; only set the display name (e.g. `"Eagle Mazda" <sales@eaglemazda.co.za>` or `"Sales" <sales@…>` — match Ford’s `"Sales" <sales@eagleford.co.za>` style unless client asks otherwise). Do not invent a sales address.

**Price Your Car / Sell:** use `"Price Your Car" <PriceYourCar@eagleford.co.za>` on **every** brand (shared mailbox).

## LMS mapping rules

- Opt-in per form: `lmsLeadInjection.enabled`
- Required when enabled: `dealerRef`, `dealerFloor`, `source` (`EAGLE-DEALERWEBSITE`)
- Defaults: `defaultBrand`, `defaultModel` (often `General Enquiry`), `defaultUsed` (`0` new / `1` used)
- Explicit `fieldMappings` for non-obvious names; common names (`firstName`, `phone`, `email`, `model`, `message`, …) auto-map in `mapFormSubmission.ts`
- Leftover fields append into `seeks.comments` (privacy/consent skipped)

### Ford floor → sibling analogy

| Form intent | Ford floor | Sibling floor |
|-------------|------------|---------------|
| New vehicle quote / special offer / test drive | `NEWFORD` | Brand `NEW*` floor |
| Used vehicle quote | `USED` | `USED` |
| General enquiry | `CALLCENTRE` | `CALLCENTRE` (including Suzuki) |
| Service / parts / paint / wheel / sell | LMS **off** on Ford | Keep off unless client requests LMS |

Dealer floor availability differs by brand — see [reference.md](reference.md).

## Forms to port (Ford set)

LMS **on:** New Vehicle Quote, Used Vehicle Quote, General Enquiry, Special Offer Enquiry, Test Drive Booking.  
LMS **off:** Paint & Panel, Parts, Sell (Price Your Car), Service Booking, Wheel & Tyre.  
Also: generic Vehicle Quote (legacy — prefer Used/New).

Titles, seed button labels, thank-you slugs, and key mappings: [reference.md](reference.md).

## Seed route pattern

```ts
// src/app/(frontend)/next/create-enquiry-form/route.ts
import { generalEnquiryForm } from '@/fixtures/form-fixtures/general-enquiry-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const POST = createFormSeedRoute({
  formName: 'General Enquiry Form',
  getFormData: () => generalEnquiryForm,
  errorMessage: 'Error upserting general enquiry form.',
  thankYouPageSlug: 'sales-form-submitted', // optional; only if page exists
})
```

Admin label must say **Upsert** … and `allowRetry: true`.

## Workflow for siblings

1. Copy `.cursor/skills/porting-forms-to-satellite/` from Ford into the sibling repo.
2. Copy the Ford files in the architecture table; search-replace brand tokens.
3. Apply [reference.md](reference.md) email + dealer matrices.
4. Run admin Upsert buttons (or POST seed routes while logged in).
5. Confirm form IDs on pages/Settings unchanged after re-seed (`upserted: 'updated'`).

## Do not

- Create a second form with a slightly different title when one already exists
- Call CMS LMS directly from the satellite (always Motor City `POST /api/leads/site-forms`)
- Hardcode production form Mongo IDs in seed routes (title upsert is enough)
- Invent department mailboxes not in the matrix / not confirmed by the client
