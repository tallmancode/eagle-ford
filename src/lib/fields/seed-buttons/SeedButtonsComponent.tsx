import React from 'react'
import type { Payload } from 'payload'
import { CreateFormButton } from '@/components/BeforeDashboard/CreateFormButton'

export const SeedButtonsComponent = ({ payload: _payload }: { payload: Payload }) => {
  return (
    <div>
      <ul>
        <li>
          <CreateFormButton
            endpoint="/next/create-sell-form"
            label="Create Sell Enquiry Form"
            successText="Sell Enquiry Form created!"
          />
          {' to add the vehicle sell enquiry form to your Forms collection.'}
        </li>
        <li>
          <CreateFormButton
            endpoint="/next/create-enquiry-form"
            label="Create General Enquiry Form"
            successText="General Enquiry Form created!"
          />
          {' to add the general contact enquiry form to your Forms collection.'}
        </li>
        <li>
          <CreateFormButton
            endpoint="/next/create-paint-panel-form"
            label="Create Paint & Panel Enquiry Form"
            successText="Paint & Panel Enquiry Form created!"
          />
          {' to add the paint & panel enquiry form to your Forms collection.'}
        </li>
        <li>
          <CreateFormButton
            endpoint="/next/create-parts-form"
            label="Create Parts Enquiry Form"
            successText="Parts Enquiry Form created!"
          />
          {' to add the parts enquiry form to your Forms collection.'}
        </li>
        <li>
          <CreateFormButton
            endpoint="/next/create-wheel-tyre-form"
            label="Create Wheel & Tyre Enquiry Form"
            successText="Wheel & Tyre Enquiry Form created!"
          />
          {' to add the wheel & tyre enquiry form to your Forms collection.'}
        </li>
      </ul>
    </div>
  )
}
