/**
 * Process-local circuit breaker for Motor City stock HTTP.
 * After retries are exhausted on a retryable failure, short-circuit further
 * calls so Ford does not thundering-herd a sick upstream (common 502 pattern).
 */

export const STOCK_UPSTREAM_CIRCUIT_OPEN_MS = 60_000

export const CIRCUIT_OPEN_CODE = 'CIRCUIT_OPEN'

let openUntilMs = 0

export function isStockUpstreamCircuitOpen(nowMs: number = Date.now()): boolean {
  return nowMs < openUntilMs
}

export function openStockUpstreamCircuit(
  durationMs: number = STOCK_UPSTREAM_CIRCUIT_OPEN_MS,
  nowMs: number = Date.now(),
): void {
  openUntilMs = Math.max(openUntilMs, nowMs + durationMs)
}

export function closeStockUpstreamCircuit(): void {
  openUntilMs = 0
}

/** Test helper — clears circuit state. */
export function resetStockUpstreamCircuitState(): void {
  openUntilMs = 0
}
