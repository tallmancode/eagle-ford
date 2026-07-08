import Link from 'next/link'
import { Download } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import type { Vehicle, VehicleModel } from '@/payload-types'
import { getBrochureUrl } from '@/lib/utils/vehicleCta'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { VehicleHero } from '@/lib/blocks/vehicle-hero-block/components/VehicleHero'
import { VehicleColors } from '@/lib/blocks/vehicle-colors-block/components/VehicleColors'
import { VehicleFeatures } from '@/lib/blocks/vehicle-features-block/components/VehicleFeatures'
import VehicleRangePage from './VehicleRangePage'
import VehicleFaq from './VehicleFaq'

type DefaultVehicleLayoutProps = {
  vehicle: Vehicle
  models: VehicleModel[]
}

export function DefaultVehicleLayout({ vehicle, models }: DefaultVehicleLayoutProps) {
  const features = vehicle.features ?? []
  const specHighlights = vehicle.specHighlights ?? []
  const engineOptions = vehicle.engineOptions ?? []
  const paymentOptions = vehicle.paymentOptions ?? []
  const faqs = vehicle.faqs ?? []
  const brochureUrl = getBrochureUrl(vehicle.brochure)

  return (
    <>
      <VehicleHero vehicle={vehicle} />

      {/* ── Description ── */}
      {vehicle.content?.description && (
        <section className="container mx-auto py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-primary text-3xl font-bold mb-6">The All-New {vehicle.name}</h2>
            <ConvertRichText
              converters={richTextConverters}
              data={vehicle.content.description as SerializedEditorState}
              className="text-muted-foreground leading-relaxed"
            />
          </div>
        </section>
      )}

      {/* ── Spec Highlights & Engine Options ── */}
      {(specHighlights.length > 0 || engineOptions.length > 0) && (
        <section className="bg-muted/40 py-14 px-4">
          <div className="container mx-auto">
            {specHighlights.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                {specHighlights.map((spec, i) => (
                  <div key={spec.id ?? i} className="text-center">
                    <p className="text-primary text-3xl md:text-4xl font-bold mb-1">{spec.value}</p>
                    <p className="text-muted-foreground text-sm uppercase tracking-wide">
                      {spec.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {engineOptions.length > 0 && (
              <div>
                <h2 className="text-primary text-2xl font-bold text-center mb-6">
                  An engine that can tackle anything
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {engineOptions.map((engine, i) => (
                    <div
                      key={engine.id ?? i}
                      className="bg-card border rounded-xl px-6 py-4 text-center min-w-[140px]"
                    >
                      <p className="text-primary text-xl font-bold">{engine.name}</p>
                      <p className="text-muted-foreground text-sm">{engine.engineType}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Features ── */}
      <VehicleFeatures features={features} />

      {/* ── Vehicle Colours ── */}
      <VehicleColors vehicleName={vehicle.name} colours={vehicle.colours ?? []} />

      {/* ── Interactive sections (models, gallery, enquiry) ── */}
      <VehicleRangePage
        vehicleName={vehicle.name}
        gallery={vehicle.gallery ?? []}
        models={models}
        vehicleFeatureImage={vehicle.featureImage ?? vehicle.heroImage ?? null}
        vehicleHeroImage={vehicle.heroImage ?? null}
      />

      {/* ── Payment Options ── */}
      {paymentOptions.length > 0 && (
        <section className="py-14 px-4">
          <div className="container mx-auto">
            <h2 className="text-primary text-3xl font-bold text-center mb-10">
              Explore Your Payment Options
            </h2>
            <div
              className={`grid grid-cols-1 gap-6 ${
                paymentOptions.length === 2
                  ? 'md:grid-cols-2'
                  : paymentOptions.length >= 3
                    ? 'md:grid-cols-3'
                    : ''
              }`}
            >
              {paymentOptions.map((option, i) => (
                <div
                  key={option.id ?? i}
                  className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col"
                >
                  <h3 className="text-lg font-semibold mb-3">{option.title}</h3>
                  {option.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                      {option.description}
                    </p>
                  )}
                  {option.ctaLabel && option.ctaUrl && (
                    <Link href={option.ctaUrl}>
                      <Button variant="outline" className="rounded-full w-full mt-auto">
                        {option.ctaLabel}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Brochure Download ── */}
      {brochureUrl && (
        <section className="bg-muted/40 py-14 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-primary text-3xl font-bold mb-4">Download Brochure</h2>
            <p className="text-muted-foreground mb-8">
              Get the full specifications and features for the {vehicle.name} in our downloadable
              brochure.
            </p>
            <a href={brochureUrl} target="_blank" rel="noopener noreferrer" download>
              <Button className="rounded-full">
                <Download className="mr-2 size-4" />
                Download Brochure
              </Button>
            </a>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <VehicleFaq faqs={faqs} />

      {/* ── CMS Blocks ── */}
      <RenderBlocks
        blocks={vehicle.content?.section ?? null}
        meta={{ vehicle, contextValues: { vehicleName: vehicle.name } }}
      />
    </>
  )
}
