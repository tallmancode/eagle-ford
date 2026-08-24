import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import { cookies, draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

import configPromise from '@payload-config'
import { SPECIAL_TEMPLATE_PREVIEW_COOKIE } from '@/lib/specials/templatePreviewCookie'

export type PreviewSearchParams = {
  path: string
  previewSecret: string
}

function extractTemplatePreviewId(path: string): string | null {
  try {
    const url = new URL(path, 'http://localhost')
    const value = url.searchParams.get('templatePreview')
    return value && value.length > 0 ? value : null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path) {
    return new Response('Insufficient search params', { status: 404 })
  }

  if (!path.startsWith('/')) {
    return new Response('This endpoint can only be used for relative previews', { status: 500 })
  }

  let user

  try {
    user = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })
  } catch (error) {
    payload.logger.error({ err: error }, 'Error verifying token for live preview')
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()
  const cookieStore = await cookies()

  if (!user) {
    draft.disable()
    cookieStore.delete(SPECIAL_TEMPLATE_PREVIEW_COOKIE)
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  draft.enable()

  const templatePreviewId = extractTemplatePreviewId(path)
  if (templatePreviewId) {
    cookieStore.set(SPECIAL_TEMPLATE_PREVIEW_COOKIE, templatePreviewId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })
  } else {
    cookieStore.delete(SPECIAL_TEMPLATE_PREVIEW_COOKIE)
  }

  redirect(path)
}
