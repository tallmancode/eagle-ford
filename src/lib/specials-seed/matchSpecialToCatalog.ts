/**
 * Maps special seed entries to vehicle / model catalog slugs used by the vehicle importer.
 * Service/enquiry specials intentionally return nulls.
 */

export type CatalogMatch = {
  vehicleSlug: string | null
  modelSlug: string | null
}

type CatalogVariant = {
  slug: string
  name: string
  tokens: string[]
}

type CatalogVehicle = {
  slug: string
  name: string
  aliases: string[]
  variants: CatalogVariant[]
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

function scoreTokens(haystack: string[], needle: string[]): number {
  if (needle.length === 0) return 0
  let hits = 0
  for (const token of needle) {
    if (haystack.includes(token)) hits++
  }
  return hits / needle.length
}

const CATALOG: CatalogVehicle[] = [
  {
    slug: 'next-level-ranger',
    name: 'Next Level Ranger',
    aliases: ['next level ranger', 'ranger dc', 'ranger double cab', 'ranger'],
    variants: [
      { slug: '2.0-sit-double-cab-xl-4x2-6mt', name: '2.0 SiT Double Cab XL 4x2 6MT', tokens: [] },
      {
        slug: '2.0-sit-double-cab-xlt-4x2-10at',
        name: '2.0 SiT Double Cab XLT 4x2 10AT',
        tokens: [],
      },
      {
        slug: '2.3l-double-cab-sport-4x2-10at',
        name: '2.3L Double Cab Sport 4x2 10AT',
        tokens: [],
      },
      {
        slug: '2.3l-double-cab-wildtrak-4x2-10at',
        name: '2.3L Double Cab Wildtrak 4x2 10AT',
        tokens: [],
      },
      {
        slug: '3.0l-v6-double-cab-tremor-4x4-10at',
        name: '3.0L V6 Double Cab Tremor 4x4 10AT',
        tokens: [],
      },
      {
        slug: '3.0l-v6-double-cab-wildtrak-4x4-10at',
        name: '3.0L V6 Double Cab Wildtrak 4x4 10AT',
        tokens: [],
      },
      {
        slug: '3.0l-v6-double-cab-platinum-4x4-10at',
        name: '3.0L V6 Double Cab Platinum 4x4 10AT',
        tokens: [],
      },
      {
        slug: '3.0l-v6-tt-double-cab-raptor-4x4-10at',
        name: '3.0L V6 TT Double Cab Raptor 4x4 10AT',
        tokens: [],
      },
    ],
  },
  {
    slug: 'ranger-super-cab',
    name: 'Ranger Super Cab',
    aliases: ['ranger super cab', 'ranger supercab', 'super cab ranger'],
    variants: [
      {
        slug: 'ranger-2.0-sit-supercab-xl-auto',
        name: 'Ranger 2.0 SiT SuperCab XL auto',
        tokens: [],
      },
      { slug: 'ranger-2.0-sit-supercab-xlt', name: 'Ranger 2.0 SiT SuperCab XLT', tokens: [] },
      {
        slug: 'ford-ranger-2.0-biturbo-supercab-wildtrak-4x4',
        name: 'Ford Ranger 2.0 BiTurbo SuperCab Wildtrak 4x4',
        tokens: [],
      },
    ],
  },
  {
    slug: 'ranger-single-cab',
    name: 'Ranger Single Cab',
    aliases: ['ranger single cab', 'single cab ranger'],
    variants: [
      {
        slug: 'ranger-2.0-sit-single-cab-xl-4x2-auto',
        name: 'Ranger 2.0 SiT Single Cab XL 4x2 auto',
        tokens: [],
      },
      {
        slug: '2.0-sit-single-cab-xl-4x4-manual',
        name: '2.0 SiT Single Cab XL 4x4 Manual',
        tokens: [],
      },
      {
        slug: 'ranger-2.0-sit-supercab-xl-4x4',
        name: 'Ranger 2.0 SiT SuperCab XL 4x4',
        tokens: [],
      },
    ],
  },
  {
    slug: 'next-level-everest',
    name: 'Next Level Everest',
    aliases: ['next level everest', 'everest'],
    variants: [
      { slug: '2.0-sit-active-4x2-10at', name: '2.0 SiT Active 4x2 10AT', tokens: [] },
      { slug: '2.0-sit-active-4x4-10at', name: '2.0 SiT Active 4x4 10AT', tokens: [] },
      { slug: '3.0-v6-sport-4x4-10at', name: '3.0 V6 Sport 4x4 10AT', tokens: [] },
      { slug: '3.0-v6-wildtrak-4x4-10at', name: '3.0 V6 Wildtrak 4x4 10AT', tokens: [] },
      { slug: '3.0-v6-platinum-4x4-10at', name: '3.0 V6 Platinum 4x4 10AT', tokens: [] },
    ],
  },
  {
    slug: 'new-level-territory',
    name: 'New Level Territory',
    aliases: ['new level territory', 'territory'],
    variants: [
      { slug: 'territory-1.8t-ambiente', name: 'Territory 1.8T Ambiente', tokens: [] },
      { slug: 'territory-1.8t-trend', name: 'Territory 1.8T Trend', tokens: [] },
      { slug: '1.8t-titanium', name: '1.8T Titanium', tokens: [] },
    ],
  },
  {
    slug: 'mustang-gt',
    name: 'Mustang GT',
    aliases: ['mustang gt', 'mustang'],
    variants: [
      {
        slug: 'mustang-5.0l-v8-gt-fastback-10at',
        name: 'MUSTANG 5.0L V8 GT FASTBACK 10AT',
        tokens: [],
      },
    ],
  },
  {
    slug: 'mustang-dark-horse',
    name: 'Mustang Dark Horse',
    aliases: ['mustang dark horse', 'dark horse'],
    variants: [
      {
        slug: 'mustang-5.0l-v8-dark-horse-10at',
        name: 'MUSTANG 5.0L V8 DARK HORSE 10AT',
        tokens: [],
      },
    ],
  },
  {
    slug: 'new-tourneo-custom',
    name: 'New Tourneo Custom',
    aliases: ['tourneo custom', 'tourneo'],
    variants: [
      { slug: 'tourneo-trend', name: 'Tourneo Trend', tokens: [] },
      { slug: 'tourneo-sport', name: 'Tourneo Sport', tokens: [] },
      { slug: 'tourneo-titanium-x', name: 'Tourneo Titanium X', tokens: [] },
    ],
  },
  {
    slug: 'new-transit-custom',
    name: 'New Transit Custom',
    aliases: ['transit custom'],
    variants: [
      {
        slug: 'transit-custom-2.0l-lwb-van-base-6mt',
        name: 'TRANSIT CUSTOM 2.0L LWB VAN BASE 6MT',
        tokens: [],
      },
    ],
  },
  {
    slug: 'transit-van',
    name: 'Transit Van',
    aliases: ['transit van', 'ford transit'],
    variants: [
      { slug: '2.2-tdci-elwb-ambiente-6mt', name: '2.2 TDCi ELWB Ambiente 6MT', tokens: [] },
    ],
  },
]

for (const vehicle of CATALOG) {
  for (const variant of vehicle.variants) {
    variant.tokens = tokenSet(`${variant.name} ${variant.slug}`)
  }
}

function detectVehicle(
  title: string,
  subTitle: string,
  specialSlug: string,
): CatalogVehicle | null {
  const hay = `${title} ${subTitle} ${specialSlug}`.toLowerCase()

  if (/dark horse/.test(hay)) {
    return CATALOG.find((v) => v.slug === 'mustang-dark-horse') ?? null
  }
  if (/mustang/.test(hay)) {
    return CATALOG.find((v) => v.slug === 'mustang-gt') ?? null
  }
  if (/everest/.test(hay)) {
    return CATALOG.find((v) => v.slug === 'next-level-everest') ?? null
  }
  if (/territory/.test(hay)) {
    return CATALOG.find((v) => v.slug === 'new-level-territory') ?? null
  }
  if (/tourneo/.test(hay)) {
    return CATALOG.find((v) => v.slug === 'new-tourneo-custom') ?? null
  }
  if (/transit custom/.test(hay)) {
    return CATALOG.find((v) => v.slug === 'new-transit-custom') ?? null
  }
  if (/transit/.test(hay)) {
    return CATALOG.find((v) => v.slug === 'transit-van') ?? null
  }

  if (/ranger/.test(hay) || /raptor/.test(hay)) {
    if (/single\s*cab|\bsinglecab\b/.test(hay) || /ranger-sc-/.test(specialSlug)) {
      return CATALOG.find((v) => v.slug === 'ranger-single-cab') ?? null
    }
    if (
      /super\s*cab|\bsupercab\b|\bsup\b/.test(hay) ||
      /ranger-sup-/.test(specialSlug) ||
      /-super-cab-/.test(specialSlug)
    ) {
      return CATALOG.find((v) => v.slug === 'ranger-super-cab') ?? null
    }
    return CATALOG.find((v) => v.slug === 'next-level-ranger') ?? null
  }

  return null
}

function bestVariant(
  vehicle: CatalogVehicle,
  subTitle: string,
  specialSlug: string,
): string | null {
  const needle = tokenSet(`${subTitle} ${specialSlug}`)
  // Drop very common noise tokens that inflate weak matches
  const filtered = needle.filter(
    (t) => !['ford', 'next', 'level', 'new', 'ranger', 'everest', 'offer'].includes(t),
  )

  let best: { slug: string; score: number } | null = null
  for (const variant of vehicle.variants) {
    const score = scoreTokens(variant.tokens, filtered.length > 0 ? filtered : needle)
    if (!best || score > best.score) {
      best = { slug: variant.slug, score }
    }
  }

  // Require a reasonably strong match (~half the distinctive tokens)
  if (!best || best.score < 0.45) return null
  return best.slug
}

function findVehicleByName(name: string | null | undefined): CatalogVehicle | null {
  if (!name?.trim()) return null
  const needle = name.trim().toLowerCase()
  return (
    CATALOG.find(
      (v) =>
        v.name.toLowerCase() === needle ||
        v.aliases.some((alias) => alias === needle) ||
        v.slug === needle,
    ) ?? null
  )
}

/**
 * Resolve linkedModel which may be a display name OR a CMS vehicle-model slug
 * (e.g. "territory-18t-ambiente", "20-sit-active-4x2-10at").
 */
function resolveLinkedModel(
  vehicle: CatalogVehicle | null,
  linkedModel: string | null | undefined,
): string | null {
  if (!linkedModel?.trim()) return null
  const needle = linkedModel.trim()
  const lower = needle.toLowerCase()

  if (vehicle) {
    const bySlug = vehicle.variants.find((v) => v.slug.toLowerCase() === lower)
    if (bySlug) return bySlug.slug

    const byName = vehicle.variants.find((v) => v.name.toLowerCase() === lower)
    if (byName) return byName.slug
  }

  // Manual seed overrides use real CMS model slugs (often without dots).
  // Pass them through so import can look them up in the DB.
  if (!/\s/.test(needle)) {
    return needle
  }

  if (vehicle) {
    return bestVariant(vehicle, needle, '')
  }

  return null
}

export function matchSpecialToCatalog(input: {
  title?: string
  subTitle?: string
  labelOverride?: string
  slug: string
  offerType: string
  /** Catalog vehicle family name or slug */
  linkedVehicle?: string | null
  /** Catalog model display name OR CMS vehicle-model slug */
  linkedModel?: string | null
  vehicleSlug?: string | null
  modelSlug?: string | null
}): CatalogMatch {
  // Explicit slug overrides in seed data win
  if (input.vehicleSlug || input.modelSlug) {
    return {
      vehicleSlug: input.vehicleSlug ?? null,
      modelSlug: input.modelSlug ?? null,
    }
  }

  // Linked vehicle/model from nested seed DATA (names and/or CMS slugs)
  if (input.linkedVehicle || input.linkedModel) {
    const vehicle =
      findVehicleByName(input.linkedVehicle) ??
      detectVehicle(input.title ?? '', input.labelOverride ?? input.subTitle ?? '', input.slug)

    return {
      vehicleSlug: vehicle?.slug ?? null,
      modelSlug: resolveLinkedModel(vehicle, input.linkedModel),
    }
  }

  if (input.offerType === 'service' || input.offerType === 'enquiry') {
    return { vehicleSlug: null, modelSlug: null }
  }

  const label = input.labelOverride ?? input.subTitle ?? ''
  const vehicle = detectVehicle(input.title ?? '', label, input.slug)
  if (!vehicle) return { vehicleSlug: null, modelSlug: null }

  const modelSlug = bestVariant(vehicle, label, input.slug)
  return {
    vehicleSlug: vehicle.slug,
    modelSlug,
  }
}
