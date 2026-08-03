'use client'

import React, { useCallback, useState } from 'react'
import { Button, toast, useFormFields } from '@payloadcms/ui'

import './EmailTestSendField.scss'

type SmtpTestResult = {
  ok: boolean
  logs: Array<{ at: string; level: 'info' | 'error'; message: string; data?: unknown }>
  configStatus: {
    host: string | null
    port: number
    user: string | null
    passConfigured: boolean
  }
  error?: {
    message: string
    code?: string
    responseCode?: number
    command?: string
  }
}

const baseClass = 'email-test-send'

/**
 * Admin UI to verify Mimecast SMTP (env SMTP_*) and show structured debug logs.
 */
export function EmailTestSendField() {
  const savedRecipient = useFormFields(([fields]) => {
    const field = fields['email.testRecipient']
    return typeof field?.value === 'string' ? field.value : ''
  })

  const [recipientOverride, setRecipientOverride] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<SmtpTestResult | null>(null)

  const recipient = recipientOverride ?? savedRecipient

  const onSend = useCallback(async () => {
    setBusy(true)
    setResult(null)
    try {
      const response = await fetch('/next/email/test', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testRecipient: recipient.trim() || undefined }),
      })
      const json = (await response.json().catch(() => null)) as SmtpTestResult | null
      if (!json || typeof json.ok !== 'boolean') {
        toast.error(`SMTP test failed (${response.status})`)
        setResult({
          ok: false,
          logs: [
            {
              at: new Date().toISOString(),
              level: 'error',
              message: `Non-JSON response from email test endpoint (HTTP ${response.status})`,
            },
          ],
          configStatus: {
            host: null,
            port: 587,
            user: null,
            passConfigured: false,
          },
          error: { message: `HTTP ${response.status}` },
        })
        return
      }
      setResult(json)
      if (json.ok) {
        toast.success('SMTP test email sent')
      } else {
        toast.error(json.error?.message || 'SMTP test failed')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error'
      toast.error(message)
      setResult({
        ok: false,
        logs: [{ at: new Date().toISOString(), level: 'error', message }],
        configStatus: {
          host: null,
          port: 587,
          user: null,
          passConfigured: false,
        },
        error: { message },
      })
    } finally {
      setBusy(false)
    }
  }, [recipient])

  return (
    <div className={baseClass}>
      <p className={`${baseClass}__intro`}>
        Verifies the Mimecast SMTP connection using server environment variables (
        <code>SMTP_HOST</code>, <code>SMTP_PORT</code>, <code>SMTP_USER</code>,{' '}
        <code>SMTP_PASS</code>) and sends a short test message. Credentials are never stored in the
        CMS.
      </p>

      <label className={`${baseClass}__field`}>
        <span className={`${baseClass}__label`}>Test recipient (optional override)</span>
        <input
          className={`${baseClass}__input`}
          type="email"
          value={recipient}
          onChange={(e) => setRecipientOverride(e.target.value)}
          placeholder="Uses the Test recipient field above when empty"
        />
      </label>

      <div className={`${baseClass}__actions`}>
        <Button buttonStyle="primary" disabled={busy} onClick={() => void onSend()}>
          {busy ? 'Testing…' : 'Send test email'}
        </Button>
      </div>

      {result && (
        <div
          className={`${baseClass}__result ${result.ok ? `${baseClass}__result--ok` : `${baseClass}__result--err`}`}
        >
          <h4>{result.ok ? 'Success' : 'Failed'}</h4>
          <p className={`${baseClass}__status`}>
            Env config:{' '}
            <code>
              host={result.configStatus.host || '(missing)'} · port={result.configStatus.port} ·
              user={result.configStatus.user || '(missing)'} · pass=
              {result.configStatus.passConfigured ? 'set' : 'missing'}
            </code>
          </p>
          {result.error && (
            <pre className={`${baseClass}__pre`}>{JSON.stringify(result.error, null, 2)}</pre>
          )}
          <h5>Logs</h5>
          <ul className={`${baseClass}__logs`}>
            {result.logs.map((entry, index) => (
              <li
                key={`${entry.at}-${index}`}
                className={`${baseClass}__log ${baseClass}__log--${entry.level}`}
              >
                <span className={`${baseClass}__log-time`}>{entry.at}</span>
                <span>{entry.message}</span>
                {entry.data != null && (
                  <pre className={`${baseClass}__pre`}>{JSON.stringify(entry.data, null, 2)}</pre>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
