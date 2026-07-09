import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { buildStockUrl, fetchStock, getStockApiConfig } from '@/lib/motor-city-stock/fetchStock'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'

describe('motor-city-stock fetch utility', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.MOTOR_CITY_STOCK_API_URL = 'http://localhost:3000'
    process.env.MOTOR_CITY_STOCK_API_KEY = 'test-api-key'
    process.env.MOTOR_CITY_STOCK_BRAND_KEY = 'ford'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.restoreAllMocks()
  })

  it('builds stock URL with brandKey and filters', () => {
    const url = buildStockUrl('http://localhost:3000', {
      dealerCode: 'EC167',
      brandKey: 'ford',
      newUsed: 'NEW',
      minPrice: 100000,
      page: 2,
      limit: 12,
    })

    expect(url.toString()).toBe(
      'http://localhost:3000/api/stock/EC167?brandKey=ford&newUsed=NEW&minPrice=100000&page=2&limit=12',
    )
  })

  it('requires stock API env configuration', () => {
    delete process.env.MOTOR_CITY_STOCK_API_URL

    expect(() => getStockApiConfig()).toThrow(MotorCityStockError)
  })

  it('sends API key authorization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        dealerCode: 'EC167',
        brandKey: 'ford',
        docs: [],
      }),
    })

    vi.stubGlobal('fetch', fetchMock)

    await fetchStock({ brandKey: 'ford' })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'http://localhost:3000/api/stock/EC167?brandKey=ford',
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
        status: 403,
        json: async () => ({ error: 'Client is not authorized for brandKey: mahindra' }),
      }),
    )

    await expect(fetchStock({ brandKey: 'mahindra' })).rejects.toMatchObject({
      name: 'MotorCityStockError',
      status: 403,
      message: 'Client is not authorized for brandKey: mahindra',
    })
  })
})
