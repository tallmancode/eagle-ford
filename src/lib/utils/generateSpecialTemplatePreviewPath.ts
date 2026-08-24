import type { PayloadRequest } from 'payload'

import type { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { getSpecialCategoryPath } from '@/lib/specials/paths'

type PreviewCategoryValue = string | { id?: string; slug?: string | null } | null | undefined

type Props = {
  data: Record<string, unknown>
  req: PayloadRequest
}

async function resolvePreviewCategorySlug(
  previewCategory: PreviewCategoryValue,
  req: PayloadRequest,
): Promise<string | null> {
  if (previewCategory && typeof previewCategory === 'object' && previewCategory.slug) {
    return previewCategory.slug
  }

  const categoryId =
    typeof previewCategory === 'string'
      ? previewCategory
      : previewCategory && typeof previewCategory === 'object'
        ? previewCategory.id
        : null

  if (categoryId) {
    const category = await req.payload.findByID({
      collection: 'special-categories',
      id: categoryId,
      depth: 0,
      disableErrors: true,
      select: { slug: true },
    })
    if (category?.slug) return category.slug
  }

  const firstCategory = await req.payload.find({
    collection: 'special-categories',
    depth: 0,
    limit: 1,
    pagination: false,
    sort: 'sortOrder',
    select: { slug: true },
  })

  return firstCategory.docs[0]?.slug ?? null
}

export async function generateSpecialTemplatePreviewPath({
  data,
  req,
}: Props): Promise<string | null> {
  const templateId = typeof data?.id === 'string' || typeof data?.id === 'number' ? String(data.id) : null
  if (!templateId) return null

  const categorySlug = await resolvePreviewCategorySlug(
    data.previewCategory as PreviewCategoryValue,
    req,
  )
  if (!categorySlug) return null

  const path = `${getSpecialCategoryPath(categorySlug)}?templatePreview=${encodeURIComponent(templateId)}`

  const encodedParams = new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  return `/next/preview?${encodedParams.toString()}`
}
