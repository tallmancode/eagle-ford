import { wheelTyreEnquiryForm } from '@/endpoints/seed/wheel-tyre-enquiry-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Wheel & Tyre Enquiry Form',
  getFormData: () => wheelTyreEnquiryForm,
  errorMessage: 'Error creating wheel & tyre enquiry form.',
})
