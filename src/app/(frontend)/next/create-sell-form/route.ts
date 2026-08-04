import { sellEnquiryForm } from '@/fixtures/form-fixtures/sell-enquiry-form'
import { SALES_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/thankYouPages'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Sell Enquiry Form',
  getFormData: () => sellEnquiryForm,
  errorMessage: 'Error upserting sell enquiry form.',
  thankYouPageSlug: SALES_THANK_YOU_SLUG,
})
