import { vehicleQuoteForm } from '@/endpoints/seed/vehicle-quote-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Vehicle Quote Form',
  getFormData: () => vehicleQuoteForm,
  errorMessage: 'Error creating vehicle quote form.',
})
