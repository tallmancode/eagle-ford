import type { Heading } from '@/payload-types'
import { renderTextWithColorTags } from '../../utils/renderTextWithColorTags'
import {
  alignmentMap,
  colorMap,
  fontWeightMap,
  headingTagMap,
  sizeMap,
} from '../heading-template-utils'

export const DashHeading: React.FC<Heading> = (props) => {
  const content = props.dashHeadingContent
  if (!content?.heading) return null

  const {
    heading,
    subheading,
    tag,
    headingTag = 'h1',
    size = 'md',
    alignment = 'left',
    color = 'neutral',
    fontWeight = 'bold',
    uppercase: uppercaseSetting,
  } = content

  const uppercase = uppercaseSetting ?? true
  const resolvedAlignment = alignment ?? 'left'
  const colors = colorMap[color ?? 'primary'] ?? colorMap.primary
  const sizes = sizeMap[size ?? 'lg'] ?? sizeMap.lg
  const alignClass = alignmentMap[resolvedAlignment] ?? alignmentMap.left
  const HeadingTag = headingTagMap[headingTag ?? 'h2'] ?? 'h2'
  const showLeftDash = resolvedAlignment === 'left' || resolvedAlignment === 'center'
  const showRightDash = resolvedAlignment === 'right' || resolvedAlignment === 'center'

  return (
    <div className={`flex flex-col gap-3 mb-8 ${alignClass}`}>
      <div className="flex items-center gap-2">
        {showLeftDash && <div className="h-px w-6 bg-primary" />}
        <span
          className={['text-sm font-medium tracking-wider text-primary', 'uppercase']
            .filter(Boolean)
            .join(' ')}
        >
          {tag}
        </span>
        {showRightDash && <div className="h-px w-6 bg-primary" />}
      </div>
      <HeadingTag
        className={[
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

      {subheading && (
        <p className={`text-neutral-500 max-w-2xl ${sizes.subheading}`}>
          {renderTextWithColorTags(subheading)}
        </p>
      )}
    </div>
  )
}
