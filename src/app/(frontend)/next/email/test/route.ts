import { headers } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'
import { runSmtpTest } from '@/lib/email/runSmtpTest'
import { isPayloadUser } from '@/lib/utils/accessUtil'

/**
 * Admin/developer: verify env SMTP (Mimecast) and send a test message. Returns structured logs.
 */
export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (
    !isPayloadUser(user) ||
    !(user.roles?.includes('admin') || user.roles?.includes('developer'))
  ) {
    return Response.json({ message: 'Action forbidden.' }, { status: 403 })
  }

  let body: Record<string, unknown> = {}
  try {
    const parsed = await request.json()
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      body = parsed as Record<string, unknown>
    }
  } catch {
    // Empty body is fine — Settings testRecipient is used.
  }

  const testRecipient = typeof body.testRecipient === 'string' ? body.testRecipient : undefined

  const result = await runSmtpTest({
    payload,
    testRecipient,
  })

  return Response.json(result, { status: result.ok ? 200 : 422 })
}
