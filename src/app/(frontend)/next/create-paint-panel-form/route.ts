import { paintPanelEnquiryForm } from '@/fixtures/form-fixtures/paint-panel-enquiry-form'
import { SALES_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/thankYouPages'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Paint & Panel Enquiry Form',
  getFormData: () => paintPanelEnquiryForm,
  errorMessage: 'Error upserting paint & panel enquiry form.',
  thankYouPageSlug: SALES_THANK_YOU_SLUG,
})
