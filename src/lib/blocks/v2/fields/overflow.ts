import type { JSONField } from 'payload'
import { v2Theme } from '@/lib/blocks/v2/theme'
import { emptyOverflowValue, validateOverflowValue } from '@/lib/blocks/v2/apply/values'
import { styleJsonField, type StyleFieldLabels } from '@/lib/blocks/v2/fields/json-field'

export function OverflowField(
  options?: StyleFieldLabels & { defaults?: { linked?: boolean } },
): JSONField {
  const linked = options?.defaults?.linked ?? v2Theme.overflow.linked
  return styleJsonField({
    name: options?.name ?? 'overflow',
    label: options?.label ?? 'Overflow',
    description: options?.description ?? 'How content that overflows this box is clipped or scrolled.',
    componentPath: '@/lib/blocks/v2/components/OverflowField#OverflowField',
    defaultValue: emptyOverflowValue(linked),
    validate: validateOverflowValue,
    clientProps: { linkedDefault: linked },
  })
}
