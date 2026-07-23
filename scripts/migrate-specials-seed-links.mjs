/**
 * Migrates specials-data.ts linkedVehicle/linkedModel to explicit 3-tier links.
 * Run: pnpm exec tsx scripts/migrate-specials-seed-links.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SPECIALS_FILE = join(__dirname, '../src/lib/specials-seed/specials-data.ts')

const LEGACY_VEHICLE = {
  'Next Level Ranger': { vehicle: 'next-level-ranger' },
  'Ranger Super Cab': { vehicle: 'next-level-ranger', model: 'super-cab' },
  'Ranger Single Cab': { vehicle: 'next-level-ranger', model: 'single-cab' },
  'Next Level Everest': { vehicle: 'next-level-everest' },
  'New Level Territory': { vehicle: 'new-level-territory' },
  Mustang: { vehicle: 'mustang' },
  'Mustang GT': { vehicle: 'mustang', model: 'gt' },
  'Mustang Dark Horse': { vehicle: 'mustang', model: 'dark-horse' },
  'New Transit Custom': { vehicle: 'new-transit-custom' },
  'new-tourneo-custom': { vehicle: 'new-tourneo-custom' },
  'New Tourneo Custom': { vehicle: 'new-tourneo-custom' },
}

async function main() {
  const { VEHICLE_CATALOG_DATA } = await import('../src/lib/vehicle-seed/vehicle-catalog-data.ts')
  const { matchSpecialToCatalog } =
    await import('../src/lib/specials-seed/matchSpecialToCatalog.ts')

  const source = readFileSync(SPECIALS_FILE, 'utf8')
  const dataStart = source.indexOf('export const DATA: SpecialSeedCategory[] = ')
  const dataOpen = source.indexOf('[', dataStart)
  const dataEnd = source.lastIndexOf(']\n')
  const dataLiteral = source.slice(dataOpen, dataEnd + 1)

  const categories = Function(`"use strict"; return (${dataLiteral})`)()

  let updatedCount = 0

  for (const category of categories) {
    for (const special of category.specials) {
      const legacy = special.linkedVehicle ? LEGACY_VEHICLE[special.linkedVehicle] : undefined
      const oldModel = special.linkedModel

      const match = matchSpecialToCatalog({
        labelOverride: special.labelOverride,
        slug: special.slug,
        offerType: special.offerType,
        linkedVehicle: special.linkedVehicle,
        linkedModel: special.linkedModel,
        linkedVariant: special.linkedVariant,
      })

      if (!match.vehicleSlug) continue

      const vehicle = VEHICLE_CATALOG_DATA.find((v) => v.slug === match.vehicleSlug)
      const model =
        vehicle?.models.find((m) => m.slug === match.modelSlug) ??
        (legacy?.model ? vehicle?.models.find((m) => m.slug === legacy.model) : undefined)

      special.linkedVehicle = vehicle?.name ?? special.linkedVehicle
      special.linkedModel = model?.name ?? special.linkedModel

      if (match.variantSlug && model) {
        const variant = model.variants.find((v) => v.slug === match.variantSlug)
        special.linkedVariant = variant?.name ?? match.variantSlug
      } else if (oldModel && model) {
        const variant = model.variants.find(
          (v) => v.name.toLowerCase() === oldModel.toLowerCase() || v.slug === oldModel,
        )
        if (variant) special.linkedVariant = variant.name
      }

      if (special.linkedVariant || special.linkedModel !== oldModel) updatedCount++
    }
  }

  const typeBlock = source.slice(0, dataStart)
  const footerStart = source.indexOf('export const SPECIALS_SEED_DATA')
  const footer = source.slice(footerStart)

  const updatedTypeBlock = typeBlock.replace(
    `  /** CMS vehicle-model slug (preferred) or catalog display name */
  linkedModel?: string`,
    `  /** CMS vehicle-model name or slug (trim level, e.g. "Ranger XL" / "xl") */
  linkedModel?: string
  /** CMS vehicle-variant name or slug (configuration) */
  linkedVariant?: string`,
  )

  const { default: utilInspect } = await import('node:util')
  void utilInspect

  function serializeItem(obj, indent) {
    const pad = '  '.repeat(indent)
    const padInner = '  '.repeat(indent + 1)
    const lines = [`${pad}{`]
    const keys = Object.keys(obj)
    for (const key of keys) {
      const value = obj[key]
      if (value === undefined) continue
      if (typeof value === 'string') {
        lines.push(`${padInner}${key}: ${JSON.stringify(value)},`)
      } else if (typeof value === 'number') {
        lines.push(`${padInner}${key}: ${value},`)
      }
    }
    lines.push(`${pad}},`)
    return lines.join('\n')
  }

  function serializeCategories(cats) {
    const lines = ['export const DATA: SpecialSeedCategory[] = [']
    for (const category of cats) {
      lines.push('  {')
      lines.push(`    specialsCategory: ${JSON.stringify(category.specialsCategory)},`)
      lines.push('    specials: [')
      for (const special of category.specials) {
        lines.push(serializeItem(special, 3))
      }
      lines.push('    ],')
      lines.push('  },')
    }
    lines.push(']')
    return lines.join('\n')
  }

  writeFileSync(
    SPECIALS_FILE,
    `${updatedTypeBlock}${serializeCategories(categories)}\n\n${footer}`,
    'utf8',
  )
  console.log(`Updated ${updatedCount} specials with 3-tier catalog links`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
