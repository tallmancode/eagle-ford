import type { Metadata } from 'next'

import { formatPageTitle } from '@/constants/site'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Media, Vehicle, VehicleModel, VehicleModelTemplate } from '@/payload-types'
import { DefaultModelLayout } from './DefaultModelLayout'
import { getVehicleModelPath } from '@/lib/utils/vehicleModel'
import { getVehicleQuoteForm } from '@/lib/stock-vehicle/getVehicleQuoteForm'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const models = await payload.find({
    collection: 'vehicle-models',
    draft: false,
    depth: 1,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      vehicle: true,
    },
  })

  return models.docs.flatMap((model) => {
    if (!model.slug) return []

    const parents = Array.isArray(model.vehicle)
      ? model.vehicle
      : model.vehicle
        ? [model.vehicle]
        : []

    return parents.flatMap((vehicle) => {
      if (!vehicle || typeof vehicle === 'string' || !vehicle.slug) return []
      return [{ slug: vehicle.slug, modelSlug: model.slug! }]
    })
  })
}

type Args = {
  params: Promise<{
    slug?: string
    modelSlug?: string
  }>
}

async function resolveModelTemplate(
  template: Vehicle['modelTemplate'],
): Promise<VehicleModelTemplate | null> {
  if (!template) return null

  if (typeof template === 'object') {
    return template
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'vehicle-model-templates',
    id: template,
    depth: 2,
    overrideAccess: false,
  })

  return result ?? null
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '', modelSlug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const decodedModelSlug = decodeURIComponent(modelSlug)
  const url = getVehicleModelPath(decodedSlug, decodedModelSlug)

  const vehicle = await queryVehicleBySlug({ slug: decodedSlug })
  if (!vehicle) return <PayloadRedirects url={url} />

  const model = await queryModelBySlug({
    slug: decodedModelSlug,
    vehicleId: vehicle.id,
  })
  if (!model) return <PayloadRedirects url={url} />

  const template = await resolveModelTemplate(vehicle.modelTemplate)
  const templateSections = template?.section
  const useTemplate = Array.isArray(templateSections) && templateSections.length > 0

  const payload = await getPayload({ config: configPromise })
  const [modelsResult, enquiryForm] = await Promise.all([
    payload.find({
      collection: 'vehicle-models',
      draft: false,
      depth: 1,
      sort: 'sortOrder',
      overrideAccess: false,
      pagination: false,
      where: { vehicle: { equals: vehicle.id } },
    }),
    getVehicleQuoteForm(),
  ])
  const siblingModels = modelsResult.docs

  const meta = {
    vehicle,
    vehicleModel: model,
    contextValues: {
      vehicleName: vehicle.name,
      modelName: model.name,
    },
  }

  return (
    <div>
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {useTemplate ? (
        <RenderBlocks blocks={templateSections} meta={meta} />
      ) : (
        <DefaultModelLayout
          vehicle={vehicle}
          model={model}
          siblingModels={siblingModels}
          enquiryForm={enquiryForm}
        />
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', modelSlug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const decodedModelSlug = decodeURIComponent(modelSlug)

  const vehicle = await queryVehicleBySlug({ slug: decodedSlug })
  if (!vehicle) return { title: formatPageTitle('Vehicle Model') }

  const model = await queryModelBySlug({
    slug: decodedModelSlug,
    vehicleId: vehicle.id,
  })
  if (!model) return { title: formatPageTitle(vehicle.name) }

  const title = model.meta?.metaTitle
    ? formatPageTitle(model.meta.metaTitle)
    : formatPageTitle(`${model.name} | ${vehicle.name}`)

  const description = model.meta?.metaDescription ?? vehicle.meta?.metaDescription ?? undefined

  const metaImage = model.meta?.metaImage ?? vehicle.meta?.metaImage
  const imageUrl =
    typeof metaImage === 'object' && metaImage && 'url' in metaImage
      ? ((metaImage as Media).url ?? undefined)
      : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      url: getVehicleModelPath(vehicle.slug ?? decodedSlug, model.slug ?? decodedModelSlug),
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

const queryModelBySlug = cache(async ({ slug, vehicleId }: { slug: string; vehicleId: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'vehicle-models',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          vehicle: {
            equals: vehicleId,
          },
        },
      ],
    },
  })

  return (result.docs?.[0] as VehicleModel | undefined) || null
})
