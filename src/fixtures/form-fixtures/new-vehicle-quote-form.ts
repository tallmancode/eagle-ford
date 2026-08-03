import type { RequiredDataFromCollectionSlug } from 'payload'
import { buildVehicleQuoteForm } from '@/fixtures/form-fixtures/buildVehicleQuoteForm'

export const newVehicleQuoteForm: RequiredDataFromCollectionSlug<'forms'> =
  buildVehicleQuoteForm({
    title: 'New Vehicle Quote',
    salesIntro: 'A new vehicle quote enquiry has been submitted.',
    customerSubject: 'Your vehicle quote request - Eagle Ford',
    salesSubject: 'Eagle Ford New Vehicle Quote: {{vehicleName}} — {{firstName}} {{lastName}}',
    lms: {
      dealerFloor: 'NEWFORD',
      defaultUsed: '0',
      source: 'EAGLE-DEALERWEBSITE',
      commentsPrefix: 'New vehicle quote',
    },
  })
