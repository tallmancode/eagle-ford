import type { GenerateTitle, GenerateDescription } from '@payloadcms/plugin-seo/types'
import type { Page } from '@/payload-types'
import { DEFAULT_OG_DESCRIPTION, SITE_NAME } from '@/constants/site'

/** Title stored in meta.title — brand suffix is applied at render time via formatPageTitle. */
const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title?.trim() || SITE_NAME
}

export const generateDescription: GenerateDescription<Page> = ({ doc }) => {
  if (doc?.meta?.description?.trim()) return doc.meta.description.trim()
  if (doc?.title?.trim()) {
    return `${doc.title.trim()} at Eagle Ford — Johannesburg Ford dealership for new and used vehicles, service, parts and finance.`
  }
  return DEFAULT_OG_DESCRIPTION
}

export default generateTitle
