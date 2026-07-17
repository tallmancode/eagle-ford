import type { CollectionSlug, GlobalSlug, Payload } from 'payload'

import { collectReferencedMediaIds } from './collectReferencedMediaIds'

const VERSIONED_COLLECTIONS = [
  'pages',
  'specials',
  'vehicles',
  'vehicle-models',
] as const satisfies CollectionSlug[]

const SCAN_COLLECTIONS = [
  ...VERSIONED_COLLECTIONS,
  'vehicle-templates',
  'vehicle-model-templates',
  'form-submissions',
] as const satisfies CollectionSlug[]

const GLOBAL_SLUGS = ['header', 'footer', 'settings'] as const satisfies GlobalSlug[]

export type OrphanMediaItem = {
  id: string
  filename: string | null
}

export type CleanupOrphanedMediaResult = {
  scannedDocs: number
  referencedCount: number
  orphanCount: number
  deletedCount: number
  orphans: OrphanMediaItem[]
  deletedFilenames: string[]
  errors: string[]
}

type CleanupOptions = {
  dryRun?: boolean
}

async function paginateCollection(
  payload: Payload,
  collection: CollectionSlug,
  onDoc: (doc: unknown) => void,
): Promise<number> {
  let page = 1
  let hasNextPage = true
  let count = 0

  while (hasNextPage) {
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 100,
      overrideAccess: true,
      page,
      pagination: true,
    })

    for (const doc of result.docs) {
      onDoc(doc)
      count += 1
    }

    hasNextPage = result.hasNextPage
    page += 1
  }

  return count
}

async function paginateVersionedCollection(
  payload: Payload,
  collection: (typeof VERSIONED_COLLECTIONS)[number],
  onDoc: (doc: unknown) => void,
): Promise<number> {
  let count = 0

  for (const draft of [false, true] as const) {
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
      const result = await payload.find({
        collection,
        depth: 0,
        draft,
        limit: 100,
        overrideAccess: true,
        page,
        pagination: true,
      })

      for (const doc of result.docs) {
        onDoc(doc)
        count += 1
      }

      hasNextPage = result.hasNextPage
      page += 1
    }
  }

  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.findVersions({
      collection,
      depth: 0,
      limit: 100,
      overrideAccess: true,
      page,
      pagination: true,
    })

    for (const versionDoc of result.docs) {
      onDoc(versionDoc.version)
      count += 1
    }

    hasNextPage = result.hasNextPage
    page += 1
  }

  return count
}

export async function cleanupOrphanedMedia(
  payload: Payload,
  options: CleanupOptions = {},
): Promise<CleanupOrphanedMediaResult> {
  const { dryRun = false } = options
  const allMediaIds = new Set<string>()
  const mediaById = new Map<string, string | null>()
  const referencedIds = new Set<string>()
  let scannedDocs = 0

  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 100,
      overrideAccess: true,
      page,
      pagination: true,
      select: {
        filename: true,
      },
    })

    for (const doc of result.docs) {
      allMediaIds.add(doc.id)
      mediaById.set(doc.id, typeof doc.filename === 'string' ? doc.filename : null)
    }

    hasNextPage = result.hasNextPage
    page += 1
  }

  const scanDoc = (doc: unknown) => {
    collectReferencedMediaIds(doc, allMediaIds, referencedIds)
  }

  for (const collection of SCAN_COLLECTIONS) {
    if ((VERSIONED_COLLECTIONS as readonly string[]).includes(collection)) {
      scannedDocs += await paginateVersionedCollection(
        payload,
        collection as (typeof VERSIONED_COLLECTIONS)[number],
        scanDoc,
      )
    } else {
      scannedDocs += await paginateCollection(payload, collection, scanDoc)
    }
  }

  for (const slug of GLOBAL_SLUGS) {
    const global = await payload.findGlobal({
      slug,
      depth: 0,
      overrideAccess: true,
    })
    scanDoc(global)
    scannedDocs += 1
  }

  const orphanIds = [...allMediaIds].filter((id) => !referencedIds.has(id))
  const orphans: OrphanMediaItem[] = orphanIds.map((id) => ({
    id,
    filename: mediaById.get(id) ?? null,
  }))

  const deletedFilenames: string[] = []
  const errors: string[] = []
  let deletedCount = 0

  if (!dryRun) {
    for (const orphan of orphans) {
      try {
        await payload.delete({
          collection: 'media',
          id: orphan.id,
          overrideAccess: true,
        })
        deletedCount += 1
        if (orphan.filename) {
          deletedFilenames.push(orphan.filename)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        errors.push(`Failed to delete ${orphan.id}: ${message}`)
        payload.logger.error({ err, message: `Failed to delete orphaned media ${orphan.id}` })
      }
    }
  }

  return {
    scannedDocs,
    referencedCount: referencedIds.size,
    orphanCount: orphanIds.length,
    deletedCount,
    orphans,
    deletedFilenames,
    errors,
  }
}
