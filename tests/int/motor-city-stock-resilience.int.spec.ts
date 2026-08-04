import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchMotorCityJson } from '@/lib/motor-city-stock/fetchMotorCity'
import {
  forgetLastGoodVehicle,
  getLastGoodVehicle,
  LAST_GOOD_VEHICLE_MAX_AGE_MS,
  rememberLastGoodVehicle,
  resetLastGoodVehicleCacheState,
} from '@/lib/motor-city-stock/lastGoodVehicleCache'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import {
  CIRCUIT_OPEN_CODE,
  isStockUpstreamCircuitOpen,
  resetStockUpstreamCircuitState,
  STOCK_UPSTREAM_CIRCUIT_OPEN_MS,
} from '@/lib/motor-city-stock/upstreamCircuit'
import type { MotorCityStockVehicle } from '@/lib/motor-city-stock/types'

function sampleVehicle(cmsId: string): MotorCityStockVehicle {
  return {
    id: 'doc-1',
    cmsId,
    sourceDealerCode: 'EC167',
    media: [],
  }
}

describe('motor-city-stock upstream circuit', () => {
  beforeEach(() => {
    resetStockUpstreamCircuitState()
  })

  afterEach(() => {
    resetStockUpstreamCircuitState()
    vi.restoreAllMocks()
  })

  it('opens after exhausted retryable failures and fail-fasts subsequent calls', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      headers: { get: () => null },
      json: async () => ({ error: 'Bad Gateway' }),
    })
    const sleep = vi.fn().mockResolvedValue(undefined)
    const now = vi.fn().mockReturnValue(1_000_000)

    await expect(
      fetchMotorCityJson({
        url: new URL('http://localhost:3000/api/stock/EC167'),
        apiKey: 'test-api-key',
        fetchImpl: fetchImpl as unknown as typeof fetch,
        sleep,
        random: () => 0,
        now,
      }),
    ).rejects.toMatchObject({
      name: 'MotorCityStockError',
      status: 502,
      retryable: true,
    })

    expect(fetchImpl).toHaveBeenCalledTimes(3)
    expect(isStockUpstreamCircuitOpen(1_000_000)).toBe(true)

    await expect(
      fetchMotorCityJson({
        url: new URL('http://localhost:3000/api/stock/EC167'),
        apiKey: 'test-api-key',
        fetchImpl: fetchImpl as unknown as typeof fetch,
        sleep,
        random: () => 0,
        now,
      }),
    ).rejects.toMatchObject({
      code: CIRCUIT_OPEN_CODE,
      status: 503,
      retryable: true,
    })

    // Fail-fast — no additional upstream calls while open.
    expect(fetchImpl).toHaveBeenCalledTimes(3)
  })

  it('closes on success and allows traffic again', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        headers: { get: () => null },
        json: async () => ({ error: 'Unavailable' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        headers: { get: () => null },
        json: async () => ({ error: 'Unavailable' }),
      })
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
    let clock = 1_000_000
    const now = () => clock

    await expect(
      fetchMotorCityJson({
        url: new URL('http://localhost:3000/api/stock/EC167'),
        apiKey: 'test-api-key',
        fetchImpl: fetchImpl as unknown as typeof fetch,
        sleep,
        random: () => 0,
        now,
      }),
    ).rejects.toMatchObject({ status: 503 })

    clock += STOCK_UPSTREAM_CIRCUIT_OPEN_MS

    const result = await fetchMotorCityJson<{ docs: unknown[] }>({
      url: new URL('http://localhost:3000/api/stock/EC167'),
      apiKey: 'test-api-key',
      fetchImpl: fetchImpl as unknown as typeof fetch,
      sleep,
      random: () => 0,
      now,
    })

    expect(result.docs).toEqual([])
    expect(isStockUpstreamCircuitOpen(clock)).toBe(false)
  })

  it('honors bypassCircuit while the circuit is open', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => null },
      json: async () => ({ ok: true }),
    })

    // Force-open via a failed call first.
    const failing = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      headers: { get: () => null },
      json: async () => ({}),
    })
    const sleep = vi.fn().mockResolvedValue(undefined)
    const now = () => 5_000_000

    await expect(
      fetchMotorCityJson({
        url: new URL('http://localhost:3000/api/stock/EC167'),
        apiKey: 'test-api-key',
        fetchImpl: failing as unknown as typeof fetch,
        sleep,
        random: () => 0,
        now,
        maxAttempts: 1,
      }),
    ).rejects.toMatchObject({ status: 502 })

    const result = await fetchMotorCityJson<{ ok: boolean }>({
      url: new URL('http://localhost:3000/api/stock/EC167'),
      apiKey: 'test-api-key',
      fetchImpl: fetchImpl as unknown as typeof fetch,
      sleep,
      random: () => 0,
      now,
      bypassCircuit: true,
    })

    expect(result.ok).toBe(true)
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it('does not open the shared circuit when openCircuitOnFailure is false', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      headers: { get: () => null },
      json: async () => ({ error: 'Bad Gateway' }),
    })
    const sleep = vi.fn().mockResolvedValue(undefined)
    const now = vi.fn().mockReturnValue(2_000_000)

    await expect(
      fetchMotorCityJson({
        url: new URL('http://localhost:3000/api/stock/EC167/vehicles/cms-1'),
        apiKey: 'test-api-key',
        fetchImpl: fetchImpl as unknown as typeof fetch,
        sleep,
        random: () => 0,
        now,
        maxAttempts: 1,
        openCircuitOnFailure: false,
      }),
    ).rejects.toMatchObject({ status: 502, retryable: true })

    expect(isStockUpstreamCircuitOpen(2_000_000)).toBe(false)
  })
})

describe('motor-city-stock last-good vehicle cache', () => {
  beforeEach(() => {
    resetLastGoodVehicleCacheState()
  })

  afterEach(() => {
    resetLastGoodVehicleCacheState()
  })

  it('returns remembered vehicles within the max age', () => {
    const vehicle = sampleVehicle('cms-1')
    rememberLastGoodVehicle('EC167', 'cms-1', vehicle, 1_000)

    expect(getLastGoodVehicle('EC167', 'cms-1', 1_000 + 60_000)).toEqual(vehicle)
  })

  it('expires and forgets stale entries', () => {
    const vehicle = sampleVehicle('cms-2')
    rememberLastGoodVehicle('EC167', 'cms-2', vehicle, 1_000)

    expect(
      getLastGoodVehicle('EC167', 'cms-2', 1_000 + LAST_GOOD_VEHICLE_MAX_AGE_MS + 1),
    ).toBeNull()
  })

  it('forgets on explicit removal (e.g. upstream 404)', () => {
    rememberLastGoodVehicle('EC167', 'cms-3', sampleVehicle('cms-3'), 1_000)
    forgetLastGoodVehicle('EC167', 'cms-3')
    expect(getLastGoodVehicle('EC167', 'cms-3', 1_000)).toBeNull()
  })
})

describe('MotorCityStockError circuit open shape', () => {
  it('marks circuit-open as retryable 503', () => {
    const error = new MotorCityStockError('circuit', 503, {
      code: CIRCUIT_OPEN_CODE,
      retryable: true,
    })
    expect(error.retryable).toBe(true)
    expect(error.code).toBe(CIRCUIT_OPEN_CODE)
  })
})

describe('loadStockVehicleWithFallback', () => {
  beforeEach(() => {
    resetLastGoodVehicleCacheState()
  })

  afterEach(() => {
    resetLastGoodVehicleCacheState()
    vi.restoreAllMocks()
  })

  it('serves last-good vehicle when upstream returns retryable 502', async () => {
    const vehicle = sampleVehicle('cms-stale')
    rememberLastGoodVehicle('EC167', 'cms-stale', vehicle, Date.now())

    vi.spyOn(
      await import('@/lib/motor-city-stock/fetchStockVehicle'),
      'fetchStockVehicle',
    ).mockRejectedValue(
      new MotorCityStockError('Stock API request failed with status 502', 502, {
        code: 'HTTP_502',
        retryable: true,
      }),
    )

    const { loadStockVehicleWithFallback } = await import(
      '@/lib/motor-city-stock/getCachedStockVehicle'
    )

    await expect(loadStockVehicleWithFallback({ cmsId: 'cms-stale' })).resolves.toEqual(vehicle)
  })

  it('rethrows retryable errors when no last-good is available', async () => {
    vi.spyOn(
      await import('@/lib/motor-city-stock/fetchStockVehicle'),
      'fetchStockVehicle',
    ).mockRejectedValue(
      new MotorCityStockError('Stock API request failed with status 502', 502, {
        code: 'HTTP_502',
        retryable: true,
      }),
    )

    const { loadStockVehicleWithFallback } = await import(
      '@/lib/motor-city-stock/getCachedStockVehicle'
    )

    await expect(loadStockVehicleWithFallback({ cmsId: 'cms-cold' })).rejects.toMatchObject({
      status: 502,
      retryable: true,
    })
  })
})

describe('fetchStock warms last-good from list docs', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.MOTOR_CITY_STOCK_API_URL = 'http://localhost:3000'
    process.env.MOTOR_CITY_STOCK_API_KEY = 'test-api-key'
    resetLastGoodVehicleCacheState()
    resetStockUpstreamCircuitState()
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    resetLastGoodVehicleCacheState()
    resetStockUpstreamCircuitState()
    vi.restoreAllMocks()
  })

  it('remembers vehicles from a successful list response', async () => {
    const vehicle = sampleVehicle('cms-from-list')
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => null },
      json: async () => ({
        dealerCode: 'EC167',
        docs: [vehicle],
      }),
    })
    vi.stubGlobal('fetch', fetchImpl)

    const { fetchStock } = await import('@/lib/motor-city-stock/fetchStock')
    await fetchStock({ dealerCode: 'EC167' })

    expect(getLastGoodVehicle('EC167', 'cms-from-list')).toEqual(vehicle)
  })
})
