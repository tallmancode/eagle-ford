/**
 * Parses calculator input accepting SA-style comma decimals and space thousands separators.
 * e.g. "149 907" → 149907, "11,25" → 11.25
 */
export function parseCalculatorNumber(value: string): number {
  const trimmed = value.trim()
  if (!trimmed) {
    return Number.NaN
  }

  const normalized = trimmed.replace(/\s/g, '').replace(',', '.')
  return Number.parseFloat(normalized)
}

export function formatCalculatorInteger(value: number): string {
  if (!Number.isFinite(value)) {
    return ''
  }

  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function formatCalculatorDecimal(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) {
    return ''
  }

  return value.toFixed(fractionDigits).replace('.', ',')
}
