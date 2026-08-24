'use client'

import { useFormFields, useRowLabel } from '@payloadcms/ui'
import {
  labelTruncateStyle,
  previewBlockText,
} from '@/lib/blocks/v2/components/blockLabelText'

/**
 * Eyebrow stores copy in a field named `label`. That name collides with Payload's
 * block Label / `label: false` on the parent blocks field, so useRowLabel often
 * has no usable `data.label` or `data.blockType` and the shared fallback became
 * "Block". Read the form value at `${rowPath}.label` instead.
 */
export function EyebrowV2BlockLabel() {
  const { data, path } = useRowLabel<Record<string, unknown>>()
  const formLabel = useFormFields(([fields]) =>
    path ? fields[`${path}.label`]?.value : undefined,
  )

  const preview =
    previewBlockText(formLabel) || previewBlockText(data?.label) || previewBlockText(data?.text)

  const label = preview || 'Eyebrow'

  return (
    <span style={labelTruncateStyle} title={label}>
      {label}
    </span>
  )
}
