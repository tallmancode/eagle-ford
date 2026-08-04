import { specialOfferEnquiryForm } from '@/fixtures/form-fixtures/special-offer-enquiry-form'
import { SALES_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/thankYouPages'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Special Offer Enquiry Form',
  getFormData: () => specialOfferEnquiryForm,
  errorMessage: 'Error upserting special offer enquiry form.',
  thankYouPageSlug: SALES_THANK_YOU_SLUG,
})
