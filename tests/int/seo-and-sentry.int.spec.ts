import { describe, expect, it } from 'vitest'

import { scrubForSentry } from '@/lib/motor-city-leads/sentry'

describe('scrubForSentry', () => {
  it('redacts PII and secret keys', () => {
    const scrubbed = scrubForSentry({
      formSubmissionId: 'abc',
      email: 'jane@example.com',
      cellPhone: '082',
      apiKey: 'secret',
      nested: { firstName: 'Jane', code: 'TIMEOUT' },
    }) as Record<string, unknown>

    expect(scrubbed.formSubmissionId).toBe('abc')
    expect(scrubbed.email).toBe('[redacted]')
    expect(scrubbed.cellPhone).toBe('[redacted]')
    expect(scrubbed.apiKey).toBe('[redacted]')
    expect((scrubbed.nested as Record<string, unknown>).firstName).toBe('[redacted]')
    expect((scrubbed.nested as Record<string, unknown>).code).toBe('TIMEOUT')
  })
})
