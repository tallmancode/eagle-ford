import type { JSONField } from 'payload'
import { emptyColorValue, validateColorValue } from '@/lib/blocks/v2/apply/values'
import { styleJsonField, type StyleFieldLabels } from '@/lib/blocks/v2/fields/json-field'
import type { ColorTokenKey } from '@/lib/blocks/v2/types'

export type ColorFieldOptions = StyleFieldLabels & {
  defaultToken?: ColorTokenKey | ''
  allowInherit?: boolean
}

export function ColorField(options?: ColorFieldOptions): JSONField {
  const defaultToken = options?.defaultToken ?? ''
  const allowInherit = options?.allowInherit ?? false
  return styleJsonField({
    name: options?.name ?? 'color',
    label: options?.label ?? 'Color',
    description: options?.description,
    componentPath: '@/lib/blocks/v2/components/ColorField#ColorField',
    defaultValue: emptyColorValue(defaultToken),
    validate: validateColorValue,
    clientProps: {
      defaultToken,
      allowInherit,
    },
  })
}
