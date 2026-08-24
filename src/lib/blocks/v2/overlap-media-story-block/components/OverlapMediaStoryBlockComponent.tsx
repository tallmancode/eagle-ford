import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { renderTextWithColorTags } from '@/lib/blocks/heading-block/utils/renderTextWithColorTags'
import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'
import { cn } from '@/lib/utils/cn'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import type { Media, OverlapMediaStoryV2 } from '@/payload-types'
import Link from 'next/link'

export function OverlapMediaStoryV2BlockComponent(
  props: OverlapMediaStoryV2 & { meta?: BlockRenderMeta },
) {
  const {
    primaryImage,
    primaryAlt,
    secondaryImage,
    secondaryAlt,
    accentColor,
    heading,
    headingColor,
    body,
    bodyColor,
    textAlign = 'left',
    contentSide = 'right',
    cta,
    content,
    styles,
    meta,
  } = props

  if (!primaryImage || typeof primaryImage !== 'object') return null
  if (!secondaryImage || typeof secondaryImage !== 'object') return null

  const nestedCopy = Array.isArray(content) && content.length > 0
  if (!nestedCopy && (!heading || !body)) return null

  const primary = primaryImage as Media
  const secondary = secondaryImage as Media
  const accentCss = resolveColorCss(accentColor, 'warning')
  const headingCss = resolveColorCss(headingColor, 'foreground')
  const bodyCss = resolveColorCss(bodyColor, 'muted')
  const alignRight = textAlign === 'right'
  const copyOnRight = contentSide !== 'left'

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const resolvedLink = cta?.label ? resolveLinkFieldHref(cta.link) : null
  const newTabProps = resolvedLink?.openInNewTab
    ? { rel: 'noopener noreferrer', target: '_blank' as const }
    : {}

  const accentStyle: CSSProperties | undefined = accentCss
    ? { backgroundColor: accentCss }
    : { backgroundColor: 'var(--color-warning, #e8c96a)' }

  const headingStyle: CSSProperties | undefined = headingCss ? { color: headingCss } : undefined
  const bodyStyle: CSSProperties | undefined = bodyCss ? { color: bodyCss } : undefined

  const collage = (
    <div className="relative w-full max-w-xl px-1 pb-10 pt-12 sm:pt-14 lg:max-w-none lg:pb-8">
      <div
        className={cn('relative overflow-hidden bg-muted', copyOnRight ? 'ml-[16%]' : 'mr-[16%] ml-auto')}
        style={{ width: '84%', aspectRatio: '4 / 3' }}
      >
        <MediaImage
          resource={primary}
          alt={primaryAlt ?? undefined}
          fill
          imgClassName="object-cover object-center"
          maxWidth={1200}
          size="(max-width: 1024px) 90vw, 560px"
        />
      </div>

      <div
        className="absolute z-20 overflow-hidden bg-muted shadow-md"
        style={{
          width: '46%',
          aspectRatio: '1',
          top: '-6%',
          ...(copyOnRight ? { left: '-4%' } : { right: '-4%' }),
        }}
      >
        <MediaImage
          resource={secondary}
          alt={secondaryAlt ?? undefined}
          fill
          imgClassName="object-cover object-center"
          maxWidth={800}
          size="(max-width: 1024px) 50vw, 360px"
        />
      </div>

      <div
        aria-hidden
        className="absolute z-10"
        style={{
          ...accentStyle,
          top: '54%',
          width: '24%',
          aspectRatio: '1',
          ...(copyOnRight
            ? { right: '2%', transform: 'translateX(12%)' }
            : { left: '2%', transform: 'translateX(-12%)' }),
        }}
      />
    </div>
  )

  const copy = (
    <div
      className={cn(
        'relative z-20 flex w-full max-w-md flex-col gap-5 lg:max-w-lg',
        alignRight ? 'items-end text-right' : 'items-start text-left',
        copyOnRight ? 'lg:pl-4' : 'lg:pr-4',
      )}
    >
      {nestedCopy ? (
        <RenderBlocks blocks={content} meta={meta} />
      ) : (
        <>
          <h2
            className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem]"
            style={headingStyle}
          >
            {renderTextWithColorTags(heading ?? '')}
          </h2>
          <p className="max-w-prose text-base leading-relaxed text-muted-foreground" style={bodyStyle}>
            {body}
          </p>
          {cta?.label && resolvedLink ? (
            <Button variant="default" className="rounded-none uppercase tracking-wide" asChild>
              <Link href={resolvedLink.href} {...newTabProps}>
                {cta.label}
              </Link>
            </Button>
          ) : null}
        </>
      )}
    </div>
  )

  return (
    <div
      className={cn('relative w-full overflow-visible py-8 sm:py-12', className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:gap-20 lg:px-8">
        <div className={cn('relative min-w-0', !copyOnRight && 'lg:order-2')}>{collage}</div>
        <div
          className={cn(
            'relative flex min-w-0 items-center justify-center',
            !copyOnRight && 'lg:order-1',
          )}
        >
          {copy}
        </div>
      </div>
    </div>
  )
}
