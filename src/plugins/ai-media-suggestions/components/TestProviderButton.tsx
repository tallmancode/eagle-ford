'use client'
import { Button, useFormFields } from '@payloadcms/ui'
import { useState } from 'react'

export function TestProviderButton() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)

  // Get current form values
  const provider = useFormFields(([fields]) => fields.provider)
  const model = useFormFields(([fields]) => fields.model)
  const apiUrl = useFormFields(([fields]) => fields.apiUrl)
  const apiKey = useFormFields(([fields]) => fields.apiKey)

  const handleTest = async () => {
    setTesting(true)
    setResult(null)

    try {
      const response = await fetch('/api/ai-suggestions/test-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: provider.value,
          model: model.value,
          apiUrl: apiUrl.value,
          apiKey: apiKey.value,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: data.message,
          details: `Test completed with ${data.provider} using ${data.model}`,
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Test failed',
          details: data.details,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to test provider',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setTesting(false)
    }
  }

  const canTest = provider.value && model.value

  return (
    <div style={{ marginTop: '1rem' }}>
      <Button type="button" onClick={handleTest} disabled={!canTest || testing}>
        {testing ? 'Testing...' : 'Test Provider Configuration'}
      </Button>

      {result && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: result.success ? 'var(--theme-success-50)' : 'var(--theme-error-50)',
            border: `1px solid ${result.success ? 'var(--theme-success-500)' : 'var(--theme-error-500)'}`,
            borderRadius: 'var(--border-radius-m)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            {result.success ? '✓ Success' : '✗ Error'}
          </div>
          <div>{result.message}</div>
          {result.details && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
              {result.details}
            </div>
          )}
        </div>
      )}

      {!canTest && (
        <div
          style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--theme-elevation-700)' }}
        >
          Please select a provider and model to test
        </div>
      )}
    </div>
  )
}
