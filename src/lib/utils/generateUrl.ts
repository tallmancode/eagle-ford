import type { GenerateURL } from '@payloadcms/plugin-seo/types'
import type { Page } from '@/payload-types'
import { getPagePath } from '@/lib/utils/getPagePath'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  if (!doc?.slug) return url

  return `${url}${getPagePath(doc)}`
}

export default generateURL
