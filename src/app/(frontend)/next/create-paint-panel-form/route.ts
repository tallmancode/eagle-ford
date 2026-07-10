import { paintPanelEnquiryForm } from '@/endpoints/seed/paint-panel-enquiry-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Paint & Panel Enquiry Form',
  getFormData: () => paintPanelEnquiryForm,
  errorMessage: 'Error creating paint & panel enquiry form.',
})
