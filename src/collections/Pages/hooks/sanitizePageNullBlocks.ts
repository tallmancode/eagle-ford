import type { CollectionBeforeChangeHook } from 'payload'

import { sanitizeNullBlocks } from '@/lib/utils/sanitizeNullBlocks'

export const sanitizePageNullBlocks: CollectionBeforeChangeHook = ({ data }) => {
  return sanitizeNullBlocks(data)
}
