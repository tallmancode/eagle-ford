/**
 * Moves content.section → top-level section on pages
 * (and their version documents) so better-editor can use blocksField: 'section'.
 *
 * Idempotent: skips docs that already have top-level section and no content.section.
 *
 * Run: pnpm migrate:section-top-level
 */
import type { Payload } from 'payload'
import config from '@payload-config'
import { getPayload } from 'payload'

type MigrateCollection = 'pages'

const COLLECTIONS: MigrateCollection[] = ['pages']

type ContentShape = {
  section?: unknown
  [key: string]: unknown
}

function hoistSection(doc: Record<string, unknown>): {
  changed: boolean
  next: Record<string, unknown>
} {
  const content = doc.content as ContentShape | null | undefined
  const nestedSection = content?.section
  const hasNested = nestedSection !== undefined && nestedSection !== null
  const hasTopLevel = doc.section !== undefined && doc.section !== null

  if (!hasNested) {
    return { changed: false, next: doc }
  }

  // Prefer existing top-level section if already set; still strip nested copy.
  const next: Record<string, unknown> = { ...doc }
  if (!hasTopLevel) {
    next.section = nestedSection
  }

  if (content && typeof content === 'object') {
    const { section: _removed, ...rest } = content
    if (Object.keys(rest).length === 0) {
      delete next.content
    } else {
      next.content = rest
    }
  }

  return { changed: true, next }
}

async function migrateModel(
  payload: Payload,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: { collection: any } | undefined,
  label: string,
  isVersion: boolean,
): Promise<number> {
  if (!model?.collection) {
    console.warn(`Skip ${label}: model not found`)
    payload.logger.warn(`Skip ${label}: model not found`)
    return 0
  }

  const filter = isVersion
    ? { 'version.content.section': { $exists: true } }
    : { 'content.section': { $exists: true } }

  const docs = (await model.collection.find(filter).toArray()) as Array<
    Record<string, unknown> & { _id: unknown; version?: Record<string, unknown> }
  >

  let updated = 0

  for (const raw of docs) {
    if (isVersion) {
      const version = (raw.version ?? {}) as Record<string, unknown>
      const { changed, next } = hoistSection(version)
      if (!changed) continue
      await model.collection.updateOne({ _id: raw._id }, { $set: { version: next } })
    } else {
      const { changed, next } = hoistSection(raw)
      if (!changed) continue
      await model.collection.replaceOne({ _id: raw._id }, next)
    }
    updated += 1
  }

  return updated
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })

  console.log('Migrating content.section → section…')
  payload.logger.info('Migrating content.section → section…')

  for (const collection of COLLECTIONS) {
    const docsUpdated = await migrateModel(
      payload,
      payload.db.collections[collection],
      collection,
      false,
    )
    const versionsUpdated = await migrateModel(
      payload,
      payload.db.versions?.[collection],
      `${collection} versions`,
      true,
    )
    const line = `${collection}: updated ${docsUpdated} docs, ${versionsUpdated} versions`
    console.log(line)
    payload.logger.info(line)
  }

  console.log('Section field migration complete.')
  payload.logger.info('Section field migration complete.')
  await payload.destroy()
}

try {
  await main()
  process.stdout.write('migrate-section-to-top-level: done\n')
} catch (error) {
  console.error('Failed to migrate section field:', error)
  process.exit(1)
}
