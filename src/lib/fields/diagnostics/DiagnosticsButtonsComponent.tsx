'use client'

import React from 'react'
import type { Payload } from 'payload'
import { CreateFormButton } from '@/components/BeforeDashboard/CreateFormButton'

import './DiagnosticsButtonsComponent.scss'

const baseClass = 'diagnostics-buttons'

export const DiagnosticsButtonsComponent = ({ payload: _payload }: { payload: Payload }) => {
  return (
    <div className={baseClass}>
      <section className={`${baseClass}__section`}>
        <h3 className={`${baseClass}__heading`}>Diagnostics</h3>
        <div className={`${baseClass}__wrapper`}>
          <div className={`${baseClass}__card`}>
            <p className={`${baseClass}__description`}>
              Intentionally capture an exception so you can confirm Sentry is receiving events
              (production + SENTRY_DSN required).
            </p>
            <div className={`${baseClass}__action`}>
              <CreateFormButton
                endpoint="/next/sentry-test-error"
                label="Force Sentry Test Error"
                successText="Sentry test error reported."
                allowRetry
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
