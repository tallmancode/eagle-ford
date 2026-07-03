import type { Heading } from '@/payload-types'
import { renderTextWithColorTags } from '../../utils/renderTextWithColorTags'
import {
  colorMap,
  fontWeightMap,
  headingTagMap,
  rowAlignmentMap,
  sizeMap,
} from '../heading-template-utils'

export const SeparatorHeading: React.FC<Heading> = (props) => {
  const content = props.separatorHeadingContent
  if (!content?.heading) return null

  const {
    heading,
    headingTag = 'h2',
    size = 'lg',
    alignment = 'center',
    color = 'primary',
    fontWeight = 'bold',
    uppercase: uppercaseSetting,
  } = content

  const uppercase = uppercaseSetting ?? false
  const colors = colorMap[color ?? 'primary'] ?? colorMap.primary
  const sizes = sizeMap[size ?? 'lg'] ?? sizeMap.lg
  const rowAlignClass = rowAlignmentMap[alignment ?? 'center'] ?? rowAlignmentMap.center
  const HeadingTag = headingTagMap[headingTag ?? 'h2'] ?? 'h2'

  const showLeftLine = alignment !== 'left'
  const showRightLine = alignment !== 'right'
  const lineColorClass = color === 'white' ? 'bg-white/30' : 'bg-neutral-300'

  return (
    <div className={`mb-8 flex w-full items-center gap-4 ${rowAlignClass} `}>
      {showLeftLine && <div className={`h-px flex-1 ${lineColorClass}`} aria-hidden="true" />}
      <HeadingTag
        className={[
          'shrink-0',
          fontWeightMap[fontWeight ?? 'bold'] ?? fontWeightMap.bold,
          'leading-tight',
          sizes.heading,
          colors.heading,
          uppercase ? 'uppercase' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {renderTextWithColorTags(heading)}
      </HeadingTag>
      {showRightLine && <div className={`h-px flex-1 ${lineColorClass}`} aria-hidden="true" />}
    </div>
  )
}
