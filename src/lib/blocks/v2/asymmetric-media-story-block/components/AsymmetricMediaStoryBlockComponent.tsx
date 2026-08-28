import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { MediaImage } from '@/components/ui/media-image'
import { cn } from '@/lib/utils/cn'
import type { AsymmetricMediaStoryV2, Media } from '@/payload-types'

export function AsymmetricMediaStoryV2BlockComponent(props: AsymmetricMediaStoryV2) {
  const {
    eyebrow,
    heading,
    text,
    image1,
    image1Alt,
    image2,
    image2Alt,
    image3,
    image3Alt,
    eyebrowColor,
    headingColor,
    textColor,
    styles,
  } = props

  if (!image1 || typeof image1 !== 'object') return null
  if (!image2 || typeof image2 !== 'object') return null
  if (!image3 || typeof image3 !== 'object') return null
  if (!heading || !text) return null

  const large = image1 as Media
  const medium = image2 as Media
  const small = image3 as Media

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const eyebrowCss = resolveColorCss(eyebrowColor, 'danger')
  const headingCss = resolveColorCss(headingColor, 'foreground')
  const bodyCss = resolveColorCss(textColor, 'muted')

  const eyebrowStyle: CSSProperties | undefined = eyebrowCss ? { color: eyebrowCss } : undefined
  const headingStyle: CSSProperties | undefined = headingCss ? { color: headingCss } : undefined
  const bodyStyle: CSSProperties | undefined = bodyCss ? { color: bodyCss } : undefined

  return (
    <div
      className={cn('w-full py-12 sm:py-16 lg:py-20', className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-14 lg:px-8">
        {/* Left: eyebrow + heading, then large image at bottom */}
        <div className="flex min-w-0 flex-1 flex-col items-start gap-12 lg:gap-20">
          <div className="flex w-full max-w-md flex-col gap-6">
            {eyebrow ? (
              <p
                className="text-sm font-normal tracking-wide text-[var(--color-error,#e07060)]"
                style={eyebrowStyle}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2
              className="text-2xl font-bold leading-8 tracking-tight text-foreground"
              style={headingStyle}
            >
              {heading}
            </h2>
          </div>

          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-muted"
            style={{ aspectRatio: '381 / 452' }}
          >
            <MediaImage
              resource={large}
              alt={image1Alt ?? undefined}
              fill
              imgClassName="object-cover object-center"
              maxWidth={800}
              size="(max-width: 1024px) 90vw, 420px"
            />
          </div>
        </div>

        {/* Right: medium + small images on top, body text below */}
        <div className="flex min-w-0 flex-1 flex-col items-start gap-10 lg:gap-12">
          <div className="flex w-full flex-wrap items-center gap-8 sm:gap-12 lg:gap-16">
            <div
              className="relative w-[42%] max-w-[172px] shrink-0 overflow-hidden rounded-[10px] bg-muted sm:w-[172px]"
              style={{ aspectRatio: '172 / 198' }}
            >
              <MediaImage
                resource={medium}
                alt={image2Alt ?? undefined}
                fill
                imgClassName="object-cover object-center"
                maxWidth={400}
                size="(max-width: 1024px) 40vw, 172px"
              />
            </div>
            <div
              className="relative w-[28%] max-w-[113px] shrink-0 overflow-hidden rounded-[10px] bg-muted sm:w-[113px]"
              style={{ aspectRatio: '113 / 98' }}
            >
              <MediaImage
                resource={small}
                alt={image3Alt ?? undefined}
                fill
                imgClassName="object-cover object-center"
                maxWidth={240}
                size="(max-width: 1024px) 28vw, 113px"
              />
            </div>
          </div>

          <p
            className="max-w-sm text-sm leading-5 tracking-wide text-muted-foreground"
            style={bodyStyle}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}
