import { sendGTMEvent } from '@next/third-parties/google'

import { canSendAnalytics } from '@/components/analytics/canSendAnalytics'
import { resolveEnquiryFormIdentity } from '@/lib/forms/enquiryFormIdentity'

export type EnquirySubmittedPayload = {
  form_name: string
  department: string
  form_id?: string
  vehicle_model?: string
  stock_number?: string
  submission_id?: string
  gclid?: string
  page_path: string
}

function pickField(data: Record<string, unknown> | undefined, keys: string[]): string | undefined {
  if (!data) return undefined
  for (const key of keys) {
    const value = data[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return undefined
}

/**
 * Push marketing `enquiry_submitted` after a successful form create (HTTP 2xx).
 */
export function pushEnquirySubmitted(args: {
  formTitle: string
  externalId?: string | null
  submissionId?: string
  formData?: Record<string, unknown>
  gclid?: string
  pagePath?: string
}): void {
  if (!canSendAnalytics()) return

  const identity = resolveEnquiryFormIdentity(args.formTitle)
  if (!identity) return

  const page_path =
    args.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/')

  const payload: EnquirySubmittedPayload = {
    form_name: identity.formName,
    department: identity.department,
    page_path,
  }

  const externalId = args.externalId?.trim()
  if (externalId) payload.form_id = externalId

  const vehicle_model = pickField(args.formData, [
    'model',
    'modelName',
    'vehicle_model',
    'vehicleModel',
    'vehicleName',
    'vehicle_name',
  ])
  const stock_number = pickField(args.formData, [
    'stockNumber',
    'stock_number',
    'stockNr',
    'stock_nr',
  ])

  if (vehicle_model) payload.vehicle_model = vehicle_model
  if (stock_number) payload.stock_number = stock_number
  if (args.submissionId) payload.submission_id = args.submissionId
  if (args.gclid) payload.gclid = args.gclid

  sendGTMEvent({
    event: 'enquiry_submitted',
    ...payload,
  })
}
