import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'

import { createSeedStreamResponse } from './createSeedStreamResponse'

type FormSeedRouteOptions = {
  formName: string
  getFormData: () => RequiredDataFromCollectionSlug<'forms'>
  errorMessage: string
}

export function createFormSeedRoute({ formName, getFormData, errorMessage }: FormSeedRouteOptions) {
  return async function POST(): Promise<Response> {
    const payload = await getPayload({ config })
    const requestHeaders = await headers()
    const { user } = await payload.auth({ headers: requestHeaders })

    if (!user) {
      return new Response('Action forbidden.', { status: 403 })
    }

    return createSeedStreamResponse(async (log) => {
      log.info(`Creating ${formName}...`)

      try {
        const form = await payload.create({
          collection: 'forms',
          depth: 0,
          data: getFormData(),
        })

        log.info(`${formName} created successfully`)

        return { success: true, id: form.id, title: form.title }
      } catch (error) {
        payload.logger.error({ err: error, message: errorMessage })
        throw new Error(errorMessage)
      }
    }, payload.logger)
  }
}
