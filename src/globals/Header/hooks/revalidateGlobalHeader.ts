import { revalidateTag } from 'next/cache.js'
import type { GlobalAfterChangeHook } from 'payload'

export const revalidateGlobalHeader: GlobalAfterChangeHook = ({
  doc,
  req: { context, payload },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating global header`)
  revalidateTag('global_header', 'max')
  return doc
}
