export function getSpecialCategoryPath(categorySlug: string, specialSlug?: string) {
  const base = `/specials/${categorySlug}`
  return specialSlug ? `${base}?special=${encodeURIComponent(specialSlug)}` : base
}
