import React from 'react'

import type { Vehicle } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'

type FeatureItem = NonNullable<NonNullable<Vehicle['features']>[number]>

type VehicleFeaturesProps = {
  features: FeatureItem[]
}

export function VehicleFeatures({ features }: VehicleFeaturesProps) {
  if (features.length === 0) return null

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
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
