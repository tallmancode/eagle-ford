import { describe, expect, it } from 'vitest'

import {
  INVALID_QUERY_JSON_MESSAGE,
  isInvalidQueryJsonError,
  remapInvalidQueryJsonError,
  invalidQueryJsonAfterError,
} from '@/lib/payload/invalidQueryJsonError'

describe('invalidQueryJsonError', () => {
  it('detects SyntaxErrors from JSON.parse of fuzzed where values', () => {
    let parseError: unknown
    try {
      JSON.parse(';')
    } catch (error) {
      parseError = error
    }

    expect(isInvalidQueryJsonError(parseError)).toBe(true)
    expect(isInvalidQueryJsonError(new Error('Something went wrong.'))).toBe(false)
    expect(isInvalidQueryJsonError(new SyntaxError('Unexpected identifier'))).toBe(false)
  })

  it('remaps to HTTP 400 and stamps error.status for the Sentry plugin', () => {
    const error = new SyntaxError(`Unexpected token ';', ";" is not valid JSON`)
    const result = remapInvalidQueryJsonError(error)

    expect(result).toEqual({
      status: 400,
      response: {
        errors: [{ message: INVALID_QUERY_JSON_MESSAGE }],
      },
    })
    expect((error as Error & { status?: number }).status).toBe(400)
  })

  it('afterError hook returns undefined for unrelated errors', async () => {
    const result = await invalidQueryJsonAfterError({
      error: new Error('db down'),
      context: {},
      req: {} as never,
    })

    expect(result).toBeUndefined()
  })

  it('afterError hook remaps matching SyntaxErrors', async () => {
    const error = new SyntaxError(`Unexpected token ';', ";" is not valid JSON`)
    const result = await invalidQueryJsonAfterError({
      error,
      context: {},
      req: {} as never,
    })

    expect(result?.status).toBe(400)
    expect((error as Error & { status?: number }).status).toBe(400)
  })
})
