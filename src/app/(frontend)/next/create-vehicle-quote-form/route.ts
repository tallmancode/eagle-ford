import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { vehicleQuoteForm } from '@/endpoints/seed/vehicle-quote-form'

export const maxDuration = 60

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const form = await payload.create({
      collection: 'forms',
      depth: 0,
      data: vehicleQuoteForm,
    })

    return Response.json({ success: true, id: form.id, title: form.title })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error creating vehicle quote form' })
    return new Response('Error creating vehicle quote form.', { status: 500 })
  }
}
