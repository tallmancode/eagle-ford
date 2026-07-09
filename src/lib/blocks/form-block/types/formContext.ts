import type { Vehicle, VehicleModel } from '@/payload-types'

export type FormBlockContextValues = Record<string, string>

export type FormBlockMeta = {
  contextValues?: FormBlockContextValues
}

export type BlockRenderMeta = FormBlockMeta & {
  inRow?: boolean
  vehicle?: Vehicle
  vehicleModel?: VehicleModel
  searchParams?: Record<string, string | string[] | undefined>
}

export function getHiddenFieldNames(contextValues?: FormBlockContextValues): Set<string> {
  if (!contextValues) {
    return new Set()
  }

  return new Set(
    Object.entries(contextValues)
      .filter(([, value]) => value.trim() !== '')
      .map(([key]) => key),
  )
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
