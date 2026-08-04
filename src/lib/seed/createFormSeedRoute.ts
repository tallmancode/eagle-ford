import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'

import { createSeedStreamResponse } from './createSeedStreamResponse'

type FormSeedRouteOptions = {
  formName: string
  getFormData: () => RequiredDataFromCollectionSlug<'forms'>
  errorMessage: string
  /** When set, prefer redirect confirmation to this page slug if it exists. */
  thankYouPageSlug?: string
}

/**
 * Upserts a form by stable `title` so re-seeding overwrites the existing document
 * and preserves IDs referenced by pages, specials, and Settings.
 */
export function createFormSeedRoute({
  formName,
  getFormData,
  errorMessage,
  thankYouPageSlug,
}: FormSeedRouteOptions) {
  return async function POST(): Promise<Response> {
    const payload = await getPayload({ config })
    const requestHeaders = await headers()
    const { user } = await payload.auth({ headers: requestHeaders })

    if (!user) {
      return new Response('Action forbidden.', { status: 403 })
    }

    return createSeedStreamResponse(async (log) => {
      log.info(`Upserting ${formName}...`)

      try {
        const data: RequiredDataFromCollectionSlug<'forms'> = { ...getFormData() }
        const title = data.title

        if (thankYouPageSlug) {
          const thankYouPages = await payload.find({
            collection: 'pages',
            depth: 0,
            limit: 1,
            where: {
              slug: {
                equals: thankYouPageSlug,
              },
            },
          })

          const thankYouPage = thankYouPages.docs[0]
          if (thankYouPage) {
            data.confirmationType = 'redirect'
            data.redirect = {
              type: 'reference',
              reference: {
                relationTo: 'pages',
                value: thankYouPage.id,
              },
            }
            log.info(`Using thank-you redirect to /${thankYouPageSlug}`)
          } else {
            log.info(
              `Thank-you page /${thankYouPageSlug} not found — keeping on-page confirmation message`,
            )
          }
        }

        const existing = await payload.find({
          collection: 'forms',
          depth: 0,
          limit: 1,
          where: {
            title: {
              equals: title,
            },
          },
        })

        const existingForm = existing.docs[0]
        if (existingForm) {
          const form = await payload.update({
            collection: 'forms',
            id: existingForm.id,
            depth: 0,
            data,
          })
          log.info(`${formName} updated (id ${form.id})`)
          return { success: true, id: form.id, title: form.title, upserted: 'updated' }
        }

        const form = await payload.create({
          collection: 'forms',
          depth: 0,
          data,
        })

        log.info(`${formName} created (id ${form.id})`)

        return { success: true, id: form.id, title: form.title, upserted: 'created' }
      } catch (error) {
        payload.logger.error({ err: error, message: errorMessage })
        throw new Error(errorMessage)
      }
    }, payload.logger)
  }
}
