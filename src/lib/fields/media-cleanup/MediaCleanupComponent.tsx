'use client'

import React, { useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

type CleanupResponse = {
  success: boolean
  dryRun: boolean
  scannedDocs: number
  referencedCount: number
  orphanCount: number
  deletedCount: number
  orphans: { id: string; filename: string | null }[]
  deletedFilenames: string[]
  errors: string[]
}

export const MediaCleanupComponent = () => {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<CleanupResponse | null>(null)

  const runCleanup = useCallback(async (dryRun: boolean) => {
    setLoading(true)

    try {
      const endpoint = dryRun
        ? '/next/cleanup-orphaned-media?dryRun=true'
        : '/next/cleanup-orphaned-media'

      const response = await fetch(endpoint, { method: 'POST', credentials: 'include' })

      if (!response.ok) {
        throw new Error(
          response.status === 403
            ? 'You do not have permission to run media cleanup.'
            : 'Media cleanup failed.',
        )
      }

      const data = (await response.json()) as CleanupResponse

      if (dryRun) {
        setPreview(data)
        if (data.orphanCount === 0) {
          toast.success('No orphaned media found.')
        } else {
          toast.info(`Found ${data.orphanCount} orphaned media item(s).`)
        }
        return data
      }

      setPreview(null)

      if (data.errors.length > 0) {
        toast.error(`Deleted ${data.deletedCount} item(s), but ${data.errors.length} failed.`)
      } else if (data.deletedCount === 0) {
        toast.success('No orphaned media to delete.')
      } else {
        toast.success(`Deleted ${data.deletedCount} orphaned media item(s).`)
      }

      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Media cleanup failed.'
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const handlePreview = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (loading) return
      await runCleanup(true)
    },
    [loading, runCleanup],
  )

  const handleDelete = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (loading) return

      if (!preview) {
        toast.info('Run a preview first to see what will be deleted.')
        return
      }

      if (preview.orphanCount === 0) {
        toast.info('No orphaned media to delete.')
        return
      }

      const confirmed = window.confirm(
        `Delete ${preview.orphanCount} orphaned media item(s)? This cannot be undone.`,
      )

      if (!confirmed) return

      await runCleanup(false)
    },
    [loading, preview, runCleanup],
  )

  const sampleFilenames = preview?.orphans
    .map((item) => item.filename)
    .filter((filename): filename is string => Boolean(filename))
    .slice(0, 10)

  return (
    <div>
      <p>
        Remove media collection items that are not referenced anywhere in the CMS, including their
        files. Form submission uploads are treated as in use and will be kept.
      </p>
      <p>
        <button className="seedButton" type="button" onClick={handlePreview} disabled={loading}>
          {loading && !preview ? 'Scanning...' : 'Preview orphaned media'}
        </button>
        {preview && preview.orphanCount > 0 && (
          <>
            {' '}
            <button className="seedButton" type="button" onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : `Delete ${preview.orphanCount} orphaned item(s)`}
            </button>
          </>
        )}
      </p>
      {preview && (
        <div>
          <p>
            Scanned {preview.scannedDocs} document(s). {preview.referencedCount} media item(s) are
            in use. {preview.orphanCount} orphaned item(s) found.
          </p>
          {sampleFilenames && sampleFilenames.length > 0 && (
            <ul>
              {sampleFilenames.map((filename) => (
                <li key={filename}>{filename}</li>
              ))}
              {preview.orphanCount > sampleFilenames.length && (
                <li>…and {preview.orphanCount - sampleFilenames.length} more</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
