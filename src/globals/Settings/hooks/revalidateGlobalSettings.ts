import { revalidateTag } from 'next/cache.js'
import type { GlobalAfterChangeHook } from 'payload'

export const revalidateGlobalSettings: GlobalAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating global settings`)
  revalidateTag('global_global-settings', 'max')
  return doc
}
