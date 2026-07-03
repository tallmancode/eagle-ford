import type { GenerateTitle } from '@payloadcms/plugin-seo/types'
import type { Page } from '@/payload-types'
import { formatPageTitle, SITE_NAME } from '@/constants/site'

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ? formatPageTitle(doc.title) : SITE_NAME
}

export default generateTitle
