import type { SeedLogEntry, SeedStreamEvent } from './types'

type ParseSeedStreamOptions = {
  onLog: (entry: SeedLogEntry) => void
  onDone: (result: unknown) => void
  onError: (message: string) => void
}

export async function parseSeedStream(
  response: Response,
  { onLog, onDone, onError }: ParseSeedStreamOptions,
): Promise<void> {
  if (!response.ok) {
    const message = (await response.text()) || 'Request failed.'
    onError(message)
    return
  }

  const reader = response.body?.getReader()

  if (!reader) {
    onError('No response body received.')
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.trim()) continue

      let event: SeedStreamEvent

      try {
        event = JSON.parse(line) as SeedStreamEvent
      } catch {
        onError('Failed to parse seed log stream.')
        return
      }

      if (event.type === 'log') {
        onLog({
          level: event.level,
          message: event.message,
          timestamp: event.timestamp,
          line: event.line,
        })
        continue
      }

      if (event.type === 'done') {
        onDone(event.result)
        continue
      }

      onError(event.message)
    }
  }

  if (buffer.trim()) {
    try {
      const event = JSON.parse(buffer) as SeedStreamEvent

      if (event.type === 'log') {
        onLog({
          level: event.level,
          message: event.message,
          timestamp: event.timestamp,
          line: event.line,
        })
      } else if (event.type === 'done') {
        onDone(event.result)
      } else {
        onError(event.message)
      }
    } catch {
      onError('Failed to parse seed log stream.')
    }
  }
}
