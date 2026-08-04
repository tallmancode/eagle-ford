import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { submitSiteFormLead } from '@/lib/motor-city-leads/submitLead'
import { MotorCityLeadsError } from '@/lib/motor-city-leads/types'

const leadBody = {
  extLeadRef: 'sub-1',
  siteKey: 'eagle-ford',
  dealerRef: 'EC167',
  dealerFloor: 'NEWFORD',
  source: 'EAGLE-DEALERWEBSITE',
  contact: { firstName: 'Jane', surname: 'Doe', cellPhone: '0821234567' },
  seeks: { used: '0', brand: 'Ford', model: 'Ranger' },
}

describe('submitSiteFormLead', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.MOTOR_CITY_STOCK_API_URL = 'http://localhost:3000'
    process.env.MOTOR_CITY_STOCK_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.restoreAllMocks()
  })

  it('retries transient 503 then succeeds', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        headers: { get: () => null },
        json: async () => ({ error: 'Unavailable' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: { get: () => null },
        json: async () => ({ id: 'lead-1', status: 'queued', created: true }),
      })

    const sleep = vi.fn().mockResolvedValue(undefined)

    const result = await submitSiteFormLead(leadBody, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      sleep,
      random: () => 0,
    })

    expect(result.id).toBe('lead-1')
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(sleep).toHaveBeenCalledTimes(1)
  })

  it('does not retry permanent 400', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => null },
      json: async () => ({ error: 'Invalid', code: 'VALIDATION' }),
    })

    await expect(
      submitSiteFormLead(leadBody, {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        sleep: async () => undefined,
      }),
    ).rejects.toMatchObject({
      name: 'MotorCityLeadsError',
      status: 400,
      retryable: false,
    } satisfies Partial<MotorCityLeadsError>)

    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })
})
