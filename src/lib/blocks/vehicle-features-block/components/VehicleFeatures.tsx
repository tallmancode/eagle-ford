import React from 'react'

import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/ui/media-image'
import type { Setting, Vehicle } from '@/payload-types'
import { getCachedGlobal } from '@/lib/utils/getGlobals'

type FeatureItem = NonNullable<NonNullable<Vehicle['features']>[number]>

type VehicleFeaturesProps = {
  features: FeatureItem[]
  salesPhone?: string | null
}

const featureCtaGtmProps = {
  'data-gtm-cta-location': 'vehicle-features',
} as const

function buildTelHref(phone: string): string {
  return `tel:${phone.replace(/\D/g, '')}`
}

export function VehicleFeatures({ features, salesPhone }: VehicleFeaturesProps) {
  if (features.length === 0) return null

  const telHref = salesPhone ? buildTelHref(salesPhone) : null

  return (
    <>
      {features.map((feature, i) => {
        const imageOnLeft = i % 2 === 0

        return (
          <section
            key={feature.id ?? i}
            className={`py-14 px-4 ${i % 2 === 1 ? 'bg-muted/40' : ''}`}
          >
            <div className="container mx-auto">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  imageOnLeft ? '' : 'lg:[&>*:first-child]:order-2'
                }`}
              >
                {feature.featureImage && (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <MediaImage
                      resource={feature.featureImage}
                      fill
                      imgClassName="object-cover"
                      maxWidth={1400}
                      size="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-primary text-3xl font-bold mb-4">{feature.featureTitle}</h2>
                  {feature.featureDescription && (
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.featureDescription}
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="rounded-full font-semibold">
                      <a
                        href="#enquire"
                        data-gtm-cta="vehicle-feature-enquire"
                        {...featureCtaGtmProps}
                      >
                        Enquire Now
                      </a>
                    </Button>
                    {telHref && (
                      <Button asChild variant="outline" className="rounded-full font-semibold">
                        <a
                          href={telHref}
                          data-gtm-cta="vehicle-feature-call"
                          {...featureCtaGtmProps}
                        >
                          Call Now
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

export async function VehicleFeaturesSection({
  features,
}: {
  features: FeatureItem[]
}) {
  const settings = (await getCachedGlobal('settings', 1)) as Setting
  const salesPhone = settings.contactInfo?.phone ?? null

  return <VehicleFeatures features={features} salesPhone={salesPhone} />
}
