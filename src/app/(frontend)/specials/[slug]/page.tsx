import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { SpecialsTabs } from '@/components/specials/SpecialsTabs'
import { CRAWLER_BLOCK_ROBOTS } from '@/constants/crawlerPolicy'
import { DEFAULT_OG_IMAGE_PATH, formatPageTitle } from '@/constants/site'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { getSpecialCategoryPath } from '@/lib/specials/paths'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import type { Media, Special, SpecialTemplate, Vehicle, VehicleModel } from '@/payload-types'

type SpecialListItem = Pick<
  Special,
  | 'id'
  | 'slug'
  | 'title'
  | 'subTitle'
  | 'offerType'
  | 'pricingLabel'
  | 'specialOffer'
  | 'bestSaving'
  | 'paymentFrom'
  | 'cardImage'
  | 'vehicle'
  | 'vehicleModel'
  | 'template'
>

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'special-categories',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return categories.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    special?: string
  }>
}

async function resolveSpecialTemplate(
  template: SpecialListItem['template'],
): Promise<SpecialTemplate | null> {
  if (!template) return null

  if (typeof template === 'object') {
    return template
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'special-templates',
    id: template,
    depth: 2,
    overrideAccess: false,
  })

  return result ?? null
}

async function resolveVehicle(vehicle: SpecialListItem['vehicle']): Promise<Vehicle | null> {
  if (!vehicle) return null
  if (typeof vehicle === 'object') return vehicle

  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'vehicles',
    id: vehicle,
    depth: 2,
    overrideAccess: false,
  })

  return result ?? null
}

async function resolveVehicleModel(
  vehicleModel: SpecialListItem['vehicleModel'],
): Promise<VehicleModel | null> {
  if (!vehicleModel) return null
  if (typeof vehicleModel === 'object') return vehicleModel

  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'vehicle-models',
    id: vehicleModel,
    depth: 2,
    overrideAccess: false,
  })

  return result ?? null
}

function findSelectedSpecial(
  specials: SpecialListItem[],
  specialSlug: string | null | undefined,
): SpecialListItem | null {
  if (specials.length === 0) return null
  if (!specialSlug) return specials[0] ?? null
  return specials.find((special) => special.slug === specialSlug) ?? specials[0] ?? null
}

export default async function SpecialCategoryPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const { slug = '' } = await paramsPromise
  const { special: initialSpecialSlug } = await searchParamsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = getSpecialCategoryPath(decodedSlug)
  const category = await queryCategoryBySlug({ slug: decodedSlug })

  if (!category) return <PayloadRedirects url={url} />

  const specials = await querySpecialsByCategoryId({ categoryId: category.id })
  const selectedSpecial = findSelectedSpecial(specials, initialSpecialSlug)

  const template = selectedSpecial ? await resolveSpecialTemplate(selectedSpecial.template) : null
  const templateSections = template?.section
  const useTemplate = Array.isArray(templateSections) && templateSections.length > 0

  const [vehicle, vehicleModel] = selectedSpecial
    ? await Promise.all([
        resolveVehicle(selectedSpecial.vehicle),
        resolveVehicleModel(selectedSpecial.vehicleModel),
      ])
    : [null, null]

  return (
    <div>
      <PayloadRedirects disableNotFound url={url} />

      <section className="py-14 px-4">
        <div className="container mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-primary md:text-4xl">{category.title}</h1>
          </div>

          <SpecialsTabs
            categorySlug={category.slug}
            specials={specials}
            initialSpecialSlug={initialSpecialSlug}
          />
        </div>
      </section>

      {useTemplate && (
        <RenderBlocks
          blocks={templateSections}
          meta={{
            ...(vehicle ? { vehicle } : {}),
            ...(vehicleModel ? { vehicleModel } : {}),
            contextValues: {
              vehicleName: vehicle?.name ?? '',
              modelName: vehicleModel?.name ?? '',
            },
          }}
        />
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const category = await queryCategoryBySlug({ slug: decodedSlug })

  if (!category) {
    return {
      title: formatPageTitle('Special Category'),
    }
  }

  const featureImage =
    category.featureImage && typeof category.featureImage === 'object'
      ? (category.featureImage as Media)
      : null

  const title = formatPageTitle(category.title)
  const serverUrl = getServerSideURL()
  const ogImageUrl = featureImage?.sizes?.og?.url
    ? serverUrl + featureImage.sizes.og.url
    : featureImage?.url
      ? serverUrl + featureImage.url
      : serverUrl + DEFAULT_OG_IMAGE_PATH
  const pageUrl = getSpecialCategoryPath(category.slug)

  return {
    title,
    robots: CRAWLER_BLOCK_ROBOTS,
    openGraph: mergeOpenGraph({
      description: '',
      images: [{ url: ogImageUrl }],
      title,
      url: pageUrl,
    }),
  }
}

const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'special-categories',
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    depth: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const querySpecialsByCategoryId = cache(async ({ categoryId }: { categoryId: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'specials',
    draft,
    limit: 1000,
    overrideAccess: draft,
    pagination: false,
    depth: 2,
    sort: 'sortOrder',
    where: {
      category: {
        equals: categoryId,
      },
    },
    select: {
      slug: true,
      title: true,
      subTitle: true,
      offerType: true,
      pricingLabel: true,
      specialOffer: true,
      bestSaving: true,
      paymentFrom: true,
      cardImage: true,
      vehicle: true,
      vehicleModel: true,
      template: true,
    },
  })

  return result.docs
})
