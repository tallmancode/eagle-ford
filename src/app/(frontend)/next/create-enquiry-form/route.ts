import { generalEnquiryForm } from '@/fixtures/form-fixtures/general-enquiry-form'
import { SALES_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/thankYouPages'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'General Enquiry Form',
  getFormData: () => generalEnquiryForm,
  errorMessage: 'Error upserting general enquiry form.',
  thankYouPageSlug: SALES_THANK_YOU_SLUG,
})
