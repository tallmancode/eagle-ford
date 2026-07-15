import { testDriveForm } from '@/fixtures/form-fixtures/test-drive-form'
import { createFormSeedRoute } from '@/lib/seed/createFormSeedRoute'

export const maxDuration = 60

export const POST = createFormSeedRoute({
  formName: 'Test Drive Booking Form',
  getFormData: () => testDriveForm,
  errorMessage: 'Error creating test drive booking form.',
})
