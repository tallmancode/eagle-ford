import type { JSONField } from 'payload'
import { emptyVisibilityValue, validateVisibilityValue } from '@/lib/blocks/v2/apply/values'
import { styleJsonField, type StyleFieldLabels } from '@/lib/blocks/v2/fields/json-field'

export function VisibilityField(options?: StyleFieldLabels): JSONField {
  return styleJsonField({
    name: options?.name ?? 'visibility',
    label: options?.label ?? 'Visibility',
    description:
      options?.description ??
      'Hidden removes the block from layout. Invisible hides it but keeps its space.',
    componentPath: '@/lib/blocks/v2/components/VisibilityField#VisibilityField',
    defaultValue: emptyVisibilityValue(),
    validate: validateVisibilityValue,
  })
}
