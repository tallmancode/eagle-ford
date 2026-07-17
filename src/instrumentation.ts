import type { Instrumentation } from 'next'
import * as Sentry from '@sentry/nextjs'
import {
  getErrorDigest,
  getErrorMessage,
  isRedactedRscError,
  unwrapRedactedRscError,
} from '@/lib/sentry/redactedRsc'
import { isRscProbeNoise } from '@/lib/sentry/rscProbeNoise'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

/**
 * Capture App Router / RSC request failures with searchable route tags.
 * Skips digests-only redacted errors (React reconstruction); those have no useful message.
 * Nested scope inherits into Sentry.captureRequestError's own withScope.
 */
export const onRequestError: Instrumentation.onRequestError = (error, request, errorContext) => {
  const resolved = unwrapRedactedRscError(error)
  const digest = getErrorDigest(resolved) ?? getErrorDigest(error)

  // Next throws this while opting a route out of static generation (e.g. draftMode).
  // It is not an application failure — do not send to Sentry or spam logs.
  if (digest === 'DYNAMIC_SERVER_USAGE') {
    return
  }

  // Automated scanners probing RSC / Server Actions (e.g. next-action: x) — not app failures.
  if (isRscProbeNoise(resolved) || isRscProbeNoise(error)) {
    return
  }

  // Still redacted after unwrap — nothing useful to report; Docker logs may have the original.
  if (isRedactedRscError(getErrorMessage(resolved))) {
    if (digest) {
      console.warn(
        `[sentry] Skipping redacted RSC error (digest=${digest}). Check server logs around this digest for the original message.`,
      )
    }
    return
  }

  Sentry.withScope((scope) => {
    scope.setTag('next.request_path', request.path)
    scope.setTag('next.route_path', errorContext.routePath)
    scope.setTag('next.route_type', errorContext.routeType)
    scope.setTag('next.router_kind', errorContext.routerKind)
    if (errorContext.renderSource) {
      scope.setTag('next.render_source', errorContext.renderSource)
    }

    if (digest) {
      scope.setTag('digest', digest)
    }

    Sentry.captureRequestError(resolved, request, errorContext)
  })
}
