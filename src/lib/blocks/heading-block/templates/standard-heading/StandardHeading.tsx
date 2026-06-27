import type { Heading, StandardHeading as StandardHeadingContent } from '@/payload-types'
import { SplitTextHeading } from '@/lib/blocks/heading-block/templates/standard-heading/SplitTextHeading'
import { hasHeadingMarkup } from '../../utils/parseHeadingColorTags'
import { renderTextWithColorTags } from '../../utils/renderTextWithColorTags'
import {
  alignmentMap,
  colorMap,
  fontWeightMap,
  headingTagMap,
  sizeMap,
} from '../heading-template-utils'

/** Pre-migration blocks stored fields at the block root instead of in standardHeadingContent. */
type LegacyHeadingBlock = Heading & {
  heading?: string
  subheading?: string | null
  tag?: StandardHeadingContent['tag']
  headingTag?: StandardHeadingContent['headingTag']
  size?: StandardHeadingContent['size']
  alignment?: StandardHeadingContent['alignment']
  color?: StandardHeadingContent['color']
  fontWeight?: StandardHeadingContent['fontWeight']
  uppercase?: StandardHeadingContent['uppercase']
}

function getStandardContent(props: Heading): StandardHeadingContent | null {
  if (props.standardHeadingContent?.heading) {
    return props.standardHeadingContent
  }

  const legacy = props as LegacyHeadingBlock
  if (legacy.heading) {
    return {
      heading: legacy.heading,
      subheading: legacy.subheading,
      tag: legacy.tag,
      headingTag: legacy.headingTag,
      size: legacy.size,
      alignment: legacy.alignment,
      color: legacy.color,
      fontWeight: legacy.fontWeight,
      uppercase: legacy.uppercase,
    }
  }

  return null
}

export const StandardHeading: React.FC<Heading> = (props) => {
  const content = getStandardContent(props)
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
    splitTextAnimation,
  } = content

  const uppercase = uppercaseSetting ?? true
  const blockColors = colorMap[color ?? 'primary'] ?? colorMap.primary
  const sizes = sizeMap[size ?? 'lg'] ?? sizeMap.lg
  const alignClass = alignmentMap[alignment ?? 'center'] ?? alignmentMap.center
  const HeadingTag = headingTagMap[headingTag ?? 'h2'] ?? 'h2'

  const tagStyle = tag?.style ?? 'filled'
  const tagColorKey =
    tagStyle === 'none' ? (tag?.color ?? color ?? 'primary') : (color ?? 'primary')
  const tagColors = colorMap[tagColorKey] ?? colorMap.primary
  const tagStyleClass =
    tagStyle === 'outline'
      ? tagColors.tagOutline
      : tagStyle === 'filled'
        ? tagColors.tag
        : tagStyle === 'none'
          ? tagColors.tagPlain
          : null

  const tagChipClass = tagStyle === 'filled' || tagStyle === 'outline' ? 'px-3 py-1 rounded' : ''

  const headingClassName = [
    fontWeightMap[fontWeight ?? 'bold'] ?? fontWeightMap.bold,
    'leading-tight',
    sizes.heading,
    blockColors.heading,
    uppercase ? 'uppercase' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`flex flex-col mb-8 ${alignClass}`}>
      {tag?.label != null && tag?.label !== '' && tagStyleClass != null && (
        <span
          className={[
            'inline-block text-sm font-semibold tracking-widest',
            uppercase ? 'uppercase' : '',
            tagChipClass,
            tagStyleClass,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {tag.label}
        </span>
      )}

      {splitTextAnimation && !hasHeadingMarkup(heading) ? (
        <SplitTextHeading as={headingTag ?? 'h2'} className={headingClassName} text={heading} />
      ) : (
        <HeadingTag className={headingClassName}>{renderTextWithColorTags(heading)}</HeadingTag>
      )}

      {subheading && (
        <p className={`text-neutral-500 max-w-2xl ${sizes.subheading}`}>
          {renderTextWithColorTags(subheading)}
        </p>
      )}
    </div>
  )
}
