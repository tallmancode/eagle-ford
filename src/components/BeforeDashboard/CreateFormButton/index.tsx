'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import '../SeedButton/index.scss'

type Props = {
  endpoint: string
  label: string
  successText: string
}

export const CreateFormButton: React.FC<Props> = ({ endpoint, label, successText }) => {
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (created) {
        toast.info(`${label} already created.`)
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
            fetch(endpoint, { method: 'POST', credentials: 'include' })
              .then((res) => {
                if (res.ok) return res.json() as Promise<{ id: string }>
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
          }).then((id) => (
            <div>
              {successText}{' '}
              <a target="_blank" href={`/admin/collections/forms/${id}`}>
                View in admin
              </a>
            </div>
          )),
          {
            loading: `Creating ${label}...`,
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
    [endpoint, label, successText, loading, created, error],
  )

  let message = ''
  if (loading) message = ' (creating...)'
  if (created) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        {label}
      </button>
      {message}
    </Fragment>
  )
}
