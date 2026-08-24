import type { JSONField } from 'payload'
import { v2Theme } from '@/lib/blocks/v2/theme'
import { emptyBoxValue, validatePaddingValue } from '@/lib/blocks/v2/apply/values'
import { styleJsonField, type BoxFieldDefaults, type StyleFieldLabels } from '@/lib/blocks/v2/fields/json-field'
import type { BoxValue } from '@/lib/blocks/v2/types'

export function PaddingField(
  options?: StyleFieldLabels & {
    defaults?: BoxFieldDefaults
    /** Full stored default (from `defineV2BlocksConfig`). Overrides empty box. */
    defaultValue?: BoxValue | (() => BoxValue)
  },
): JSONField {
  const linked = options?.defaults?.linked ?? v2Theme.padding.linked
  const unit = options?.defaults?.unit ?? v2Theme.padding.unit
  const defaultValue =
    options?.defaultValue ?? emptyBoxValue({ linked, unit })
  return styleJsonField({
    name: options?.name ?? 'padding',
    label: options?.label ?? 'Padding',
    description: options?.description ?? 'Padding per breakpoint. Empty values inherit from smaller screens.',
    componentPath: '@/lib/blocks/v2/components/PaddingField#PaddingField',
    defaultValue,
    validate: validatePaddingValue,
    clientProps: { linkedDefault: linked, unitDefault: unit },
  })
}
