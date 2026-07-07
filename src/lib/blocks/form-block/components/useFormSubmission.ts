'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import type { Form, Page } from '@/payload-types'
import { getPagePath } from '@/lib/utils/getPagePath'
import { buildInitialFormState } from '@/lib/blocks/form-block/components/buildInitialFormState'

type FormData = Record<string, unknown>

type SubmissionError = {
  message: string
  status?: number
}

function getRedirectUrl(form: Form): string | null {
  const { redirect, confirmationType } = form

  if (confirmationType !== 'redirect' || !redirect) {
    return null
  }

  if (redirect.type === 'custom' && redirect.url) {
    return redirect.url
  }

  if (redirect.type === 'reference' && redirect.reference?.value) {
    const page = redirect.reference.value
    if (typeof page === 'object' && page.slug) {
      return getPagePath(page as Page)
    }
  }

  return redirect.url ?? null
}

export function useFormSubmission(form: Form) {
  const router = useRouter()
  const formMethods = useForm<FormData>({
    defaultValues: buildInitialFormState(form),
  })

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<SubmissionError | undefined>()

  const formID = form.id
  const { confirmationMessage, confirmationType } = form

  const onSubmit = useCallback(
    (data: FormData) => {
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([field, value]) => ({
          field,
          value: String(value ?? ''),
        }))

        const loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 400)

        try {
          const req = await fetch('/api/form-submissions', {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = (await req.json()) as {
            errors?: { message: string }[]
          }

          if (loadingTimerID) {
            clearTimeout(loadingTimerID)
          }

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: req.status,
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          const redirectUrl = getRedirectUrl(form)
          if (redirectUrl) {
            router.push(redirectUrl)
          }
        } catch {
          if (loadingTimerID) {
            clearTimeout(loadingTimerID)
          }
          setIsLoading(false)
          setError({
            message: 'Something went wrong. Please try again.',
          })
        }
      }

      void submitForm()
    },
    [form, formID, router],
  )

  return {
    formMethods,
    isLoading,
    hasSubmitted,
    error,
    onSubmit,
    confirmationMessage,
    confirmationType,
  }
}
