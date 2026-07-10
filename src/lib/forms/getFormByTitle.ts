import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Form } from '@/payload-types'

export const getFormByTitle = cache(async (title: string): Promise<Form | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'forms',
    where: {
      title: {
        equals: title,
      },
    },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })

  return result.docs[0] ?? null
})
