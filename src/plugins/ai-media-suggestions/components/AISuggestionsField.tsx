'use client'

import { useDocumentInfo, useFormFields, useForm } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui'
import { useState } from 'react'
import type { UIFieldClientComponent } from 'payload'

interface AISuggestionsCustomProps {
  endpointPath?: string
  fieldMappings?: { title?: string; alt?: string; credits?: string }
}

export const AISuggestionsField: UIFieldClientComponent = (props) => {
  const customProps = (props as { customProps?: AISuggestionsCustomProps }).customProps ?? {}
  const endpointPath = customProps.endpointPath || '/ai-suggestions'
  const fieldMappings = customProps.fieldMappings || {
    title: 'title',
    alt: 'alt',
    credits: 'creditText',
  }

  const { id } = useDocumentInfo()
  const { dispatchFields } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [context, setContext] = useState('')

  // Get current field values
  const filename = useFormFields(([fields]) => fields?.filename?.value)
  const url = useFormFields(([fields]) => fields?.url?.value)
  const file = useFormFields(([fields]) => fields?.file?.value) as File | undefined

  // Check if file is uploaded (either saved with url/filename OR has file object)
  const hasFile = Boolean(url || filename || file)

  const handleGenerateSuggestions = async () => {
    // Check if file is uploaded (either saved with ID or just uploaded)
    if (!hasFile) {
      setError('Please upload an image file first')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      let requestBody:
        | { mediaId: string; context?: string }
        | { base64Image: string; mimeType: string; context?: string }

      if (id) {
        // If saved, use the existing approach with mediaId
        requestBody = {
          mediaId: String(id),
          context: context.trim() || undefined,
        }
      } else if (file) {
        // If not saved yet, convert file to base64 and send directly
        const reader = new FileReader()
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            if (reader.result) {
              // Extract base64 data (remove data URL prefix)
              const base64 = (reader.result as string).split(',')[1]
              resolve(base64)
            } else {
              reject(new Error('Failed to read file'))
            }
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        const base64Image = await base64Promise
        requestBody = {
          base64Image,
          mimeType: file.type,
          context: context.trim() || undefined,
        }
      } else {
        setError('No file data available')
        return
      }

      const response = await fetch(`/api${endpointPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = (await response.json()) as {
        success?: boolean
        suggestions?: { title?: string; alt?: string; credits?: string }
        details?: string
        error?: string
      }

      if (!response.ok) {
        setError(data.details ?? data.error ?? 'Failed to generate suggestions')
        return
      }

      if (data.success && data.suggestions) {
        // Update form fields with AI suggestions using configured field mappings
        if (fieldMappings?.title) {
          dispatchFields({
            type: 'UPDATE',
            path: fieldMappings.title,
            value: data.suggestions.title,
          })
        }

        if (fieldMappings?.alt) {
          dispatchFields({
            type: 'UPDATE',
            path: fieldMappings.alt,
            value: data.suggestions.alt,
          })
        }

        if (fieldMappings?.credits) {
          dispatchFields({
            type: 'UPDATE',
            path: fieldMappings.credits,
            value: data.suggestions.credits,
          })
        }

        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000) // Clear success message after 3 seconds
      } else {
        setError('Invalid response from server')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error generating AI suggestions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: 'var(--base)', borderTop: '1px solid var(--theme-elevation-200)' }}>
      <div style={{ marginBottom: 'var(--base)' }}>
        <h3 style={{ margin: '0 0 var(--base) 0', fontSize: 'var(--font-size-small)' }}>
          AI Suggestions
        </h3>
        <p
          style={{
            margin: '0 0 var(--base) 0',
            fontSize: 'var(--font-size-small)',
            color: 'var(--theme-text)',
            opacity: 0.7,
          }}
        >
          Generate AI-powered suggestions for Title, Alt text, and Credits based on the image
          content.
        </p>
      </div>

      <div style={{ marginBottom: 'var(--base)' }}>
        <label
          htmlFor="ai-context"
          style={{
            display: 'block',
            marginBottom: 'calc(var(--base) / 2)',
            fontSize: 'var(--font-size-small)',
            fontWeight: '600',
            color: 'var(--theme-text)',
          }}
        >
          Additional Context (optional)
        </label>
        <textarea
          id="ai-context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="E.g., 'This is for a blog post about design', 'Focus on the architecture', etc."
          rows={3}
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
      </div>

      <Button
        onClick={handleGenerateSuggestions}
        disabled={isLoading || !hasFile}
        buttonStyle="secondary"
        size="small"
      >
        {isLoading ? 'Generating...' : 'Generate AI Suggestions'}
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
          <strong>Error:</strong> {error}
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
          <strong>Success!</strong> AI suggestions applied to fields
        </div>
      )}

      {!hasFile && (
        <div
          style={{
            marginTop: 'var(--base)',
            fontSize: 'var(--font-size-small)',
            color: 'var(--theme-text)',
            opacity: 0.6,
          }}
        >
          Upload an image to enable AI suggestions
        </div>
      )}
    </div>
  )
}
