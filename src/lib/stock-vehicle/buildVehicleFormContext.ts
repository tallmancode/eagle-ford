import type { Form } from '@/payload-types'
import {
  formatMileage,
  formatPrice,
  getTaxonomyLabel,
  getVehicleDisplayName,
} from '@/lib/blocks/stock-archive-block/utils'
import type { FormBlockContextValues } from '@/lib/blocks/form-block/types/formContext'
import { getAllInputFields } from '@/lib/blocks/form-block/utils/getFormSteps'
import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'

/** Form field names prefilled/hidden on VDP enquire forms for LMS. */
export const VEHICLE_LMS_FIELD_NAMES = [
  'vehicleName',
  'brand',
  'model',
  'modelRange',
  'mmCode',
  'year',
  'mileage',
  'price',
  'stockNumber',
  'vin',
  'dealershipName',
  'type',
  'colour',
  'regNo',
] as const

/**
 * Maps a stock vehicle into form context values for enquiry prefills.
 * Empty values are omitted so fields stay visible when data is missing
 * (unless force-hidden via VEHICLE_LMS_FIELD_NAMES on the VDP form).
 */
export function buildVehicleFormContext(vehicle: MotorCityStockVehicle): FormBlockContextValues {
  const values: FormBlockContextValues = {}

  const vehicleName = getVehicleDisplayName(vehicle).trim()
  if (vehicleName) {
    values.vehicleName = vehicleName
  }

  const brand = getTaxonomyLabel(vehicle.brand)?.trim()
  if (brand) {
    values.brand = brand
  }

  const model = (vehicle.model ?? vehicle.modelRange ?? '').trim()
  if (model) {
    values.model = model
  }

  const modelRange = (vehicle.modelRange ?? '').trim()
  if (modelRange) {
    values.modelRange = modelRange
  }

  const mmCode = (vehicle.mmCode ?? '').trim()
  if (mmCode) {
    values.mmCode = mmCode
  }

  if (vehicle.year != null) {
    values.year = String(vehicle.year)
  }

  if (typeof vehicle.mileage === 'number') {
    values.mileage = formatMileage(vehicle.mileage)
  }

  const rawPrice = vehicle.specialPrice ?? vehicle.price
  if (typeof rawPrice === 'number') {
    values.price = formatPrice(rawPrice)
  }

  const stockNumber = (vehicle.stockNoDisplay ?? vehicle.stockNo ?? '').trim()
  if (stockNumber) {
    values.stockNumber = stockNumber
  }

  const vin = (vehicle.vin ?? '').trim()
  if (vin) {
    values.vin = vin
  }

  const dealershipName =
    typeof vehicle.dealership === 'object' && vehicle.dealership !== null
      ? (vehicle.dealership.name ?? '').trim()
      : ''
  if (dealershipName) {
    values.dealershipName = dealershipName
  }

  if (vehicle.newUsed === 'USED') {
    values.type = '1'
  } else if (vehicle.newUsed === 'NEW') {
    values.type = '0'
  }

  const colour = (vehicle.colour ?? '').trim()
  if (colour) {
    values.colour = colour
  }

  const regNo = (vehicle.regNo ?? '').trim()
  if (regNo) {
    values.regNo = regNo
  }

  return values
}

/** Keeps only context keys that exist as named fields on the form. */
export function pickFormContextValues(
  form: Form,
  contextValues: FormBlockContextValues,
): FormBlockContextValues {
  const fieldNames = new Set(
    getAllInputFields(form)
      .filter(
        (field): field is typeof field & { name: string } =>
          'name' in field && typeof field.name === 'string' && field.name.length > 0,
      )
      .map((field) => field.name),
  )

  const picked: FormBlockContextValues = {}
  for (const [key, value] of Object.entries(contextValues)) {
    if (fieldNames.has(key) && value.trim() !== '') {
      picked[key] = value
    }
  }
  return picked
}

/** Vehicle LMS field names that exist on the given form (always hide on VDP). */
export function getVehicleLmsHiddenFieldNames(form: Form): Set<string> {
  const fieldNames = new Set(
    getAllInputFields(form)
      .filter(
        (field): field is typeof field & { name: string } =>
          'name' in field && typeof field.name === 'string' && field.name.length > 0,
      )
      .map((field) => field.name),
  )

  return new Set(VEHICLE_LMS_FIELD_NAMES.filter((name) => fieldNames.has(name)))
}
