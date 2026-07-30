import type { SeverityLevel } from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'

export type LeadForwardSentryContext = {
  event:
    | 'forward_failure'
    | 'forward_exhausted'
    | 'forward_config'
    | 'enqueue_failure'
    | 'sweep_failure'
  formSubmissionId?: string
  formId?: string
  errorCode?: string
  httpStatus?: number
  retryable?: boolean
  attempt?: number
  maxAttempts?: number
  nextRetryAt?: string | null
  /** Safe one-line message; must not include PII */
  detail?: string
}

const PII_KEY_PATTERN =
  /^(email|cellPhone|phone|surname|firstName|name|password|token|authorization|secret|api[_-]?key|access[_-]?token|submissionData|contact|body)$/i

/**
 * Strip known PII / secret keys from plain objects before sending to Sentry.
 */
export function scrubForSentry(value: unknown, depth = 0): unknown {
  if (depth > 4 || value == null) return value
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => scrubForSentry(item, depth + 1))
  }
  if (typeof value !== 'object') {
    if (typeof value === 'string' && value.length > 500) return `${value.slice(0, 500)}…`
    return value
  }

  const out: Record<string, unknown> = {}
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (PII_KEY_PATTERN.test(key)) {
      out[key] = '[redacted]'
      continue
    }
    out[key] = scrubForSentry(nested, depth + 1)
  }
  return out
}

/**
 * Structured Sentry capture for Motor City lead forwards. Never attach raw lead payloads or API keys.
 */
export function captureLeadForwardEvent(error: unknown, context: LeadForwardSentryContext): void {
  const level: SeverityLevel =
    context.event === 'forward_failure' && context.retryable ? 'warning' : 'error'

  const fingerprint = [
    'motor-city-leads',
    context.event,
    context.errorCode ?? 'unknown',
  ]

  Sentry.withScope((scope) => {
    scope.setLevel(level)
    scope.setFingerprint(fingerprint)
    scope.setTags({
      feature: 'motor-city-leads',
      lead_event: context.event,
      ...(context.errorCode ? { lead_error_code: context.errorCode } : {}),
      ...(typeof context.retryable === 'boolean'
        ? { lead_retryable: String(context.retryable) }
        : {}),
    })
    scope.setContext(
      'motor_city_leads',
      scrubForSentry({
        formSubmissionId: context.formSubmissionId,
        formId: context.formId,
        errorCode: context.errorCode,
        httpStatus: context.httpStatus,
        retryable: context.retryable,
        attempt: context.attempt,
        maxAttempts: context.maxAttempts,
        nextRetryAt: context.nextRetryAt,
        detail: context.detail,
      }) as Record<string, unknown>,
    )

    if (error instanceof Error) {
      Sentry.captureException(error)
    } else {
      Sentry.captureMessage(context.detail || String(error), level)
    }
  })
}
