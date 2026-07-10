import type { Metadata } from 'next'

import type { Media, Page, Blog, Config, Special } from '@/payload-types'

import { CRAWLER_BLOCK_ROBOTS } from '@/constants/crawlerPolicy'
import { DEFAULT_OG_IMAGE_PATH, formatPageTitle, SITE_NAME } from '@/constants/site'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import { getSpecialDisplayTitle } from '@/lib/specials/getSpecialDisplayTitle'
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

function isSpecial(
  doc: Partial<Page> | Partial<Blog> | Partial<Special> | null,
): doc is Partial<Special> {
  return doc != null && 'offerType' in doc
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Blog> | Partial<Special> | null
}): Promise<Metadata> => {
  const { doc } = args

  if (isSpecial(doc)) {
    const displayTitle = getSpecialDisplayTitle(doc as Special)
    const title = formatPageTitle(displayTitle)
    const cardImage = typeof doc.cardImage === 'object' ? doc.cardImage : undefined
    const ogImage = getImageURL(cardImage)
    const url = doc.slug ? `/specials/${doc.slug}` : '/'

    return {
      robots: CRAWLER_BLOCK_ROBOTS,
      openGraph: mergeOpenGraph({
        description: '',
        images: ogImage ? [{ url: ogImage }] : undefined,
        title,
        url,
      }),
      title,
    }
  }

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title ? formatPageTitle(doc.meta.title) : SITE_NAME

  return {
    description: doc?.meta?.description,
    robots: CRAWLER_BLOCK_ROBOTS,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
