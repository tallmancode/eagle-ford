import type { Row } from '@/payload-types'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import type { LayoutSpacingValue } from '@/lib/fields/layout-field/utils/layout-utils'
import {
  layoutVisibilityToClassName,
  mergeLayoutSpacingWithDefaults,
} from '@/lib/fields/layout-field/utils/layout-utils'
import type { LayoutVisibilityValue } from '@/lib/fields/layout-field/utils/layout-utils'
import React, { JSX } from 'react'
import {
  layoutSpacingHasVars,
  layoutSpacingToCssVars,
} from '@/lib/blocks/section-block/utils/layout-utils'
import { backgroundColorToClass } from '@/lib/fields/background-color/backgroundColorUtils'
import { cn } from '@/lib/utils/cn'

const alignClassMap: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

const verticalAlignClassMap: Record<string, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
}

const gapClassMap: Record<string, string> = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-8',
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

export const RowBlockComponent: React.FC<Row> = (props) => {
  const { content, container, accessibility, backgroundColor, align, verticalAlign, gap, wrap } =
    props

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
  const backgroundClass = backgroundColorToClass(backgroundColor)

  const rawVisibility = props.layout?.visibility
  const visibilityClass =
    rawVisibility !== null &&
    rawVisibility !== undefined &&
    typeof rawVisibility === 'object' &&
    !Array.isArray(rawVisibility)
      ? layoutVisibilityToClassName(rawVisibility as LayoutVisibilityValue)
      : ''

  const rowClass = cn(
    'flex flex-row',
    wrap !== false && 'flex-wrap',
    alignClassMap[align ?? 'left'],
    verticalAlignClassMap[verticalAlign ?? 'center'],
    gapClassMap[gap ?? 'md'],
  )

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

  const contentClasses = cn(containerClass, spacingClassPadding, rowClass)

  if (backgroundClass && container) {
    const outerClassName = cn(backgroundClass, spacingClassMargin, visibilityClass)
    return (
      <Tag className={outerClassName} style={spacingStyle} {...ariaProps}>
        <div className={contentClasses || undefined}>
          <RenderBlocks blocks={content} meta={{ inRow: true }} />
        </div>
      </Tag>
    )
  }

  const className = cn(
    backgroundClass,
    containerClass,
    spacingClassPadding,
    spacingClassMargin,
    rowClass,
    visibilityClass,
  )

  return (
    <Tag className={className} style={spacingStyle} {...ariaProps}>
      <RenderBlocks blocks={content} meta={{ inRow: true }} />
    </Tag>
  )
}
