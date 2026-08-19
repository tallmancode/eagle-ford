export const DEFAULT_SEO_MODEL = 'claude-sonnet-4-5'
export const DEFAULT_MONTHLY_BUDGET_USD = 25
export const GENERATE_TIMEOUT_MS = 20_000
export const MAX_OUTPUT_TOKENS = 400

export function getAnthropicApiKey(): string | null {
  const key = process.env.ANTHROPIC_API_KEY?.trim()
  return key ? key : null
}

export function isAnthropicConfigured(): boolean {
  return Boolean(getAnthropicApiKey())
}

export function getSeoModel(): string {
  const model = process.env.ANTHROPIC_SEO_MODEL?.trim()
  return model || DEFAULT_SEO_MODEL
}

export function parseBudgetUsd(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed) && parsed >= 0) return parsed
  }
  return null
}

export function resolveMonthlyBudgetUsd(cmsBudget?: unknown): number {
  const fromEnv = parseBudgetUsd(process.env.AI_SEO_MONTHLY_BUDGET_USD)
  if (fromEnv != null) return fromEnv
  const fromCms = parseBudgetUsd(cmsBudget)
  if (fromCms != null) return fromCms
  return DEFAULT_MONTHLY_BUDGET_USD
}
