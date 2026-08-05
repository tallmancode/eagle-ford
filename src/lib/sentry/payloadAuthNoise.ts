import type { ErrorEvent } from '@sentry/nextjs'

import { getErrorMessage } from './redactedRsc'

/** Payload default English message for missing/expired admin session. */
const MUST_BE_LOGGED_IN = 'you must be logged in to make this request'

/**
 * Expected Payload admin auth failures (expired session, logged-out server action).
 * These are not application bugs — do not open Sentry issues.
 */
export function isExpectedPayloadAuthError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const e = error as { name?: unknown; status?: unknown; message?: unknown; data?: unknown }

  if (e.name === 'UnauthorizedError') return true
  if (e.status === 401 && e.name === 'UnauthorizedError') return true

  const message = typeof e.message === 'string' ? e.message : getErrorMessage(error)
  if (message?.toLowerCase().includes(MUST_BE_LOGGED_IN)) return true

  // Payload APIError sometimes nests the translation key / message under data
  if (e.data && typeof e.data === 'object') {
    const dataMessage = (e.data as { message?: unknown }).message
    if (typeof dataMessage === 'string' && dataMessage.toLowerCase().includes(MUST_BE_LOGGED_IN)) {
      return true
    }
  }

  return false
}

export function isExpectedPayloadAuthErrorEvent(event: ErrorEvent): boolean {
  if (event.message?.toLowerCase().includes(MUST_BE_LOGGED_IN)) return true

  return Boolean(
    event.exception?.values?.some((v) => {
      if (v?.type === 'UnauthorizedError') return true
      return Boolean(v?.value?.toLowerCase().includes(MUST_BE_LOGGED_IN))
    }),
  )
}
