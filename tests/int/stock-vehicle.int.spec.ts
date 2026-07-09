import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { buildStockVehicleUrl, fetchStockVehicle } from '@/lib/motor-city-stock/fetchStockVehicle'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import {
  buildStockVehiclePath,
  getStockNumberForPath,
  getStockVehicleCmsIdFromSlug,
  parseStockVehicleSlug,
} from '@/lib/stock-vehicle/paths'

describe('stock vehicle paths', () => {
  it('builds showroom path from stock number and cmsId', () => {
    expect(
      buildStockVehiclePath({
        stockNo: '752',
        stockNoDisplay: null,
        cmsId: 'ec170df60use14458',
      }),
    ).toBe('/showroom/752-ec170df60use14458')
  })

  it('prefers stockNoDisplay over stockNo', () => {
    expect(
      getStockNumberForPath({
        stockNo: '752',
        stockNoDisplay: 'EC752',
        cmsId: 'ec170df60use14458',
      }),
    ).toBe('EC752')
  })

  it('parses slug into stock number and cmsId', () => {
    expect(parseStockVehicleSlug('752-ec170df60use14458')).toEqual({
      stockNo: '752',
      cmsId: 'ec170df60use14458',
    })
  })

  it('returns cmsId from slug', () => {
    expect(getStockVehicleCmsIdFromSlug('752-ec170df60use14458')).toBe('ec170df60use14458')
  })

  it('returns null for invalid slug', () => {
    expect(parseStockVehicleSlug('invalidslug')).toBeNull()
    expect(getStockVehicleCmsIdFromSlug('invalidslug')).toBeNull()
  })
})

describe('fetchStockVehicle', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.MOTOR_CITY_STOCK_API_URL = 'http://localhost:3000'
    process.env.MOTOR_CITY_STOCK_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.restoreAllMocks()
  })

  it('builds single vehicle URL', () => {
    const url = buildStockVehicleUrl('http://localhost:3000', {
      dealerCode: 'EC167',
      cmsId: 'ec170df60use14458',
    })

    expect(url.toString()).toBe('http://localhost:3000/api/stock/EC167/vehicles/ec170df60use14458')
  })

  it('sends API key authorization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        dealerCode: 'EC167',
        vehicle: {
          id: '1',
          cmsId: 'ec170df60use14458',
          sourceDealerCode: 'EC170',
          media: [],
        },
      }),
    })

    vi.stubGlobal('fetch', fetchMock)

    await fetchStockVehicle({ cmsId: 'ec170df60use14458' })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'http://localhost:3000/api/stock/EC167/vehicles/ec170df60use14458',
      }),
      expect.objectContaining({
        headers: {
          Authorization: 'stock-api-clients API-Key test-api-key',
        },
      }),
    )
  })

  it('throws MotorCityStockError for 404 responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Vehicle not found' }),
      }),
    )

    await expect(fetchStockVehicle({ cmsId: 'missing' })).rejects.toBeInstanceOf(
      MotorCityStockError,
    )
  })
})
