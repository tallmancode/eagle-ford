'use client'

import React, { useEffect, useRef } from 'react'
import { Button, Modal, useModal } from '@payloadcms/ui'

import type { SeedLogEntry, SeedLogStatus } from '@/lib/seed/types'

import './SeedLogModal.scss'

const baseClass = 'seed-log-modal'

type Props = {
  modalSlug: string
  title: string
  logs: SeedLogEntry[]
  status: SeedLogStatus
  onClose: () => void
}

function statusLabel(status: SeedLogStatus): string {
  if (status === 'running') return 'In progress...'
  if (status === 'complete') return 'Complete'
  return 'Failed'
}

export const SeedLogModal: React.FC<Props> = ({ modalSlug, title, logs, status, onClose }) => {
  const { closeModal, isModalOpen } = useModal()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    panel.scrollTop = panel.scrollHeight
  }, [logs])

  if (!isModalOpen(modalSlug)) {
    return null
  }

  const handleClose = () => {
    closeModal(modalSlug)
    onClose()
  }

  return (
    <Modal className={baseClass} closeOnBlur={status !== 'running'} slug={modalSlug}>
      <div className={`${baseClass}__wrapper`}>
        <div className={`${baseClass}__header`}>
          <h2 className={`${baseClass}__title`}>{title}</h2>
          <span className={`${baseClass}__status ${baseClass}__status--${status}`}>
            {statusLabel(status)}
          </span>
        </div>

        <div ref={panelRef} className={`${baseClass}__panel`}>
          {logs.length === 0 ? (
            <p className={`${baseClass}__empty`}>Waiting for logs...</p>
          ) : (
            logs.map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className={`${baseClass}__line ${baseClass}__line--${entry.level}`}
              >
                {entry.line}
              </div>
            ))
          )}
        </div>

        <div className={`${baseClass}__controls`}>
          <Button buttonStyle="secondary" onClick={handleClose} size="medium" type="button">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
