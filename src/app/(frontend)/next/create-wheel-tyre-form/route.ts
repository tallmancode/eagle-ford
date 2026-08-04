import { wheelTyreEnquiryForm } from '@/fixtures/form-fixtures/wheel-tyre-enquiry-form'
import { SALES_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/thankYouPages'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Wheel & Tyre Enquiry Form',
  getFormData: () => wheelTyreEnquiryForm,
  errorMessage: 'Error upserting wheel & tyre enquiry form.',
  thankYouPageSlug: SALES_THANK_YOU_SLUG,
})
