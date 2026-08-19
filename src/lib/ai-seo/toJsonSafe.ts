/**
 * JSON.stringify throws when Payload SEO preview / generate sends form state that still
 * holds block RowLabel React trees (they close over BasePayload). Strip cycles and
 * non-JSON values so admin fetches stay safe.
 */
export function toJsonSafe<T>(value: T): T {
  const seen = new WeakSet<object>()

  const json = JSON.stringify(value, (_key, current) => {
    if (typeof current === 'function') return undefined
    if (!current || typeof current !== 'object') return current

    if (seen.has(current as object)) return undefined
    seen.add(current as object)

    const ctor = (current as { constructor?: { name?: string } }).constructor?.name
    if (ctor === 'BasePayload' || ctor === 'Payload') return undefined

    if (
      'db' in (current as object) &&
      'config' in (current as object) &&
      'collections' in (current as object) &&
      typeof (current as { find?: unknown }).find === 'function'
    ) {
      return undefined
    }

    return current
  })

  return (json ? JSON.parse(json) : null) as T
}
