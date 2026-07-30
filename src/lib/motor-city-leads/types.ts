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

export type MotorCitySiteFormLeadRequest = {
  extLeadRef: string
  siteKey: string
  formTitle?: string
  dealerRef: string
  dealerFloor: string
  source: string
  contact: LeadContact
  seeks: LeadSeeks
}

export class MotorCityLeadsError extends Error {
  readonly code: string
  readonly status?: number

  constructor(message: string, options?: { code?: string; status?: number; cause?: unknown }) {
    super(message, options?.cause ? { cause: options.cause } : undefined)
    this.name = 'MotorCityLeadsError'
    this.code = options?.code ?? 'MOTOR_CITY_LEADS_ERROR'
    this.status = options?.status
  }
}
