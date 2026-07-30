import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

import { bustAllCaches } from '@/lib/cache/bustAllCaches'

function isDeveloper(user: { roles?: string[] | null } | null | undefined): boolean {
  return Boolean(user?.roles?.includes('developer'))
}

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user || !isDeveloper(user)) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const result = bustAllCaches()

    payload.logger.info({
      message: 'Busted all Next.js caches',
      tags: result.tags,
      paths: result.paths,
    })

    return Response.json({
      success: true,
      tags: result.tags,
      paths: result.paths,
    })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error busting all caches' })
    return new Response('Error busting all caches.', { status: 500 })
  }
}
