import type { GenerateURL } from '@payloadcms/plugin-seo/types'
import type { Page, Blog } from '@/payload-types'
import { getPagePath } from '@/lib/utils/getPagePath'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'

const generateURL: GenerateURL<Page | Blog> = ({ doc, collectionSlug }) => {
  const url = getServerSideURL()

  if (!doc?.slug) return url

  if (collectionSlug === 'blog') {
    return `${url}/blog/${doc.slug}`
  }

  return `${url}${getPagePath(doc)}`
}

export default generateURL
