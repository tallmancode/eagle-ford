import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies, draftMode } from 'next/headers'
import React, { cache } from 'react'

import { SpecialsTabs } from '@/components/specials/SpecialsTabs'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { DEFAULT_OG_IMAGE_PATH } from '@/constants/site'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { getFinanceCalculatorDefaults } from '@/lib/blocks/finance-calculator-block/getFinanceCalculatorDefaults'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { contentContainsSpecialsTabs } from '@/lib/blocks/v2/specials-tabs-block/contentContainsSpecialsTabs'
import { getOfferTypeLabel } from '@/lib/specials/constants'
import { getSpecialDisplayTitle } from '@/lib/specials/getSpecialDisplayTitle'
import { getSpecialCategoryPath } from '@/lib/specials/paths'
import { SPECIAL_TEMPLATE_PREVIEW_COOKIE } from '@/lib/specials/templatePreviewCookie'
import { getSpecialCategorySeoDescription } from '@/lib/specials/specialCategorySeo'
import { buildDocumentMetadata, resolveMediaOgUrl } from '@/lib/seo/buildDocumentMetadata'
import {
  buildJsonLdGraph,
  getBreadcrumbJsonLd,
  getItemListJsonLd,
  getSpecialOfferJsonLd,
  getWebPageJsonLd,
} from '@/lib/seo/dealershipJsonLd'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { getPagePath } from '@/lib/utils/getPagePath'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
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

/** Prefer ISR over force-dynamic; searchParams still allow deep-links to a special. */
export const revalidate = 300

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
  | 'vehicleVariant'
  | 'enquiryForm'
  | 'template'
>

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    special?: string
    templatePreview?: string
  }>
}

async function resolveSpecialTemplate(
  template: SpecialListItem['template'] | SpecialCategory['template'] | string | null | undefined,
): Promise<SpecialTemplate | null> {
  if (!template) return null

  const { isEnabled: draft } = await draftMode()
  const templateId = typeof template === 'object' ? template.id : template

  if (!draft && typeof template === 'object') return template

  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'special-templates',
    id: templateId,
    draft,
    depth: 2,
    disableErrors: true,
    overrideAccess: draft,
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
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const { special: initialSpecialSlug, templatePreview } = await searchParamsPromise
  const cookieStore = await cookies()
  const templatePreviewFromCookie = cookieStore.get(SPECIAL_TEMPLATE_PREVIEW_COOKIE)?.value
  const decodedSlug = decodeURIComponent(slug)
  const url = getSpecialCategoryPath(decodedSlug)
  const category = await queryCategoryBySlug({ slug: decodedSlug })

  if (!category) return <PayloadRedirects url={url} />

  const specials = await querySpecialsByCategoryId({ categoryId: category.id })
  const selectedSpecial = findSelectedSpecial(specials, initialSpecialSlug)

  const forcedTemplateId =
    draft && (templatePreview || templatePreviewFromCookie)
      ? (templatePreview ?? templatePreviewFromCookie)!
      : null

  const [template, specialContentSections] = await Promise.all([
    forcedTemplateId
      ? resolveSpecialTemplate(forcedTemplateId)
      : selectedSpecial
        ? resolveSpecialTemplate(selectedSpecial.template ?? category.template)
        : Promise.resolve(null),
    selectedSpecial ? resolveSpecialContent(selectedSpecial.id) : Promise.resolve(null),
  ])
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
  const selectedSpecialPath = selectedSpecial
    ? getSpecialCategoryPath(decodedSlug, selectedSpecial.slug ?? undefined)
    : url
  const selectedImageUrl = selectedSpecial
    ? resolveMediaOgUrl(
        typeof selectedSpecial.cardImage === 'object' ? (selectedSpecial.cardImage as Media) : null,
      )
    : null
  const categoryDescription =
    getSpecialCategorySeoDescription(category.slug) ||
    `${category.title} — current Ford offers at Eagle Ford in Sandton, Johannesburg.`

  const specialListItems = specialsWithForms.slice(0, 20).map((special) => ({
    name: getSpecialDisplayTitle(special),
    path: getSpecialCategoryPath(decodedSlug, special.slug ?? undefined),
    imageUrl: resolveMediaOgUrl(
      typeof special.cardImage === 'object' ? (special.cardImage as Media) : null,
    ),
  }))

  const isTemplatePreview = Boolean(forcedTemplateId)
  const templateHasSpecialsTabs = contentContainsSpecialsTabs(templateSections)
  const useLegacyHardcodedTabs = !isTemplatePreview && !templateHasSpecialsTabs

  const baseMeta: BlockRenderMeta | undefined = selectedSpecial
    ? {
        ...(vehicle ? { vehicle } : {}),
        ...(vehicleModel ? { vehicleModel } : {}),
        contextValues: {
          ...(vehicle?.name ? { vehicleName: vehicle.name } : {}),
          ...(vehicleModel?.name ? { modelName: vehicleModel.name } : {}),
          specialCategory: category.title,
          specialType: getOfferTypeLabel(selectedSpecial.offerType),
          specialTitle: selectedDisplayTitle,
        },
      }
    : {
        contextValues: {
          specialCategory: category.title,
        },
      }

  const offerDetails =
    useSpecialContent && specialContentSections ? (
      <RenderBlocks blocks={specialContentSections} meta={baseMeta} />
    ) : null

  const blockMeta: BlockRenderMeta = {
    ...baseMeta,
    specialsPage: {
      categorySlug: category.slug,
      categoryTitle: category.title,
      categoryEnquiryForm,
      fordPromiseHref,
      specials: specialsWithForms,
      initialSpecialSlug,
      calculatorDefaults,
      offerDetails,
    },
  }

  return (
    <div>
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <JsonLd
        data={buildJsonLdGraph(
          getWebPageJsonLd({
            name: category.title,
            description: categoryDescription,
            path: url,
            dateModified: category.updatedAt,
            types: ['CollectionPage'],
          }),
          getItemListJsonLd({
            name: category.title,
            path: url,
            items: specialListItems,
          }),
          selectedSpecial
            ? getSpecialOfferJsonLd({
                name: selectedDisplayTitle,
                description:
                  selectedSpecial.subTitle ||
                  `${selectedDisplayTitle} — current offer at Eagle Ford.`,
                path: selectedSpecialPath,
                price: selectedSpecial.specialOffer,
                imageUrl: selectedImageUrl,
                dateModified: category.updatedAt,
              })
            : null,
          getBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Specials', path: '/specials' },
            { name: category.title, path: url },
          ]),
        )}
      />

      {useLegacyHardcodedTabs ? (
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
              offerDetails={offerDetails}
            />
          </div>
        </section>
      ) : null}

      {useTemplate && templateSections ? (
        <RenderBlocks blocks={templateSections} meta={blockMeta} />
      ) : null}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const category = await queryCategoryBySlug({ slug: decodedSlug })

  if (!category) {
    return buildDocumentMetadata({
      title: 'Special Category',
      path: `/specials/${decodedSlug}`,
    })
  }

  const featureImage =
    category.featureImage && typeof category.featureImage === 'object'
      ? (category.featureImage as Media)
      : null

  const serverUrl = getServerSideURL()
  const ogPath = resolveMediaOgUrl(featureImage)
  const ogImageUrl = ogPath
    ? ogPath.startsWith('http')
      ? ogPath
      : serverUrl + ogPath
    : serverUrl + DEFAULT_OG_IMAGE_PATH
  const pageUrl = getSpecialCategoryPath(category.slug)
  const description =
    getSpecialCategorySeoDescription(category.slug) ||
    `${category.title} — current Ford offers at Eagle Ford in Sandton, Johannesburg.`

  return buildDocumentMetadata({
    title: category.title,
    description,
    path: pageUrl,
    imageUrl: ogImageUrl,
  })
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'special-categories',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return categories.docs
    .filter((doc) => Boolean(doc.slug))
    .map(({ slug }) => ({ slug: slug as string }))
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
    sort: '_order',
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
      vehicleVariant: true,
      enquiryForm: true,
      template: true,
    },
  })

  return result.docs
})
