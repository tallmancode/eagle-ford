import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { buildStockUrl, fetchStock, getStockApiConfig } from '@/lib/motor-city-stock/fetchStock'
import { fetchMotorCityJson } from '@/lib/motor-city-stock/fetchMotorCity'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import { resetStockUpstreamCircuitState } from '@/lib/motor-city-stock/upstreamCircuit'

describe('motor-city-stock fetch utility', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.MOTOR_CITY_STOCK_API_URL = 'http://localhost:3000'
    process.env.MOTOR_CITY_STOCK_API_KEY = 'test-api-key'
    resetStockUpstreamCircuitState()
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    resetStockUpstreamCircuitState()
    vi.restoreAllMocks()
  })

  it('builds stock URL without brand key scoping', () => {
    const url = buildStockUrl('http://localhost:3000', {
      dealerCode: 'EC167',
      newUsed: 'NEW',
      minPrice: 100000,
      page: 2,
      limit: 12,
    })

    expect(url.toString()).toBe(
      'http://localhost:3000/api/stock/EC167?newUsed=NEW&minPrice=100000&page=2&limit=12',
    )
    expect(url.searchParams.get('brandKey')).toBeNull()
    expect(url.searchParams.get('brandKeys')).toBeNull()
  })

  it('requires stock API env configuration', () => {
    delete process.env.MOTOR_CITY_STOCK_API_URL

    expect(() => getStockApiConfig()).toThrow(MotorCityStockError)
  })

  it('sends API key authorization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        dealerCodes: ['EC167', 'EC170'],
        docs: [],
      }),
      headers: { get: () => null },
    })

    vi.stubGlobal('fetch', fetchMock)

    await fetchStock()

    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'http://localhost:3000/api/stock/EC167',
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'stock-api-clients API-Key test-api-key',
          Accept: 'application/json',
        }),
      }),
    )
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
        headers: { get: () => null },
        json: async () => ({ docs: [] }),
      })

    const sleep = vi.fn().mockResolvedValue(undefined)

    const result = await fetchMotorCityJson<{ docs: unknown[] }>({
      url: new URL('http://localhost:3000/api/stock/EC167'),
      apiKey: 'test-api-key',
      fetchImpl: fetchImpl as unknown as typeof fetch,
      sleep,
      random: () => 0,
    })

    expect(result.docs).toEqual([])
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(sleep).toHaveBeenCalledTimes(1)
  })

  it('throws MotorCityStockError for permanent non-2xx responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: { get: () => null },
        json: async () => ({ error: 'Stock API request failed' }),
      }),
    )

    await expect(fetchStock()).rejects.toMatchObject({
      name: 'MotorCityStockError',
      status: 400,
      message: 'Stock API request failed',
      retryable: false,
    })
  })
})
