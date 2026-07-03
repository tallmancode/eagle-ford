import type { Metadata } from 'next'

import type { Media, Page, Blog, Config } from '@/payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import { DEFAULT_OG_IMAGE_PATH, formatPageTitle, SITE_NAME } from '@/constants/site'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + DEFAULT_OG_IMAGE_PATH

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Blog> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title ? formatPageTitle(doc.meta.title) : SITE_NAME

  return {
    description: doc?.meta?.description,
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
