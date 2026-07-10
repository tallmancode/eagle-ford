import { sellEnquiryForm } from '@/endpoints/seed/sell-enquiry-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Sell Enquiry Form',
  getFormData: () => sellEnquiryForm,
  errorMessage: 'Error creating sell enquiry form.',
})
