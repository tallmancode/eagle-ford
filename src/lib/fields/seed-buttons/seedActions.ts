export type SeedAction = {
  endpoint: string
  label: string
  successText: string
  description: string
  adminLink?: { collection: 'forms' }
  allowRetry?: boolean
}

export const formSeedActions: SeedAction[] = [
  {
    endpoint: '/next/create-sell-form',
    label: 'Upsert Sell Enquiry Form',
    successText: 'Sell Enquiry Form upserted!',
    description:
      'Create or overwrite the sell enquiry form by title (preserves existing form id/references).',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
  {
    endpoint: '/next/create-enquiry-form',
    label: 'Upsert General Enquiry Form',
    successText: 'General Enquiry Form upserted!',
    description:
      'Create or overwrite the general enquiry form by title (LMS CALLCENTRE + Mimecast emails).',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
  {
    endpoint: '/next/create-paint-panel-form',
    label: 'Upsert Paint & Panel Enquiry Form',
    successText: 'Paint & Panel Enquiry Form upserted!',
    description: 'Create or overwrite the paint & panel enquiry form by title.',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
  {
    endpoint: '/next/create-parts-form',
    label: 'Upsert Parts Enquiry Form',
    successText: 'Parts Enquiry Form upserted!',
    description: 'Create or overwrite the parts enquiry form by title.',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
  {
    endpoint: '/next/create-wheel-tyre-form',
    label: 'Upsert Wheel & Tyre Enquiry Form',
    successText: 'Wheel & Tyre Enquiry Form upserted!',
    description: 'Create or overwrite the wheel & tyre enquiry form by title.',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
  {
    endpoint: '/next/create-service-form',
    label: 'Upsert Service Booking Form',
    successText: 'Service Booking Form upserted!',
    description: 'Create or overwrite the service booking form by title.',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
  {
    endpoint: '/next/create-test-drive-form',
    label: 'Upsert Test Drive Booking Form',
    successText: 'Test Drive Booking Form upserted!',
    description:
      'Create or overwrite the test drive form by title (LMS NEWFORD + model mapping).',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
  {
    endpoint: '/next/create-special-offer-form',
    label: 'Upsert Special Offer Enquiry Form',
    successText: 'Special Offer Enquiry Form upserted!',
    description:
      'Create or overwrite the special offer form by title (LMS NEWFORD + vehicle context fields).',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
  {
    endpoint: '/next/create-vehicle-quote-form',
    label: 'Upsert Vehicle Quote Form',
    successText: 'Vehicle Quote Form upserted!',
    description:
      'Create or overwrite the generic vehicle quote form. Prefer Used / New quote forms for showroom and catalog.',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
  {
    endpoint: '/next/create-used-vehicle-quote-form',
    label: 'Upsert Used Vehicle Quote Form',
    successText: 'Used Vehicle Quote Form upserted!',
    description:
      'Create or overwrite the used quote form by title. Wire it in Settings → Showroom quote form.',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
  {
    endpoint: '/next/create-new-vehicle-quote-form',
    label: 'Upsert New Vehicle Quote Form',
    successText: 'New Vehicle Quote Form upserted!',
    description:
      'Create or overwrite the new quote form by title. Wire it in Settings → New vehicle quote form.',
    adminLink: { collection: 'forms' },
    allowRetry: true,
  },
]

export const importSeedActions: SeedAction[] = [
  {
    endpoint: '/next/import-vehicles',
    label: 'Import Vehicle Catalog',
    successText: 'Vehicle catalog imported successfully!',
    description:
      'Import all vehicles, models, categories, and refresh images from bundled seed assets.',
    allowRetry: true,
  },
  {
    endpoint: '/next/import-specials',
    label: 'Import Specials',
    successText: 'Specials imported successfully!',
    description:
      'Import all specials from bundled specials-data.ts (images downloaded from live URLs). Run "Create Special Offer Enquiry Form" first.',
    allowRetry: true,
  },
  {
    endpoint: '/next/seed-seo',
    label: 'Seed SEO Metadata',
    successText: 'SEO metadata seeded successfully!',
    description:
      'Update meta title/description on existing pages, vehicles, and models by URL slug (skips missing docs). Safe to re-run.',
    allowRetry: true,
  },
]

export const diagnosticSeedActions: SeedAction[] = [
  {
    endpoint: '/next/sentry-test-error',
    label: 'Force Sentry Test Error',
    successText: 'Sentry test error reported.',
    description:
      'Intentionally capture an exception so you can confirm Sentry is receiving events (production + SENTRY_DSN required).',
    allowRetry: true,
  },
]
