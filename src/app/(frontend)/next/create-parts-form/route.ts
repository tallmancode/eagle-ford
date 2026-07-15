import { partsEnquiryForm } from '@/fixtures/form-fixtures/parts-enquiry-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Parts Enquiry Form',
  getFormData: () => partsEnquiryForm,
  errorMessage: 'Error creating parts enquiry form.',
})
