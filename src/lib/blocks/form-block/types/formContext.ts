import type { Vehicle, VehicleModel, VehicleVariant } from '@/payload-types'

export type FormBlockContextValues = Record<string, string>

export type FormBlockMeta = {
  contextValues?: FormBlockContextValues
}

export type BlockRenderMeta = FormBlockMeta & {
  inRow?: boolean
  vehicle?: Vehicle
  vehicleModel?: VehicleModel
  vehicleVariant?: VehicleVariant
  searchParams?: Record<string, string | string[] | undefined>
}

export function getHiddenFieldNames(
  contextValues?: FormBlockContextValues,
  forceHiddenFieldNames?: Iterable<string>,
): Set<string> {
  const hidden = new Set<string>(forceHiddenFieldNames)

  if (contextValues) {
    for (const [key, value] of Object.entries(contextValues)) {
      if (value.trim() !== '') {
        hidden.add(key)
      }
    }
  }

  return hidden
}

export function mergeFormDefaultValues(
  formDefaults: Record<string, unknown>,
  contextValues?: FormBlockContextValues,
): Record<string, unknown> {
  if (!contextValues) {
    return formDefaults
  }

  return { ...formDefaults, ...contextValues }
}
