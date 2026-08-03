import type { AfterErrorHook, AfterErrorResult } from 'payload'

type ErrorWithStatus = Error & { status?: number }

const INVALID_JSON_MESSAGE_RE =
  /Unexpected token|is not valid JSON|Bad escaped character|Unterminated string|Expected property name|JSON\.parse/i

export const INVALID_QUERY_JSON_MESSAGE = 'Invalid JSON in query parameters'

/**
 * Payload `parseParams` does unguarded `JSON.parse` on string `where` / `data`
 * query params. Malformed values (bot fuzzing) throw SyntaxError → 500.
 * Remap to 400 and stamp `error.status` so the Sentry plugin skips capture.
 */
export function isInvalidQueryJsonError(error: unknown): error is SyntaxError {
  return error instanceof SyntaxError && INVALID_JSON_MESSAGE_RE.test(error.message)
}

export function remapInvalidQueryJsonError(error: Error): AfterErrorResult {
  const withStatus = error as ErrorWithStatus
  withStatus.status = 400

  return {
    status: 400,
    response: {
      errors: [{ message: INVALID_QUERY_JSON_MESSAGE }],
    },
  }
}

export const invalidQueryJsonAfterError: AfterErrorHook = ({ error }) => {
  if (!isInvalidQueryJsonError(error)) return

  return remapInvalidQueryJsonError(error)
}
