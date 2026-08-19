import { headers } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'
import { generatePageSeo } from '@/lib/ai-seo/generatePageSeo'
import { isPayloadUser } from '@/lib/utils/accessUtil'

/**
 * Authenticated CMS users: generate SEO title + description from current page form data.
 * Does not persist — the admin UI writes the returned values into the unsaved form.
 */
export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!isPayloadUser(user)) {
    return Response.json({ ok: false, message: 'Action forbidden.' }, { status: 403 })
  }

  let body: Record<string, unknown> = {}
  try {
    const parsed = await request.json()
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      body = parsed as Record<string, unknown>
    }
  } catch {
    return Response.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 })
  }

  const doc = body.doc && typeof body.doc === 'object' && !Array.isArray(body.doc) ? body.doc : null
  const collectionSlug =
    typeof body.collectionSlug === 'string' && body.collectionSlug.trim()
      ? body.collectionSlug.trim()
      : 'pages'

  const result = await generatePageSeo({
    doc: doc as { title?: unknown; slug?: unknown; section?: unknown; id?: unknown },
    payload,
    collectionSlug,
    userId: user.id,
  })

  if (!result.ok) {
    const status = result.reason === 'not_configured' || result.reason === 'budget_exceeded' ? 422 : 502
    return Response.json(
      {
        ok: false,
        reason: result.reason,
        message: result.message,
      },
      { status },
    )
  }

  return Response.json({
    ok: true,
    title: result.title,
    description: result.description,
  })
}
