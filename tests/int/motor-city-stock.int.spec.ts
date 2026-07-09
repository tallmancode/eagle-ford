import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { buildStockUrl, fetchStock, getStockApiConfig } from '@/lib/motor-city-stock/fetchStock'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'

describe('motor-city-stock fetch utility', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.MOTOR_CITY_STOCK_API_URL = 'http://localhost:3000'
    process.env.MOTOR_CITY_STOCK_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
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
    })

    vi.stubGlobal('fetch', fetchMock)

    await fetchStock()

    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'http://localhost:3000/api/stock/EC167',
      }),
      expect.objectContaining({
        headers: {
          Authorization: 'stock-api-clients API-Key test-api-key',
        },
      }),
    )
  })

  it('throws MotorCityStockError for non-2xx responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Stock API request failed' }),
      }),
    )

    await expect(fetchStock()).rejects.toMatchObject({
      name: 'MotorCityStockError',
      status: 500,
      message: 'Stock API request failed',
    })
  })
})
