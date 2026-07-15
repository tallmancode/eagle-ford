import { specialOfferEnquiryForm } from '@/fixtures/form-fixtures/special-offer-enquiry-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Special Offer Enquiry Form',
  getFormData: () => specialOfferEnquiryForm,
  errorMessage: 'Error creating special offer enquiry form.',
})
