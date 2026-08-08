import nodemailer from 'nodemailer'
import type { Payload } from 'payload'

export type SmtpTestLogEntry = {
  at: string
  level: 'info' | 'error'
  message: string
  data?: unknown
}

export type SmtpConfigStatus = {
  host: string | null
  port: number
  user: string | null
  passConfigured: boolean
}

export type SmtpTestResult = {
  ok: boolean
  logs: SmtpTestLogEntry[]
  configStatus: SmtpConfigStatus
  error?: {
    message: string
    code?: string
    responseCode?: number
    command?: string
  }
}

const DEFAULT_FROM_ADDRESS = 'noreply@eaglemc.co.za'
const DEFAULT_FROM_NAME = 'Eagle Ford'

function log(
  logs: SmtpTestLogEntry[],
  level: SmtpTestLogEntry['level'],
  message: string,
  data?: unknown,
): void {
  logs.push({ at: new Date().toISOString(), level, message, data })
}

function readEnvConfig(): SmtpConfigStatus & { pass: string | null } {
  const host = process.env.SMTP_HOST?.trim() || null
  const user = process.env.SMTP_USER?.trim() || null
  const pass = process.env.SMTP_PASS?.trim() || null
  const port = Number(process.env.SMTP_PORT ?? 587)

  return {
    host,
    port: Number.isFinite(port) && port > 0 ? port : 587,
    user,
    pass,
    passConfigured: Boolean(pass),
  }
}

function toPublicStatus(config: ReturnType<typeof readEnvConfig>): SmtpConfigStatus {
  return {
    host: config.host,
    port: config.port,
    user: config.user,
    passConfigured: config.passConfigured,
  }
}

function summarizeError(error: unknown): NonNullable<SmtpTestResult['error']> {
  if (!error || typeof error !== 'object') {
    return { message: error instanceof Error ? error.message : String(error) }
  }

  const err = error as {
    message?: string
    code?: string
    responseCode?: number
    command?: string
  }

  return {
    message: err.message || 'SMTP test failed',
    code: err.code,
    responseCode: err.responseCode,
    command: err.command,
  }
}

/**
 * Verifies env SMTP transport (Mimecast) and sends a short test message.
 * Never returns or logs the SMTP password.
 */
export async function runSmtpTest(args: {
  payload: Payload
  testRecipient?: string
}): Promise<SmtpTestResult> {
  const logs: SmtpTestLogEntry[] = []
  const envConfig = readEnvConfig()
  const configStatus = toPublicStatus(envConfig)

  log(logs, 'info', 'Reading SMTP_* from server environment', {
    hostConfigured: Boolean(envConfig.host),
    port: envConfig.port,
    userConfigured: Boolean(envConfig.user),
    passConfigured: envConfig.passConfigured,
  })

  let recipient = args.testRecipient?.trim() || ''
  if (!recipient) {
    log(logs, 'info', 'No recipient in request body — loading Settings → Email test recipient')
    const settings = await args.payload.findGlobal({
      slug: 'settings',
      depth: 0,
      overrideAccess: true,
    })
    recipient = settings.email?.testRecipient?.trim() || ''
  }

  if (!recipient) {
    const message =
      'Test recipient is required. Set it under Settings → Email or pass testRecipient.'
    log(logs, 'error', message)
    return { ok: false, logs, configStatus, error: { message } }
  }

  const emailDryRun = ['true', '1', 'yes'].includes(
    (process.env.EMAIL_DRY_RUN?.trim().toLowerCase() || ''),
  )
  if (emailDryRun) {
    const summary = `EMAIL_DRY_RUN: skipped SMTP test send to ${recipient}`
    log(logs, 'info', summary)
    await persistLastTest(args.payload, true, summary)
    return { ok: true, logs, configStatus }
  }

  if (!envConfig.host) {
    const message = 'SMTP_HOST is not set in the server environment.'
    log(logs, 'error', message)
    return { ok: false, logs, configStatus, error: { message } }
  }

  if (!envConfig.user || !envConfig.pass) {
    const message = 'SMTP_USER and/or SMTP_PASS are not set in the server environment.'
    log(logs, 'error', message)
    return { ok: false, logs, configStatus, error: { message } }
  }

  const fromAddress = envConfig.user || DEFAULT_FROM_ADDRESS
  const secure = envConfig.port === 465
  const transport = nodemailer.createTransport({
    host: envConfig.host,
    port: envConfig.port,
    secure,
    requireTLS: !secure,
    auth: {
      user: envConfig.user,
      pass: envConfig.pass,
    },
  })

  log(logs, 'info', 'Created Nodemailer transport', {
    host: envConfig.host,
    port: envConfig.port,
    secure,
    requireTLS: !secure,
    user: envConfig.user,
  })

  try {
    log(logs, 'info', 'Verifying SMTP connection (transport.verify)')
    await transport.verify()
    log(logs, 'info', 'SMTP verify succeeded')
  } catch (error) {
    const summarized = summarizeError(error)
    log(logs, 'error', 'SMTP verify failed', summarized)
    await persistLastTest(args.payload, false, summarized.message)
    return { ok: false, logs, configStatus, error: summarized }
  }

  try {
    log(logs, 'info', 'Sending test email', {
      from: `"${DEFAULT_FROM_NAME}" <${fromAddress}>`,
      to: recipient,
    })
    const info = await transport.sendMail({
      from: `"${DEFAULT_FROM_NAME}" <${fromAddress}>`,
      to: recipient,
      subject: 'Eagle Ford SMTP test',
      text: [
        'Eagle Ford SMTP connectivity test.',
        '',
        `Sent at: ${new Date().toISOString()}`,
        `Host: ${envConfig.host}`,
        `Port: ${envConfig.port}`,
      ].join('\n'),
    })
    log(logs, 'info', 'Test email accepted by SMTP server', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    })
  } catch (error) {
    const summarized = summarizeError(error)
    log(logs, 'error', 'SMTP send failed', summarized)
    await persistLastTest(args.payload, false, summarized.message)
    return { ok: false, logs, configStatus, error: summarized }
  } finally {
    transport.close()
  }

  const summary = `Test email sent to ${recipient} via ${envConfig.host}:${envConfig.port}`
  log(logs, 'info', summary)
  await persistLastTest(args.payload, true, summary)

  return { ok: true, logs, configStatus }
}

async function persistLastTest(payload: Payload, ok: boolean, summary: string): Promise<void> {
  const settings = await payload.findGlobal({
    slug: 'settings',
    depth: 0,
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'settings',
    data: {
      email: {
        testRecipient: settings.email?.testRecipient ?? undefined,
        lastTestAt: new Date().toISOString(),
        lastTestOk: ok,
        lastTestSummary: summary,
      },
    },
    overrideAccess: true,
  })
}
