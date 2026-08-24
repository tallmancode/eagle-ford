import React from 'react'
import type { Hero } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { cn } from '@/lib/utils/cn'
import { FULL_BLEED_IMAGE_MAX_WIDTH } from '@/lib/utils/getOptimalMediaSize'
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'

const iconMap = {
  phone: Phone,
  mail: Mail,
  'map-pin': MapPin,
  clock: Clock,
  'arrow-right': ArrowRight,
  none: null,
}

const DEFAULT_OVERLAY_COLOR = '#000000'
const DEFAULT_OVERLAY_OPACITY = 60

type IconKey = keyof typeof iconMap

function ButtonIcon({ name, className }: { name?: string | null; className?: string }) {
  if (!name || name === 'none') return null
  const IconComponent = iconMap[name as IconKey]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}

export const CtaOverlayBanner: React.FC<Hero> = (props) => {
  const { bannerHeroContent } = props
  const content = bannerHeroContent?.ctaOverlayContent

  if (!content?.image) return null

  const {
    image,
    eyebrow,
    eyebrowColor,
    heading,
    headingColor,
    subheading,
    subheadingColor,
    overlayColor,
    overlayOpacity,
    primaryButton,
    secondaryButton,
  } = content

  const eyebrowColorCss = resolveColorCss(eyebrowColor)
  const headingColorCss = resolveColorCss(headingColor)
  const subheadingColorCss = resolveColorCss(subheadingColor)
  const overlayColorCss = resolveColorCss(overlayColor)
  const opacityIsSet = typeof overlayOpacity === 'number'
  const useCustomOverlay = Boolean(overlayColorCss) || opacityIsSet
  const resolvedOverlayOpacity = Math.min(
    100,
    Math.max(0, opacityIsSet ? overlayOpacity : DEFAULT_OVERLAY_OPACITY),
  )

  return (
    <section className="relative w-full overflow-hidden min-h-[500px] md:min-h-[500px]">
      <MediaImage
        resource={image}
        fill
        imgClassName="object-cover object-center"
        priority
        loading="eager"
        maxWidth={FULL_BLEED_IMAGE_MAX_WIDTH}
        size="100vw"
      />

      {useCustomOverlay ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColorCss ?? DEFAULT_OVERLAY_COLOR,
            opacity: resolvedOverlayOpacity / 100,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
      )}

      <div className="relative z-10 container mx-auto flex flex-col items-center text-center justify-center py-20 px-4 h-full min-h-[380px] md:min-h-[480px] md:items-start md:text-left">
        {eyebrow && (
          <p
            className={cn(
              'uppercase tracking-widest text-sm font-medium mb-3',
              !eyebrowColorCss && 'text-white/70',
            )}
            style={eyebrowColorCss ? { color: eyebrowColorCss } : undefined}
          >
            {eyebrow}
          </p>
        )}

        {heading && (
          <h1
            className={cn(
              'text-4xl md:text-5xl font-bold mb-4 leading-tight',
              !headingColorCss && 'text-white',
            )}
            style={headingColorCss ? { color: headingColorCss } : undefined}
          >
            {heading}
          </h1>
        )}

        {subheading && (
          <p
            className={cn('text-lg max-w-xl mb-8', !subheadingColorCss && 'text-white/80')}
            style={subheadingColorCss ? { color: subheadingColorCss } : undefined}
          >
            {subheading}
          </p>
        )}

        {(primaryButton?.label || secondaryButton?.label) && (
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap md:justify-start">
            {primaryButton?.label && primaryButton.href && (
              <a href={primaryButton.href}>
                <Button className="rounded-full gap-2" variant="secondary">
                  <ButtonIcon name={primaryButton.icon} className="size-4" />
                  {primaryButton.label}
                </Button>
              </a>
            )}
            {secondaryButton?.label && secondaryButton.href && (
              <a href={secondaryButton.href}>
                <Button variant="default" className="rounded-full gap-2">
                  <ButtonIcon name={secondaryButton.icon} className="size-4" />
                  {secondaryButton.label}
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
