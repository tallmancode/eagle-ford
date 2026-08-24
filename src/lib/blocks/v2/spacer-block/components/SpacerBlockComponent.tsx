import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { SpacerV2 } from '@/payload-types'
import type { CSSProperties } from 'react'

const heightMap: Record<string, string> = {
  xs: '0.5rem',
  sm: '1rem',
  md: '2rem',
  lg: '3rem',
  xl: '4rem',
  '2xl': '6rem',
}

export function SpacerV2BlockComponent(props: SpacerV2) {
  const { height = 'md', styles } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })
  const heightValue = heightMap[height ?? 'md'] ?? heightMap.md

  const mergedStyle: CSSProperties = {
    ...style,
    height: heightValue,
    minHeight: heightValue,
  }

  return (
    <div
      aria-hidden="true"
      className={className || undefined}
      style={mergedStyle}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    />
  )
}
