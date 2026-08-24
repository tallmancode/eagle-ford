import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { alignmentMap } from '@/lib/blocks/heading-block/templates/heading-template-utils'
import type { EyebrowV2 } from '@/payload-types'

export function EyebrowV2BlockComponent(props: EyebrowV2) {
  const {
    label,
    style: tagStyle = 'filled',
    color,
    alignment = 'center',
    uppercase: uppercaseSetting,
    styles,
  } = props

  if (label == null || label === '') return null

  const uppercase = uppercaseSetting ?? true
  const colorCss = resolveColorCss(color, 'primary')
  const isChip = tagStyle === 'filled' || tagStyle === 'outline'
  const isDashed = tagStyle === 'dashed'
  if (tagStyle !== 'filled' && tagStyle !== 'outline' && tagStyle !== 'dashed' && tagStyle !== 'none') {
    return null
  }

  const tagStyleProps: CSSProperties = {}
  if (colorCss) {
    tagStyleProps.color = colorCss
    if (tagStyle === 'filled') {
      tagStyleProps.backgroundColor = `color-mix(in srgb, ${colorCss} 12%, transparent)`
    }
    if (tagStyle === 'outline') tagStyleProps.borderColor = colorCss
  }

  const tagChipClass = isChip ? 'px-3 py-1 rounded' : ''
  const outlineClass = tagStyle === 'outline' ? 'border' : ''
  const resolvedAlignment = alignment ?? 'center'
  const alignClass = alignmentMap[resolvedAlignment] ?? alignmentMap.center
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const showLeftDash = isDashed && (resolvedAlignment === 'left' || resolvedAlignment === 'center')
  const showRightDash = isDashed && (resolvedAlignment === 'right' || resolvedAlignment === 'center')
  const dashStyle: CSSProperties | undefined = colorCss ? { backgroundColor: colorCss } : undefined

  const labelEl = (
    <span
      className={[
        'inline-block text-sm font-semibold tracking-widest',
        uppercase ? 'uppercase' : '',
        tagChipClass,
        outlineClass,
      ]
        .filter(Boolean)
        .join(' ')}
      style={tagStyleProps}
    >
      {label}
    </span>
  )

  return (
    <div
      className={['flex flex-col', alignClass, className].filter(Boolean).join(' ') || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      {isDashed ? (
        <div className="flex items-center gap-2">
          {showLeftDash ? <div className="h-px w-6 bg-primary" style={dashStyle} /> : null}
          {labelEl}
          {showRightDash ? <div className="h-px w-6 bg-primary" style={dashStyle} /> : null}
        </div>
      ) : (
        labelEl
      )}
    </div>
  )
}
