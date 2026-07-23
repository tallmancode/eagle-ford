'use client'

import { useDocumentInfo, useForm } from '@payloadcms/ui'
import { Button, Drawer, DrawerToggler, useDrawerSlug } from '@payloadcms/ui'
import React, { useCallback, useState } from 'react'
import type { UIFieldClientComponent } from 'payload'

/**
 * Dedicated AI Generate field for excerpt.
 * Hardcoded to update excerpt field - no customProps needed.
 */
export const AIGenerateExcerptField: UIFieldClientComponent = () => {
  const endpointPath = '/ai-seo-generate'
  const target = 'excerpt' as const
  const descriptionPath = 'excerpt'

  const { collectionSlug, globalSlug } = useDocumentInfo()
  const { getData, dispatchFields } = useForm()
  const drawerSlug = useDrawerSlug('ai-excerpt-generate')

  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const slug = collectionSlug ?? globalSlug ?? ''

  const fetchDefaultPrompt = useCallback(async () => {
    if (!slug) return
    setIsLoadingPrompt(true)
    setError(null)
    try {
      const apiUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const response = await fetch(`${apiUrl}/api${endpointPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          doc: getData(),
          collectionSlug: slug || undefined,
          globalSlug: slug || undefined,
          action: 'extract',
        }),
      })
      const data = (await response.json()) as { success?: boolean; prompt?: string }
      if (data.success && typeof data.prompt === 'string') {
        setPrompt(data.prompt)
      } else {
        setPrompt('')
      }
    } catch (err) {
      console.error('Failed to fetch default prompt:', err)
      setPrompt('')
    } finally {
      setIsLoadingPrompt(false)
    }
  }, [endpointPath, getData, slug])

  const handleOpenDrawer = useCallback(() => {
    setError(null)
    setSuccess(false)
    fetchDefaultPrompt()
  }, [fetchDefaultPrompt])

  const handleGenerate = async () => {
    const effectivePrompt = prompt.trim()
    if (!effectivePrompt) {
      setError('Enter or edit the prompt content, then click Generate.')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const apiUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const response = await fetch(`${apiUrl}/api${endpointPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          doc: getData(),
          collectionSlug: slug || undefined,
          globalSlug: slug || undefined,
          promptOverride: effectivePrompt,
          target,
        }),
      })

      const data = (await response.json()) as {
        success?: boolean
        description?: string
        error?: string
        details?: string
      }

      if (!response.ok) {
        setError(data.details ?? data.error ?? 'Failed to generate')
        return
      }

      if (data.success && data.description) {
        dispatchFields({ type: 'UPDATE', path: descriptionPath, value: data.description })
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error ?? 'Invalid response')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: 'var(--base)' }}>
      <DrawerToggler slug={drawerSlug} onClick={handleOpenDrawer}>
        AI Generate Excerpt
      </DrawerToggler>

      <Drawer slug={drawerSlug} title="AI Generate Excerpt">
        <div style={{ padding: 'var(--base) 0' }}>
          <p
            style={{
              margin: '0 0 var(--base) 0',
              fontSize: 'var(--font-size-small)',
              color: 'var(--theme-text)',
              opacity: 0.8,
            }}
          >
            The prompt is pre-filled from your page content. Edit it if needed, then click Generate
            to create an excerpt.
          </p>

          <div style={{ marginBottom: 'var(--base)' }}>
            <label
              htmlFor="ai-excerpt-prompt"
              style={{
                display: 'block',
                marginBottom: 'calc(var(--base) / 2)',
                fontSize: 'var(--font-size-small)',
                fontWeight: 600,
                color: 'var(--theme-text)',
              }}
            >
              Prompt (editable)
            </label>
            {isLoadingPrompt ? (
              <div
                style={{
                  padding: 'var(--base)',
                  backgroundColor: 'var(--theme-elevation-100)',
                  borderRadius: 'var(--border-radius-m)',
                  fontSize: 'var(--font-size-small)',
                }}
              >
                Loading content...
              </div>
            ) : (
              <textarea
                id="ai-excerpt-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Page content will be extracted automatically, or enter custom prompt..."
                rows={8}
                style={{
                  width: '100%',
                  padding: 'calc(var(--base) / 2)',
                  fontSize: 'var(--font-size-small)',
                  backgroundColor: 'var(--theme-input-bg)',
                  color: 'var(--theme-text)',
                  border: '1px solid var(--theme-elevation-400)',
                  borderRadius: 'var(--border-radius-s)',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading || isLoadingPrompt || !prompt.trim()}
            buttonStyle="primary"
            size="small"
            type="button"
          >
            {isLoading ? 'Generating...' : 'Generate Excerpt'}
          </Button>

          {error && (
            <div
              style={{
                marginTop: 'var(--base)',
                padding: 'var(--base)',
                backgroundColor: 'var(--theme-error-100)',
                color: 'var(--theme-error-500)',
                borderRadius: 'var(--border-radius-m)',
                fontSize: 'var(--font-size-small)',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                marginTop: 'var(--base)',
                padding: 'var(--base)',
                backgroundColor: 'var(--theme-success-100)',
                color: 'var(--theme-success-500)',
                borderRadius: 'var(--border-radius-m)',
                fontSize: 'var(--font-size-small)',
              }}
            >
              Excerpt generated and applied to field.
            </div>
          )}
        </div>
      </Drawer>
    </div>
  )
}
