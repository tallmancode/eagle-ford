import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchStockVehicle } from '@/lib/motor-city-stock/fetchStockVehicle'
import { CIRCUIT_OPEN_CODE } from '@/lib/motor-city-stock/upstreamCircuit'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'

const captureStockFetchEvent = vi.fn()

vi.mock('@/lib/motor-city-stock/sentry', () => ({
  captureStockFetchEvent: (...args: unknown[]) => captureStockFetchEvent(...args),
  safeApiHost: (baseUrl: string | undefined) => {
    if (!baseUrl) return undefined
    try {
      return new URL(baseUrl).host
    } catch {
      return undefined
    }
  },
}))

vi.mock('@/lib/motor-city-stock/fetchMotorCity', () => ({
  fetchMotorCityJson: vi.fn(),
}))

describe('fetchStockVehicle sentry reporting', () => {
  const originalEnv = { ...process.env }

  beforeEach(async () => {
    process.env.MOTOR_CITY_STOCK_API_URL = 'http://localhost:3000'
    process.env.MOTOR_CITY_STOCK_API_KEY = 'test-api-key'
    captureStockFetchEvent.mockClear()
    const { fetchMotorCityJson } = await import('@/lib/motor-city-stock/fetchMotorCity')
    vi.mocked(fetchMotorCityJson).mockReset()
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('does not capture Sentry for circuit-open fail-fast', async () => {
    const { fetchMotorCityJson } = await import('@/lib/motor-city-stock/fetchMotorCity')
    vi.mocked(fetchMotorCityJson).mockRejectedValue(
      new MotorCityStockError('Stock API temporarily unavailable (circuit open)', 503, {
        code: CIRCUIT_OPEN_CODE,
        retryable: true,
      }),
    )

    await expect(fetchStockVehicle({ cmsId: 'cms-1' })).rejects.toMatchObject({
      code: CIRCUIT_OPEN_CODE,
    })

    expect(captureStockFetchEvent).not.toHaveBeenCalled()
  })

  it('captures Sentry for upstream 502 after retries', async () => {
    const { fetchMotorCityJson } = await import('@/lib/motor-city-stock/fetchMotorCity')
    vi.mocked(fetchMotorCityJson).mockRejectedValue(
      new MotorCityStockError('Stock API request failed with status 502', 502, {
        code: 'HTTP_502',
        retryable: true,
      }),
    )

    await expect(fetchStockVehicle({ cmsId: 'cms-1' })).rejects.toMatchObject({
      status: 502,
    })

    expect(captureStockFetchEvent).toHaveBeenCalledTimes(1)
    expect(captureStockFetchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ status: 502 }),
      expect.objectContaining({
        event: 'stock_vehicle_failure',
        errorCode: 'HTTP_502',
        retryable: true,
      }),
    )
  })

  it('does not capture Sentry for expected 404', async () => {
    const { fetchMotorCityJson } = await import('@/lib/motor-city-stock/fetchMotorCity')
    vi.mocked(fetchMotorCityJson).mockRejectedValue(
      new MotorCityStockError('Vehicle not found', 404, {
        code: 'HTTP_404',
        retryable: false,
      }),
    )

    await expect(fetchStockVehicle({ cmsId: 'cms-gone' })).rejects.toMatchObject({
      status: 404,
    })

    expect(captureStockFetchEvent).not.toHaveBeenCalled()
  })
})
