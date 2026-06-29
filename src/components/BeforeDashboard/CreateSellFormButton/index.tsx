'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC<{ id: string }> = ({ id }) => (
  <div>
    Sell Enquiry Form created!{' '}
    <a target="_blank" href={`/admin/collections/forms/${id}`}>
      View in admin
    </a>
  </div>
)

export const CreateSellFormButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (created) {
        toast.info('Sell Enquiry Form already created.')
        return
      }
      if (loading) {
        toast.info('Creation already in progress.')
        return
      }
      if (error) {
        toast.error('An error occurred, please refresh and try again.')
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise<string>((resolve, reject) => {
            fetch('/next/create-sell-form', { method: 'POST', credentials: 'include' })
              .then((res) => {
                if (res.ok) {
                  return res.json() as Promise<{ id: string }>
                }
                reject('An error occurred while creating the form.')
                return null
              })
              .then((data) => {
                if (data) {
                  setCreated(true)
                  resolve(data.id)
                }
              })
              .catch(reject)
          }).then((id) => <SuccessMessage id={id} />),
          {
            loading: 'Creating Sell Enquiry Form...',
            success: (msg) => msg,
            error: 'An error occurred while creating the form.',
          },
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [loading, created, error],
  )

  let message = ''
  if (loading) message = ' (creating...)'
  if (created) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="createSellFormButton" onClick={handleClick}>
        Create Sell Enquiry Form
      </button>
      {message}
    </Fragment>
  )
}
