import { headers } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'
import { getSeoModel, isAnthropicConfigured, resolveMonthlyBudgetUsd } from '@/lib/ai-seo/config'
import { getMonthUsageSummary, getRecentAiSeoUsage } from '@/lib/ai-seo/usage'
import { isPayloadUser } from '@/lib/utils/accessUtil'

/**
 * Developer-only snapshot of AI SEO token usage and remaining monthly budget.
 */
export async function GET(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!isPayloadUser(user) || !user.roles?.includes('developer')) {
    return Response.json({ ok: false, message: 'Action forbidden.' }, { status: 403 })
  }

  let cmsBudget: unknown
  try {
    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
      overrideAccess: true,
    })
    cmsBudget = (settings as { aiSeoMonthlyBudgetUsd?: unknown }).aiSeoMonthlyBudgetUsd
  } catch {
    cmsBudget = undefined
  }

  const monthlyBudgetUsd = resolveMonthlyBudgetUsd(cmsBudget)
  const month = await getMonthUsageSummary(payload)
  const recent = await getRecentAiSeoUsage(payload, 20)
  const remainingUsd = Math.max(0, monthlyBudgetUsd - month.estimatedCostUsd)

  return Response.json({
    ok: true,
    configured: isAnthropicConfigured(),
    model: getSeoModel(),
    monthlyBudgetUsd,
    spentUsd: month.estimatedCostUsd,
    remainingUsd,
    inputTokens: month.inputTokens,
    outputTokens: month.outputTokens,
    generationCount: month.count,
    recent,
  })
}
