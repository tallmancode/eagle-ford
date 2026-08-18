import { Download } from 'lucide-react'
import React from 'react'

import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import type { Vehicle } from '@/payload-types'
import { formatPrice } from '@/lib/utils/formatPrice'
import { formatVehicleBadge } from '@/lib/utils/formatVehicleBadge'
import { getBrochureUrl, isExternalUrl, resolveCtaUrl } from '@/lib/utils/vehicleCta'

type CtaButton = NonNullable<Vehicle['ctaButtons']>[number]

function HeroCtaButton({
  cta,
  brochureUrl,
  variant = 'primary',
}: {
  cta: CtaButton
  brochureUrl: string | null
  variant?: 'primary' | 'outline'
}) {
  const href = resolveCtaUrl(cta.action, { url: cta.url, brochureUrl })
  const isBrochure = cta.action === 'brochure'
  const external = isExternalUrl(href)

  const buttonClass = variant === 'primary' ? 'rounded-full font-semibold' : 'rounded-full'

  const button = (
    <Button variant={variant === 'primary' ? 'default' : 'outline'} className={buttonClass}>
      {isBrochure && <Download className="mr-2 size-4" />}
      {cta.label}
    </Button>
  )

  if (isBrochure && brochureUrl) {
    return (
      <a
        href={brochureUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        data-gtm-cta="vehicle-hero-cta"
        data-gtm-cta-location="vehicle-hero"
      >
        {button}
      </a>
    )
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-gtm-cta="vehicle-hero-cta"
        data-gtm-cta-location="vehicle-hero"
      >
        {button}
      </a>
    )
  }

  return (
    <a href={href} data-gtm-cta="vehicle-hero-cta" data-gtm-cta-location="vehicle-hero">
      {button}
    </a>
  )
}

type VehicleHeroProps = {
  vehicle: Vehicle
}

export function VehicleHero({ vehicle }: VehicleHeroProps) {
  const ctaButtons = vehicle.ctaButtons ?? []
  const brochureUrl = getBrochureUrl(vehicle.brochure)
  const hasPrice = vehicle.startingPrice != null || vehicle.monthlyPrice != null
  const badge = formatVehicleBadge(vehicle.badge)

  return (
    <section className="relative w-full overflow-hidden min-h-[420px] md:min-h-[560px]">
      <MediaImage
        resource={vehicle.heroImage}
        fill
        imgClassName="object-cover object-center"
        priority
        maxWidth={1920}
        size="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
      <div className="relative z-10 container mx-auto flex flex-col justify-end py-20 px-4 min-h-[420px] md:min-h-[560px]">
        {badge && (
          <span className="inline-block bg-primary text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit">
            {badge}
          </span>
        )}
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight">
          {vehicle.name}
        </h1>
        {vehicle.tagline && (
          <p className="text-white/90 text-xl md:text-2xl font-medium mb-4">{vehicle.tagline}</p>
        )}
        {hasPrice && (
          <div className="mb-6 space-y-1">
            {vehicle.startingPrice != null && (
              <p className="text-white/80 text-2xl font-semibold">
                FROM {formatPrice(vehicle.startingPrice)}
              </p>
            )}
            {vehicle.monthlyPrice != null && (
              <div>
                <p className="text-white/80 text-xl font-semibold">
                  From {formatPrice(vehicle.monthlyPrice)} p/m*
                </p>
                {vehicle.monthlyPriceNote && (
                  <p className="text-white/60 text-sm">*{vehicle.monthlyPriceNote}</p>
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          {ctaButtons.length > 0 ? (
            ctaButtons.map((cta, i) => (
              <HeroCtaButton
                key={cta.id ?? i}
                cta={cta}
                brochureUrl={brochureUrl}
                variant={i === 0 ? 'primary' : 'outline'}
              />
            ))
          ) : (
            <>
              <a
                href="#enquire"
                data-gtm-cta="vehicle-hero-cta"
                data-gtm-cta-location="vehicle-hero"
              >
                <Button className="rounded-full font-semibold" variant="secondary">
                  Enquire Now
                </Button>
              </a>
              <a
                href="#models"
                data-gtm-cta="vehicle-hero-cta"
                data-gtm-cta-location="vehicle-hero"
              >
                <Button
                  variant="outline"
                  className="rounded-full border-white text-white bg-transparent hover:bg-white/20 hover:text-white/80"
                >
                  View Models
                </Button>
              </a>
              {brochureUrl && (
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  data-gtm-cta="vehicle-hero-cta"
                  data-gtm-cta-location="vehicle-hero"
                >
                  <Button className="rounded-full ">
                    <Download className="mr-2 size-4" />
                    Download Brochure
                  </Button>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
