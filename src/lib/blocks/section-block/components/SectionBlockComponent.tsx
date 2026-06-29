import { Section, SectionInner } from '@/payload-types'
import { RenderBlocks, renderBlock } from '@/lib/blocks/RenderBlocks'
import type { LayoutSpacingValue } from '@/lib/fields/layout-field/utils/layout-utils'
import { mergeLayoutSpacingWithDefaults } from '@/lib/fields/layout-field/utils/layout-utils'

import React, { JSX } from 'react'
import {
  layoutSpacingHasVars,
  layoutSpacingToCssVars,
} from '@/lib/blocks/section-block/utils/layout-utils'
import { backgroundColorToClass } from '@/lib/fields/background-color/backgroundColorUtils'
import { sectionBackgroundStyleToClass } from '@/lib/blocks/section-block/sectionBackgroundStyleUtils'
import {
  sectionDividerColorToClass,
  sectionDividerVisibilityClass,
} from '@/lib/blocks/section-block/sectionDividerUtils'
import { cn } from '@/lib/utils/cn'

const verticalAlignClassMap: Record<string, string> = {
  center: 'flex flex-col h-full justify-center',
  bottom: 'flex flex-col h-full justify-end',
}

const gridColsClassMap: Record<string, string> = {
  '2': 'grid grid-cols-1 gap-8 md:gap-16 lg:grid-cols-2',
  '3': 'grid grid-cols-1 gap-8 md:gap-16 lg:grid-cols-3',
  '4': 'grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4',
}

const landmarkElementMap: Record<string, keyof JSX.IntrinsicElements> = {
  main: 'main',
  banner: 'header',
  contentinfo: 'footer',
  navigation: 'nav',
  complementary: 'aside',
  region: 'section',
  search: 'search',
  form: 'form',
}

function renderSectionContent(
  props: Section | SectionInner,
  gridCols: Section['gridCols'] | undefined,
): React.ReactNode {
  const { content } = props
  const showDivider = 'showDivider' in props ? props.showDivider : false
  const dividerColor = 'dividerColor' in props ? props.dividerColor : undefined

  if (!showDivider || !gridCols || gridCols === '1' || !content?.length) {
    return <RenderBlocks blocks={content as Parameters<typeof RenderBlocks>[0]['blocks']} />
  }

  const dividerColorClass = sectionDividerColorToClass(dividerColor)
  const dividerVisibilityClass = sectionDividerVisibilityClass(gridCols)

  type AnyBlock = Parameters<typeof renderBlock>[0]
  return (
    <>
      {(content as AnyBlock[]).map((block, index) => {
        const key = 'id' in block && block.id ? String(block.id) : `${block.blockType}-${index}`

        return (
          <div key={key} className="relative">
            {index > 0 && (
              <div
                className={cn(
                  'absolute left-0 top-[15%] h-[70%] w-2 -translate-x-1/2',
                  dividerColorClass,
                  dividerVisibilityClass,
                )}
                aria-hidden
              />
            )}
            {renderBlock(block, index)}
          </div>
        )
      })}
    </>
  )
}

export const SectionBlock: React.FC<Section | SectionInner> = (props) => {
  const { container, accessibility, backgroundColor, backgroundStyle } = props

  const gridCols = 'gridCols' in props ? props.gridCols : undefined
  const verticalAlign = 'verticalAlign' in props ? props.verticalAlign : undefined

  const raw = props.layout?.spacing
  const layoutSpacingNormalized =
    raw !== null && raw !== undefined && typeof raw === 'object' && !Array.isArray(raw)
      ? mergeLayoutSpacingWithDefaults(raw as LayoutSpacingValue, [])
      : null

  const hasLayoutSpacingPadding = layoutSpacingNormalized
    ? layoutSpacingHasVars(layoutSpacingNormalized, 'padding')
    : false

  const hasLayoutSpacingMargin = layoutSpacingNormalized
    ? layoutSpacingHasVars(layoutSpacingNormalized, 'margin')
    : false

  const spacingStyle =
    hasLayoutSpacingPadding || hasLayoutSpacingMargin
      ? layoutSpacingToCssVars(layoutSpacingNormalized!)
      : undefined

  const containerClass = container ? 'container' : ''
  const spacingClassPadding = hasLayoutSpacingPadding ? 'section-layout-padding' : ''
  const spacingClassMargin = hasLayoutSpacingMargin ? 'section-layout-margin' : ''
  const verticalAlignClass = verticalAlign ? (verticalAlignClassMap[verticalAlign] ?? '') : ''
  const gridColsClass = gridCols ? (gridColsClassMap[gridCols] ?? '') : ''
  const backgroundClass = backgroundColorToClass(backgroundColor)
  const backgroundStyleClass = sectionBackgroundStyleToClass(backgroundStyle)

  const landmark = accessibility?.landmark
  const Tag = (
    landmark === '' ? 'div' : (landmarkElementMap[landmark ?? ''] ?? 'section')
  ) as React.ElementType
  const role = landmark && !landmarkElementMap[landmark] ? landmark : undefined

  const ariaProps = {
    id: accessibility?.sectionId || undefined,
    role,
    'aria-label': accessibility?.ariaLabel || undefined,
    'aria-labelledby': accessibility?.ariaLabelledBy || undefined,
    'aria-describedby': accessibility?.ariaDescribedBy || undefined,
    'aria-roledescription': accessibility?.ariaRoleDescription || undefined,
    'aria-hidden': accessibility?.ariaHidden === true ? true : undefined,
    tabIndex: accessibility?.tabIndex ? Number(accessibility.tabIndex) : undefined,
  }

  const contentClasses = [containerClass, spacingClassPadding, verticalAlignClass, gridColsClass]
    .filter(Boolean)
    .join(' ')

  // Background on the same element as `container` only spans the max-width box — wrap when both are set.
  if ((backgroundClass || backgroundStyleClass) && container) {
    const outerClassName = [backgroundClass, backgroundStyleClass, spacingClassMargin]
      .filter(Boolean)
      .join(' ')
    return (
      <Tag className={outerClassName} style={spacingStyle} {...ariaProps}>
        <div className={contentClasses || undefined}>{renderSectionContent(props, gridCols)}</div>
      </Tag>
    )
  }

  const className = [
    backgroundClass,
    backgroundStyleClass,
    containerClass,
    spacingClassPadding,
    spacingClassMargin,
    verticalAlignClass,
    gridColsClass,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={className} style={spacingStyle} {...ariaProps}>
      {renderSectionContent(props, gridCols)}
    </Tag>
  )
}
