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
import type { Media, QuoteCtaV2 } from '@/payload-types'

export function QuoteCtaV2BlockComponent(props: QuoteCtaV2) {
  const {
    quote,
    attribution,
    body,
    cta,
    image,
    imageAlt,
    backgroundColor,
    quoteColor,
    buttonColor,
    styles,
  } = props

  if (!quote?.trim() || !image || typeof image !== 'object') return null

  const media = image as Media
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const bgCss = resolveColorCss(backgroundColor, 'foreground')
  const quoteCss = resolveColorCss(quoteColor, 'background')
  const buttonCss = resolveColorCss(buttonColor, 'primary')

  const rootStyle: CSSProperties = {
    ...style,
    backgroundColor: bgCss ?? 'var(--color-foreground, #0a0a0a)',
  }
  const quoteStyle: CSSProperties | undefined = quoteCss ? { color: quoteCss } : undefined
  const buttonStyle: CSSProperties | undefined = buttonCss
    ? { backgroundColor: buttonCss, borderColor: buttonCss }
    : undefined

  const resolvedLink = cta?.label ? resolveLinkFieldHref(cta.link) : null
  const newTabProps = resolvedLink?.openInNewTab
    ? { rel: 'noopener noreferrer', target: '_blank' as const }
    : {}

  return (
    <section
      className={cn('relative w-full overflow-hidden bg-foreground text-white', className)}
      style={rootStyle}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:py-20">
        <div className="relative z-10 flex max-w-xl flex-col items-start gap-8">
          <figure className="flex flex-col gap-4">
            <blockquote
              className="text-3xl font-normal leading-tight text-white md:text-[3.375rem] md:leading-normal"
              style={quoteStyle}
            >
              {quote}
            </blockquote>
            {attribution ? (
              <figcaption className="text-xl font-bold text-[#848484]">{attribution}</figcaption>
            ) : null}
          </figure>

          {body ? (
            <p className="max-w-xl text-lg leading-relaxed text-white/90">{body}</p>
          ) : null}

          {cta?.label && resolvedLink ? (
            <Button
              className="h-[54px] min-w-[274px] rounded-none bg-primary-500 px-8 text-lg font-medium text-white hover:bg-primary-600"
              style={buttonStyle}
              asChild
            >
              <Link href={resolvedLink.href} {...newTabProps}>
                {cta.label}
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl lg:mx-0 lg:max-w-none">
          <MediaImage
            resource={media}
            alt={imageAlt ?? undefined}
            fill
            imgClassName="object-contain object-right-bottom"
            maxWidth={1200}
            size="(max-width: 1024px) 90vw, 50vw"
          />
        </div>
      </div>
    </section>
  )
}
