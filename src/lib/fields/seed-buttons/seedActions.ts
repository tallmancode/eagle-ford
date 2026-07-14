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
    label: 'Create Sell Enquiry Form',
    successText: 'Sell Enquiry Form created!',
    description: 'Add the vehicle sell enquiry form to your Forms collection.',
    adminLink: { collection: 'forms' },
  },
  {
    endpoint: '/next/create-enquiry-form',
    label: 'Create General Enquiry Form',
    successText: 'General Enquiry Form created!',
    description: 'Add the general contact enquiry form to your Forms collection.',
    adminLink: { collection: 'forms' },
  },
  {
    endpoint: '/next/create-paint-panel-form',
    label: 'Create Paint & Panel Enquiry Form',
    successText: 'Paint & Panel Enquiry Form created!',
    description: 'Add the paint & panel enquiry form to your Forms collection.',
    adminLink: { collection: 'forms' },
  },
  {
    endpoint: '/next/create-parts-form',
    label: 'Create Parts Enquiry Form',
    successText: 'Parts Enquiry Form created!',
    description: 'Add the parts enquiry form to your Forms collection.',
    adminLink: { collection: 'forms' },
  },
  {
    endpoint: '/next/create-wheel-tyre-form',
    label: 'Create Wheel & Tyre Enquiry Form',
    successText: 'Wheel & Tyre Enquiry Form created!',
    description: 'Add the wheel & tyre enquiry form to your Forms collection.',
    adminLink: { collection: 'forms' },
  },
  {
    endpoint: '/next/create-service-form',
    label: 'Create Service Booking Form',
    successText: 'Service Booking Form created!',
    description: 'Add the service booking form to your Forms collection.',
    adminLink: { collection: 'forms' },
  },
  {
    endpoint: '/next/create-test-drive-form',
    label: 'Create Test Drive Booking Form',
    successText: 'Test Drive Booking Form created!',
    description: 'Add the test drive booking form to your Forms collection.',
    adminLink: { collection: 'forms' },
  },
  {
    endpoint: '/next/create-special-offer-form',
    label: 'Create Special Offer Enquiry Form',
    successText: 'Special Offer Enquiry Form created!',
    description: 'Add the special offer enquiry form to your Forms collection.',
    adminLink: { collection: 'forms' },
  },
  {
    endpoint: '/next/create-vehicle-quote-form',
    label: 'Create Vehicle Quote Form',
    successText: 'Vehicle Quote Form created!',
    description: 'Add the vehicle quote form to your Forms collection.',
    adminLink: { collection: 'forms' },
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
