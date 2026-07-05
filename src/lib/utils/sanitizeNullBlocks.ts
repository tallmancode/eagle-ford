function isBlockArray(arr: unknown[]): boolean {
  return arr.some(
    (item) => item === null || (typeof item === 'object' && item !== null && 'blockType' in item),
  )
}

/**
 * Recursively strip null entries from block arrays anywhere in document data.
 * Payload autosave can persist null slots in nested blocks arrays, which crashes queryDrafts.
 */
export function sanitizeNullBlocks<T>(data: T): T {
  if (data === null || data === undefined) {
    return data
  }

  if (Array.isArray(data)) {
    if (isBlockArray(data)) {
      return data.filter(Boolean).map((item) => sanitizeNullBlocks(item)) as T
    }

    return data.map((item) => sanitizeNullBlocks(item)) as T
  }

  if (typeof data === 'object') {
    const result = { ...data } as Record<string, unknown>

    for (const key of Object.keys(result)) {
      result[key] = sanitizeNullBlocks(result[key])
    }

    return result as T
  }

  return data
}

/** Count null entries in block arrays (for repair script logging). */
export function countNullBlocks(data: unknown): number {
  if (data === null || data === undefined) {
    return 0
  }

  if (Array.isArray(data)) {
    let count = isBlockArray(data) ? data.filter((item) => item === null).length : 0

    for (const item of data) {
      count += countNullBlocks(item)
    }

    return count
  }

  if (typeof data === 'object') {
    return Object.values(data).reduce<number>((sum, value) => sum + countNullBlocks(value), 0)
  }

  return 0
}
