import { usedVehicleQuoteForm } from '@/fixtures/form-fixtures/used-vehicle-quote-form'
import { VEHICLE_QUOTE_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/buildVehicleQuoteForm'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Used Vehicle Quote Form',
  getFormData: () => usedVehicleQuoteForm,
  errorMessage: 'Error upserting used vehicle quote form.',
  thankYouPageSlug: VEHICLE_QUOTE_THANK_YOU_SLUG,
})
