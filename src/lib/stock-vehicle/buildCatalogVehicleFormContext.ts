import type { Vehicle, VehicleModel } from '@/payload-types'
import type { FormBlockContextValues } from '@/lib/blocks/form-block/types/formContext'
import { LMS_DEFAULT_BRAND } from '@/lib/motor-city-leads/constants'

type CatalogVehicleContextInput = {
  vehicle: Pick<Vehicle, 'name'>
  model?: Pick<VehicleModel, 'name'> | null
}

/**
 * Maps catalog vehicle / model pages into form context values for LMS prefills.
 * Empty values are omitted so fields without data stay editable unless marked Hidden.
 */
export function buildCatalogVehicleFormContext({
  vehicle,
  model,
}: CatalogVehicleContextInput): FormBlockContextValues {
  const values: FormBlockContextValues = {}

  const vehicleName = (vehicle.name ?? '').trim()
  const modelName = (model?.name ?? '').trim()

  if (vehicleName) {
    values.vehicleName = vehicleName
  }

  values.brand = LMS_DEFAULT_BRAND

  const modelValue = modelName || vehicleName
  if (modelValue) {
    values.model = modelValue
  }

  if (vehicleName) {
    values.modelRange = vehicleName
  }

  if (modelName) {
    values.modelName = modelName
  }

  return values
}
