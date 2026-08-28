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
import type { CtaBackgroundV2, Media } from '@/payload-types'

export function CtaBackgroundV2BlockComponent(props: CtaBackgroundV2) {
  const {
    backgroundImage,
    backgroundAlt,
    heading,
    description,
    cta,
    tagline,
    overlayOpacity = 50,
    frameColor,
    buttonColor,
    styles,
  } = props

  if (!backgroundImage || typeof backgroundImage !== 'object' || !heading?.trim()) return null

  const media = backgroundImage as Media
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const frameCss = resolveColorCss(frameColor, 'background')
  const buttonCss = resolveColorCss(buttonColor, 'primary')
  const opacity = Math.min(100, Math.max(0, overlayOpacity ?? 50)) / 100

  const frameStyle: CSSProperties = {
    borderColor: frameCss ?? '#ececec',
  }
  const buttonStyle: CSSProperties | undefined = buttonCss
    ? { backgroundColor: buttonCss, borderColor: buttonCss }
    : undefined

  const resolvedLink = cta?.label ? resolveLinkFieldHref(cta.link) : null
  const newTabProps = resolvedLink?.openInNewTab
    ? { rel: 'noopener noreferrer', target: '_blank' as const }
    : {}

  return (
    <section
      className={cn('relative w-full overflow-hidden bg-foreground', className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className="absolute inset-0">
        <MediaImage
          resource={media}
          alt={backgroundAlt ?? undefined}
          fill
          imgClassName="object-cover object-center"
          maxWidth={1920}
          size="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,0) 100%)`,
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div
          className="flex w-full max-w-3xl flex-col items-center gap-8 border-[3px] border-solid p-10 text-center text-white sm:p-16 md:p-20"
          style={frameStyle}
        >
          <div className="flex flex-col items-center gap-2.5">
            <h2 className="text-3xl font-bold uppercase tracking-wide md:text-4xl md:leading-[1.25]">
              {heading}
            </h2>
            {description ? (
              <p className="max-w-xl text-sm leading-5 text-white/90">{description}</p>
            ) : null}
          </div>

          {cta?.label && resolvedLink ? (
            <Button
              className="h-[52px] rounded-[5px] bg-primary-500 px-10 text-sm font-bold uppercase tracking-wide text-white hover:bg-primary-600"
              style={buttonStyle}
              asChild
            >
              <Link href={resolvedLink.href} {...newTabProps}>
                {cta.label}
              </Link>
            </Button>
          ) : null}

          {tagline ? (
            <p className="text-sm font-bold tracking-wide text-[#ececec]">{tagline}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
