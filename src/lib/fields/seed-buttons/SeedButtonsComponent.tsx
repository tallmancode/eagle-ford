'use client'

import React from 'react'
import type { Payload } from 'payload'
import { CreateFormButton } from '@/components/BeforeDashboard/CreateFormButton'
import {
  diagnosticSeedActions,
  formMaintenanceSeedActions,
  formSeedActions,
  importSeedActions,
  type SeedAction,
} from './seedActions'

import './SeedButtonsComponent.scss'

const baseClass = 'seed-buttons'

function isActionEnabled(action: SeedAction): boolean {
  return action.enabled !== false
}

function SeedActionCard({ action }: { action: SeedAction }) {
  const enabled = isActionEnabled(action)

  return (
    <div className={`${baseClass}__card${enabled ? '' : ` ${baseClass}__card--disabled`}`}>
      <p className={`${baseClass}__description`}>{action.description}</p>
      {!enabled ? (
        <p className={`${baseClass}__disabled-note`}>
          Disabled — set <code>enabled: true</code> in <code>seedActions.ts</code> to re-run.
        </p>
      ) : null}
      <div className={`${baseClass}__action`}>
        {enabled ? (
          <CreateFormButton
            endpoint={action.endpoint}
            label={action.label}
            successText={action.successText}
            adminLink={action.adminLink}
            allowRetry={action.allowRetry}
          />
        ) : (
          <button type="button" className={`${baseClass}__disabled-button`} disabled>
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

function SeedSection({ title, actions }: { title: string; actions: SeedAction[] }) {
  if (actions.length === 0) {
    return null
  }

  return (
    <section className={`${baseClass}__section`}>
      <h3 className={`${baseClass}__heading`}>{title}</h3>
      <div className={`${baseClass}__wrapper`}>
        {actions.map((action) => (
          <SeedActionCard key={action.endpoint} action={action} />
        ))}
      </div>
    </section>
  )
}

export const SeedButtonsComponent = ({ payload: _payload }: { payload: Payload }) => {
  return (
    <div className={baseClass}>
      <SeedSection title="Form maintenance" actions={formMaintenanceSeedActions} />
      <SeedSection title="Forms" actions={formSeedActions} />
      <SeedSection title="Imports & SEO" actions={importSeedActions} />
      <SeedSection title="Diagnostics" actions={diagnosticSeedActions} />
    </div>
  )
}
