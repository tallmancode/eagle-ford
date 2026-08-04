import { serviceBookingForm } from '@/fixtures/form-fixtures/service-booking-form'
import { SERVICE_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/thankYouPages'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Service Booking Form',
  getFormData: () => serviceBookingForm,
  errorMessage: 'Error upserting service booking form.',
  thankYouPageSlug: SERVICE_THANK_YOU_SLUG,
})
