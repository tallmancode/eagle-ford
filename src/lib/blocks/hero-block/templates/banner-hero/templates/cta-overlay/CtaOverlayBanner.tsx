import React from 'react'
import type { Hero } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'

const iconMap = {
  phone: Phone,
  mail: Mail,
  'map-pin': MapPin,
  clock: Clock,
  'arrow-right': ArrowRight,
  none: null,
}

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

  const { image, eyebrow, heading, subheading, primaryButton, secondaryButton } = content

  return (
    <section className="relative w-full overflow-hidden min-h-[380px] md:min-h-[480px]">
      <MediaImage
        resource={image}
        fill
        imgClassName="object-cover object-center"
        priority
        loading="eager"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

      <div className="relative z-10 container mx-auto flex flex-col justify-center py-20 px-4 h-full min-h-[380px] md:min-h-[480px]">
        {eyebrow && (
          <p className="text-white/70 uppercase tracking-widest text-sm font-medium mb-3">
            {eyebrow}
          </p>
        )}

        {heading && (
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {heading}
          </h1>
        )}

        {subheading && <p className="text-white/80 text-lg max-w-xl mb-8">{subheading}</p>}

        {(primaryButton?.label || secondaryButton?.label) && (
          <div className="flex flex-wrap gap-4">
            {primaryButton?.label && primaryButton.href && (
              <a href={primaryButton.href}>
                <Button className="rounded-full bg-white text-black hover:bg-white/90 gap-2">
                  <ButtonIcon name={primaryButton.icon} className="size-4" />
                  {primaryButton.label}
                </Button>
              </a>
            )}
            {secondaryButton?.label && secondaryButton.href && (
              <a href={secondaryButton.href}>
                <Button
                  variant="outline"
                  className="rounded-full border-white text-white hover:bg-white/10 gap-2"
                >
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
