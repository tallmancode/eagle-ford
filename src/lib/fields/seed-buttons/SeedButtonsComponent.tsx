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
        <li>
          <CreateFormButton
            endpoint="/next/create-service-form"
            label="Create Service Booking Form"
            successText="Service Booking Form created!"
          />
          {' to add the service booking form to your Forms collection.'}
        </li>
        <li>
          <CreateFormButton
            endpoint="/next/create-test-drive-form"
            label="Create Test Drive Booking Form"
            successText="Test Drive Booking Form created!"
          />
          {' to add the test drive booking form to your Forms collection.'}
        </li>
        <li>
          <CreateFormButton
            endpoint="/next/create-special-offer-form"
            label="Create Special Offer Enquiry Form"
            successText="Special Offer Enquiry Form created!"
          />
          {' to add the special offer enquiry form to your Forms collection.'}
        </li>
        <li>
          <CreateFormButton
            endpoint="/next/create-vehicle-quote-form"
            label="Create Vehicle Quote Form"
            successText="Vehicle Quote Form created!"
          />
          {' to add the vehicle quote form to your Forms collection.'}
        </li>
        <li>
          <CreateFormButton
            endpoint="/next/import-vehicles"
            label="Import Vehicle Catalog"
            successText="Vehicle catalog imported successfully!"
          />
          {
            ' to import all vehicles, models, categories, and refresh images from bundled seed assets.'
          }
        </li>
      </ul>
    </div>
  )
}
