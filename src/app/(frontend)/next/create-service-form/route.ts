import { serviceBookingForm } from '@/fixtures/form-fixtures/service-booking-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Service Booking Form',
  getFormData: () => serviceBookingForm,
  errorMessage: 'Error creating service booking form.',
})
