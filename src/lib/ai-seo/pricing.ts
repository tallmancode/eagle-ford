/**
 * Approximate Anthropic list prices (USD per million tokens).
 * Update when Anthropic reprices — remaining budget in Diagnostics uses these rates.
 */
const MODEL_RATES: Record<string, { inputPerMTok: number; outputPerMTok: number }> = {
  'claude-sonnet-4-5': { inputPerMTok: 3, outputPerMTok: 15 },
  'claude-sonnet-4-6': { inputPerMTok: 3, outputPerMTok: 15 },
  'claude-sonnet-4': { inputPerMTok: 3, outputPerMTok: 15 },
  'claude-haiku-4-5': { inputPerMTok: 1, outputPerMTok: 5 },
  'claude-haiku-4': { inputPerMTok: 1, outputPerMTok: 5 },
  'claude-opus-4-5': { inputPerMTok: 15, outputPerMTok: 75 },
  'claude-opus-4': { inputPerMTok: 15, outputPerMTok: 75 },
}

const DEFAULT_RATES = MODEL_RATES['claude-sonnet-4-5']

export function resolveModelRates(model: string): { inputPerMTok: number; outputPerMTok: number } {
  const exact = MODEL_RATES[model]
  if (exact) return exact

  const stem = Object.keys(MODEL_RATES).find((key) => model.startsWith(key))
  if (stem) return MODEL_RATES[stem]

  return DEFAULT_RATES
}

export function estimateCostUsd(args: {
  model: string
  inputTokens: number
  outputTokens: number
}): number {
  const rates = resolveModelRates(args.model)
  const input = Math.max(0, args.inputTokens)
  const output = Math.max(0, args.outputTokens)
  const usd = (input / 1_000_000) * rates.inputPerMTok + (output / 1_000_000) * rates.outputPerMTok
  return Math.round(usd * 1_000_000) / 1_000_000
}
