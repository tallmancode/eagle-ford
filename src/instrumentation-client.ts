// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import {
  filterRedactedRscEvent,
  filterRedactedRscLog,
  REDACTED_RSC_MESSAGE,
} from '@/lib/sentry/redactedRsc'
import { RSC_PROBE_NOISE_MESSAGES } from '@/lib/sentry/rscProbeNoise'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Belt-and-suspenders with beforeSend — digests-only RSC errors are useless on the client.
  ignoreErrors: [REDACTED_RSC_MESSAGE, ...RSC_PROBE_NOISE_MESSAGES],

  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },

  beforeSend(event, hint) {
    return filterRedactedRscEvent(event, hint)
  },

  beforeSendLog(log) {
    return filterRedactedRscLog(log)
  },
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
