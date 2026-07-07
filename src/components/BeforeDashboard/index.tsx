import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { CreateFormButton } from './CreateFormButton'
import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your dashboard!</h4>
      </Banner>
      Here&apos;s what to do next:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' with a few pages, blogs, and projects to jump-start your new site, then '}
          <a href="/" target="_blank">
            visit your website
          </a>
          {' to see the results.'}
        </li>
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
          {'Modify your '}
          <a
            href="https://payloadcms.com/docs/configuration/collections"
            rel="noopener noreferrer"
            target="_blank"
          >
            collections
          </a>
          {' and add more '}
          <a
            href="https://payloadcms.com/docs/fields/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            fields
          </a>
          {' as needed. If you are new to Payload, we also recommend you check out the '}
          <a
            href="https://payloadcms.com/docs/getting-started/what-is-payload"
            rel="noopener noreferrer"
            target="_blank"
          >
            Getting Started
          </a>
          {' docs.'}
        </li>
        <li>
          Commit and push your changes to the repository to trigger a redeployment of your project.
        </li>
      </ul>
      {'Pro Tip: This block is a '}
      <a
        href="https://payloadcms.com/docs/custom-components/overview"
        rel="noopener noreferrer"
        target="_blank"
      >
        custom component
      </a>
      , you can remove it at any time by updating your <strong>payload.config</strong>.
    </div>
  )
}

export default BeforeDashboard
