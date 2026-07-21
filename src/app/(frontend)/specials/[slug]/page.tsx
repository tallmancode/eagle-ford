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
import { getFinanceCalculatorDefaults } from '@/lib/blocks/finance-calculator-block/getFinanceCalculatorDefaults'
import { getOfferTypeLabel } from '@/lib/specials/constants'
import { getSpecialDisplayTitle } from '@/lib/specials/getSpecialDisplayTitle'
import { getSpecialCategoryPath } from '@/lib/specials/paths'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { getPagePath } from '@/lib/utils/getPagePath'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import type {
  Form,
  Media,
  Setting,
  Special,
  SpecialCategory,
  SpecialTemplate,
  Vehicle,
  VehicleModel,
} from '@/payload-types'

export const dynamic = 'force-dynamic'

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
  | 'enquiryForm'
  | 'template'
>

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    special?: string
  }>
}

async function resolveSpecialTemplate(
  template: SpecialListItem['template'] | SpecialCategory['template'],
): Promise<SpecialTemplate | null> {
  if (!template) return null
  if (typeof template === 'object') return template

  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'special-templates',
    id: template,
    depth: 2,
    disableErrors: true,
    overrideAccess: false,
  })

  return result ?? null
}

async function resolveForm(
  form: SpecialListItem['enquiryForm'] | SpecialCategory['enquiryForm'],
): Promise<Form | null> {
  if (!form) return null
  if (typeof form === 'object' && form.id && (form.fields || form.steps)) {
    return form
  }

  const formId = typeof form === 'object' ? form.id : form
  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'forms',
    id: formId,
    depth: 2,
    disableErrors: true,
    overrideAccess: false,
  })

  return result ?? null
}

async function resolveFordPromiseHref(
  fordPromisePage: SpecialCategory['fordPromisePage'],
): Promise<string | null> {
  if (!fordPromisePage) return null

  if (typeof fordPromisePage === 'object') {
    if (!fordPromisePage.slug) return null
    return getPagePath(fordPromisePage)
  }

  const payload = await getPayload({ config: configPromise })
  const page = await payload.findByID({
    collection: 'pages',
    id: fordPromisePage,
    depth: 0,
    disableErrors: true,
    overrideAccess: false,
    select: {
      slug: true,
    },
  })

  if (!page?.slug) return null
  return getPagePath(page)
}

async function resolveSpecialContent(
  specialId: string,
): Promise<NonNullable<Special['content']>['section'] | null> {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'specials',
    id: specialId,
    draft,
    depth: 2,
    disableErrors: true,
    overrideAccess: draft,
    select: {
      content: true,
    },
  })

  const sections = result?.content?.section
  return Array.isArray(sections) && sections.length > 0 ? sections : null
}

async function resolveVehicle(vehicle: SpecialListItem['vehicle']): Promise<Vehicle | null> {
  if (!vehicle) return null
  if (typeof vehicle === 'object') return vehicle

  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'vehicles',
    id: vehicle,
    depth: 2,
    disableErrors: true,
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
    disableErrors: true,
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

function getFormId(
  form: SpecialListItem['enquiryForm'] | SpecialCategory['enquiryForm'],
): string | null {
  if (!form) return null
  return typeof form === 'object' ? form.id : form
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

  const [template, specialContentSections] = selectedSpecial
    ? await Promise.all([
        resolveSpecialTemplate(selectedSpecial.template ?? category.template),
        resolveSpecialContent(selectedSpecial.id),
      ])
    : [null, null]
  const templateSections = template?.section
  const useTemplate = Array.isArray(templateSections) && templateSections.length > 0
  const useSpecialContent =
    Array.isArray(specialContentSections) && specialContentSections.length > 0

  const formIds = new Set<string>()
  const categoryFormId = getFormId(category.enquiryForm)
  if (categoryFormId) formIds.add(categoryFormId)
  for (const special of specials) {
    const specialFormId = getFormId(special.enquiryForm)
    if (specialFormId) formIds.add(specialFormId)
  }

  const resolvedForms = new Map<string, Form>()
  await Promise.all(
    [...formIds].map(async (formId) => {
      const form = await resolveForm(formId)
      if (form) resolvedForms.set(formId, form)
    }),
  )

  const categoryEnquiryForm = categoryFormId ? (resolvedForms.get(categoryFormId) ?? null) : null

  const specialsWithForms: SpecialListItem[] = specials.map((special) => {
    const specialFormId = getFormId(special.enquiryForm)
    if (!specialFormId) return { ...special, enquiryForm: null }
    return {
      ...special,
      enquiryForm: resolvedForms.get(specialFormId) ?? null,
    }
  })

  const [vehicle, vehicleModel, fordPromiseHref, settings] = await Promise.all([
    selectedSpecial ? resolveVehicle(selectedSpecial.vehicle) : Promise.resolve(null),
    selectedSpecial ? resolveVehicleModel(selectedSpecial.vehicleModel) : Promise.resolve(null),
    resolveFordPromiseHref(category.fordPromisePage),
    getCachedGlobal('settings', 1) as Promise<Setting>,
  ])

  const calculatorDefaults = getFinanceCalculatorDefaults(settings)

  const selectedDisplayTitle = selectedSpecial ? getSpecialDisplayTitle(selectedSpecial) : ''

  const blockMeta = selectedSpecial
    ? {
        ...(vehicle ? { vehicle } : {}),
        ...(vehicleModel ? { vehicleModel } : {}),
        contextValues: {
          vehicleName: vehicle?.name ?? '',
          modelName: vehicleModel?.name ?? '',
          specialCategory: category.title,
          specialType: getOfferTypeLabel(selectedSpecial.offerType),
          specialTitle: selectedDisplayTitle,
        },
      }
    : undefined

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
            categoryTitle={category.title}
            categoryEnquiryForm={categoryEnquiryForm}
            fordPromiseHref={fordPromiseHref}
            specials={specialsWithForms}
            initialSpecialSlug={initialSpecialSlug}
            calculatorDefaults={calculatorDefaults}
            offerDetails={
              useSpecialContent && specialContentSections ? (
                <RenderBlocks blocks={specialContentSections} meta={blockMeta} />
              ) : null
            }
          />
        </div>
      </section>

      {useTemplate && templateSections && (
        <RenderBlocks blocks={templateSections} meta={blockMeta} />
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
    depth: 0,
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
      enquiryForm: true,
      template: true,
    },
  })

  return result.docs
})
