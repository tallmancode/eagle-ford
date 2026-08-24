import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { renderTextWithColorTags } from '@/lib/blocks/heading-block/utils/renderTextWithColorTags'
import {
  alignmentMap,
  fontWeightMap,
  headingTagMap,
  sizeMap,
} from '@/lib/blocks/heading-block/templates/heading-template-utils'
import type { HeadingTextV2 } from '@/payload-types'

export function HeadingTextV2BlockComponent(props: HeadingTextV2) {
  const {
    text,
    headingTag = 'h2',
    size = 'lg',
    alignment = 'center',
    color,
    fontWeight = 'bold',
    uppercase: uppercaseSetting,
    styles,
  } = props

  if (text == null || text === '') return null

  const uppercase = uppercaseSetting ?? true
  const colorCss = resolveColorCss(color, 'primary')
  const sizes = sizeMap[size ?? 'lg'] ?? sizeMap.lg
  const alignClass = alignmentMap[alignment ?? 'center'] ?? alignmentMap.center
  const HeadingTag = headingTagMap[headingTag ?? 'h2'] ?? 'h2'
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const headingClassName = [
    fontWeightMap[fontWeight ?? 'bold'] ?? fontWeightMap.bold,
    'leading-tight',
    sizes.heading,
    uppercase ? 'uppercase' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const headingStyle: CSSProperties | undefined = colorCss ? { color: colorCss } : undefined

  return (
    <div
      className={['flex flex-col', alignClass, className].filter(Boolean).join(' ') || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <HeadingTag className={headingClassName} style={headingStyle}>
        {renderTextWithColorTags(text)}
      </HeadingTag>
    </div>
  )
}
