import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'
import { cn } from '@/lib/utils/cn'
import { ArrowUpRight, Check, Play } from 'lucide-react'
import Link from 'next/link'
import type { CtaImageV2, Media } from '@/payload-types'

export function CtaImageV2BlockComponent(props: CtaImageV2) {
  const {
    image,
    imageAlt,
    showPlayButton = false,
    videoUrl,
    heading,
    description,
    checklist,
    cta,
    mediaSide = 'left',
    panelColor,
    buttonColor,
    styles,
  } = props

  if (!heading?.trim() || !image || typeof image !== 'object') return null

  const media = image as Media
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const panelCss = resolveColorCss(panelColor, 'background')
  const buttonCss = resolveColorCss(buttonColor, 'primary')

  const panelStyle: CSSProperties | undefined = panelCss ? { backgroundColor: panelCss } : undefined
  const buttonStyle: CSSProperties | undefined = buttonCss
    ? { backgroundColor: buttonCss, borderColor: buttonCss }
    : undefined

  const resolvedLink = cta?.label ? resolveLinkFieldHref(cta.link) : null
  const newTabProps = resolvedLink?.openInNewTab
    ? { rel: 'noopener noreferrer', target: '_blank' as const }
    : {}

  const mediaOnLeft = mediaSide !== 'right'

  const mediaPanel = (
    <div className="relative min-h-[280px] overflow-hidden rounded-l-2xl bg-muted max-lg:rounded-2xl lg:min-h-[520px]">
      <MediaImage
        resource={media}
        alt={imageAlt ?? undefined}
        fill
        imgClassName="object-cover object-center"
        maxWidth={1200}
        size="(max-width: 1024px) 100vw, 55vw"
      />
      {showPlayButton ? (
        videoUrl ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-1/2 top-1/2 flex size-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105"
            aria-label="Play video"
          >
            <Play className="size-6 fill-foreground text-foreground" width={24} height={24} />
          </a>
        ) : (
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 flex size-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
            aria-hidden
          >
            <Play className="size-6 fill-foreground text-foreground" width={24} height={24} />
          </div>
        )
      ) : null}
    </div>
  )

  const contentPanel = (
    <div
      className={cn(
        'flex flex-col justify-center gap-6 bg-[#eef1fb] px-8 py-12 sm:px-12 lg:px-16 lg:py-16',
        mediaOnLeft ? 'rounded-r-2xl max-lg:rounded-2xl' : 'rounded-l-2xl max-lg:rounded-2xl',
      )}
      style={panelStyle}
    >
      <h2 className="whitespace-pre-line text-3xl font-bold leading-tight text-foreground md:text-4xl md:leading-[1.4]">
        {heading}
      </h2>
      {description ? (
        <p className="max-w-xl text-[15px] leading-relaxed text-foreground/80">{description}</p>
      ) : null}
      {checklist?.length ? (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {checklist.map((item, index) => (
            <li key={item.id ?? index} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-[25px] shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Check className="size-3 text-foreground" strokeWidth={3} width={12} height={12} />
              </span>
              <span className="text-[15px] font-medium leading-relaxed text-foreground">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {cta?.label && resolvedLink ? (
        <Button
          className="h-[56px] w-fit gap-2 rounded-xl bg-primary-500 px-6 text-[15px] font-medium text-white hover:bg-primary-600"
          style={buttonStyle}
          asChild
        >
          <Link href={resolvedLink.href} {...newTabProps}>
            {cta.label}
            <ArrowUpRight className="size-3.5" width={14} height={14} aria-hidden />
          </Link>
        </Button>
      ) : null}
    </div>
  )

  return (
    <section
      className={cn('w-full px-4 py-4 sm:px-6 lg:px-8', className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className={cn(!mediaOnLeft && 'lg:order-2')}>{mediaPanel}</div>
        <div className={cn(!mediaOnLeft && 'lg:order-1')}>{contentPanel}</div>
      </div>
    </section>
  )
}
