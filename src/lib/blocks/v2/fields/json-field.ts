import type { DefaultValue, JSONField, LabelFunction, StaticLabel } from 'payload'
import type { SpacingUnit } from '@/lib/blocks/v2/types'

export type StyleFieldLabels = {
  name?: string
  label?: false | LabelFunction | StaticLabel
  description?: string
}

export type BoxFieldDefaults = {
  linked?: boolean
  unit?: SpacingUnit
}

export function styleJsonField({
  name,
  label,
  description,
  componentPath,
  defaultValue,
  validate,
  clientProps,
}: {
  name: string
  label: false | LabelFunction | StaticLabel | undefined
  description?: string
  componentPath: string
  defaultValue: DefaultValue
  validate: (value: unknown) => true | string
  clientProps?: Record<string, unknown>
}): JSONField {
  return {
    type: 'json',
    name,
    label: label ?? false,
    defaultValue,
    validate,
    admin: {
      className: 'v2-style-field',
      description,
      components: {
        Field: {
          path: componentPath,
          clientProps: clientProps ?? {},
        },
      },
    },
  }
}
