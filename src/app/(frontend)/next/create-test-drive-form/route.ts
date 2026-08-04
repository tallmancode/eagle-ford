import { testDriveForm } from '@/fixtures/form-fixtures/test-drive-form'
import { SALES_THANK_YOU_SLUG } from '@/fixtures/form-fixtures/thankYouPages'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Test Drive Booking Form',
  getFormData: () => testDriveForm,
  errorMessage: 'Error upserting test drive booking form.',
  thankYouPageSlug: SALES_THANK_YOU_SLUG,
})
