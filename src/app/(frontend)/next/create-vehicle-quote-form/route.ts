import { VEHICLE_QUOTE_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/buildVehicleQuoteForm'
import { vehicleQuoteForm } from '@/fixtures/form-fixtures/vehicle-quote-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Vehicle Quote Form',
  getFormData: () => vehicleQuoteForm,
  errorMessage: 'Error upserting vehicle quote form.',
  thankYouPageSlug: VEHICLE_QUOTE_THANK_YOU_SLUG,
})
