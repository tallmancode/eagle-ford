'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button, toast } from '@payloadcms/ui'

import './AiSeoUsageField.scss'

type UsageSnapshot = {
  ok: boolean
  configured: boolean
  model: string
  monthlyBudgetUsd: number
  spentUsd: number
  remainingUsd: number
  inputTokens: number
  outputTokens: number
  generationCount: number
  recent: Array<{
    id: string
    createdAt: string
    slug?: string | null
    status: string
    inputTokens: number
    outputTokens: number
    estimatedCostUsd: number
    errorCode?: string | null
  }>
  message?: string
}

const baseClass = 'ai-seo-usage'

function formatUsd(value: number): string {
  return `$${value.toFixed(4)}`
}

export function AiSeoUsageField() {
  const [busy, setBusy] = useState(false)
  const [snapshot, setSnapshot] = useState<UsageSnapshot | null>(null)

  const load = useCallback(async () => {
    setBusy(true)
    try {
      const response = await fetch('/next/ai-seo/usage', {
        method: 'GET',
        credentials: 'include',
      })
      const json = (await response.json().catch(() => null)) as UsageSnapshot | null
      if (!json?.ok) {
        toast.error(json?.message || `Could not load AI SEO usage (${response.status})`)
        return
      }
      setSnapshot(json)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error'
      toast.error(message)
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__header`}>
        <h3 className={`${baseClass}__heading`}>AI SEO usage</h3>
        <Button buttonStyle="secondary" disabled={busy} onClick={() => void load()} type="button">
          {busy ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>
      <p className={`${baseClass}__intro`}>
        Token counts and estimated spend for AI-generated SEO this calendar month (UTC). The API key
        stays in server env and is never shown here. Estimated cost uses a local rate table — update
        it if Anthropic reprices.
      </p>

      {snapshot && (
        <>
          <dl className={`${baseClass}__stats`}>
            <div>
              <dt>API key</dt>
              <dd>{snapshot.configured ? 'Set' : 'Missing'}</dd>
            </div>
            <div>
              <dt>Model</dt>
              <dd>
                <code>{snapshot.model}</code>
              </dd>
            </div>
            <div>
              <dt>Monthly budget</dt>
              <dd>{formatUsd(snapshot.monthlyBudgetUsd)}</dd>
            </div>
            <div>
              <dt>Spent this month</dt>
              <dd>{formatUsd(snapshot.spentUsd)}</dd>
            </div>
            <div>
              <dt>Remaining</dt>
              <dd>{formatUsd(snapshot.remainingUsd)}</dd>
            </div>
            <div>
              <dt>Tokens (in / out)</dt>
              <dd>
                {snapshot.inputTokens.toLocaleString()} / {snapshot.outputTokens.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt>Generations</dt>
              <dd>{snapshot.generationCount}</dd>
            </div>
          </dl>

          {snapshot.recent.length > 0 && (
            <table className={`${baseClass}__table`}>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Tokens</th>
                  <th>Est. USD</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.recent.map((row) => (
                  <tr key={row.id}>
                    <td>{row.createdAt.replace('T', ' ').replace(/\.\d+Z$/, 'Z')}</td>
                    <td>{row.slug || '—'}</td>
                    <td>
                      {row.status}
                      {row.errorCode ? ` (${row.errorCode})` : ''}
                    </td>
                    <td>
                      {row.inputTokens} / {row.outputTokens}
                    </td>
                    <td>{formatUsd(row.estimatedCostUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}
