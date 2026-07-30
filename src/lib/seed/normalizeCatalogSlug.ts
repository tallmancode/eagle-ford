/** Matches Payload slugField slugify so import upserts find the same stored slug. */
export function normalizeCatalogSlug(value: string): string {
  return value
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()
}
