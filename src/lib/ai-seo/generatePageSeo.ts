import Anthropic from '@anthropic-ai/sdk'
import type { Payload, PayloadRequest } from 'payload'

import {
  GENERATE_TIMEOUT_MS,
  MAX_OUTPUT_TOKENS,
  getAnthropicApiKey,
  getSeoModel,
  isAnthropicConfigured,
  resolveMonthlyBudgetUsd,
} from '@/lib/ai-seo/config'
import { extractPageContent } from '@/lib/ai-seo/extractPageContent'
import { fallbackSeoDescription, fallbackSeoTitle } from '@/lib/ai-seo/fallbacks'
import { SEO_SYSTEM_PROMPT, buildSeoUserPrompt } from '@/lib/ai-seo/prompts'
import { extractTextFromAnthropicContent, parseSeoJson } from '@/lib/ai-seo/parseSeoJson'
import { captureAiSeoEvent } from '@/lib/ai-seo/sentry'
import { getMonthUsageSummary, logAiSeoUsage } from '@/lib/ai-seo/usage'
import { getPagePath } from '@/lib/utils/getPagePath'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import { isPayloadUser } from '@/lib/utils/accessUtil'

export type GeneratePageSeoReason =
  | 'not_configured'
  | 'budget_exceeded'
  | 'timeout'
  | 'invalid_response'
  | 'api_error'

export type GeneratePageSeoSuccess = {
  ok: true
  title: string
  description: string
  model: string
  inputTokens: number
  outputTokens: number
}

export type GeneratePageSeoFailure = {
  ok: false
  reason: GeneratePageSeoReason
  message: string
  fallbackTitle: string
  fallbackDescription: string
}

export type GeneratePageSeoResult = GeneratePageSeoSuccess | GeneratePageSeoFailure

type PageDoc = {
  id?: unknown
  title?: unknown
  slug?: unknown
  section?: unknown
  excerpt?: unknown
}

export type AnthropicMessageCreateResult = {
  content: unknown
  usage?: { input_tokens?: number; output_tokens?: number }
}

export type AnthropicMessagesClient = {
  messages: {
    create: (
      body: {
        model: string
        max_tokens: number
        system: string
        messages: Array<{ role: 'user'; content: string }>
      },
      options?: { signal?: AbortSignal; timeout?: number; maxRetries?: number },
    ) => Promise<AnthropicMessageCreateResult>
  }
}

export type GeneratePageSeoArgs = {
  doc: PageDoc | null | undefined
  payload: Payload
  req?: PayloadRequest
  userId?: string | null
  collectionSlug?: string | null
  createClient?: () => AnthropicMessagesClient | null
  now?: Date
}

function pageUrlFor(doc: PageDoc | null | undefined): string {
  const base = getServerSideURL()
  if (!doc || typeof doc.slug !== 'string' || !doc.slug) return base
  return `${base}${getPagePath({ slug: doc.slug })}`
}

function isRetryableStatus(status: number | undefined): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 529
}

function readErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined
  if ('status' in error && typeof (error as { status?: unknown }).status === 'number') {
    return (error as { status: number }).status
  }
  return undefined
}

function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const name = 'name' in error ? String((error as { name?: unknown }).name) : ''
  return (
    name === 'AbortError' ||
    name === 'APIUserAbortError' ||
    name === 'TimeoutError' ||
    name === 'APIConnectionTimeoutError'
  )
}

async function createMessageWithRetry(
  client: AnthropicMessagesClient,
  body: {
    model: string
    max_tokens: number
    system: string
    messages: Array<{ role: 'user'; content: string }>
  },
  timeoutMs: number,
): Promise<AnthropicMessageCreateResult> {
  let lastError: unknown

  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      return await client.messages.create(body, {
        signal: controller.signal,
        timeout: timeoutMs,
        maxRetries: 0,
      })
    } catch (error) {
      lastError = error
      if (isTimeoutError(error)) throw error
      const status = readErrorStatus(error)
      if (attempt === 0 && isRetryableStatus(status)) {
        await sleep(400 + Math.random() * 200)
        continue
      }
      throw error
    } finally {
      clearTimeout(timer)
    }
  }

  throw lastError
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function defaultCreateClient(): AnthropicMessagesClient | null {
  const apiKey = getAnthropicApiKey()
  if (!apiKey) return null
  return new Anthropic({ apiKey }) as unknown as AnthropicMessagesClient
}

export async function generatePageSeo(args: GeneratePageSeoArgs): Promise<GeneratePageSeoResult> {
  const { doc, payload, req } = args
  const collectionSlug = args.collectionSlug ?? 'pages'
  const slug = typeof doc?.slug === 'string' ? doc.slug : null
  const docId = doc?.id != null ? String(doc.id) : null
  const userId = args.userId ?? (isPayloadUser(req?.user) ? req.user.id : null)
  const fallbackTitle = fallbackSeoTitle(doc)
  const fallbackDescription = fallbackSeoDescription(doc)
  const model = getSeoModel()

  const fail = async (
    reason: GeneratePageSeoReason,
    message: string,
    error?: unknown,
  ): Promise<GeneratePageSeoFailure> => {
    await logAiSeoUsage({
      payload,
      req,
      userId,
      collectionSlug,
      docId,
      slug,
      status: reason === 'not_configured' || reason === 'budget_exceeded' ? 'fallback' : 'error',
      model,
      errorCode: reason,
    })
    if (reason !== 'not_configured') {
      captureAiSeoEvent({ error, reason, collectionSlug, slug, detail: message })
    }
    return {
      ok: false,
      reason,
      message,
      fallbackTitle,
      fallbackDescription,
    }
  }

  if (!isAnthropicConfigured()) {
    return fail(
      'not_configured',
      'AI SEO is not configured. Set ANTHROPIC_API_KEY on the server and try again.',
    )
  }

  let monthlyBudget = resolveMonthlyBudgetUsd()
  try {
    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
      overrideAccess: true,
    })
    monthlyBudget = resolveMonthlyBudgetUsd(
      (settings as { aiSeoMonthlyBudgetUsd?: unknown }).aiSeoMonthlyBudgetUsd,
    )
  } catch {
    // Settings read is best-effort — env / default budget still apply.
  }

  try {
    const month = await getMonthUsageSummary(payload, args.now)
    if (month.estimatedCostUsd >= monthlyBudget) {
      return fail(
        'budget_exceeded',
        'This month’s AI SEO budget has been reached. Ask a developer to raise the budget or wait until next month.',
      )
    }
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Failed to load AI SEO usage for budget check' })
  }

  const createClient = args.createClient ?? defaultCreateClient
  const client = createClient()

  if (!client) {
    return fail(
      'not_configured',
      'AI SEO is not configured. Set ANTHROPIC_API_KEY on the server and try again.',
    )
  }

  const extracted = extractPageContent(doc)

  try {
    const message = await createMessageWithRetry(
      client,
      {
        model,
        max_tokens: MAX_OUTPUT_TOKENS,
        system: SEO_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: buildSeoUserPrompt({
              pageUrl: pageUrlFor(doc),
              content: extracted.text || '(No page body content yet.)',
              truncated: extracted.truncated,
            }),
          },
        ],
      },
      GENERATE_TIMEOUT_MS,
    )

    const parsed = parseSeoJson(extractTextFromAnthropicContent(message.content))
    const inputTokens = message.usage?.input_tokens ?? 0
    const outputTokens = message.usage?.output_tokens ?? 0

    if (!parsed) {
      await logAiSeoUsage({
        payload,
        req,
        userId,
        collectionSlug,
        docId,
        slug,
        status: 'error',
        model,
        inputTokens,
        outputTokens,
        errorCode: 'invalid_response',
      })
      captureAiSeoEvent({
        reason: 'invalid_response',
        collectionSlug,
        slug,
        detail: 'Model did not return title and description JSON',
      })
      return {
        ok: false,
        reason: 'invalid_response',
        message: 'AI returned an unusable response. Existing SEO fields were left unchanged.',
        fallbackTitle,
        fallbackDescription,
      }
    }

    await logAiSeoUsage({
      payload,
      req,
      userId,
      collectionSlug,
      docId,
      slug,
      status: 'success',
      model,
      inputTokens,
      outputTokens,
    })

    return {
      ok: true,
      title: parsed.title,
      description: parsed.description,
      model,
      inputTokens,
      outputTokens,
    }
  } catch (error) {
    if (isTimeoutError(error)) {
      return fail('timeout', 'AI SEO timed out. Try again in a moment.', error)
    }

    const status = readErrorStatus(error)
    const message =
      status != null
        ? `Anthropic request failed (HTTP ${status}). Try again later.`
        : 'Anthropic request failed. Try again later.'

    return fail('api_error', message, error)
  }
}
