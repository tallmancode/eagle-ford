import { sendGTMEvent } from '@next/third-parties/google'

import { canSendAnalytics } from '@/components/analytics/canSendAnalytics'
import { resolveEnquiryFormIdentityFromForm } from '@/lib/forms/enquiryFormIdentity'

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

/** Enforce snake_case — dots in legacy CMS data become underscores. */
export function normalizeFormIdentifier(value: string): string {
  return value.trim().replace(/\./g, '_')
}

function warnIfDotsNormalized(original: string, normalized: string, field: 'form_name' | 'form_id') {
  if (original !== normalized && canSendAnalytics()) {
    console.warn('[analytics] form identifier contained dots; normalized to underscores', {
      field,
      original,
      normalized,
    })
  }
}

/**
 * Push marketing `enquiry_submitted` after a successful form create (HTTP 2xx).
 */
export function pushEnquirySubmitted(args: {
  formTitle: string
  formName?: string | null
  externalId?: string | null
  submissionId?: string
  formData?: Record<string, unknown>
  gclid?: string
  pagePath?: string
}): void {
  if (!canSendAnalytics()) return

  const identity = resolveEnquiryFormIdentityFromForm({
    title: args.formTitle,
    form_name: args.formName as Parameters<typeof resolveEnquiryFormIdentityFromForm>[0]['form_name'],
  })

  if (!identity) {
    console.warn('[analytics] enquiry_submitted skipped: unresolved form', {
      formTitle: args.formTitle,
      formName: args.formName,
      externalId: args.externalId,
    })
    return
  }

  const page_path =
    args.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/')

  const rawFormName = identity.formName
  const form_name = normalizeFormIdentifier(rawFormName)
  warnIfDotsNormalized(rawFormName, form_name, 'form_name')

  const payload: EnquirySubmittedPayload = {
    form_name,
    department: identity.department,
    page_path,
  }

  const externalId = args.externalId?.trim()
  if (externalId) {
    const form_id = normalizeFormIdentifier(externalId)
    warnIfDotsNormalized(externalId, form_id, 'form_id')
    payload.form_id = form_id
  }

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
