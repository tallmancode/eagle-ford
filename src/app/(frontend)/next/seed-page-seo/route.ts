import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { pageSeoSeeds } from '@/fixtures/seo-fixtures/page-seo-data'
import { createSeedStreamResponse } from '@/lib/seed/createSeedStreamResponse'

export const maxDuration = 60

/**
 * Upserts SEO plugin meta (title + description) on existing Pages by slug.
 * Missing pages are skipped with a warning — never creates pages or throws for not-found.
 */
export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  return createSeedStreamResponse(async (log) => {
    log.info(`Seeding SEO meta for ${pageSeoSeeds.length} page slug(s)...`)

    let updated = 0
    let skippedMissing = 0
    let failed = 0
    const missingSlugs: string[] = []

    for (const seed of pageSeoSeeds) {
      try {
        const found = await payload.find({
          collection: 'pages',
          depth: 0,
          limit: 1,
          pagination: false,
          where: {
            slug: {
              equals: seed.slug,
            },
          },
        })

        const page = found.docs[0]

        if (!page) {
          skippedMissing++
          missingSlugs.push(seed.slug)
          log.warn(`Page not found for slug "${seed.slug}" — skipping`)
          continue
        }

        await payload.update({
          collection: 'pages',
          id: page.id,
          depth: 0,
          data: {
            meta: {
              title: seed.title,
              description: seed.description,
            },
            _status: 'published',
          },
        })

        updated++
        log.info(`Updated SEO for "${seed.slug}" (${page.title ?? page.id})`)
      } catch (error) {
        failed++
        const message = error instanceof Error ? error.message : 'Unknown error'
        log.error(`Failed to update SEO for slug "${seed.slug}": ${message}`)
        payload.logger.error({ err: error, message: `SEO seed failed for ${seed.slug}` })
      }
    }

    if (missingSlugs.length > 0) {
      log.warn(
        `Skipped ${missingSlugs.length} missing page(s): ${missingSlugs.join(', ')}. Create those pages first, then re-run this seed.`,
      )
    }

    const summary = {
      success: failed === 0,
      updated,
      skippedMissing,
      failed,
      missingSlugs,
      total: pageSeoSeeds.length,
    }

    log.info(
      `SEO seed complete — updated ${updated}, skipped missing ${skippedMissing}, failed ${failed}`,
    )

    return summary
  }, payload.logger)
}
