import type { LmsFieldPath } from '@/lib/motor-city-leads/lmsFieldPaths'

export type FormSubmissionDataItem = {
  field: string
  value: string
}

export type FieldMapping = {
  formFieldName: string
  lmsPath: LmsFieldPath | string
}

export type FormLmsConfig = {
  enabled?: boolean | null
  dealerRef?: string | null
  dealerFloor?: string | null
  source?: string | null
  defaultUsed?: '0' | '1' | string | null
  defaultBrand?: string | null
  defaultModel?: string | null
  commentsPrefix?: string | null
  fieldMappings?: FieldMapping[] | null
}

export type LeadContact = {
  title?: string
  firstName: string
  surname: string
  email?: string
  cellPhone: string
  preferredContactMethod?: string
  [key: string]: string | undefined
}

export type LeadSeeks = {
  used: string
  brand: string
  model: string
  modelrange?: string
  year?: string
  kms?: string
  stockNr?: string
  comments?: string
  vin?: string
  regno?: string
  [key: string]: string | undefined
}

/** Optional ad / UTM attribution forwarded to Motor City (issue #357). */
export type LeadAttribution = {
  gclid?: string | null
  gbraid?: string | null
  wbraid?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
  landing_page?: string | null
  referrer?: string | null
  capturedAt?: string | null
}

export type MotorCitySiteFormLeadRequest = {
  extLeadRef: string
  siteKey: string
  formTitle?: string
  dealerRef: string
  dealerFloor: string
  source: string
  contact: LeadContact
  seeks: LeadSeeks
  attribution?: LeadAttribution
}

export class MotorCityLeadsError extends Error {
  readonly code: string
  readonly status?: number
  readonly retryable: boolean
  readonly retryAfterMs?: number

  constructor(
    message: string,
    options?: {
      code?: string
      status?: number
      retryable?: boolean
      retryAfterMs?: number
      cause?: unknown
    },
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined)
    this.name = 'MotorCityLeadsError'
    this.code = options?.code ?? 'MOTOR_CITY_LEADS_ERROR'
    this.status = options?.status
    this.retryable = options?.retryable ?? false
    this.retryAfterMs = options?.retryAfterMs
  }
}
