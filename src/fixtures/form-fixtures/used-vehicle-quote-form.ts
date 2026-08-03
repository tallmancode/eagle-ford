import type { RequiredDataFromCollectionSlug } from 'payload'
import { buildVehicleQuoteForm } from '@/fixtures/form-fixtures/buildVehicleQuoteForm'

export const usedVehicleQuoteForm: RequiredDataFromCollectionSlug<'forms'> =
  buildVehicleQuoteForm({
    title: 'Used Vehicle Quote',
    salesEmailHeading: 'New Used Vehicle Quote',
    salesEmailIntro: 'A new used vehicle quote was submitted on the Eagle Ford website.',
    salesSubject: 'Eagle Ford Used Vehicle Quote: {{vehicleName}} — {{firstName}} {{lastName}}',
    lms: {
      dealerFloor: 'USED',
      defaultUsed: '1',
      source: 'EAGLE-DEALERWEBSITE',
      commentsPrefix: 'Used vehicle quote',
    },
  })
