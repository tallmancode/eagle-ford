import type { CollectionBeforeValidateHook, CollectionSlug } from 'payload'
import { ValidationError } from 'payload'

type ScopedSlugConfig = {
  collection: CollectionSlug
  entityLabel: string
  parentField: string
  parentLabel: string
}

function resolveRelationshipId(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const id = (value as { id: unknown }).id
    return id != null ? String(id) : null
  }
  return null
}

export function validateScopedSlugUniqueness({
  collection,
  entityLabel,
  parentField,
  parentLabel,
}: ScopedSlugConfig): CollectionBeforeValidateHook {
  return async ({ data, operation, req, originalDoc }) => {
    if (!data?.slug) return data

    const parentId = resolveRelationshipId(data[parentField])
    if (!parentId) return data

    const existing = await req.payload.find({
      collection,
      where: {
        and: [
          { slug: { equals: data.slug } },
          { [parentField]: { equals: parentId } },
          ...(operation === 'update' && originalDoc?.id
            ? [{ id: { not_equals: originalDoc.id } }]
            : []),
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) {
      throw new ValidationError({
        collection,
        errors: [
          {
            message: `A ${entityLabel} with slug "${data.slug}" already exists for this ${parentLabel}. Slugs must be unique per ${parentLabel}.`,
            path: 'slug',
          },
        ],
      })
    }

    return data
  }
}
