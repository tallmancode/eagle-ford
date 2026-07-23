'use client'

import React, { useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MediaImage } from '@/components/ui/media-image'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import type { Vehicle, VehicleModel, VehicleVariant } from '@/payload-types'
import { formatPrice } from '@/lib/utils/formatPrice'
import { getVariantImage } from '@/lib/utils/vehicleModel'

type VehicleModelVariantsProps = {
  vehicle: Vehicle
  model: VehicleModel
  variants: VehicleVariant[]
}

function VariantDetailContent({
  variant,
  vehicle,
  model,
}: {
  variant: VehicleVariant
  vehicle: Vehicle
  model: VehicleModel
}) {
  const detailImage = getVariantImage(variant, model, vehicle)
  const highlights = variant.highlights ?? []
  const description = variant.content?.description

  return (
    <div className="flex flex-col gap-6" id={`variant-${variant.slug}`}>
      {detailImage && (
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
          <MediaImage
            resource={detailImage}
            fill
            imgClassName="object-cover object-center"
            maxWidth={1400}
            size="(max-width: 1024px) 100vw, 66vw"
          />
        </div>
      )}

      <div>
        <h3 className="text-primary text-2xl md:text-3xl font-bold mb-3">{variant.name}</h3>

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

        <div className="pt-4 border-t border-border">
          <p className="text-primary text-3xl font-bold">{formatPrice(variant.price)}</p>
          <p className="text-sm text-muted-foreground">Retail Price From</p>
        </div>
      </div>
    </div>
  )
}

export function VehicleModelVariants({ vehicle, model, variants }: VehicleModelVariantsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedVariant = variants[selectedIndex] ?? variants[0]
  if (!selectedVariant) return null

  const firstVariantId = String(variants[0].id)

  return (
    <section id="variants" className="py-14 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-primary text-3xl md:text-4xl font-bold">{model.name} Variants</h2>
        </div>

        <div className="lg:hidden flex flex-col gap-6">
          <div className="border-b border-border">
            <div className="grid grid-cols-[1fr_auto] gap-4 px-4 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Variants</span>
              <span>Price From</span>
            </div>
            <Accordion type="single" collapsible={false} defaultValue={firstVariantId}>
              {variants.map((variant) => (
                <AccordionItem key={variant.id} value={String(variant.id)} className="border-b-0">
                  <AccordionTrigger className="group hover:no-underline w-full px-4 py-4 text-left transition-colors border-l-4 border-l-transparent data-[state=open]:bg-primary/5 data-[state=open]:border-l-primary hover:bg-muted/50 [&>svg]:text-muted-foreground group-data-[state=open]:[&>svg]:text-primary">
                    <span className="grid grid-cols-[1fr_auto] gap-4 flex-1 items-center">
                      <span className="font-semibold text-sm group-data-[state=open]:text-primary">
                        {variant.name}
                      </span>
                      <span className="text-sm font-medium whitespace-nowrap text-muted-foreground group-data-[state=open]:text-primary">
                        {formatPrice(variant.price)}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-6">
                    <VariantDetailContent variant={variant} vehicle={vehicle} model={model} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-[minmax(0,440px)_1fr] gap-12 items-start">
          <div className="border-b border-border">
            <div className="grid grid-cols-[1fr_auto] gap-4 px-4 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Variants</span>
              <span>Price From</span>
            </div>
            <ul className="divide-y divide-border">
              {variants.map((variant, index) => {
                const isSelected = index === selectedIndex
                return (
                  <li key={variant.id}>
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
                      <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : ''}`}>
                        {variant.name}
                      </span>
                      <span
                        className={`text-sm font-medium whitespace-nowrap ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        {formatPrice(variant.price)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <VariantDetailContent variant={selectedVariant} vehicle={vehicle} model={model} />
        </div>
      </div>
    </section>
  )
}
