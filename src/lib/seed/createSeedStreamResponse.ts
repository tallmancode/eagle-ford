import type { Payload } from 'payload'

import { SeedLogger } from './SeedLogger'

export function createSeedStreamResponse(
  handler: (log: SeedLogger) => Promise<unknown>,
  payloadLogger?: Payload['logger'],
): Response {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const log = new SeedLogger((entry) => {
        controller.enqueue(encoder.encode(`${JSON.stringify({ type: 'log', ...entry })}\n`))
      }, payloadLogger)

      try {
        const result = await handler(log)
        controller.enqueue(encoder.encode(`${JSON.stringify({ type: 'done', result })}\n`))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
        log.error(message)
        controller.enqueue(encoder.encode(`${JSON.stringify({ type: 'error', message })}\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache, no-transform',
    },
  })
}
