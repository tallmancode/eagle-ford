import type {
  FormLmsConfig,
  FormSubmissionDataItem,
  LeadContact,
  LeadSeeks,
  MotorCitySiteFormLeadRequest,
} from '@/lib/motor-city-leads/types'
import { MotorCityLeadsError } from '@/lib/motor-city-leads/types'
import {
  LMS_DEFAULT_BRAND,
  LMS_DEFAULT_MODEL,
  LMS_DEFAULT_USED,
  MOTOR_CITY_SITE_KEY,
} from '@/lib/motor-city-leads/constants'

/** Built-in form field name → LMS path when form config omits an explicit mapping. */
const DEFAULT_FORM_FIELD_MAP: Record<string, string> = {
  first_name: 'contact.firstName',
  firstname: 'contact.firstName',
  last_name: 'contact.surname',
  lastname: 'contact.surname',
  surname: 'contact.surname',
  full_name: 'contact.fullName',
  fullname: 'contact.fullName',
  name: 'contact.fullName',
  email: 'contact.email',
  phone: 'contact.cellPhone',
  phone_number: 'contact.cellPhone',
  phonenumber: 'contact.cellPhone',
  cell: 'contact.cellPhone',
  cellphone: 'contact.cellPhone',
  cell_phone: 'contact.cellPhone',
  mobile: 'contact.cellPhone',
  brand: 'seeks.brand',
  make: 'seeks.brand',
  vehicle_make: 'seeks.brand',
  model: 'seeks.model',
  model_name: 'seeks.model',
  vehicle_model: 'seeks.model',
  modelrange: 'seeks.modelrange',
  model_range: 'seeks.modelrange',
  vehicle_name: 'seeks.modelrange',
  vehicle: 'seeks.modelrange',
  used: 'seeks.used',
  type: 'seeks.used',
  year: 'seeks.year',
  year_model: 'seeks.year',
  kms: 'seeks.kms',
  mileage: 'seeks.kms',
  stock_nr: 'seeks.stockNr',
  stock_number: 'seeks.stockNr',
  stocknr: 'seeks.stockNr',
  mm_code: 'seeks.mmCode',
  mmcode: 'seeks.mmCode',
  colour: 'seeks.colour',
  color: 'seeks.colour',
  price: 'seeks.price',
  message: 'seeks.comments',
  comments: 'seeks.comments',
  comment: 'seeks.comments',
  vin: 'seeks.vin',
  registration: 'seeks.regno',
  regno: 'seeks.regno',
  reg_no: 'seeks.regno',
}

function normalizeKey(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
}

function setByPath(contact: LeadContact, seeks: LeadSeeks, path: string, value: string): void {
  if (!value) return
  const [root, key] = path.split('.')
  if (!root || !key) return

  if (root === 'contact') {
    if (key === 'fullName') {
      const parts = value.split(/\s+/).filter(Boolean)
      if (parts.length === 1) {
        contact.firstName = parts[0] ?? contact.firstName
        if (!contact.surname) contact.surname = 'Unknown'
      } else if (parts.length > 1) {
        contact.firstName = parts[0] ?? contact.firstName
        contact.surname = parts.slice(1).join(' ')
      }
      return
    }
    contact[key] = value
    return
  }

  if (root === 'seeks') {
    seeks[key] = value
  }
}

export type MapFormSubmissionResult = {
  request: MotorCitySiteFormLeadRequest
}

/**
 * Maps Payload form-submission field/value pairs into a Motor City site-form lead body.
 */
export function mapFormSubmissionToLeadRequest(args: {
  submissionData: FormSubmissionDataItem[] | null | undefined
  formConfig: FormLmsConfig
  extLeadRef: string
  formTitle?: string | null
}): MapFormSubmissionResult {
  const { submissionData, formConfig, extLeadRef, formTitle } = args

  const dealerRef = formConfig.dealerRef?.trim()
  const dealerFloor = formConfig.dealerFloor?.trim()
  const source = formConfig.source?.trim()

  if (!dealerRef || !dealerFloor || !source) {
    throw new MotorCityLeadsError(
      'LMS lead injection is enabled but dealerRef / dealerFloor / source are incomplete',
      { code: 'CONFIG_INCOMPLETE' },
    )
  }

  const lookup = new Map<string, string>()
  for (const item of submissionData ?? []) {
    if (!item?.field) continue
    lookup.set(normalizeKey(item.field), String(item.value ?? '').trim())
  }

  const contact: LeadContact = {
    firstName: '',
    surname: '',
    cellPhone: '',
    email: '',
  }
  const seeks: LeadSeeks = {
    used: formConfig.defaultUsed || LMS_DEFAULT_USED,
    brand: formConfig.defaultBrand || LMS_DEFAULT_BRAND,
    model: formConfig.defaultModel || LMS_DEFAULT_MODEL,
    comments: '',
  }

  const applied = new Set<string>()

  for (const mapping of formConfig.fieldMappings ?? []) {
    const formName = mapping.formFieldName?.trim()
    const path = mapping.lmsPath?.trim()
    if (!formName || !path) continue
    const key = normalizeKey(formName)
    const value = lookup.get(key) ?? ''
    if (value) {
      setByPath(contact, seeks, path, value)
      applied.add(key)
    }
  }

  for (const [formKey, path] of Object.entries(DEFAULT_FORM_FIELD_MAP)) {
    if (applied.has(formKey)) continue
    const value = lookup.get(formKey)
    if (value) {
      setByPath(contact, seeks, path, value)
      applied.add(formKey)
    }
  }

  // Prefer modelrange as model when model is still the generic default and a range was provided
  if (
    seeks.modelrange &&
    (!seeks.model || seeks.model === (formConfig.defaultModel || LMS_DEFAULT_MODEL))
  ) {
    seeks.model = seeks.modelrange
  }

  if (!contact.firstName) {
    throw new MotorCityLeadsError('Lead is missing first name after field mapping', {
      code: 'MAPPING_FIRST_NAME',
    })
  }
  if (!contact.surname) {
    contact.surname = 'Unknown'
  }
  if (!contact.cellPhone) {
    throw new MotorCityLeadsError('Lead is missing cell phone after field mapping', {
      code: 'MAPPING_CELL',
    })
  }
  if (!seeks.brand || !seeks.model) {
    throw new MotorCityLeadsError('Lead is missing brand/model after field mapping', {
      code: 'MAPPING_VEHICLE',
    })
  }

  const commentParts: string[] = []
  if (formConfig.commentsPrefix?.trim()) {
    commentParts.push(formConfig.commentsPrefix.trim())
  }
  if (seeks.comments?.trim()) {
    commentParts.push(seeks.comments.trim())
  }

  const leftover: string[] = []
  for (const [key, value] of lookup.entries()) {
    if (!value || applied.has(key) || key in DEFAULT_FORM_FIELD_MAP) continue
    // Skip privacy checkboxes and similar noise
    if (key.includes('privacy') || key.includes('consent') || key === 'honeypot') continue
    leftover.push(`${key}: ${value}`)
  }
  if (leftover.length) {
    commentParts.push(leftover.join(' | '))
  }
  seeks.comments = commentParts.join(' — ').slice(0, 4000)

  return {
    request: {
      extLeadRef: extLeadRef.slice(0, 50),
      siteKey: MOTOR_CITY_SITE_KEY,
      formTitle: formTitle?.trim() || undefined,
      dealerRef,
      dealerFloor,
      source,
      contact,
      seeks,
    },
  }
}
