import type { GenerateDescription } from '@payloadcms/plugin-seo/types'
import type { Page } from '@/payload-types'
import { generatePageSeo } from '@/lib/ai-seo/generatePageSeo'
import { fallbackSeoDescription } from '@/lib/ai-seo/fallbacks'

const generateDescription: GenerateDescription<Page> = async ({ doc, req, collectionSlug }) => {
  if (!req?.payload) {
    return fallbackSeoDescription(doc)
  }

  const result = await generatePageSeo({
    doc,
    payload: req.payload,
    req,
    collectionSlug: collectionSlug ?? 'pages',
  })

  if (result.ok) return result.description
  return result.fallbackDescription
}

export default generateDescription
