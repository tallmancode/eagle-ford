/**
 * Maps special seed entries to vehicle / model / variant catalog slugs used by the vehicle importer.
 * Service/enquiry specials intentionally return nulls.
 */
import {
  SPECIALS_CATALOG_INDEX,
  scoreTokens,
  tokenSet,
  type SpecialsCatalogModel,
  type SpecialsCatalogVehicle,
} from '@/lib/vehicle-seed/buildSpecialsCatalogIndex'

export type CatalogMatch = {
  vehicleSlug: string | null
  modelSlug: string | null
  variantSlug: string | null
}

/** Legacy flat linkedVehicle values from pre-3-tier specials seed. */
const LEGACY_LINKED_VEHICLE: Record<string, { vehicleSlug: string; modelSlug?: string }> = {
  'next level ranger': { vehicleSlug: 'next-level-ranger' },
  'ranger super cab': { vehicleSlug: 'next-level-ranger', modelSlug: 'super-cab' },
  'ranger single cab': { vehicleSlug: 'next-level-ranger', modelSlug: 'single-cab' },
  'next level everest': { vehicleSlug: 'next-level-everest' },
  'new level territory': { vehicleSlug: 'new-level-territory' },
  mustang: { vehicleSlug: 'mustang' },
  'mustang gt': { vehicleSlug: 'mustang', modelSlug: 'gt' },
  'mustang dark horse': { vehicleSlug: 'mustang', modelSlug: 'dark-horse' },
  'new tourneo custom': { vehicleSlug: 'new-tourneo-custom' },
  'new transit custom': { vehicleSlug: 'new-transit-custom' },
  'transit van': { vehicleSlug: 'transit-van' },
}

function detectVehicle(
  title: string,
  subTitle: string,
  specialSlug: string,
): SpecialsCatalogVehicle | null {
  const hay = `${title} ${subTitle} ${specialSlug}`.toLowerCase()

  if (/dark horse/.test(hay) || /mustang/.test(hay)) {
    return SPECIALS_CATALOG_INDEX.find((v) => v.slug === 'mustang') ?? null
  }
  if (/everest/.test(hay)) {
    return SPECIALS_CATALOG_INDEX.find((v) => v.slug === 'next-level-everest') ?? null
  }
  if (/territory/.test(hay)) {
    return SPECIALS_CATALOG_INDEX.find((v) => v.slug === 'new-level-territory') ?? null
  }
  if (/tourneo/.test(hay)) {
    return SPECIALS_CATALOG_INDEX.find((v) => v.slug === 'new-tourneo-custom') ?? null
  }
  if (/transit custom/.test(hay)) {
    return SPECIALS_CATALOG_INDEX.find((v) => v.slug === 'new-transit-custom') ?? null
  }
  if (/transit/.test(hay)) {
    return SPECIALS_CATALOG_INDEX.find((v) => v.slug === 'transit-van') ?? null
  }
  if (/ranger/.test(hay) || /raptor/.test(hay) || /tremor/.test(hay) || /wildtrak/.test(hay)) {
    return SPECIALS_CATALOG_INDEX.find((v) => v.slug === 'next-level-ranger') ?? null
  }

  return null
}

function detectModel(
  vehicle: SpecialsCatalogVehicle,
  subTitle: string,
  specialSlug: string,
): SpecialsCatalogModel | null {
  const hay = `${subTitle} ${specialSlug}`.toLowerCase()

  for (const model of vehicle.models) {
    if (model.aliases.some((alias) => hay.includes(alias))) {
      return model
    }
  }

  if (vehicle.slug === 'next-level-ranger') {
    if (/wildtrak\s*x|wildtrak-x/.test(hay)) {
      return vehicle.models.find((m) => m.slug === 'wildtrak-x') ?? null
    }
    if (/wildtrak/.test(hay)) return vehicle.models.find((m) => m.slug === 'wildtrak') ?? null
    if (/raptor/.test(hay)) return vehicle.models.find((m) => m.slug === 'raptor') ?? null
    if (/tremor/.test(hay)) return vehicle.models.find((m) => m.slug === 'tremor') ?? null
    if (/platinum/.test(hay)) return vehicle.models.find((m) => m.slug === 'platinum') ?? null
    if (/\bsport\b/.test(hay)) return vehicle.models.find((m) => m.slug === 'sport') ?? null
    if (/\bxlt\b/.test(hay)) return vehicle.models.find((m) => m.slug === 'xlt') ?? null
    if (/\bxl\b/.test(hay) && !/xlt/.test(hay))
      return vehicle.models.find((m) => m.slug === 'xl') ?? null
    if (/single\s*cab|\bsinglecab\b/.test(hay) || /ranger-sc-/.test(specialSlug)) {
      return vehicle.models.find((m) => m.slug === 'single-cab') ?? null
    }
    if (/super\s*cab|\bsupercab\b|\bsup\b/.test(hay) || /ranger-sup-/.test(specialSlug)) {
      return vehicle.models.find((m) => m.slug === 'super-cab') ?? null
    }
  }

  if (vehicle.slug === 'mustang') {
    if (/dark horse/.test(hay)) return vehicle.models.find((m) => m.slug === 'dark-horse') ?? null
    if (/\bgt\b/.test(hay)) return vehicle.models.find((m) => m.slug === 'gt') ?? null
  }

  return vehicle.models[0] ?? null
}

function bestVariant(
  model: SpecialsCatalogModel,
  subTitle: string,
  specialSlug: string,
): string | null {
  const needle = tokenSet(`${subTitle} ${specialSlug}`)
  const filtered = needle.filter(
    (t) => !['ford', 'next', 'level', 'new', 'ranger', 'everest', 'offer'].includes(t),
  )

  let best: { slug: string; score: number } | null = null
  for (const variant of model.variants) {
    const score = scoreTokens(variant.tokens, filtered.length > 0 ? filtered : needle)
    if (!best || score > best.score) {
      best = { slug: variant.slug, score }
    }
  }

  if (!best || best.score < 0.45) return null
  return best.slug
}

function findVehicleByName(name: string | null | undefined): SpecialsCatalogVehicle | null {
  if (!name?.trim()) return null
  const needle = name.trim().toLowerCase()

  const legacy = LEGACY_LINKED_VEHICLE[needle]
  if (legacy) {
    return SPECIALS_CATALOG_INDEX.find((v) => v.slug === legacy.vehicleSlug) ?? null
  }

  return (
    SPECIALS_CATALOG_INDEX.find(
      (v) =>
        v.name.toLowerCase() === needle ||
        v.aliases.some((alias) => alias === needle) ||
        v.slug === needle,
    ) ?? null
  )
}

function legacyModelSlugForVehicle(
  vehicle: SpecialsCatalogVehicle,
  linkedVehicle: string | null | undefined,
): string | null {
  if (!linkedVehicle?.trim()) return null
  const legacy = LEGACY_LINKED_VEHICLE[linkedVehicle.trim().toLowerCase()]
  return legacy?.modelSlug ?? null
}

function findModelByName(
  vehicle: SpecialsCatalogVehicle,
  name: string | null | undefined,
): SpecialsCatalogModel | null {
  if (!name?.trim()) return null
  const needle = name.trim().toLowerCase()

  const bySlugOrAlias = vehicle.models.find(
    (model) =>
      model.name.toLowerCase() === needle ||
      model.aliases.some((alias) => alias === needle) ||
      model.slug === needle,
  )
  if (bySlugOrAlias) return bySlugOrAlias

  // linkedModel may still be a variant display name from legacy seed — resolve by variant match.
  for (const model of vehicle.models) {
    const byVariantSlug = model.variants.find((v) => v.slug.toLowerCase() === needle)
    if (byVariantSlug) return model

    const byVariantName = model.variants.find((v) => v.name.toLowerCase() === needle)
    if (byVariantName) return model
  }

  return null
}

function resolveLinkedVariant(
  model: SpecialsCatalogModel | null,
  linkedVariant: string | null | undefined,
  linkedModelFallback: string | null | undefined,
): string | null {
  const needle = linkedVariant?.trim() || linkedModelFallback?.trim()
  if (!needle || !model) return null

  const lower = needle.toLowerCase()
  const bySlug = model.variants.find((v) => v.slug.toLowerCase() === lower)
  if (bySlug) return bySlug.slug

  const byName = model.variants.find((v) => v.name.toLowerCase() === lower)
  if (byName) return byName.slug

  if (!/\s/.test(needle)) return needle

  return bestVariant(model, needle, '')
}

export function matchSpecialToCatalog(input: {
  title?: string
  subTitle?: string
  labelOverride?: string
  slug: string
  offerType: string
  linkedVehicle?: string | null
  linkedModel?: string | null
  linkedVariant?: string | null
  vehicleSlug?: string | null
  modelSlug?: string | null
  variantSlug?: string | null
}): CatalogMatch {
  if (input.vehicleSlug || input.modelSlug || input.variantSlug) {
    return {
      vehicleSlug: input.vehicleSlug ?? null,
      modelSlug: input.modelSlug ?? null,
      variantSlug: input.variantSlug ?? null,
    }
  }

  if (input.linkedVehicle || input.linkedModel || input.linkedVariant) {
    const vehicle =
      findVehicleByName(input.linkedVehicle) ??
      detectVehicle(input.title ?? '', input.labelOverride ?? input.subTitle ?? '', input.slug)

    const legacyModelSlug = vehicle ? legacyModelSlugForVehicle(vehicle, input.linkedVehicle) : null

    const model =
      (vehicle && input.linkedModel ? findModelByName(vehicle, input.linkedModel) : null) ??
      (vehicle && legacyModelSlug
        ? (vehicle.models.find((m) => m.slug === legacyModelSlug) ?? null)
        : null) ??
      (vehicle
        ? detectModel(vehicle, input.labelOverride ?? input.subTitle ?? '', input.slug)
        : null)

    return {
      vehicleSlug: vehicle?.slug ?? null,
      modelSlug: model?.slug ?? null,
      variantSlug: resolveLinkedVariant(model, input.linkedVariant, input.linkedModel),
    }
  }

  if (input.offerType === 'service' || input.offerType === 'enquiry') {
    return { vehicleSlug: null, modelSlug: null, variantSlug: null }
  }

  const label = input.labelOverride ?? input.subTitle ?? ''
  const vehicle = detectVehicle(input.title ?? '', label, input.slug)
  if (!vehicle) return { vehicleSlug: null, modelSlug: null, variantSlug: null }

  const model = detectModel(vehicle, label, input.slug)
  if (!model) {
    return { vehicleSlug: vehicle.slug, modelSlug: null, variantSlug: null }
  }

  const variantSlug = bestVariant(model, label, input.slug)
  return {
    vehicleSlug: vehicle.slug,
    modelSlug: model.slug,
    variantSlug,
  }
}
