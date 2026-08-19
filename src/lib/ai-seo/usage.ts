import type { Payload, PayloadRequest } from 'payload'

import { estimateCostUsd } from '@/lib/ai-seo/pricing'

export const AI_SEO_USAGE_SLUG = 'ai-seo-usage' as const

export type AiSeoUsageStatus = 'success' | 'fallback' | 'error'

export type AiSeoUsageLogInput = {
  payload: Payload
  req?: PayloadRequest
  userId?: string | null
  collectionSlug?: string | null
  docId?: string | null
  slug?: string | null
  status: AiSeoUsageStatus
  model?: string | null
  inputTokens?: number | null
  outputTokens?: number | null
  errorCode?: string | null
}

export type MonthUsageSummary = {
  inputTokens: number
  outputTokens: number
  estimatedCostUsd: number
  count: number
}

function startOfUtcMonth(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))
}

export async function logAiSeoUsage(input: AiSeoUsageLogInput): Promise<void> {
  const inputTokens = input.inputTokens ?? 0
  const outputTokens = input.outputTokens ?? 0
  const estimatedCostUsd =
    input.model && (inputTokens > 0 || outputTokens > 0)
      ? estimateCostUsd({
          model: input.model,
          inputTokens,
          outputTokens,
        })
      : 0

  try {
    await input.payload.create({
      collection: AI_SEO_USAGE_SLUG,
      data: {
        collectionSlug: input.collectionSlug ?? undefined,
        docId: input.docId ?? undefined,
        slug: input.slug ?? undefined,
        user: input.userId ?? undefined,
        status: input.status,
        model: input.model ?? undefined,
        inputTokens,
        outputTokens,
        estimatedCostUsd,
        errorCode: input.errorCode ?? undefined,
      },
      req: input.req,
      overrideAccess: true,
    })
  } catch (error) {
    input.payload.logger.error({ err: error, msg: 'Failed to log AI SEO usage' })
  }
}

export async function getMonthUsageSummary(
  payload: Payload,
  now = new Date(),
): Promise<MonthUsageSummary> {
  const since = startOfUtcMonth(now).toISOString()

  const result = await payload.find({
    collection: AI_SEO_USAGE_SLUG,
    where: {
      createdAt: {
        greater_than_equal: since,
      },
    },
    depth: 0,
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    sort: '-createdAt',
  })

  let inputTokens = 0
  let outputTokens = 0
  let estimatedCostUsd = 0

  for (const doc of result.docs) {
    inputTokens += typeof doc.inputTokens === 'number' ? doc.inputTokens : 0
    outputTokens += typeof doc.outputTokens === 'number' ? doc.outputTokens : 0
    estimatedCostUsd += typeof doc.estimatedCostUsd === 'number' ? doc.estimatedCostUsd : 0
  }

  return {
    inputTokens,
    outputTokens,
    estimatedCostUsd: Math.round(estimatedCostUsd * 1_000_000) / 1_000_000,
    count: result.docs.length,
  }
}

export type RecentAiSeoUsage = {
  id: string
  createdAt: string
  slug?: string | null
  status: AiSeoUsageStatus
  inputTokens: number
  outputTokens: number
  estimatedCostUsd: number
  errorCode?: string | null
}

export async function getRecentAiSeoUsage(
  payload: Payload,
  limit = 20,
): Promise<RecentAiSeoUsage[]> {
  const result = await payload.find({
    collection: AI_SEO_USAGE_SLUG,
    depth: 0,
    limit,
    sort: '-createdAt',
    overrideAccess: true,
  })

  return result.docs.map((doc) => ({
    id: String(doc.id),
    createdAt: typeof doc.createdAt === 'string' ? doc.createdAt : '',
    slug: typeof doc.slug === 'string' ? doc.slug : null,
    status: (doc.status as AiSeoUsageStatus) ?? 'error',
    inputTokens: typeof doc.inputTokens === 'number' ? doc.inputTokens : 0,
    outputTokens: typeof doc.outputTokens === 'number' ? doc.outputTokens : 0,
    estimatedCostUsd: typeof doc.estimatedCostUsd === 'number' ? doc.estimatedCostUsd : 0,
    errorCode: typeof doc.errorCode === 'string' ? doc.errorCode : null,
  }))
}
