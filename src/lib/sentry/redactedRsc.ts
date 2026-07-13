import type { ErrorEvent, EventHint, Log } from '@sentry/nextjs'

/**
 * Next.js / React replace Server Component error messages with this string in
 * production when reconstructing errors from digests (client, edge, and node
 * RSC consumers). The original message is only available on the first
 * server-side throw via `onRequestError`.
 */
export const REDACTED_RSC_MESSAGE =
  'specific message is omitted in production builds to avoid leaking sensitive details'

export function isRedactedRscError(message: string | undefined | null): boolean {
  return Boolean(message?.includes(REDACTED_RSC_MESSAGE))
}

export function getErrorMessage(error: unknown): string | undefined {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return undefined
}

export function getErrorDigest(error: unknown): string | undefined {
  if (
    error &&
    typeof error === 'object' &&
    'digest' in error &&
    typeof (error as { digest?: unknown }).digest === 'string'
  ) {
    return (error as { digest: string }).digest
  }
  return undefined
}

/** Prefer a non-redacted `cause` when Next/React only surfaces the digests Error. */
export function unwrapRedactedRscError(error: unknown): unknown {
  if (!isRedactedRscError(getErrorMessage(error))) return error
  if (error instanceof Error && error.cause != null) {
    const causeMessage = getErrorMessage(error.cause)
    if (causeMessage && !isRedactedRscError(causeMessage)) {
      return error.cause
    }
  }
  return error
}

/**
 * Drop Next.js production digests-only RSC errors; tag digest when present.
 * Shared by client, server, and edge `beforeSend`.
 */
export function filterRedactedRscEvent(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
  const original = hint.originalException
  const originalMessage = getErrorMessage(original)

  if (
    isRedactedRscError(originalMessage) ||
    isRedactedRscError(event.message) ||
    event.exception?.values?.some((v) => isRedactedRscError(v?.value))
  ) {
    return null
  }

  const digest = getErrorDigest(original)
  if (digest) {
    event.tags = { ...event.tags, digest }
  }

  return event
}

export function filterRedactedRscLog(log: Log): Log | null {
  if (isRedactedRscError(log.message)) return null
  return log
}
