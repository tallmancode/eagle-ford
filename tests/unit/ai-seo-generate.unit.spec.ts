import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@sentry/nextjs', () => ({
  withScope: (fn: (scope: { setTag: () => void; setContext: () => void }) => void) =>
    fn({ setTag: vi.fn(), setContext: vi.fn() }),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}))


import { generatePageSeo } from '@/lib/ai-seo/generatePageSeo'
import type { AnthropicMessagesClient } from '@/lib/ai-seo/generatePageSeo'
import type { Payload } from 'payload'

function createPayloadStub(args?: { spentUsd?: number; budget?: number }): Payload {
  const spentUsd = args?.spentUsd ?? 0
  const budget = args?.budget ?? 25

  return {
    logger: { error: vi.fn(), info: vi.fn() },
    findGlobal: vi.fn().mockResolvedValue({ aiSeoMonthlyBudgetUsd: budget }),
    find: vi.fn().mockResolvedValue({
      docs: spentUsd
        ? [{ inputTokens: 0, outputTokens: 0, estimatedCostUsd: spentUsd }]
        : [],
    }),
    create: vi.fn().mockResolvedValue({ id: 'usage-1' }),
  } as unknown as Payload
}

describe('generatePageSeo', () => {
  const previousKey = process.env.ANTHROPIC_API_KEY

  afterEach(() => {
    if (previousKey == null) delete process.env.ANTHROPIC_API_KEY
    else process.env.ANTHROPIC_API_KEY = previousKey
    vi.unstubAllGlobals()
  })

  it('falls back when the API key is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY
    const payload = createPayloadStub()

    const result = await generatePageSeo({
      doc: { title: 'About us', slug: 'about-us' },
      payload,
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe('not_configured')
    expect(result.fallbackTitle).toBe('About us')
    expect(payload.create).toHaveBeenCalled()
  })

  it('falls back when the monthly budget is exhausted', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-test'
    const payload = createPayloadStub({ spentUsd: 25, budget: 25 })
    const createClient = vi.fn()

    const result = await generatePageSeo({
      doc: { title: 'About us', slug: 'about-us' },
      payload,
      createClient,
    })

    expect(createClient).not.toHaveBeenCalled()
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe('budget_exceeded')
  })

  it('returns parsed title and description from the model', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-test'
    const payload = createPayloadStub()
    const client: AnthropicMessagesClient = {
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [
            {
              type: 'text',
              text: '{"title":"About Eagle Motor City | Eagle Motor City","description":"Visit Eagle Motor City in Bramley for Ford, Mazda, Suzuki and Mahindra sales and service."}',
            },
          ],
          usage: { input_tokens: 200, output_tokens: 80 },
        }),
      },
    }

    const result = await generatePageSeo({
      doc: {
        title: 'About us',
        slug: 'about-us',
        section: [{ blockType: 'heading', heading: 'Welcome to Bramley' }],
      },
      payload,
      createClient: () => client,
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.title).toContain('Eagle Motor City')
    expect(result.description.length).toBeGreaterThan(40)
    expect(payload.create).toHaveBeenCalled()
  })

  it('falls back when the model returns invalid JSON', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-test'
    const payload = createPayloadStub()
    const client: AnthropicMessagesClient = {
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [{ type: 'text', text: 'sorry, no json' }],
          usage: { input_tokens: 10, output_tokens: 5 },
        }),
      },
    }

    const result = await generatePageSeo({
      doc: { title: 'About us', slug: 'about-us' },
      payload,
      createClient: () => client,
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe('invalid_response')
    expect(result.fallbackTitle).toBe('About us')
  })
})
