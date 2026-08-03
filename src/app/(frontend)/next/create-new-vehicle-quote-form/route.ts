import { newVehicleQuoteForm } from '@/fixtures/form-fixtures/new-vehicle-quote-form'
import { VEHICLE_QUOTE_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/buildVehicleQuoteForm'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'New Vehicle Quote Form',
  getFormData: () => newVehicleQuoteForm,
  errorMessage: 'Error creating new vehicle quote form.',
  thankYouPageSlug: VEHICLE_QUOTE_THANK_YOU_SLUG,
})
