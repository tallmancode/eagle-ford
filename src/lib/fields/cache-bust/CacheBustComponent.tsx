'use client'

import React, { useCallback, useState } from 'react'
import { Button, toast } from '@payloadcms/ui'

type BustResponse = {
  success: boolean
  tags: string[]
  paths: string[]
}

export const CacheBustComponent = () => {
  const [loading, setLoading] = useState(false)

  const handleBust = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (loading) return

      setLoading(true)

      try {
        const response = await fetch('/next/bust-all-caches', {
          method: 'POST',
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error(
            response.status === 403
              ? 'You do not have permission to bust caches.'
              : 'Failed to bust caches.',
          )
        }

        const data = (await response.json()) as BustResponse

        toast.success(`Cleared ${data.tags.length} cache tag(s) and revalidated the root layout.`)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to bust caches.'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [loading],
  )

  return (
    <div>
      <p>
        Invalidate all Next.js Data Cache tags (globals, vehicles, models, specials, sitemap,
        redirects, and Motor City stock) and revalidate the root layout Full Route Cache.
      </p>
      <p>
        <Button buttonStyle="secondary" size="small" disabled={loading} onClick={handleBust}>
          {loading ? 'Busting caches...' : 'Bust all caches'}
        </Button>
      </p>
    </div>
  )
}
