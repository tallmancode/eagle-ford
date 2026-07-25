import config from '@payload-config'
import * as Sentry from '@sentry/nextjs'
import { createLocalReq, getPayload } from 'payload'
import { headers } from 'next/headers'

import { createSeedStreamResponse } from '@/lib/seed/createSeedStreamResponse'
import { runSeoSeed } from '@/lib/seo-seed/runSeoSeed'

export const maxDuration = 120

export const POST = async (): Promise<Response> => {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  return createSeedStreamResponse(async (log) => {
    try {
      const payloadReq = await createLocalReq({ user }, payload)
      const result = await runSeoSeed(payload, payloadReq, log)
      return { success: result.errors === 0, ...result }
    } catch (error) {
      Sentry.captureException(error, { tags: { seed: 'seo', phase: 'fatal' } })
      await Sentry.flush(2000)
      throw error
    }
  }, payload.logger)
}
