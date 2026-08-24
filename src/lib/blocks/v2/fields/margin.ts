import type { JSONField } from 'payload'
import { v2Theme } from '@/lib/blocks/v2/theme'
import { emptyBoxValue, validateMarginValue } from '@/lib/blocks/v2/apply/values'
import { styleJsonField, type BoxFieldDefaults, type StyleFieldLabels } from '@/lib/blocks/v2/fields/json-field'
import type { BoxValue } from '@/lib/blocks/v2/types'

export function MarginField(
  options?: StyleFieldLabels & {
    defaults?: BoxFieldDefaults
    defaultValue?: BoxValue | (() => BoxValue)
  },
): JSONField {
  const linked = options?.defaults?.linked ?? v2Theme.margin.linked
  const unit = options?.defaults?.unit ?? v2Theme.margin.unit
  const defaultValue = options?.defaultValue ?? emptyBoxValue({ linked, unit })
  return styleJsonField({
    name: options?.name ?? 'margin',
    label: options?.label ?? 'Margin',
    description:
      options?.description ??
      'Margin per breakpoint. Use auto to center. Empty values inherit from smaller screens.',
    componentPath: '@/lib/blocks/v2/components/MarginField#MarginField',
    defaultValue,
    validate: validateMarginValue,
    clientProps: { linkedDefault: linked, unitDefault: unit, allowNegative: true, allowAuto: true },
  })
}
