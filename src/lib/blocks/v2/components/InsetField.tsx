'use client'

import { BoxStyleField, type BoxFieldClientProps } from '@/lib/blocks/v2/components/PaddingField'

export function InsetField(props: BoxFieldClientProps) {
  return <BoxStyleField {...props} allowNegative allowAuto fallbackLabel="Inset" />
}
