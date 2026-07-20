'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import type { Media, Vehicle, VehicleModel } from '@/payload-types'
import { formatPrice } from '@/lib/utils/formatPrice'
import { getVehicleModelPath } from '@/lib/utils/vehicleModel'

const MODELS_PER_PAGE = 3

type VehicleModelSiblingsProps = {
  vehicle: Vehicle
  currentModel: VehicleModel
  models: VehicleModel[]
}

function getCardImage(
  model: VehicleModel,
  vehicleFeatureImage: string | Media | null,
  vehicleHeroImage: string | Media | null,
) {
  return model.featureImage ?? model.heroImage ?? vehicleFeatureImage ?? vehicleHeroImage ?? null
}

export function VehicleModelSiblings({ vehicle, currentModel, models }: VehicleModelSiblingsProps) {
  const siblings = models.filter((m) => m.id !== currentModel.id)
  const [modelPage, setModelPage] = useState(0)

  if (siblings.length === 0) return null

  const modelPages = Math.ceil(siblings.length / MODELS_PER_PAGE)
  const visibleModels = siblings.slice(
    modelPage * MODELS_PER_PAGE,
    (modelPage + 1) * MODELS_PER_PAGE,
  )
  const vehicleFeatureImage = vehicle.featureImage ?? vehicle.heroImage ?? null
  const vehicleHeroImage = vehicle.heroImage ?? null

  return (
    <section id="models" className="bg-muted/40 py-14 px-4">
      <div className="container mx-auto">
        <h2 className="text-primary text-3xl font-bold text-center mb-10">{vehicle.name} Models</h2>

        <div className="relative">
          {modelPages > 1 && (
            <button
              onClick={() => setModelPage((p) => Math.max(0, p - 1))}
              disabled={modelPage === 0}
              aria-label="Previous models"
              className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-background border rounded-full p-2 shadow-sm disabled:opacity-30 hover:bg-muted transition-colors items-center justify-center"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleModels.map((model) => {
              const cardImage = getCardImage(model, vehicleFeatureImage, vehicleHeroImage)
              const href = getVehicleModelPath(vehicle.slug ?? '', model.slug ?? '')

              return (
                <div
                  key={model.id}
                  className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col"
                >
                  {cardImage && (
                    <div className="relative w-full aspect-[3/2] mb-4">
                      <MediaImage
                        resource={cardImage}
                        fill
                        imgClassName="object-contain"
                        maxWidth={600}
                        size="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-base mb-1 leading-snug">{model.name}</h3>
                  <p className="text-primary text-2xl font-bold mb-4">{formatPrice(model.price)}</p>
                  {model.highlights && model.highlights.length > 0 && (
                    <ul className="space-y-1.5 flex-1 mb-6">
                      {model.highlights.slice(0, 5).map((h, i) => (
                        <li
                          key={h.id ?? i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-primary mt-0.5 shrink-0">•</span>
                          <span>{h.highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link href={href} className="mt-auto">
                    <Button variant="outline" className="rounded-full w-full">
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
              className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-background border rounded-full p-2 shadow-sm disabled:opacity-30 hover:bg-muted transition-colors items-center justify-center"
            >
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>

        {modelPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setModelPage((p) => Math.max(0, p - 1))}
              disabled={modelPage === 0}
              className="md:hidden flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30"
            >
              <ChevronLeft className="size-4" /> Prev
            </button>

            {Array.from({ length: modelPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setModelPage(i)}
                aria-label={`Page ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === modelPage
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }`}
              />
            ))}

            <button
              onClick={() => setModelPage((p) => Math.min(modelPages - 1, p + 1))}
              disabled={modelPage >= modelPages - 1}
              className="md:hidden flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30"
            >
              Next <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
