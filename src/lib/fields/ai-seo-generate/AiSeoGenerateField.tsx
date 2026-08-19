'use client'

import React, { useCallback, useState } from 'react'
import { Button, toast, useDocumentInfo, useForm } from '@payloadcms/ui'

import { toJsonSafe } from '@/lib/ai-seo/toJsonSafe'
import './AiSeoGenerateField.scss'

type GenerateResponse = {
  ok: boolean
  title?: string
  description?: string
  reason?: string
  message?: string
}

const baseClass = 'ai-seo-generate'

export function AiSeoGenerateField() {
  const { getData, dispatchFields, setModified } = useForm()
  const { id, collectionSlug } = useDocumentInfo()
  const [busy, setBusy] = useState(false)

  const onGenerate = useCallback(async () => {
    setBusy(true)
    try {
      const response = await fetch('/next/ai-seo/generate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          collectionSlug,
          doc: toJsonSafe(getData()),
        }),
      })
      const json = (await response.json().catch(() => null)) as GenerateResponse | null

      if (!json?.ok) {
        toast.error(json?.message || `AI SEO generation failed (${response.status})`)
        return
      }

      dispatchFields({
        type: 'UPDATE',
        path: 'meta.title',
        value: json.title ?? '',
      })
      dispatchFields({
        type: 'UPDATE',
        path: 'meta.description',
        value: json.description ?? '',
      })
      setModified(true)
      toast.success('Title and description filled. Review them, then save the page.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error'
      toast.error(message)
    } finally {
      setBusy(false)
    }
  }, [collectionSlug, dispatchFields, getData, id, setModified])

  return (
    <div className={baseClass}>
      <p className={`${baseClass}__intro`}>
        Analyses this page’s content (including unsaved Better Editor blocks) and writes a search
        title and meta description. Does not run on save — review the fields below, then save.
      </p>
      <Button buttonStyle="primary" disabled={busy} onClick={() => void onGenerate()} type="button">
        {busy ? 'Generating…' : 'Generate with AI'}
      </Button>
    </div>
  )
}
