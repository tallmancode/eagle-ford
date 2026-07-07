import type { Metadata } from 'next'

import { formatPageTitle } from '@/constants/site'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { MediaImage } from '@/components/ui/media-image'
import { Button } from '@/components/ui/button'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import type { Media } from '@/payload-types'
import PageClient from './page.client'
import VehicleRangePage from './VehicleRangePage'

const BADGE_LABELS: Record<string, string> = {
  'newly-launched': 'Newly Launched',
  'coming-soon': 'Coming Soon',
  limited: 'Limited',
}

import { formatPrice } from '@/lib/utils/formatPrice'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const vehicles = await payload.find({
    collection: 'vehicles',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return vehicles.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/vehicles/' + decodedSlug

  const vehicle = await queryVehicleBySlug({ slug: decodedSlug })
  if (!vehicle) return <PayloadRedirects url={url} />

  const payload = await getPayload({ config: configPromise })
  const modelsResult = await payload.find({
    collection: 'vehicle-models',
    draft: false,
    depth: 1,
    sort: 'sortOrder',
    overrideAccess: false,
    pagination: false,
    where: { vehicle: { equals: vehicle.id } },
  })
  const models = modelsResult.docs

  const features = vehicle.features ?? []

  return (
    <div>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden min-h-[420px] md:min-h-[560px]">
        <MediaImage
          resource={vehicle.heroImage}
          fill
          imgClassName="object-cover object-center"
          priority
          size="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="relative z-10 container mx-auto flex flex-col justify-end py-20 px-4 min-h-[420px] md:min-h-[560px]">
          {vehicle.badge && (
            <span className="inline-block bg-primary text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit">
              {BADGE_LABELS[vehicle.badge] ?? vehicle.badge}
            </span>
          )}
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight">
            {vehicle.name}
          </h1>
          {vehicle.startingPrice != null && (
            <p className="text-white/80 text-2xl font-semibold mb-6">
              FROM {formatPrice(vehicle.startingPrice)}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <a href="#enquire">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 font-semibold">
                Enquire Now
              </Button>
            </a>
            <a href="#models">
              <Button
                variant="outline"
                className="rounded-full border-white text-white bg-transparent hover:bg-white/10"
              >
                View Models
              </Button>
            </a>
          </div>
        </div>
      </section>

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

      {/* ── Features ── */}
      {features.length > 0 && (
        <section className="bg-muted/40 py-14 px-4">
          <div className="container mx-auto">
            <h2 className="text-primary text-3xl font-bold text-center mb-10">Features</h2>
            <div
              className={`grid grid-cols-1 gap-8 ${
                features.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
              }`}
            >
              {features.map((feature, i) => (
                <div key={feature.id ?? i} className="flex flex-col">
                  {feature.featureImage && (
                    <div className="relative h-48 rounded-xl overflow-hidden mb-5">
                      <MediaImage
                        resource={feature.featureImage}
                        fill
                        imgClassName="object-cover"
                        size="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-2">{feature.featureTitle}</h3>
                  {feature.featureDescription && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.featureDescription}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Interactive sections (colours, models, gallery, enquiry) ── */}
      <VehicleRangePage
        vehicleName={vehicle.name}
        colours={vehicle.colours ?? []}
        gallery={vehicle.gallery ?? []}
        models={models}
        vehicleFeatureImage={vehicle.featureImage ?? vehicle.heroImage ?? null}
        vehicleHeroImage={vehicle.heroImage ?? null}
      />

      {/* ── CMS Blocks ── */}
      <RenderBlocks blocks={vehicle.content?.section ?? null} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const vehicle = await queryVehicleBySlug({ slug: decodedSlug })

  if (!vehicle) return { title: formatPageTitle('Vehicle') }

  const title = vehicle.meta?.metaTitle
    ? formatPageTitle(vehicle.meta.metaTitle)
    : formatPageTitle(vehicle.name)

  const metaImage = vehicle.meta?.metaImage
  const imageUrl =
    typeof metaImage === 'object' && metaImage && 'url' in metaImage
      ? ((metaImage as Media).url ?? undefined)
      : undefined

  return {
    title,
    description: vehicle.meta?.metaDescription ?? undefined,
    openGraph: {
      title,
      description: vehicle.meta?.metaDescription ?? undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      url: `/vehicles/${vehicle.slug}`,
    },
  }
}

const queryVehicleBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'vehicles',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
