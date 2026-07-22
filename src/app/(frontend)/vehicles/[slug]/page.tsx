import type { Metadata } from 'next'

import { formatPageTitle } from '@/constants/site'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Media, Vehicle, VehicleTemplate } from '@/payload-types'
import { DefaultVehicleLayout } from './DefaultVehicleLayout'
import { getModelStartingPrice } from '@/lib/utils/vehicleModel'
import { getVehicleQuoteForm } from '@/lib/stock-vehicle/getVehicleQuoteForm'

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
    getVehicleQuoteForm(),
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

  return (
    <div>
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {useTemplate ? (
        <RenderBlocks
          blocks={templateSections}
          meta={{ vehicle, contextValues: { vehicleName: vehicle.name } }}
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
