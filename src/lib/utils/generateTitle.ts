import type { GenerateTitle } from '@payloadcms/plugin-seo/types'
import type { Page } from '@/payload-types'
import { SITE_NAME } from '@/constants/site'
import { generatePageSeo } from '@/lib/ai-seo/generatePageSeo'
import { fallbackSeoTitle } from '@/lib/ai-seo/fallbacks'

const generateTitle: GenerateTitle<Page> = async ({ doc, req, collectionSlug }) => {
  if (!req?.payload) {
    return fallbackSeoTitle(doc) || SITE_NAME
  }

  const result = await generatePageSeo({
    doc,
    payload: req.payload,
    req,
    collectionSlug: collectionSlug ?? 'pages',
  })

  if (result.ok) return result.title
  return result.fallbackTitle || SITE_NAME
}

export default generateTitle
