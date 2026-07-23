'use client'

import { useFormFields, Button } from '@payloadcms/ui'
import { useState } from 'react'

export function RefetchModelsButton() {
  const [refetching, setRefetching] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)

  const provider = useFormFields(([fields]) => fields.provider)

  const handleRefetch = async () => {
    if (!provider?.value) return

    setRefetching(true)
    setResult(null)

    try {
      const response = await fetch('/api/ai-suggestions/refetch-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: data.message || `Fetched ${data.count} model(s).`,
          details:
            data.count != null ? `Open the model dropdown to see updated options.` : undefined,
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Refetch failed',
          details: data.details,
        })
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      const isNetwork =
        msg.includes('Failed to fetch') ||
        msg.includes('Connection refused') ||
        msg.includes('ERR_CONNECTION_REFUSED') ||
        msg.includes('NetworkError')
      setResult({
        success: false,
        message: 'Failed to refetch models',
        details: isNetwork ? `${msg}. Ensure the dev server is running (e.g. pnpm dev).` : msg,
      })
    } finally {
      setRefetching(false)
    }
  }

  const canRefetch = Boolean(provider?.value)

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
      <Button onClick={handleRefetch} disabled={!canRefetch || refetching}>
        {refetching ? 'Refetching...' : 'Refetch models'}
      </Button>
      {result && (
        <div
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: result.success ? 'var(--theme-success-50)' : 'var(--theme-error-50)',
            border: `1px solid ${result.success ? 'var(--theme-success-500)' : 'var(--theme-error-500)'}`,
            borderRadius: 'var(--border-radius-s)',
            maxWidth: '100%',
          }}
        >
          {result.success ? '✓' : '✗'} {result.message}
          {result.details && (
            <div style={{ marginTop: '0.125rem', opacity: 0.9 }}>{result.details}</div>
          )}
        </div>
      )}
    </div>
  )
}
