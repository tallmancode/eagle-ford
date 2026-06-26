import type { Metadata } from 'next'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import { DEFAULT_OG_DESCRIPTION, DEFAULT_OG_IMAGE_PATH, SITE_NAME } from '@/lib/constants/site'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: DEFAULT_OG_DESCRIPTION,
  images: [
    {
      url: `${getServerSideURL()}${DEFAULT_OG_IMAGE_PATH}`,
    },
  ],
  siteName: SITE_NAME,
  title: SITE_NAME,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
