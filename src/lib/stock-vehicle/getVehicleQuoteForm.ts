import type { Form } from '@/payload-types'
import { getFormByTitle } from '@/lib/forms/getFormByTitle'

const VEHICLE_QUOTE_FORM_TITLE = 'Vehicle Quote'

export async function getVehicleQuoteForm(): Promise<Form | null> {
  return getFormByTitle(VEHICLE_QUOTE_FORM_TITLE)
}
