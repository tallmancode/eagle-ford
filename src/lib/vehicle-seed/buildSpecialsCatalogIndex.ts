import { VEHICLE_CATALOG_DATA } from './vehicle-catalog-data'
import type { VehicleDef } from './vehicle-catalog-types'

export type SpecialsCatalogVariant = {
  slug: string
  name: string
  tokens: string[]
}

export type SpecialsCatalogModel = {
  slug: string
  name: string
  aliases: string[]
  variants: SpecialsCatalogVariant[]
}

export type SpecialsCatalogVehicle = {
  slug: string
  name: string
  aliases: string[]
  models: SpecialsCatalogModel[]
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/double[\s-]?cab|\bdc\b/g, ' doublecab ')
    .replace(/super[\s-]?cab|supercab|\bsup\b|\bsc\b/g, ' supercab ')
    .replace(/single[\s-]?cab/g, ' singlecab ')
    .replace(/\b4wd\b/g, ' 4x4 ')
    .replace(/\b10at\b|\b8at\b|\b6at\b/g, ' auto ')
    .replace(/\b6mt\b|\bmanual\b/g, ' manual ')
    .replace(/[^a-z0-9.]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function tokenSet(value: string): string[] {
  return [...new Set(tokenize(value))]
}

function modelAliases(modelName: string, modelSlug: string): string[] {
  const aliases = new Set<string>([modelName.toLowerCase(), modelSlug])
  const trimmed = modelName.replace(/^Ranger\s+/i, '').trim()
  if (trimmed && trimmed !== modelName) aliases.add(trimmed.toLowerCase())
  return [...aliases]
}

function vehicleAliases(vehicle: VehicleDef): string[] {
  const aliases = new Set<string>([vehicle.name.toLowerCase(), vehicle.slug])
  if (vehicle.slug === 'next-level-ranger') {
    aliases.add('ranger')
    aliases.add('ranger super cab')
    aliases.add('ranger single cab')
  }
  if (vehicle.slug === 'next-level-everest') aliases.add('everest')
  if (vehicle.slug === 'new-level-territory') aliases.add('territory')
  if (vehicle.slug === 'mustang') {
    aliases.add('mustang gt')
    aliases.add('mustang dark horse')
    aliases.add('dark horse')
  }
  if (vehicle.slug === 'new-tourneo-custom') aliases.add('tourneo custom')
  if (vehicle.slug === 'new-transit-custom') aliases.add('transit custom')
  if (vehicle.slug === 'transit-van') aliases.add('transit van')
  return [...aliases]
}

export function buildSpecialsCatalogIndex(
  catalog: VehicleDef[] = VEHICLE_CATALOG_DATA,
): SpecialsCatalogVehicle[] {
  return catalog.map((vehicle) => ({
    slug: vehicle.slug,
    name: vehicle.name,
    aliases: vehicleAliases(vehicle),
    models: vehicle.models.map((model) => ({
      slug: model.slug,
      name: model.name,
      aliases: modelAliases(model.name, model.slug),
      variants: model.variants.map((variant) => ({
        slug: variant.slug,
        name: variant.name,
        tokens: tokenSet(`${variant.name} ${variant.slug}`),
      })),
    })),
  }))
}

export const SPECIALS_CATALOG_INDEX = buildSpecialsCatalogIndex()

export function scoreTokens(haystack: string[], needle: string[]): number {
  if (needle.length === 0) return 0
  let hits = 0
  for (const token of needle) {
    if (haystack.includes(token)) hits++
  }
  return hits / needle.length
}

export { tokenSet, tokenize }
