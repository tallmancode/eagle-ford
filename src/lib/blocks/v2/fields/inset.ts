import type { JSONField } from 'payload'
import { v2Theme } from '@/lib/blocks/v2/theme'
import { emptyBoxValue, validateInsetValue } from '@/lib/blocks/v2/apply/values'
import { styleJsonField, type BoxFieldDefaults, type StyleFieldLabels } from '@/lib/blocks/v2/fields/json-field'
import type { BoxValue } from '@/lib/blocks/v2/types'

export function InsetField(
  options?: StyleFieldLabels & {
    defaults?: BoxFieldDefaults
    defaultValue?: BoxValue | (() => BoxValue)
  },
): JSONField {
  const linked = options?.defaults?.linked ?? v2Theme.inset.linked
  const unit = options?.defaults?.unit ?? v2Theme.inset.unit
  const defaultValue = options?.defaultValue ?? emptyBoxValue({ linked, unit })
  return styleJsonField({
    name: options?.name ?? 'inset',
    label: options?.label ?? 'Inset',
    description:
      options?.description ??
      'Offsets for positioned elements (relative, absolute, sticky, or fixed). Empty values inherit from smaller screens.',
    componentPath: '@/lib/blocks/v2/components/InsetField#InsetField',
    defaultValue,
    validate: validateInsetValue,
    clientProps: { linkedDefault: linked, unitDefault: unit, allowNegative: true, allowAuto: true },
  })
}
