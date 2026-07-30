import type { Payload } from 'payload'

type VehicleSlugCollection = 'vehicle-models' | 'vehicle-variants'

const VEHICLE_SLUG_COLLECTIONS: VehicleSlugCollection[] = ['vehicle-models', 'vehicle-variants']

type MongoIndex = {
  key?: Record<string, unknown>
  name?: string
  unique?: boolean
}

function isGlobalUniqueSlugIndex(index: MongoIndex) {
  const keys = index.key ? Object.keys(index.key) : []
  return keys.length === 1 && keys[0] === 'slug' && index.unique === true
}

async function dropStaleGlobalSlugIndex(
  payload: Payload,
  collectionSlug: VehicleSlugCollection,
): Promise<boolean> {
  const model = payload.db.collections[collectionSlug]
  if (!model) {
    payload.logger.warn(`Could not inspect indexes for ${collectionSlug}: model not found`)
    return false
  }

  const indexes = (await model.collection.indexes()) as MongoIndex[]
  const staleIndex = indexes.find(isGlobalUniqueSlugIndex)
  if (!staleIndex?.name) {
    return false
  }

  payload.logger.warn(
    `Dropping stale global unique index "${staleIndex.name}" on ${collectionSlug}.slug — slugs are unique per parent only.`,
  )
  await model.collection.dropIndex(staleIndex.name)
  return true
}

export async function ensureVehicleSlugIndexes(payload: Payload): Promise<void> {
  let droppedAny = false

  for (const collectionSlug of VEHICLE_SLUG_COLLECTIONS) {
    droppedAny = (await dropStaleGlobalSlugIndex(payload, collectionSlug)) || droppedAny
  }

  if (droppedAny) {
    await Promise.all(
      VEHICLE_SLUG_COLLECTIONS.map(async (collectionSlug) => {
        const model = payload.db.collections[collectionSlug]
        await model?.ensureIndexes()
      }),
    )
    payload.logger.info('Rebuilt vehicle slug indexes with per-parent compound uniqueness.')
  }
}
