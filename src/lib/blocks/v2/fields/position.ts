import type { JSONField } from 'payload'
import { emptyPositionValue, validatePositionValue } from '@/lib/blocks/v2/apply/values'
import { styleJsonField, type StyleFieldLabels } from '@/lib/blocks/v2/fields/json-field'

export function PositionField(options?: StyleFieldLabels): JSONField {
  return styleJsonField({
    name: options?.name ?? 'position',
    label: options?.label ?? 'Position',
    description: options?.description ?? 'Positioning mode per breakpoint. Empty values inherit from smaller screens.',
    componentPath: '@/lib/blocks/v2/components/PositionField#PositionField',
    defaultValue: emptyPositionValue(),
    validate: validatePositionValue,
  })
}
