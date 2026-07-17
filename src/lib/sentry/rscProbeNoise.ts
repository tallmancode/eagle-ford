import type { ErrorEvent } from '@sentry/nextjs'

import { getErrorMessage } from './redactedRsc'

const ROUTER_STATE_PARSE_ERROR = 'The router state header was sent but could not be parsed'
const RSC_RESPONSE_INVARIANT = 'Expected RSC response, got text/plain'
const SERVER_ACTION_PROBE_RE = /Failed to find Server Action ["']([^"']+)["']/

/** Valid server action IDs are long encrypted hex strings; bot probes send short garbage like "x". */
const MIN_VALID_SERVER_ACTION_ID_LENGTH = 20

export const RSC_PROBE_NOISE_MESSAGES = [ROUTER_STATE_PARSE_ERROR, RSC_RESPONSE_INVARIANT] as const

export function isGarbageServerActionId(actionId: string): boolean {
  return actionId.length < MIN_VALID_SERVER_ACTION_ID_LENGTH
}

export function isRscProbeNoiseMessage(message: string | undefined | null): boolean {
  if (!message) return false

  if (message.includes(ROUTER_STATE_PARSE_ERROR)) return true
  if (message.includes(RSC_RESPONSE_INVARIANT)) return true

  const match = message.match(SERVER_ACTION_PROBE_RE)
  if (match?.[1] && isGarbageServerActionId(match[1])) {
    return true
  }

  return false
}

export function isRscProbeNoise(error: unknown): boolean {
  return isRscProbeNoiseMessage(getErrorMessage(error))
}

export function isRscProbeNoiseEvent(event: ErrorEvent): boolean {
  if (isRscProbeNoiseMessage(event.message)) return true

  return Boolean(event.exception?.values?.some((v) => isRscProbeNoiseMessage(v?.value)))
}

export function isDirectIpRequest(url: string | undefined): boolean {
  if (!url) return false

  try {
    const hostname = new URL(url).hostname
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
  } catch {
    return false
  }
}
