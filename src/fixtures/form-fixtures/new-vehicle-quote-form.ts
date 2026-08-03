import type { RequiredDataFromCollectionSlug } from 'payload'
import { buildVehicleQuoteForm } from '@/fixtures/form-fixtures/buildVehicleQuoteForm'

/** Adapted from the live Used Vehicle Quote form with new-vehicle LMS floor / copy. */
export const newVehicleQuoteForm: RequiredDataFromCollectionSlug<'forms'> =
  buildVehicleQuoteForm({
    title: 'New Vehicle Quote',
    salesEmailHeading: 'New Vehicle Quote',
    salesEmailIntro: 'A new vehicle quote was submitted on the Eagle Ford website.',
    salesSubject: 'Eagle Ford New Vehicle Quote: {{vehicleName}} — {{firstName}} {{lastName}}',
    lms: {
      dealerFloor: 'NEWFORD',
      defaultUsed: '0',
      source: 'EAGLE-DEALERWEBSITE',
      commentsPrefix: 'New vehicle quote',
    },
  })
