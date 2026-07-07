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
    headingTag = 'h2',
    size = 'lg',
    alignment = 'center',
    color = 'primary',
    fontWeight = 'bold',
    uppercase: uppercaseSetting,
  } = content

  const uppercase = uppercaseSetting ?? true
  const colors = colorMap[color ?? 'primary'] ?? colorMap.primary
  const sizes = sizeMap[size ?? 'lg'] ?? sizeMap.lg
  const alignClass = alignmentMap[alignment ?? 'center'] ?? alignmentMap.center
  const HeadingTag = headingTagMap[headingTag ?? 'h2'] ?? 'h2'

  return (
    <div className={`flex flex-col gap-3 mb-8 ${alignClass}`}>
      <div className="flex items-center gap-4">
        <div className="h-px w-12 bg-dark-600"></div>
        <span
          className={[
            'text-sm font-medium tracking-wider text-dark-600',
            uppercase ? 'uppercase' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {tag}
        </span>
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
