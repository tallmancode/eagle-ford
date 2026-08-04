import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Media, Vehicle, VehicleTemplate } from '@/payload-types'
import { DefaultVehicleLayout } from './DefaultVehicleLayout'
import { getModelStartingPrice } from '@/lib/utils/vehicleModel'
import { buildCatalogVehicleFormContext } from '@/lib/stock-vehicle/buildCatalogVehicleFormContext'
import { getNewVehicleQuoteForm } from '@/lib/stock-vehicle/getVehicleQuoteForm'
import { buildDocumentMetadata, resolveMediaOgUrl } from '@/lib/seo/buildDocumentMetadata'
import {
  buildJsonLdGraph,
  getBreadcrumbJsonLd,
  getFaqPageJsonLd,
  getVariantPriceStats,
  getVehicleJsonLd,
  getWebPageJsonLd,
} from '@/lib/seo/dealershipJsonLd'

/** ISR: vehicle pages refresh at most every 5 minutes unless revalidated by CMS hooks. */
export const revalidate = 300

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

async function resolveVehicleTemplate(
  template: Vehicle['template'],
): Promise<VehicleTemplate | null> {
  if (!template) return null

  if (typeof template === 'object') {
    return template
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'vehicle-templates',
    id: template,
    depth: 2,
    overrideAccess: false,
  })

  return result ?? null
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/vehicles/' + decodedSlug

  const vehicle = await queryVehicleBySlug({ slug: decodedSlug })
  if (!vehicle) return <PayloadRedirects url={url} />

  const template = await resolveVehicleTemplate(vehicle.template)
  const templateSections = template?.section
  const useTemplate = Array.isArray(templateSections) && templateSections.length > 0

  const payload = await getPayload({ config: configPromise })
  const [modelsResult, variantsResult, enquiryForm] = await Promise.all([
    payload.find({
      collection: 'vehicle-models',
      draft: false,
      depth: 1,
      sort: 'sortOrder',
      overrideAccess: false,
      pagination: false,
      where: { vehicle: { equals: vehicle.id } },
    }),
    payload.find({
      collection: 'vehicle-variants',
      where: { 'model.vehicle': { equals: vehicle.id } },
      sort: 'sortOrder',
      depth: 0,
      draft: false,
      overrideAccess: false,
      pagination: false,
      select: {
        id: true,
        price: true,
        model: true,
      },
    }),
    getNewVehicleQuoteForm(),
  ])

  const variantsByModelId = new Map<string, typeof variantsResult.docs>()
  for (const variant of variantsResult.docs) {
    const modelId =
      typeof variant.model === 'object' && variant.model !== null
        ? String(variant.model.id)
        : String(variant.model)
    const list = variantsByModelId.get(modelId) ?? []
    list.push(variant)
    variantsByModelId.set(modelId, list)
  }

  const models = modelsResult.docs.map((model) => ({
    ...model,
    startingPrice: getModelStartingPrice(variantsByModelId.get(String(model.id)) ?? []),
  }))

  const priceStats = getVariantPriceStats(variantsResult.docs)
  const imageUrl = resolveMediaOgUrl(
    typeof vehicle.meta?.metaImage === 'object' ? (vehicle.meta.metaImage as Media) : null,
  )
  const description = vehicle.meta?.metaDescription

  return (
    <div>
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <JsonLd
        data={buildJsonLdGraph(
          getWebPageJsonLd({
            name: vehicle.name,
            description,
            path: url,
            dateModified: vehicle.updatedAt,
            imageUrl,
          }),
          getVehicleJsonLd({
            name: vehicle.name,
            description,
            path: url,
            imageUrl,
            dateModified: vehicle.updatedAt,
            lowPrice: priceStats?.lowPrice,
            highPrice: priceStats?.highPrice,
            offerCount: priceStats?.offerCount,
          }),
          getFaqPageJsonLd(vehicle.faqs),
          getBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Vehicles', path: '/vehicles' },
            { name: vehicle.name, path: url },
          ]),
        )}
      />

      {useTemplate ? (
        <RenderBlocks
          blocks={templateSections}
          meta={{
            vehicle,
            contextValues: buildCatalogVehicleFormContext({ vehicle }),
          }}
        />
      ) : (
        <DefaultVehicleLayout vehicle={vehicle} models={models} enquiryForm={enquiryForm} />
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const vehicle = await queryVehicleBySlug({ slug: decodedSlug })

  if (!vehicle) {
    return buildDocumentMetadata({ title: 'Vehicle', path: `/vehicles/${decodedSlug}` })
  }

  const path = `/vehicles/${vehicle.slug}`
  const imageUrl = resolveMediaOgUrl(
    typeof vehicle.meta?.metaImage === 'object' ? (vehicle.meta.metaImage as Media) : null,
  )

  return buildDocumentMetadata({
    title: vehicle.meta?.metaTitle || vehicle.name,
    description: vehicle.meta?.metaDescription,
    path,
    imageUrl,
  })
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
