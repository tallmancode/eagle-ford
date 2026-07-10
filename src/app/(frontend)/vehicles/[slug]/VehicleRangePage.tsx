'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/ui/media-image'
import { VehicleGallery } from '@/lib/blocks/vehicle-gallery-block/components/VehicleGallery'
import type { Media, Vehicle, VehicleModel } from '@/payload-types'
import { formatPrice } from '@/lib/utils/formatPrice'
import { getVehicleModelPath } from '@/lib/utils/vehicleModel'

type GalleryItem = NonNullable<NonNullable<Vehicle['gallery']>[number]>

function getModelCardImage(
  model: VehicleModel,
  vehicleFeatureImage: string | Media | null,
  vehicleHeroImage: string | Media | null,
) {
  return model.featureImage ?? model.heroImage ?? vehicleFeatureImage ?? vehicleHeroImage ?? null
}

const MODELS_PER_PAGE = 3

type Props = {
  vehicleName: string
  vehicleSlug: string
  gallery: GalleryItem[]
  models: VehicleModel[]
  vehicleFeatureImage: string | Media | null
  vehicleHeroImage: string | Media | null
}

export default function VehicleRangePage({
  vehicleName,
  vehicleSlug,
  gallery,
  models,
  vehicleFeatureImage,
  vehicleHeroImage,
}: Props) {
  const [modelPage, setModelPage] = useState(0)

  const modelPages = Math.ceil(models.length / MODELS_PER_PAGE)
  const visibleModels = models.slice(modelPage * MODELS_PER_PAGE, (modelPage + 1) * MODELS_PER_PAGE)

  return (
    <>
      {models.length > 0 && (
        <section id="models" className="bg-muted/40 py-14 px-4">
          <div className="container mx-auto">
            <h2 className="mb-10 text-center text-3xl font-bold text-primary">
              {vehicleName} Model Variants
            </h2>

            <div className="relative">
              {modelPages > 1 && (
                <button
                  onClick={() => setModelPage((p) => Math.max(0, p - 1))}
                  disabled={modelPage === 0}
                  aria-label="Previous models"
                  className="absolute top-1/2 -left-5 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border bg-background p-2 shadow-sm transition-colors hover:bg-muted disabled:opacity-30 md:flex"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleModels.map((model) => {
                  const cardImage = getModelCardImage(model, vehicleFeatureImage, vehicleHeroImage)

                  return (
                    <div
                      key={model.id}
                      className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm"
                    >
                      {cardImage && (
                        <div className="relative mb-4 aspect-[3/2] w-full">
                          <MediaImage
                            resource={cardImage}
                            fill
                            imgClassName="object-contain"
                            size="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        </div>
                      )}
                      <h3 className="mb-1 text-base leading-snug font-semibold">{model.name}</h3>
                      <p className="mb-4 text-2xl font-bold text-primary">
                        {formatPrice(model.price)}
                      </p>
                      {model.highlights && model.highlights.length > 0 && (
                        <ul className="mb-6 flex-1 space-y-1.5">
                          {model.highlights.map((h, i) => (
                            <li
                              key={h.id ?? i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-0.5 shrink-0 text-primary">•</span>
                              <span>{h.highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link href={getVehicleModelPath(vehicleSlug, model.slug ?? '')}>
                        <Button variant="outline" className="mt-auto w-full rounded-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  )
                })}
              </div>

              {modelPages > 1 && (
                <button
                  onClick={() => setModelPage((p) => Math.min(modelPages - 1, p + 1))}
                  disabled={modelPage >= modelPages - 1}
                  aria-label="Next models"
                  className="absolute top-1/2 -right-5 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border bg-background p-2 shadow-sm transition-colors hover:bg-muted disabled:opacity-30 md:flex"
                >
                  <ChevronRight className="size-5" />
                </button>
              )}
            </div>

            {modelPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setModelPage((p) => Math.max(0, p - 1))}
                  disabled={modelPage === 0}
                  className="flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30 md:hidden"
                >
                  <ChevronLeft className="size-4" /> Prev
                </button>

                {Array.from({ length: modelPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setModelPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      i === modelPage
                        ? 'bg-primary'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                    }`}
                  />
                ))}

                <button
                  onClick={() => setModelPage((p) => Math.min(modelPages - 1, p + 1))}
                  disabled={modelPage >= modelPages - 1}
                  className="flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30 md:hidden"
                >
                  Next <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <VehicleGallery vehicleName={vehicleName} gallery={gallery} />
    </>
  )
}
