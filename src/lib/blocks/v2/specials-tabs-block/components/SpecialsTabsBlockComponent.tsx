import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { mergeColorValue } from '@/lib/blocks/v2/apply/values'
import { COLOR_TOKEN_MAP } from '@/lib/blocks/v2/theme'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import {
  SpecialsTabs,
  type SpecialsTabsAppearance,
} from '@/components/specials/SpecialsTabs'
import type { ColorTokenKey, ColorValue } from '@/lib/blocks/v2/types'

type SpecialsTabsV2Props = {
  showCategoryTitle?: boolean | null
  activeTabBackground?: ColorValue | null
  activeTabText?: ColorValue | null
  inactiveTabBackground?: ColorValue | null
  inactiveTabText?: ColorValue | null
  activeTabAccent?: ColorValue | null
  badgeBackground?: ColorValue | null
  badgeText?: ColorValue | null
  categoryTitleColor?: ColorValue | null
  pricingColor?: ColorValue | null
  mutedTextColor?: ColorValue | null
  styles?: StyleValues | null
  blockType?: string
  id?: string | null
  meta?: BlockRenderMeta
}

/** Solid hex for client-component inline styles — avoids CSS-var hydration mismatches. */
function resolveAppearanceColor(value: unknown): string | undefined {
  const merged = mergeColorValue(value, '')
  if (merged.source === 'custom' && merged.hex) return merged.hex
  if (merged.source === 'token' && merged.token) {
    const token = COLOR_TOKEN_MAP[merged.token as ColorTokenKey]
    return token?.fallback
  }
  return undefined
}

function pickAppearance(
  entries: Array<[keyof SpecialsTabsAppearance, unknown]>,
): SpecialsTabsAppearance | undefined {
  const appearance: SpecialsTabsAppearance = {}
  for (const [key, value] of entries) {
    const css = resolveAppearanceColor(value)
    if (css) appearance[key] = css
  }
  return Object.keys(appearance).length > 0 ? appearance : undefined
}

export function SpecialsTabsV2BlockComponent(props: SpecialsTabsV2Props) {
  const {
    showCategoryTitle = true,
    activeTabBackground,
    activeTabText,
    inactiveTabBackground,
    inactiveTabText,
    activeTabAccent,
    badgeBackground,
    badgeText,
    categoryTitleColor,
    pricingColor,
    mutedTextColor,
    styles,
    meta,
  } = props
  const specialsPage = meta?.specialsPage

  if (!specialsPage) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const appearance = pickAppearance([
    ['activeTabBackground', activeTabBackground],
    ['activeTabText', activeTabText],
    ['inactiveTabBackground', inactiveTabBackground],
    ['inactiveTabText', inactiveTabText],
    ['activeTabAccent', activeTabAccent],
    ['badgeBackground', badgeBackground],
    ['badgeText', badgeText],
    ['pricingColor', pricingColor],
    ['mutedTextColor', mutedTextColor],
  ])

  const categoryTitleCss = resolveAppearanceColor(categoryTitleColor)
  const titleStyle: CSSProperties | undefined = categoryTitleCss
    ? { color: categoryTitleCss }
    : undefined

  const rootStyle = style && Object.keys(style).length > 0 ? style : undefined

  return (
    <div
      className={className || undefined}
      style={rootStyle}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <section className="py-14 px-4">
        <div className="container mx-auto">
          {showCategoryTitle !== false ? (
            <div className="mb-10">
              <h1
                className={`text-3xl font-bold md:text-4xl ${categoryTitleCss ? '' : 'text-primary'}`}
                style={titleStyle}
              >
                {specialsPage.categoryTitle}
              </h1>
            </div>
          ) : null}

          <SpecialsTabs
            categorySlug={specialsPage.categorySlug}
            categoryTitle={specialsPage.categoryTitle}
            categoryEnquiryForm={specialsPage.categoryEnquiryForm}
            fordPromiseHref={specialsPage.fordPromiseHref}
            specials={specialsPage.specials}
            initialSpecialSlug={specialsPage.initialSpecialSlug}
            calculatorDefaults={specialsPage.calculatorDefaults}
            offerDetails={specialsPage.offerDetails}
            appearance={appearance}
          />
        </div>
      </section>
    </div>
  )
}
