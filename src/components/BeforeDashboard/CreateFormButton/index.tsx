'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Button, toast, useModal } from '@payloadcms/ui'

import { SeedLogModal } from '@/components/BeforeDashboard/SeedLogModal/SeedLogModal'
import { parseSeedStream } from '@/lib/seed/parseSeedStream'
import type { SeedLogEntry, SeedLogStatus } from '@/lib/seed/types'

type Props = {
  endpoint: string
  label: string
  successText: string
  adminLink?: { collection: string }
  allowRetry?: boolean
}

function toModalSlug(endpoint: string): string {
  return `seed-log-${endpoint.replace(/\//g, '-')}`
}

export const CreateFormButton: React.FC<Props> = ({
  endpoint,
  label,
  successText,
  adminLink,
  allowRetry = false,
}) => {
  const { openModal } = useModal()
  const modalSlug = useMemo(() => toModalSlug(endpoint), [endpoint])
  const abortRef = useRef<AbortController | null>(null)

  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [logs, setLogs] = useState<SeedLogEntry[]>([])
  const [status, setStatus] = useState<SeedLogStatus>('running')

  const handleClose = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setLoading(false)
  }, [])

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()

      if (created && !allowRetry) {
        toast.info(`${label} already created.`)
        return
      }

      if (loading) {
        toast.info('Seed already in progress.')
        return
      }

      setLogs([])
      setStatus('running')
      setLoading(true)
      openModal(modalSlug)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal,
        })

        await parseSeedStream(response, {
          onLog: (entry) => {
            setLogs((current) => [...current, entry])
          },
          onDone: (result) => {
            setStatus('complete')
            setCreated(true)

            const data = result as { id?: string }

            if (adminLink && data.id) {
              toast.success(
                <div>
                  {successText}{' '}
                  <a target="_blank" href={`/admin/collections/${adminLink.collection}/${data.id}`}>
                    View in admin
                  </a>
                </div>,
              )
            } else {
              toast.success(successText)
            }
          },
          onError: (message) => {
            setStatus('error')
            setLogs((current) => [
              ...current,
              {
                level: 'error',
                message,
                timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                line: `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}] ERROR: ${message}`,
              },
            ])
            toast.error(message)
          },
        })
      } catch (error) {
        if (controller.signal.aborted) return

        const message = error instanceof Error ? error.message : 'Request failed.'
        setStatus('error')
        setLogs((current) => [
          ...current,
          {
            level: 'error',
            message,
            timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
            line: `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}] ERROR: ${message}`,
          },
        ])
        toast.error(message)
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null
        }
        setLoading(false)
      }
    },
    [adminLink, allowRetry, created, endpoint, label, loading, modalSlug, openModal, successText],
  )

  return (
    <>
      <Button
        buttonStyle="secondary"
        size="small"
        disabled={loading || (created && !allowRetry)}
        onClick={handleClick}
      >
        {loading ? 'Working...' : created && !allowRetry ? 'Done' : label}
      </Button>

      <SeedLogModal
        logs={logs}
        modalSlug={modalSlug}
        onClose={handleClose}
        status={status}
        title={label}
      />
    </>
  )
}
