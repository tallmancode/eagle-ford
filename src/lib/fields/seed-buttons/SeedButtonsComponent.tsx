'use client'

import React from 'react'
import type { Payload } from 'payload'
import { CreateFormButton } from '@/components/BeforeDashboard/CreateFormButton'
import { formSeedActions, importSeedActions, type SeedAction } from './seedActions'

import './SeedButtonsComponent.scss'

const baseClass = 'seed-buttons'

function SeedActionCard({ action }: { action: SeedAction }) {
  return (
    <div className={`${baseClass}__card`}>
      <p className={`${baseClass}__description`}>{action.description}</p>
      <div className={`${baseClass}__action`}>
        <CreateFormButton
          endpoint={action.endpoint}
          label={action.label}
          successText={action.successText}
          adminLink={action.adminLink}
          allowRetry={action.allowRetry}
        />
      </div>
    </div>
  )
}

function SeedSection({ title, actions }: { title: string; actions: SeedAction[] }) {
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
      <SeedSection title="Forms" actions={formSeedActions} />
      <SeedSection title="Imports" actions={importSeedActions} />
    </div>
  )
}
