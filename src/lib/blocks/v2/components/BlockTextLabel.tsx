'use client'

import { useFormFields, useRowLabel } from '@payloadcms/ui'
import {
  coerceBlockType,
  labelTruncateStyle,
  previewBlockText,
  readField,
} from '@/lib/blocks/v2/components/blockLabelText'

const TEXT_FIELDS_BY_BLOCK: Record<string, string[]> = {
  headingTextV2: ['text'],
  eyebrowV2: ['label'],
  subheadingV2: ['text'],
  richTextV2: ['content'],
  quoteV2: ['quote'],
  buttonV2: ['label'],
  'cta-button': ['label'],
  'icon-text': ['text'],
  'rich-text': ['content'],
}

const FALLBACK_BY_BLOCK: Record<string, string> = {
  headingTextV2: 'Heading',
  eyebrowV2: 'Eyebrow',
  subheadingV2: 'Subheading',
  richTextV2: 'Rich Text',
  quoteV2: 'Quote',
  buttonV2: 'Button',
  'cta-button': 'CTA Button',
  'icon-text': 'Icon Text',
  'rich-text': 'Rich Text',
}

type BlockTextLabelProps = {
  textFields?: string[]
  fallback?: string
  blockType?: string
}

export function BlockTextLabel({
  textFields,
  fallback,
  blockType: blockTypeFromProps,
}: BlockTextLabelProps) {
  const { data, path } = useRowLabel<Record<string, unknown>>()
  const formRow = useFormFields(([fields]) => {
    if (!path) return undefined as Record<string, unknown> | undefined
    return {
      blockType: fields[`${path}.blockType`]?.value,
      content: fields[`${path}.content`]?.value,
      label: fields[`${path}.label`]?.value,
      quote: fields[`${path}.quote`]?.value,
      text: fields[`${path}.text`]?.value,
    } as Record<string, unknown>
  })

  const blockType =
    coerceBlockType(data?.blockType) ||
    coerceBlockType(formRow?.blockType) ||
    coerceBlockType(blockTypeFromProps)

  const fields = textFields?.length
    ? textFields
    : (blockType && TEXT_FIELDS_BY_BLOCK[blockType]) || ['text', 'label', 'content', 'quote']

  let preview: string | undefined
  for (const field of fields) {
    const fromForm = formRow ? formRow[field] : undefined
    preview = previewBlockText(fromForm) || previewBlockText(readField(data, field))
    if (preview) break
  }

  const label =
    preview ||
    fallback ||
    (blockType && FALLBACK_BY_BLOCK[blockType]) ||
    'Content'

  return (
    <span style={labelTruncateStyle} title={label}>
      {label}
    </span>
  )
}
