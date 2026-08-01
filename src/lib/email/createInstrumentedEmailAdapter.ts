import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import type { EmailAdapter, SendEmailOptions } from 'payload'

import {
  captureEmailSendEvent,
  extractSmtpErrorFields,
} from '@/lib/email/sentry'

function countAddresses(value: SendEmailOptions['to']): number {
  if (!value) return 0
  if (Array.isArray(value)) return value.length
  return 1
}

function recipientCount(message: SendEmailOptions): number {
  return (
    countAddresses(message.to) + countAddresses(message.cc) + countAddresses(message.bcc)
  )
}

/**
 * Nodemailer adapter that reports send failures to Sentry with scrubbed SMTP context.
 * Re-throws so Payload / form-builder logging behavior is unchanged.
 */
export function createInstrumentedEmailAdapter(): Promise<EmailAdapter> {
  const smtpPort = Number(process.env.SMTP_PORT ?? 587)

  return instrumentEmailAdapter(
    nodemailerAdapter({
      defaultFromAddress: 'noreply@eaglemc.co.za',
      defaultFromName: 'Eagle Ford',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: smtpPort,
        // Port 587 = STARTTLS (secure: false + requireTLS: true)
        // Port 465 = implicit SSL (secure: true)
        secure: smtpPort === 465,
        requireTLS: smtpPort !== 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
  )
}

async function instrumentEmailAdapter(
  adapterPromise: Promise<EmailAdapter>,
): Promise<EmailAdapter> {
  const adapter = await adapterPromise

  return ({ payload }) => {
    const initialized = adapter({ payload })

    return {
      ...initialized,
      sendEmail: async (message) => {
        try {
          return await initialized.sendEmail(message)
        } catch (error) {
          const smtp = extractSmtpErrorFields(error)
          captureEmailSendEvent(error, {
            event: 'send_failure',
            smtpCode: smtp.smtpCode,
            responseCode: smtp.responseCode,
            command: smtp.command,
            detail: smtp.detail,
            smtpHost: process.env.SMTP_HOST,
            recipientCount: recipientCount(message),
            hasHtml: Boolean(message.html),
            hasText: Boolean(message.text),
          })
          throw error
        }
      },
    }
  }
}
