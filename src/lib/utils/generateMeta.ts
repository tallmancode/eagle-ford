import type { Metadata } from 'next'

import type { Media, Page, Config, Special } from '@/payload-types'

import { DEFAULT_OG_IMAGE_PATH } from '@/constants/site'
import { CRAWLER_NOINDEX_ROBOTS } from '@/constants/crawlerPolicy'
import { isThankYouSlug } from '@/lib/forms/enquiryFormIdentity'
import { buildDocumentMetadata, resolveMediaOgUrl } from '@/lib/seo/buildDocumentMetadata'
import { getSpecialDisplayTitle } from '@/lib/specials/getSpecialDisplayTitle'
import { getPagePath } from '@/lib/utils/getPagePath'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()
  let url = serverUrl + DEFAULT_OG_IMAGE_PATH

  if (image && typeof image === 'object' && 'url' in image) {
    const ogPath = resolveMediaOgUrl(image)
    if (ogPath) {
      url = ogPath.startsWith('http') ? ogPath : serverUrl + ogPath
    }
  }

  return url
}

function isSpecial(doc: Partial<Page> | Partial<Special> | null): doc is Partial<Special> {
  return doc != null && 'offerType' in doc
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Special> | null
}): Promise<Metadata> => {
  try {
    const { doc } = args

    if (isSpecial(doc)) {
      const displayTitle = getSpecialDisplayTitle(doc as Special)
      const cardImage = typeof doc.cardImage === 'object' ? doc.cardImage : undefined
      const ogImage = getImageURL(cardImage)
      const path = doc.slug ? `/specials/${doc.slug}` : '/'

      return buildDocumentMetadata({
        title: displayTitle,
        description: null,
        path,
        imageUrl: ogImage,
      })
    }

    if (!doc) {
      return buildDocumentMetadata({
        title: '',
        path: '/',
      })
    }

    const path = getPagePath(doc)
    const ogImage = getImageURL(doc.meta?.image)
    const title = doc.meta?.title || doc.title || ''

    return buildDocumentMetadata({
      title,
      description: doc.meta?.description,
      path,
      imageUrl: ogImage,
      robots: isThankYouSlug(doc.slug) ? CRAWLER_NOINDEX_ROBOTS : undefined,
    })
  } catch (error) {
    const { captureException } = await import('@sentry/nextjs')
    captureException(error, { tags: { area: 'generateMeta' } })
    return buildDocumentMetadata({
      title: '',
      path: '/',
    })
  }
}
