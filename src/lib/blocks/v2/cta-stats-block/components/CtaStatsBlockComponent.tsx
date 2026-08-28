import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import type { CtaStatsV2, Media } from '@/payload-types'

export function CtaStatsV2BlockComponent(props: CtaStatsV2) {
  const {
    heading,
    description,
    cta,
    image,
    imageAlt,
    stats,
    headingColor,
    statValueColor,
    buttonColor,
    styles,
  } = props

  if (!heading?.trim() || !image || typeof image !== 'object' || !stats?.length) return null

  const media = image as Media
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const headingCss = resolveColorCss(headingColor, 'foreground')
  const statCss = resolveColorCss(statValueColor, 'foreground')
  const buttonCss = resolveColorCss(buttonColor, 'primary')

  const headingStyle: CSSProperties | undefined = headingCss ? { color: headingCss } : undefined
  const statStyle: CSSProperties | undefined = statCss ? { color: statCss } : undefined
  const buttonStyle: CSSProperties | undefined = buttonCss
    ? { backgroundColor: buttonCss, borderColor: buttonCss }
    : undefined

  const resolvedLink = cta?.label ? resolveLinkFieldHref(cta.link) : null
  const newTabProps = resolvedLink?.openInNewTab
    ? { rel: 'noopener noreferrer', target: '_blank' as const }
    : {}

  return (
    <section
      className={cn('w-full py-16 md:py-20', className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-3 lg:gap-8 lg:px-8">
        <div className="flex flex-col items-start gap-9">
          <h2
            className="whitespace-pre-line text-2xl font-bold leading-8 tracking-tight text-foreground"
            style={headingStyle}
          >
            {heading}
          </h2>
          {description ? (
            <p className="max-w-[14rem] text-sm leading-5 text-muted-foreground">{description}</p>
          ) : null}
          {cta?.label && resolvedLink ? (
            <Button
              className="h-auto rounded-[5px] bg-primary-500 px-10 py-[15px] text-sm font-bold uppercase tracking-wide text-white hover:bg-primary-600"
              style={buttonStyle}
              asChild
            >
              <Link href={resolvedLink.href} {...newTabProps}>
                {cta.label}
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="relative mx-auto aspect-[337/490] w-full max-w-sm overflow-hidden rounded-sm bg-muted md:max-w-none">
          <MediaImage
            resource={media}
            alt={imageAlt ?? undefined}
            fill
            imgClassName="object-cover object-center"
            maxWidth={800}
            size="(max-width: 768px) 90vw, 33vw"
          />
        </div>

        <div className="flex flex-col gap-1">
          {stats.map((stat, index) => (
            <div key={stat.id ?? index} className="flex flex-col gap-4 p-6">
              <p
                className="text-4xl font-bold leading-[50px] tracking-wide text-foreground"
                style={statStyle}
              >
                {stat.value}
              </p>
              <p className="text-base leading-6 tracking-wide text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
