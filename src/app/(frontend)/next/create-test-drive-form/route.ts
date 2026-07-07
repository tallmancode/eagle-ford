import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { testDriveForm } from '@/endpoints/seed/test-drive-form'

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
      data: testDriveForm,
    })

    return Response.json({ success: true, id: form.id, title: form.title })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error creating test drive booking form' })
    return new Response('Error creating test drive booking form.', { status: 500 })
  }
}
