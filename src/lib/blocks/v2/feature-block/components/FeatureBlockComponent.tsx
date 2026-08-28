import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'
import { cn } from '@/lib/utils/cn'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { FeatureV2 } from '@/payload-types'

export function FeatureV2BlockComponent(props: FeatureV2) {
  const {
    showAccentBar = true,
    heading,
    description,
    link,
    features,
    accentColor,
    headingColor,
    descriptionColor,
    linkColor,
    styles,
  } = props

  if (!heading?.trim() || !features?.length) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const accentCss = resolveColorCss(accentColor, 'danger')
  const headingCss = resolveColorCss(headingColor, 'foreground')
  const descriptionCss = resolveColorCss(descriptionColor, 'muted')
  const linkCss = resolveColorCss(linkColor, 'primary')

  const accentStyle: CSSProperties | undefined = accentCss
    ? { backgroundColor: accentCss }
    : undefined
  const headingStyle: CSSProperties | undefined = headingCss ? { color: headingCss } : undefined
  const descriptionStyle: CSSProperties | undefined = descriptionCss
    ? { color: descriptionCss }
    : undefined
  const linkStyle: CSSProperties | undefined = linkCss ? { color: linkCss } : undefined

  const resolvedLink = link?.label ? resolveLinkFieldHref(link.href) : null
  const newTabProps = resolvedLink?.openInNewTab
    ? { rel: 'noopener noreferrer', target: '_blank' as const }
    : {}

  return (
    <section
      className={cn('w-full py-16 md:py-24', className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="flex max-w-lg flex-col items-start gap-6">
          {showAccentBar ? (
            <div className="h-[7px] w-[94px] bg-destructive" style={accentStyle} aria-hidden />
          ) : null}
          <h2
            className="whitespace-pre-line text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-[3.625rem] lg:leading-[1.35]"
            style={headingStyle}
          >
            {heading}
          </h2>
          {description ? (
            <p
              className="text-sm leading-5 tracking-wide text-muted-foreground"
              style={descriptionStyle}
            >
              {description}
            </p>
          ) : null}
          {link?.label && resolvedLink ? (
            <Link
              href={resolvedLink.href}
              className="inline-flex items-center gap-2.5 text-sm font-bold tracking-wide text-primary-500 hover:underline"
              style={linkStyle}
              {...newTabProps}
            >
              {link.label}
              <ChevronRight className="size-4 shrink-0" aria-hidden width={16} height={16} />
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = lucideIconMap[feature.icon as keyof typeof lucideIconMap]
            return (
              <div
                key={feature.id ?? index}
                className="flex gap-5 rounded-sm bg-card p-6 shadow-sm"
              >
                <div
                  className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-destructive text-white"
                  style={accentStyle}
                >
                  {Icon ? <Icon className="size-5 text-white" strokeWidth={1.75} aria-hidden /> : null}
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-sm font-bold leading-6 text-foreground">{feature.title}</p>
                  <p className="text-xs leading-4 text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
