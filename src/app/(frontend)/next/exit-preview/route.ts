import { cookies, draftMode } from 'next/headers'

import { SPECIAL_TEMPLATE_PREVIEW_COOKIE } from '@/lib/specials/templatePreviewCookie'

export async function GET(): Promise<Response> {
  const draft = await draftMode()
  draft.disable()
  const cookieStore = await cookies()
  cookieStore.delete(SPECIAL_TEMPLATE_PREVIEW_COOKIE)
  return new Response('Draft mode is disabled')
}
