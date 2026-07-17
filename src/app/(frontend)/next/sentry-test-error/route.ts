import config from '@payload-config'
import * as Sentry from '@sentry/nextjs'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { createSeedStreamResponse } from '@/lib/seed/createSeedStreamResponse'

export const maxDuration = 30

export const POST = async (): Promise<Response> => {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  return createSeedStreamResponse(async (log) => {
    log.info('Forcing a test error for Sentry...')

    if (process.env.NODE_ENV !== 'production') {
      log.warn('Sentry is disabled outside production — the event will not be sent locally.')
    }

    if (!process.env.SENTRY_DSN) {
      log.warn('SENTRY_DSN is not set — server errors will not be reported.')
    }

    const error = new Error('Sentry test error — intentional (Eagle Ford seed button)')
    Sentry.captureException(error)
    await Sentry.flush(2000)

    log.info('captureException called and flush completed. Check the Sentry Issues stream.')

    throw error
  }, payload.logger)
}
