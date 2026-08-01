import type { ErrorEvent } from '@sentry/nextjs'

import { getErrorMessage } from './redactedRsc'

/**
 * Node.js TransformStream cancel/write race (nodejs/node#62036).
 * Fixed in Node 24.15+; still noise on older runtimes when RSC streams abort.
 */
export const TRANSFORM_ALGORITHM_NOISE = 'transformAlgorithm is not a function'

const WEBSTREAMS_FRAME = 'node:internal/webstreams'

export function isTransformStreamNoiseMessage(message: string | undefined | null): boolean {
  return Boolean(message?.includes(TRANSFORM_ALGORITHM_NOISE))
}

function stackMentionsWebstreams(stack: string | undefined | null): boolean {
  return Boolean(stack?.includes(WEBSTREAMS_FRAME))
}

function eventHasWebstreamsFrame(event: ErrorEvent): boolean {
  return Boolean(
    event.exception?.values?.some((v) =>
      v?.stacktrace?.frames?.some(
        (frame) =>
          frame?.filename?.includes(WEBSTREAMS_FRAME) ||
          frame?.abs_path?.includes(WEBSTREAMS_FRAME) ||
          frame?.module?.includes(WEBSTREAMS_FRAME),
      ),
    ),
  )
}

/**
 * Match the known Node TransformStream race.
 * When a stack is present, also require a `node:internal/webstreams` frame.
 */
export function isTransformStreamNoise(error: unknown): boolean {
  if (!isTransformStreamNoiseMessage(getErrorMessage(error))) return false

  if (error instanceof Error && error.stack) {
    return stackMentionsWebstreams(error.stack)
  }

  return true
}

export function isTransformStreamNoiseEvent(event: ErrorEvent): boolean {
  const messageHit =
    isTransformStreamNoiseMessage(event.message) ||
    Boolean(event.exception?.values?.some((v) => isTransformStreamNoiseMessage(v?.value)))

  if (!messageHit) return false

  const hasFrames = Boolean(
    event.exception?.values?.some((v) => (v?.stacktrace?.frames?.length ?? 0) > 0),
  )

  if (!hasFrames) return true

  return eventHasWebstreamsFrame(event)
}
