import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { countNullBlocks, sanitizeNullBlocks } from '@/lib/utils/sanitizeNullBlocks'

type RepairStats = {
  repairedDocs: number
  repairedVersions: number
  nullsRemoved: number
}

async function repairPages(payload: Payload, draft: boolean, stats: RepairStats): Promise<void> {
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.find({
      collection: 'pages',
      draft,
      depth: 0,
      limit: 100,
      overrideAccess: true,
      page,
      pagination: true,
    })

    for (const doc of result.docs) {
      const nullCount = countNullBlocks(doc)
      if (nullCount === 0) {
        continue
      }

      const sanitized = sanitizeNullBlocks(doc)

      await payload.update({
        collection: 'pages',
        context: {
          disableRevalidate: true,
        },
        data: {
          content: sanitized.content,
        },
        draft,
        id: doc.id,
        overrideAccess: true,
      })

      stats.repairedDocs += 1
      stats.nullsRemoved += nullCount

      payload.logger.info(
        `Repaired ${draft ? 'draft' : 'published'} page "${doc.title}" (${doc.id}): removed ${nullCount} null block(s)`,
      )
    }

    hasNextPage = result.hasNextPage
    page += 1
  }
}

async function repairPageVersions(payload: Payload, stats: RepairStats): Promise<void> {
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.findVersions({
      collection: 'pages',
      depth: 0,
      limit: 100,
      overrideAccess: true,
      page,
      pagination: true,
    })

    for (const versionDoc of result.docs) {
      const nullCount = countNullBlocks(versionDoc.version)
      if (nullCount === 0) {
        continue
      }

      const sanitizedVersion = sanitizeNullBlocks(versionDoc.version)

      await payload.db.updateVersion({
        collection: 'pages',
        id: versionDoc.id,
        req: { payload },
        versionData: {
          createdAt: versionDoc.createdAt,
          latest: versionDoc.latest,
          parent: versionDoc.parent,
          publishedLocale: versionDoc.publishedLocale,
          updatedAt: versionDoc.updatedAt,
          version: sanitizedVersion,
        },
      })

      stats.repairedVersions += 1
      stats.nullsRemoved += nullCount

      payload.logger.info(
        `Repaired version ${versionDoc.id} (page ${versionDoc.parent}): removed ${nullCount} null block(s)`,
      )
    }

    hasNextPage = result.hasNextPage
    page += 1
  }
}

async function repairNullBlocks(): Promise<void> {
  const payload = await getPayload({ config })
  const stats: RepairStats = {
    repairedDocs: 0,
    repairedVersions: 0,
    nullsRemoved: 0,
  }

  payload.logger.info('Scanning published pages for null blocks...')
  await repairPages(payload, false, stats)

  payload.logger.info('Scanning draft pages for null blocks...')
  await repairPages(payload, true, stats)

  payload.logger.info('Scanning page versions for null blocks...')
  await repairPageVersions(payload, stats)

  payload.logger.info(
    `Repair complete: ${stats.repairedDocs} page(s), ${stats.repairedVersions} version(s), ${stats.nullsRemoved} null block(s) removed`,
  )

  await payload.destroy()
}

repairNullBlocks().catch((error) => {
  console.error('Failed to repair null blocks:', error)
  process.exit(1)
})
