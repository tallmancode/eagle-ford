import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { SpecialsTabs } from '@/components/specials/SpecialsTabs'
import { CRAWLER_BLOCK_ROBOTS } from '@/constants/crawlerPolicy'
import { DEFAULT_OG_IMAGE_PATH, formatPageTitle } from '@/constants/site'
import { getSpecialCategoryPath } from '@/lib/specials/paths'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import type { Media } from '@/payload-types'

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
    depth: 1,
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
    },
  })

  return result.docs
})
