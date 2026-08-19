'use client'

import React from 'react'
import { useAllFormFields } from '@payloadcms/ui'

import { getPagePath } from '@/lib/utils/getPagePath'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'

/**
 * Local SEO snippet preview. The plugin PreviewComponent POSTs full form state
 * (including block RowLabel trees that close over BasePayload) and throws
 * "Converting circular structure to JSON" — see payloadcms/payload#16786.
 */
export function SeoPreviewField() {
  const [fields] = useAllFormFields()

  const slug = typeof fields.slug?.value === 'string' ? fields.slug.value : ''
  const metaTitle = typeof fields['meta.title']?.value === 'string' ? fields['meta.title'].value : ''
  const metaDescription =
    typeof fields['meta.description']?.value === 'string' ? fields['meta.description'].value : ''

  const href = `${getServerSideURL()}${getPagePath({ slug })}`

  return (
    <div style={{ marginBottom: '20px' }}>
      <div>Preview</div>
      <div style={{ color: '#9A9A9A', marginBottom: '5px' }}>
        Exact result listings may vary based on content and search relevancy.
      </div>
      <div
        style={{
          background: 'var(--theme-elevation-50)',
          borderRadius: '5px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          padding: '20px',
          pointerEvents: 'none',
          width: '100%',
        }}
      >
        <div>
          <span style={{ color: '#1a0dab', textDecoration: 'none' }}>{href || 'https://...'}</span>
        </div>
        <h4 style={{ margin: 0 }}>
          <span style={{ color: '#1a0dab', textDecoration: 'none' }}>{metaTitle}</span>
        </h4>
        <p style={{ margin: 0 }}>{metaDescription}</p>
      </div>
    </div>
  )
}
