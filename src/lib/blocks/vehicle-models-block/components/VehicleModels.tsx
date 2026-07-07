'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import type { Media, Vehicle, VehicleModel } from '@/payload-types'
import { formatPrice } from '@/lib/utils/formatPrice'

type VehicleModelsProps = {
  vehicle: Vehicle
  models: VehicleModel[]
}

function getModelImage(
  model: VehicleModel,
  vehicleFeatureImage: string | Media | null,
  vehicleHeroImage: string | Media | null,
) {
  return model.featureImage ?? model.heroImage ?? vehicleFeatureImage ?? vehicleHeroImage ?? null
}

export function VehicleModels({ vehicle, models }: VehicleModelsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedModel = models[selectedIndex] ?? models[0]
  if (!selectedModel) return null

  const vehicleFeatureImage = vehicle.featureImage ?? vehicle.heroImage ?? null
  const vehicleHeroImage = vehicle.heroImage ?? null
  const detailImage = getModelImage(selectedModel, vehicleFeatureImage, vehicleHeroImage)
  const highlights = selectedModel.highlights ?? []
  const description = selectedModel.content?.description

  return (
    <section id="models" className="py-14 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-primary text-3xl md:text-4xl font-bold">{vehicle.name} Models</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,440px)_1fr] gap-8 lg:gap-12 items-start">
          {/* Left: model list */}
          <div className="flex flex-col gap-6">
            <div className="border-b border-border">
              <div className="grid grid-cols-[1fr_auto] gap-4 px-4 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>Models</span>
                <span>Starting From</span>
              </div>
              <ul className="divide-y divide-border">
                {models.map((model, index) => {
                  const isSelected = index === selectedIndex
                  return (
                    <li key={model.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        aria-pressed={isSelected}
                        className={`w-full grid grid-cols-[1fr_auto] gap-4 items-center px-4 py-4 text-left transition-colors border-l-4 ${
                          isSelected
                            ? 'bg-primary/5 border-l-primary text-primary'
                            : 'border-l-transparent hover:bg-muted/50'
                        }`}
                      >
                        <span
                          className={`font-semibold text-sm ${isSelected ? 'text-primary' : ''}`}
                        >
                          {model.name}
                        </span>
                        <span
                          className={`text-sm font-medium whitespace-nowrap ${
                            isSelected ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          {formatPrice(model.price)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="rounded-2xl bg-muted/60 p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Already have a Model in mind? We&apos;ll get you the best deal.
              </p>
              <Link href="#enquire">
                <Button variant="outline" className="rounded-full w-full sm:w-auto">
                  Request a Quote
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: selected model detail */}
          <div className="flex flex-col gap-6">
            {detailImage && (
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
                <MediaImage
                  resource={detailImage}
                  fill
                  imgClassName="object-cover object-center"
                  size="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
            )}

            <div>
              <h3 className="text-primary text-2xl md:text-3xl font-bold mb-3">
                {selectedModel.name}
              </h3>

              {description && (
                <div className="text-muted-foreground leading-relaxed mb-6">
                  <ConvertRichText
                    converters={richTextConverters}
                    data={description as SerializedEditorState}
                  />
                </div>
              )}

              {highlights.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-primary font-bold mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {highlights.map((item, i) => (
                      <li
                        key={item.id ?? i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span>{item.highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pt-4 border-t border-border">
                <div>
                  <p className="text-primary text-3xl font-bold">
                    {formatPrice(selectedModel.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">Starting From</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="#enquire">
                    <Button variant="outline" className="rounded-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
