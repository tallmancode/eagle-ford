import type { Form, Vehicle, VehicleModel, VehicleVariant } from '@/payload-types'
import { getAllInputFields } from '@/lib/blocks/form-block/utils/getFormSteps'

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

/** Field names marked Hidden in the CMS form builder. */
export function getConfiguredHiddenFieldNames(form: Form): Set<string> {
  const hidden = new Set<string>()

  for (const field of getAllInputFields(form)) {
    if (
      'name' in field &&
      typeof field.name === 'string' &&
      field.name.length > 0 &&
      'hidden' in field &&
      field.hidden === true
    ) {
      hidden.add(field.name)
    }
  }

  return hidden
}

export function getHiddenFieldNames(
  contextValues?: FormBlockContextValues,
  forceHiddenFieldNames?: Iterable<string>,
  configuredHiddenFieldNames?: Iterable<string>,
): Set<string> {
  const hidden = new Set<string>(forceHiddenFieldNames)

  if (configuredHiddenFieldNames) {
    for (const name of configuredHiddenFieldNames) {
      hidden.add(name)
    }
  }

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
