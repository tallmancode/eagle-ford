import { generalEnquiryForm } from '@/fixtures/form-fixtures/general-enquiry-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'General Enquiry Form',
  getFormData: () => generalEnquiryForm,
  errorMessage: 'Error creating general enquiry form.',
})
