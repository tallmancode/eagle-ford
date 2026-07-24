/**
 * Strips legacy flat VEHICLE_DATA from import-vehicles/route.ts after catalog extraction.
 * Run once: node scripts/trim-import-vehicles-route.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROUTE_FILE = join(__dirname, '../src/app/(frontend)/next/import-vehicles/route.ts')

const source = readFileSync(ROUTE_FILE, 'utf8')

const seedStart = source.indexOf(
  '// ---------------------------------------------------------------------------\n// Vehicle seed data',
)
const seedEnd = source.indexOf(
  '// ---------------------------------------------------------------------------\n// Route handler',
)

if (seedStart === -1 || seedEnd === -1 || seedEnd <= seedStart) {
  throw new Error('Could not locate vehicle seed data block boundaries')
}

const newImportBlock = `import { createSeedStreamResponse } from '@/lib/seed/createSeedStreamResponse'
import {
  fetchRemoteImage,
  findSeedMediaId,
  uploadSeedImage,
  type ImageImportStats,
} from '@/lib/seed/media'
import { buildSeedMediaFilename, type SeedImage } from '@/lib/vehicle-seed-images'
import {
  CATEGORY_DATA,
  VEHICLE_CATALOG_DATA as CATALOG_DATA,
} from '@/lib/vehicle-seed/vehicle-catalog-data'
import type {
  ColourDef,
  EngineOptionDef,
  FeatureDef,
  GalleryDef,
  ModelDef,
  SpecHighlightDef,
} from '@/lib/vehicle-seed/vehicle-catalog-types'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import type { Payload, PayloadRequest } from 'payload'

`

const oldImportEnd = source.indexOf('export const maxDuration')
let updated = newImportBlock + source.slice(oldImportEnd, seedStart) + source.slice(seedEnd)

writeFileSync(ROUTE_FILE, updated, 'utf8')
console.log('Trimmed import-vehicles/route.ts')
