import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { getCmsPageJsonLd } from '@/lib/seo/dealershipJsonLd'
import { resolveMediaOgUrl } from '@/lib/seo/buildDocumentMetadata'
import { generateMeta } from '@/lib/utils/generateMeta'
import { getPagePath } from '@/lib/utils/getPagePath'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Media } from '@/payload-types'

/** ISR for CMS pages (home + [slug]). */
export const revalidate = 300

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const searchParams = await searchParamsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const pagePath = getPagePath(page)
  const pageName = page.meta?.title || page.title || decodedSlug
  const pageDescription = page.meta?.description
  const pageImage = resolveMediaOgUrl(
    typeof page.meta?.image === 'object' ? (page.meta.image as Media) : null,
  )

  return (
    <div>
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <JsonLd
        data={getCmsPageJsonLd({
          slug: page.slug ?? decodedSlug,
          name: pageName,
          description: pageDescription,
          path: pagePath,
          dateModified: page.updatedAt,
          imageUrl: pageImage,
        })}
      />

      <RenderBlocks blocks={page.content?.section ?? null} meta={{ searchParams }} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
