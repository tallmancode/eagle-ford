// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import {
  filterRedactedRscEvent,
  filterRedactedRscLog,
  REDACTED_RSC_MESSAGE,
} from './src/lib/sentry/redactedRsc'
import { RSC_PROBE_NOISE_MESSAGES } from './src/lib/sentry/rscProbeNoise'

if (process.env.NODE_ENV === 'production' && !process.env.SENTRY_DSN) {
  console.warn(
    '[sentry] SENTRY_DSN is not set at runtime; Server Component / API errors will not be reported. NEXT_PUBLIC_SENTRY_DSN alone only covers the browser (where RSC messages are redacted).',
  )
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Drop digests-only RSC errors if they reach the server SDK (e.g. React node client reconstruction).
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
