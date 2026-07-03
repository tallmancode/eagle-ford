'use client'

import { FieldWrapper } from '@/lib/blocks/form-block/components/fields/FieldWrapper'

type SubheadingFieldProps = {
  text?: string | null
  size?: 'h2' | 'h3' | 'h4' | null
  width?: number | null
}

const sizeClasses: Record<'h2' | 'h3' | 'h4', string> = {
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-semibold',
  h4: 'text-lg font-semibold',
}

export function SubheadingField({ text, size, width }: SubheadingFieldProps) {
  if (!text) {
    return null
  }

  const tag = size ?? 'h2'
  const Tag = tag
  const className = sizeClasses[tag]

  return (
    <FieldWrapper width={width}>
      <Tag className={className}>{text}</Tag>
    </FieldWrapper>
  )
}
