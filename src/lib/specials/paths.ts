export function getSpecialCategoryPath(categorySlug: string, specialSlug?: string) {
  const base = `/specials/${categorySlug}`
  return specialSlug ? `${base}?special=${encodeURIComponent(specialSlug)}` : base
}

/**
 * Build a specials category URL while keeping other query params (e.g. `templatePreview`
 * used by Special Template Better Editor). Only `special` is set/replaced.
 */
export function getSpecialCategoryPathPreservingParams(
  categorySlug: string,
  specialSlug: string | undefined,
  currentSearchParams: URLSearchParams,
) {
  const params = new URLSearchParams(currentSearchParams.toString())
  if (specialSlug) {
    params.set('special', specialSlug)
  } else {
    params.delete('special')
  }
  const qs = params.toString()
  return `/specials/${categorySlug}${qs ? `?${qs}` : ''}`
}
