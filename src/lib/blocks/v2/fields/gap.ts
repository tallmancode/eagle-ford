import type { JSONField } from 'payload'
import { v2Theme } from '@/lib/blocks/v2/theme'
import { emptyGapValue, validateGapValue } from '@/lib/blocks/v2/apply/values'
import { styleJsonField, type BoxFieldDefaults, type StyleFieldLabels } from '@/lib/blocks/v2/fields/json-field'

export function GapField(options?: StyleFieldLabels & { defaults?: BoxFieldDefaults }): JSONField {
  const linked = options?.defaults?.linked ?? v2Theme.gap.linked
  const unit = options?.defaults?.unit ?? v2Theme.gap.unit
  return styleJsonField({
    name: options?.name ?? 'gap',
    label: options?.label ?? 'Gap',
    description:
      options?.description ?? 'Row and column gap when this element is flex or grid. Empty values inherit from smaller screens.',
    componentPath: '@/lib/blocks/v2/components/GapField#GapField',
    defaultValue: emptyGapValue({ linked, unit }),
    validate: validateGapValue,
    clientProps: { linkedDefault: linked, unitDefault: unit },
  })
}
