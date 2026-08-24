import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { renderTextWithColorTags } from '@/lib/blocks/heading-block/utils/renderTextWithColorTags'
import {
  alignmentMap,
  sizeMap,
} from '@/lib/blocks/heading-block/templates/heading-template-utils'
import type { SubheadingV2 } from '@/payload-types'

export function SubheadingV2BlockComponent(props: SubheadingV2) {
  const { text, size = 'lg', alignment = 'center', color, styles } = props

  if (text == null || text === '') return null

  const sizes = sizeMap[size ?? 'lg'] ?? sizeMap.lg
  const alignClass = alignmentMap[alignment ?? 'center'] ?? alignmentMap.center
  const colorCss = resolveColorCss(color, 'muted')
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })
  const textStyle: CSSProperties | undefined = colorCss ? { color: colorCss } : undefined

  return (
    <div
      className={['flex flex-col', alignClass, className].filter(Boolean).join(' ') || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <p className={colorCss ? sizes.subheading : `text-neutral-500 ${sizes.subheading}`} style={textStyle}>
        {renderTextWithColorTags(text)}
      </p>
    </div>
  )
}
