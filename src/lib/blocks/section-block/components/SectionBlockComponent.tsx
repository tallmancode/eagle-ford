import { Section, SectionInner } from '@/payload-types'
import { RenderBlocks, renderBlock } from '@/lib/blocks/RenderBlocks'
import React, { JSX } from 'react'
import type {
  FlexLayoutValue,
  LayoutSpacingValue,
} from '@/lib/fields/layout-field/utils/layout-utils'
import {
  flexLayoutGapToCssVars,
  flexLayoutHasConfig,
  flexLayoutHasGap,
  flexLayoutToClassName,
  layoutVisibilityToClassName,
  mergeFlexLayoutWithDefaults,
  mergeLayoutSpacingWithDefaults,
  layoutSpacingHasVars,
  layoutSpacingToCssVars,
} from '@/lib/fields/layout-field/utils/layout-utils'
import type { LayoutVisibilityValue } from '@/lib/fields/layout-field/utils/layout-utils'
import { backgroundColorToClass } from '@/lib/fields/background-color/backgroundColorUtils'
import { sectionBackgroundStyleToClass } from '@/lib/blocks/section-block/sectionBackgroundStyleUtils'
import {
  sectionDividerColorToClass,
  sectionDividerVisibilityClass,
} from '@/lib/blocks/section-block/sectionDividerUtils'
import { cn } from '@/lib/utils/cn'
import type { FormBlockMeta } from '@/lib/blocks/form-block/types/formContext'

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
  meta?: FormBlockMeta,
): React.ReactNode {
  const { content } = props
  const showDivider = 'showDivider' in props ? props.showDivider : false
  const dividerColor = 'dividerColor' in props ? props.dividerColor : undefined

  if (!showDivider || !gridCols || gridCols === '1' || !content?.length) {
    return (
      <RenderBlocks blocks={content as Parameters<typeof RenderBlocks>[0]['blocks']} meta={meta} />
    )
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
            {renderBlock(block, index, meta)}
          </div>
        )
      })}
    </>
  )
}

export const SectionBlock: React.FC<(Section | SectionInner) & { meta?: FormBlockMeta }> = (
  props,
) => {
  const { meta, ...sectionProps } = props
  const { container, accessibility, backgroundColor, backgroundStyle } = sectionProps

  const gridCols = 'gridCols' in sectionProps ? sectionProps.gridCols : undefined
  const verticalAlign = 'verticalAlign' in sectionProps ? sectionProps.verticalAlign : undefined

  const raw = sectionProps.layout?.spacing
  const layoutSpacingNormalized =
    raw !== null && raw !== undefined && typeof raw === 'object' && !Array.isArray(raw)
      ? mergeLayoutSpacingWithDefaults(raw as LayoutSpacingValue, [])
      : null

  const rawFlex = sectionProps.layout?.flex
  const layoutFlexNormalized =
    rawFlex !== null &&
    rawFlex !== undefined &&
    typeof rawFlex === 'object' &&
    !Array.isArray(rawFlex)
      ? mergeFlexLayoutWithDefaults(rawFlex as FlexLayoutValue)
      : null

  const useFlexLayout =
    (!gridCols || gridCols === '1') &&
    layoutFlexNormalized !== null &&
    flexLayoutHasConfig(layoutFlexNormalized)

  const flexClass = useFlexLayout ? flexLayoutToClassName(layoutFlexNormalized) : ''
  const hasFlexGap = useFlexLayout && flexLayoutHasGap(layoutFlexNormalized)
  const flexGapClass = hasFlexGap ? 'section-layout-flex-gap' : ''

  const hasLayoutSpacingPadding = layoutSpacingNormalized
    ? layoutSpacingHasVars(layoutSpacingNormalized, 'padding')
    : false

  const hasLayoutSpacingMargin = layoutSpacingNormalized
    ? layoutSpacingHasVars(layoutSpacingNormalized, 'margin')
    : false

  const spacingStyle =
    hasLayoutSpacingPadding || hasLayoutSpacingMargin || hasFlexGap
      ? {
          ...((hasLayoutSpacingPadding || hasLayoutSpacingMargin) && layoutSpacingNormalized
            ? layoutSpacingToCssVars(layoutSpacingNormalized)
            : {}),
          ...(hasFlexGap && layoutFlexNormalized
            ? flexLayoutGapToCssVars(layoutFlexNormalized)
            : {}),
        }
      : undefined

  const containerClass = container ? 'container' : ''
  const spacingClassPadding = hasLayoutSpacingPadding ? 'section-layout-padding' : ''
  const spacingClassMargin = hasLayoutSpacingMargin ? 'section-layout-margin' : ''
  const verticalAlignClass =
    useFlexLayout || !verticalAlign ? '' : (verticalAlignClassMap[verticalAlign] ?? '')
  const gridColsClass = gridCols && gridCols !== '1' ? (gridColsClassMap[gridCols] ?? '') : ''
  const backgroundClass = backgroundColorToClass(backgroundColor)
  const backgroundStyleClass = sectionBackgroundStyleToClass(backgroundStyle)

  const rawVisibility = sectionProps.layout?.visibility
  const visibilityClass =
    rawVisibility !== null &&
    rawVisibility !== undefined &&
    typeof rawVisibility === 'object' &&
    !Array.isArray(rawVisibility)
      ? layoutVisibilityToClassName(rawVisibility as LayoutVisibilityValue)
      : ''

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

  const contentClasses = [
    containerClass,
    spacingClassPadding,
    flexClass,
    flexGapClass,
    verticalAlignClass,
    gridColsClass,
  ]
    .filter(Boolean)
    .join(' ')

  // Background on the same element as `container` only spans the max-width box — wrap when both are set.
  if ((backgroundClass || backgroundStyleClass) && container) {
    const outerClassName = [
      backgroundClass,
      backgroundStyleClass,
      spacingClassMargin,
      visibilityClass,
    ]
      .filter(Boolean)
      .join(' ')
    return (
      <Tag className={outerClassName} style={spacingStyle} {...ariaProps}>
        <div className={contentClasses || undefined}>
          {renderSectionContent(sectionProps, gridCols, meta)}
        </div>
      </Tag>
    )
  }

  const className = [
    backgroundClass,
    backgroundStyleClass,
    containerClass,
    spacingClassPadding,
    spacingClassMargin,
    flexClass,
    flexGapClass,
    verticalAlignClass,
    gridColsClass,
    visibilityClass,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={className} style={spacingStyle} {...ariaProps}>
      {renderSectionContent(sectionProps, gridCols, meta)}
    </Tag>
  )
}
