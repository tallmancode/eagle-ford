import type { CollectionBeforeChangeHook } from 'payload'

export const populatePublishedAt: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  if (operation === 'create' || operation === 'update') {
    const alreadyHasPublishedAt = Boolean(data?.publishedAt ?? originalDoc?.publishedAt)
    if (!alreadyHasPublishedAt) {
      return {
        ...data,
        publishedAt: new Date(),
      }
    }
  }

  return data
}
