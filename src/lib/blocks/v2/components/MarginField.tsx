'use client'

import { BoxStyleField, type BoxFieldClientProps } from '@/lib/blocks/v2/components/PaddingField'

export function MarginField(props: BoxFieldClientProps) {
  return <BoxStyleField {...props} allowNegative allowAuto fallbackLabel="Margin" />
}
