/**
 * Recursively walks a document/global/version JSON tree and collects any
 * string values that match known media IDs. Upload fields at depth 0 store
 * plain ID strings; polymorphic upload refs use { relationTo, value }.
 */
export function collectReferencedMediaIds(
  value: unknown,
  mediaIds: Set<string>,
  referenced: Set<string>,
): void {
  if (value === null || value === undefined) {
    return
  }

  if (typeof value === 'string') {
    if (mediaIds.has(value)) {
      referenced.add(value)
    }
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectReferencedMediaIds(item, mediaIds, referenced)
    }
    return
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>

    if (obj.relationTo === 'media' && 'value' in obj) {
      const ref = obj.value
      if (typeof ref === 'string' && mediaIds.has(ref)) {
        referenced.add(ref)
      } else if (ref && typeof ref === 'object' && 'id' in ref) {
        const id = (ref as { id: unknown }).id
        if (typeof id === 'string' && mediaIds.has(id)) {
          referenced.add(id)
        }
      }
    }

    for (const key of Object.keys(obj)) {
      collectReferencedMediaIds(obj[key], mediaIds, referenced)
    }
  }
}
