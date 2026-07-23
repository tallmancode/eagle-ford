import type { Metadata } from 'next'

import type { Media, Page, Config, Special } from '@/payload-types'

import { CRAWLER_ROBOTS } from '@/constants/crawlerPolicy'
import { DEFAULT_OG_DESCRIPTION, DEFAULT_OG_IMAGE_PATH, formatPageTitle, SITE_NAME } from '@/constants/site'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import { getSpecialDisplayTitle } from '@/lib/specials/getSpecialDisplayTitle'
import { getPagePath } from '@/lib/utils/getPagePath'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + DEFAULT_OG_IMAGE_PATH

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

function isSpecial(doc: Partial<Page> | Partial<Special> | null): doc is Partial<Special> {
  return doc != null && 'offerType' in doc
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Special> | null
}): Promise<Metadata> => {
  const { doc } = args
  const serverUrl = getServerSideURL()

  if (isSpecial(doc)) {
    const displayTitle = getSpecialDisplayTitle(doc as Special)
    const title = formatPageTitle(displayTitle)
    const cardImage = typeof doc.cardImage === 'object' ? doc.cardImage : undefined
    const ogImage = getImageURL(cardImage)
    const path = doc.slug ? `/specials/${doc.slug}` : '/'
    const description = DEFAULT_OG_DESCRIPTION

    return {
      title,
      description,
      robots: CRAWLER_ROBOTS,
      alternates: {
        canonical: `${serverUrl}${path}`,
      },
      openGraph: mergeOpenGraph({
        description,
        images: ogImage ? [{ url: ogImage }] : undefined,
        title,
        url: path,
      }),
    }
  }

  const ogImage = getImageURL(doc?.meta?.image)
  const path = doc ? getPagePath(doc) : '/'
  const title = doc?.meta?.title ? formatPageTitle(doc.meta.title) : SITE_NAME
  const description = doc?.meta?.description || DEFAULT_OG_DESCRIPTION

  return {
    title,
    description,
    robots: CRAWLER_ROBOTS,
    alternates: {
      canonical: `${serverUrl}${path}`,
    },
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: path,
    }),
  }
}
