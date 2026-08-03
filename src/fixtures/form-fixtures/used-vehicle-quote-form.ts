import type { RequiredDataFromCollectionSlug } from 'payload'
import { buildVehicleQuoteForm } from '@/fixtures/form-fixtures/buildVehicleQuoteForm'

export const usedVehicleQuoteForm: RequiredDataFromCollectionSlug<'forms'> =
  buildVehicleQuoteForm({
    title: 'Used Vehicle Quote',
    salesIntro: 'A used vehicle quote enquiry has been submitted.',
    lms: {
      dealerFloor: 'USED',
      defaultUsed: '1',
      source: 'EAGLE-DEALERWEBSITE',
    },
  })
