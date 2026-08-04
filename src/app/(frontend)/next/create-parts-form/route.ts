import { partsEnquiryForm } from '@/fixtures/form-fixtures/parts-enquiry-form'
import { SERVICE_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/thankYouPages'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Parts Enquiry Form',
  getFormData: () => partsEnquiryForm,
  errorMessage: 'Error upserting parts enquiry form.',
  thankYouPageSlug: SERVICE_THANK_YOU_SLUG,
})
