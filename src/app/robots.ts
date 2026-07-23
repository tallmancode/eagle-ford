import type { MetadataRoute } from 'next'

import { ALLOW_SEARCH_INDEXING } from '@/constants/crawlerPolicy'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getServerSideURL()

  if (!ALLOW_SEARCH_INDEXING) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/next/', '/monitoring'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
