import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

import { cleanupOrphanedMedia } from '@/lib/media/cleanupOrphanedMedia'

export const maxDuration = 300

function isDeveloper(user: { roles?: string[] | null } | null | undefined): boolean {
  return Boolean(user?.roles?.includes('developer'))
}

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user || !isDeveloper(user)) {
    return new Response('Action forbidden.', { status: 403 })
  }

  const url = new URL(request.url)
  const dryRun = url.searchParams.get('dryRun') === 'true'

  try {
    const result = await cleanupOrphanedMedia(payload, { dryRun })

    return Response.json({
      success: true,
      dryRun,
      scannedDocs: result.scannedDocs,
      referencedCount: result.referencedCount,
      orphanCount: result.orphanCount,
      deletedCount: result.deletedCount,
      orphans: result.orphans,
      deletedFilenames: result.deletedFilenames,
      errors: result.errors,
    })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error cleaning up orphaned media' })
    return new Response('Error cleaning up orphaned media.', { status: 500 })
  }
}
