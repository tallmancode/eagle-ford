import type { SeverityLevel } from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'

import { scrubForSentry } from '@/lib/motor-city-leads/sentry'

export type EmailSendSentryContext = {
  event: 'send_failure' | 'smtp_verify_failure'
  /** Nodemailer / SMTP error code, e.g. EAUTH, ECONNECTION */
  smtpCode?: string
  /** SMTP numeric response, e.g. 535 */
  responseCode?: number
  /** SMTP command that failed, e.g. AUTH PLAIN — not a secret */
  command?: string
  smtpHost?: string
  recipientCount?: number
  hasHtml?: boolean
  hasText?: boolean
  /** Safe one-line message; must not include passwords or full addresses */
  detail?: string
}

const EMAIL_IN_TEXT =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const CREDENTIAL_FRAGMENT =
  /\b(pass(?:word)?|smtp_pass|auth)\s*[=:]\s*\S+/gi

/**
 * Strip addresses and credential-looking fragments from SMTP error text.
 */
export function scrubSmtpDetail(message: string): string {
  return message
    .replace(CREDENTIAL_FRAGMENT, '$1=[redacted]')
    .replace(EMAIL_IN_TEXT, '[redacted-email]')
    .slice(0, 300)
}

export type SmtpErrorFields = {
  smtpCode?: string
  responseCode?: number
  command?: string
  detail?: string
}

/**
 * Pull safe SMTP fields from Nodemailer errors (EAUTH / 535 / etc.).
 * Never returns auth credentials or full message bodies.
 */
export function extractSmtpErrorFields(error: unknown): SmtpErrorFields {
  const fields: SmtpErrorFields = {}

  if (error && typeof error === 'object') {
    const record = error as Record<string, unknown>
    if (typeof record.code === 'string') fields.smtpCode = record.code
    if (typeof record.responseCode === 'number') fields.responseCode = record.responseCode
    if (typeof record.command === 'string') fields.command = record.command

    if (typeof record.response === 'string') {
      fields.detail = scrubSmtpDetail(record.response)
    }
  }

  if (!fields.detail && error instanceof Error && error.message) {
    fields.detail = scrubSmtpDetail(error.message)
  }

  return fields
}

/**
 * Structured Sentry capture for outbound email / SMTP failures.
 * Never attach SMTP_PASS, auth objects, recipient addresses, or HTML bodies.
 */
export function captureEmailSendEvent(error: unknown, context: EmailSendSentryContext): void {
  const level: SeverityLevel = 'error'
  const fingerprint = [
    'email-smtp',
    context.event,
    context.smtpCode ?? 'unknown',
    context.responseCode != null ? String(context.responseCode) : 'none',
  ]

  Sentry.withScope((scope) => {
    scope.setLevel(level)
    scope.setFingerprint(fingerprint)
    scope.setTags({
      area: 'email',
      feature: 'form-email',
      email_event: context.event,
      ...(context.smtpCode ? { 'smtp.code': context.smtpCode } : {}),
      ...(context.responseCode != null ? { responseCode: String(context.responseCode) } : {}),
    })
    scope.setContext(
      'email_smtp',
      scrubForSentry({
        event: context.event,
        smtpCode: context.smtpCode,
        responseCode: context.responseCode,
        command: context.command,
        smtpHost: context.smtpHost,
        recipientCount: context.recipientCount,
        hasHtml: context.hasHtml,
        hasText: context.hasText,
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
