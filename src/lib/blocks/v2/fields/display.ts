import type { JSONField } from 'payload'
import { emptyDisplayValue, validateDisplayValue } from '@/lib/blocks/v2/apply/values'
import { styleJsonField, type StyleFieldLabels } from '@/lib/blocks/v2/fields/json-field'

export function DisplayField(options?: StyleFieldLabels): JSONField {
  return styleJsonField({
    name: options?.name ?? 'display',
    label: options?.label ?? 'Display',
    description: options?.description ?? 'Layout mode per breakpoint. Empty values inherit from smaller screens.',
    componentPath: '@/lib/blocks/v2/components/DisplayField#DisplayField',
    defaultValue: emptyDisplayValue(),
    validate: validateDisplayValue,
  })
}
