'use client'

import React, { useCallback, useState } from 'react'
import { Button, toast } from '@payloadcms/ui'

import './MotorCityStockTestField.scss'

type StockTestResult = {
  ok: boolean
  logs: Array<{ at: string; level: 'info' | 'error'; message: string; data?: unknown }>
  configStatus: {
    apiHost: string | null
    urlConfigured: boolean
    keyConfigured: boolean
    dealerCode: string
  }
  sample?: {
    totalDocs?: number
    page?: number
    filtersOk?: boolean
  }
  error?: {
    message: string
    code?: string
    httpStatus?: number
    retryable?: boolean
  }
}

const baseClass = 'motor-city-stock-test'

/**
 * Admin UI to verify Motor City stock API connectivity (env MOTOR_CITY_STOCK_API_*).
 */
export function MotorCityStockTestField() {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<StockTestResult | null>(null)

  const onTest = useCallback(async () => {
    setBusy(true)
    setResult(null)
    try {
      const response = await fetch('/next/motor-city/stock-test', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const json = (await response.json().catch(() => null)) as StockTestResult | null
      if (!json || typeof json.ok !== 'boolean') {
        toast.error(`Stock API test failed (${response.status})`)
        setResult({
          ok: false,
          logs: [
            {
              at: new Date().toISOString(),
              level: 'error',
              message: `Non-JSON response from stock test endpoint (HTTP ${response.status})`,
            },
          ],
          configStatus: {
            apiHost: null,
            urlConfigured: false,
            keyConfigured: false,
            dealerCode: 'EC167',
          },
          error: { message: `HTTP ${response.status}` },
        })
        return
      }
      setResult(json)
      if (json.ok) {
        toast.success('Motor City stock API test succeeded')
      } else {
        toast.error(json.error?.message || 'Stock API test failed')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error'
      toast.error(message)
      setResult({
        ok: false,
        logs: [{ at: new Date().toISOString(), level: 'error', message }],
        configStatus: {
          apiHost: null,
          urlConfigured: false,
          keyConfigured: false,
          dealerCode: 'EC167',
        },
        error: { message },
      })
    } finally {
      setBusy(false)
    }
  }, [])

  return (
    <div className={baseClass}>
      <p className={`${baseClass}__intro`}>
        Checks connectivity to Eagle Motor City stock using server environment variables (
        <code>MOTOR_CITY_STOCK_API_URL</code>, <code>MOTOR_CITY_STOCK_API_KEY</code>). Calls the
        stock list and filters endpoints for dealer <code>EC167</code>. The API key is never shown
        or stored in the CMS.
      </p>

      <div className={`${baseClass}__actions`}>
        <Button buttonStyle="primary" disabled={busy} onClick={() => void onTest()}>
          {busy ? 'Testing…' : 'Test Motor City stock API'}
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
              host={result.configStatus.apiHost || '(missing)'} · url=
              {result.configStatus.urlConfigured ? 'set' : 'missing'} · key=
              {result.configStatus.keyConfigured ? 'set' : 'missing'} · dealer=
              {result.configStatus.dealerCode}
            </code>
          </p>
          {result.sample && (
            <p className={`${baseClass}__status`}>
              Sample:{' '}
              <code>
                totalDocs={result.sample.totalDocs ?? '—'} · page={result.sample.page ?? '—'} ·
                filters={result.sample.filtersOk ? 'ok' : result.sample.filtersOk === false ? 'fail' : '—'}
              </code>
            </p>
          )}
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
