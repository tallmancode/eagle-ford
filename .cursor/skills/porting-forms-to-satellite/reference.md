# Forms porting — reference tables

Companion to [SKILL.md](SKILL.md). Eagle Ford paths are relative to the satellite repo root after copying the Ford pattern.

## Brand email matrix (authoritative for porting)

Use **display name** + address as shown. Capitalization of local-parts should match the client mailboxes below.

### From (all forms)

| Brand | From |
|-------|------|
| Ford (default) | `"Eagle Ford" <noreply@eaglemc.co.za>` |
| Mazda | `"Eagle Mazda" <noreply@eaglemc.co.za>` |
| Suzuki | `"Eagle Suzuki" <noreply@eaglemc.co.za>` |
| Mahindra | `"Eagle Mahindra" <noreply@eaglemc.co.za>` |

Only change noreply if that brand already uses a different confirmed address.

### Department To addresses

| Dept | Display | Ford | Mazda | Mahindra | Suzuki |
|------|---------|------|-------|----------|--------|
| Sales | `"Sales"` | `sales@eagleford.co.za` | existing `sales@eaglemazda.co.za` (do not invent) | existing `sales@…` for brand | existing `sales@…` for brand |
| Service | `"Service"` | `Serviceford@eaglemc.co.za` | `Servicemazda@eaglemc.co.za` | `Servicemahindra@eaglemc.co.za` | `Servicesuzuki@eaglemc.co.za` |
| Parts | `"Parts"` | `FordParts@eagleford.co.za` | `MazdaParts@eaglemazda.co.za` | `MahindraParts@eaglemahindra.co.za` | `SuzukiParts@eaglesuzuki.co.za` |
| Wheel & Tyre | `"Wheel and Tyre"` | `Wheelandtyre@eaglemc.co.za` (shared) | same | same | same |
| Paint & Panel | `"Paint and Panel"` | `Paintandpanel@eaglemc.co.za` (shared) | same | same | same |
| Price Your Car / Sell | `"Price Your Car"` | `PriceYourCar@eagleford.co.za` (shared across all brands) | same | same | same |

Example encoded values (Ford):

```ts
'"Service" <Serviceford@eaglemc.co.za>'
'"Parts" <FordParts@eagleford.co.za>'
'"Wheel and Tyre" <Wheelandtyre@eaglemc.co.za>'
'"Paint and Panel" <Paintandpanel@eaglemc.co.za>'
'"Price Your Car" <PriceYourCar@eagleford.co.za>'
```

Ford helpers live in `src/fixtures/form-fixtures/formEmailHelpers.ts` (`DEPARTMENT_EMAILS` + `EAGLE_FORD_EMAIL_FROM`). Sell Enquiry uses `DEPARTMENT_EMAILS.priceYourCar`.

## LMS dealers and floors

| Dealer | CMSDealerCode (`dealerRef`) | DealerFloors |
|--------|----------------------------|--------------|
| Eagle Ford | `EC167` | `NEWFORD`, `NEWMAZDA`, `USED` |
| Eagle Mahindra | `EC170` | `NEWMAHINDRA`, `USED`, `CALLCENTRE` |
| Eagle Mazda | `ECM491` | `NEWMAZDA`, `USED`, `CALLCENTRE` |
| Eagle Suzuki | `EC004` | `NEWSUZUKI`, `USED` |

**All LMS forms:** `source: 'EAGLE-DEALERWEBSITE'`.

**General enquiry floor:** use `CALLCENTRE` on every brand, including **Suzuki** (canonical LMS spelling is `CALLCENTRE`, not `CALLCENTER`). Ford General Enquiry already uses this; siblings should match even when the dealer floor table above does not list `CALLCENTRE` for that dealer.

### Ford form → floor / used flag

| Form title | LMS | dealerFloor | defaultUsed | Notes |
|------------|-----|-------------|-------------|-------|
| New Vehicle Quote | On | `NEWFORD` | `0` | + full vehicle field mappings |
| Used Vehicle Quote | On | `USED` | `1` | + full vehicle field mappings |
| Vehicle Quote (generic) | Prefer migrate to Used/New | — | — | Legacy; Settings should use Used/New |
| General Enquiry Form | On | `CALLCENTRE` | `0` | `message` → `seeks.comments` |
| Special Offer Enquiry Form | On | `NEWFORD` | `0` | `modelName`→model, `vehicleName`→modelrange |
| Test Drive Booking Form | On | `NEWFORD` | `0` | `model`→model |
| Paint & Panel Enquiry Form | Off | — | — | Email only |
| Parts Enquiry Form | Off | — | — | Email only |
| Sell Enquiry Form | Off | — | — | Multi-step; email only → PriceYourCar |
| Service Booking Form | Off | — | — | Brand model select list |
| Wheel & Tyre Enquiry Form | Off | — | — | Email only |

Sibling analogy: replace `NEWFORD` with that brand’s `NEW*` floor; keep `USED`; general enquiry always `CALLCENTRE`.

## Form inventory + seed buttons

| Form title | Fixture | Seed route | Admin button label |
|------------|---------|------------|-------------------|
| Sell Enquiry Form | `sell-enquiry-form.ts` | `/next/create-sell-form` | Upsert Sell Enquiry Form |
| General Enquiry Form | `general-enquiry-form.ts` | `/next/create-enquiry-form` | Upsert General Enquiry Form |
| Paint & Panel Enquiry Form | `paint-panel-enquiry-form.ts` | `/next/create-paint-panel-form` | Upsert Paint & Panel Enquiry Form |
| Parts Enquiry Form | `parts-enquiry-form.ts` | `/next/create-parts-form` | Upsert Parts Enquiry Form |
| Wheel & Tyre Enquiry Form | `wheel-tyre-enquiry-form.ts` | `/next/create-wheel-tyre-form` | Upsert Wheel & Tyre Enquiry Form |
| Service Booking Form | `service-booking-form.ts` | `/next/create-service-form` | Upsert Service Booking Form |
| Test Drive Booking Form | `test-drive-form.ts` | `/next/create-test-drive-form` | Upsert Test Drive Booking Form |
| Special Offer Enquiry Form | `special-offer-enquiry-form.ts` | `/next/create-special-offer-form` | Upsert Special Offer Enquiry Form |
| Vehicle Quote | `vehicle-quote-form.ts` | `/next/create-vehicle-quote-form` | Upsert Vehicle Quote Form |
| Used Vehicle Quote | `used-vehicle-quote-form.ts` | `/next/create-used-vehicle-quote-form` | Upsert Used Vehicle Quote Form |
| New Vehicle Quote | `new-vehicle-quote-form.ts` | `/next/create-new-vehicle-quote-form` | Upsert New Vehicle Quote Form |

Shared helpers: `formEmailHelpers.ts`, `buildVehicleQuoteForm.ts`, `vehicleLmsSeedFields.ts`, `thankYouPages.ts`.

### Thank-you page slugs (Ford)

| Constant | Slug | Used by |
|----------|------|---------|
| `SALES_THANK_YOU_SLUG` | `sales-form-submitted` | Sales-ish forms (enquiry, test drive, special, sell, …) |
| `SERVICE_THANK_YOU_SLUG` | `service-form-submitted` | Service booking |
| `VEHICLE_QUOTE_THANK_YOU_SLUG` | `sales-form-submitted` | Used/New quote seeds |

`createFormSeedRoute` only switches to redirect if the page exists; otherwise keeps on-page confirmation message.

## Key LMS field mappings (Ford)

### Vehicle quotes (`buildVehicleQuoteForm`)

`brand`, `model`, `modelRange`, `year`, `mileage`, `stockNumber`, `mmCode`, `colour`, `price`, `vin`, `regNo`, `message` → corresponding `seeks.*` paths (see fixture).

Hidden/prefilled field names: `vehicleLmsSeedFields.ts` / `VEHICLE_LMS_FIELD_NAMES` in `buildVehicleFormContext.ts`.

### Special Offer

- `modelName` → `seeks.model`
- `vehicleName` → `seeks.modelrange`
- `message` → `seeks.comments`
- Also include specials context fields (`specialTitle`, `specialCategory`, …) as needed for email templates

### Test Drive / General Enquiry

- Test drive: `model` → `seeks.model`; `message` → `seeks.comments`
- General: `message` → `seeks.comments`; defaults brand/model for LMS required seeks

## Email durability

Plugin hook (do not break this contract):

`node_modules/@payloadcms/plugin-form-builder/dist/collections/FormSubmissions/hooks/sendEmail.js`

- Runs on `afterChange` of **create** only (submission already persisted)
- Per-recipient `try/catch` logs and continues
- Outer `try/catch` logs without failing the request

Satellite Sentry wrapper (`src/lib/email/createInstrumentedEmailAdapter.ts`) may rethrow for logging visibility — form-builder still catches around `payload.sendEmail`. Prefer leaving that stack intact.

## Motor City constants to brand

`src/lib/motor-city-leads/constants.ts` (Ford values):

| Export | Ford | Sibling |
|--------|------|---------|
| `MOTOR_CITY_SITE_KEY` | `eagle-ford` | brand slug used by Motor City |
| `LMS_DEFAULT_BRAND` | `Ford` | brand |
| `LMS_DEFAULT_MODEL` | `General Enquiry` | usually same |
| `LMS_DEFAULT_SOURCE` | `EAGLE-DEALERWEBSITE` | same on every brand |

`dealerRef` defaults in `formFields.ts` admin UI are Ford `EC167` — update per brand.

## Notes

- Whether Ford should keep `NEWMAZDA` floor usage for any cross-brand forms remains rare/optional — leave alone unless the client requests it.
- Do not invent sales mailboxes; keep each brand’s existing `sales@…` address and only set the display name.
