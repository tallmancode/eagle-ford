import type { RequiredDataFromCollectionSlug } from 'payload'
import { buildVehicleQuoteForm } from '@/fixtures/form-fixtures/buildVehicleQuoteForm'

/** Catalog new-vehicle quote — no stock attributes (MM code, VIN, mileage, etc.). */
export const newVehicleQuoteForm: RequiredDataFromCollectionSlug<'forms'> =
  buildVehicleQuoteForm({
    title: 'New Vehicle Quote',
    salesEmailHeading: 'New Vehicle Quote',
    salesEmailIntro: 'A new vehicle quote was submitted on the Eagle Ford website.',
    salesSubject: 'Eagle Ford New Vehicle Quote: {{vehicleName}} — {{firstName}} {{lastName}}',
    includeStockFields: false,
    lms: {
      dealerFloor: 'NEWFORD',
      defaultUsed: '0',
      source: 'EAGLE-DEALERWEBSITE',
      commentsPrefix: 'New vehicle quote',
    },
  })
