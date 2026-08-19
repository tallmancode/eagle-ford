import { describe, expect, it } from 'vitest'

import { toJsonSafe } from '@/lib/ai-seo/toJsonSafe'

describe('toJsonSafe', () => {
  it('strips circular Payload-like objects so JSON.stringify can succeed', () => {
    const payload = { config: {}, collections: {}, find: () => undefined } as {
      config: object
      collections: object
      find: () => undefined
      db?: { payload?: unknown }
    }
    payload.db = { payload }

    const result = toJsonSafe({
      title: 'About',
      slug: 'about-us',
      payload,
      nested: { self: payload },
    })

    expect(result).toEqual({
      title: 'About',
      slug: 'about-us',
      nested: {},
    })
  })
})
