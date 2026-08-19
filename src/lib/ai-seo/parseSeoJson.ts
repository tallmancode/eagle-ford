export type ParsedSeoJson = {
  title: string
  description: string
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function tryParseObject(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * Parse `{ title, description }` from a model response, including fenced JSON.
 */
export function parseSeoJson(raw: string | null | undefined): ParsedSeoJson | null {
  if (typeof raw !== 'string' || !raw.trim()) return null

  const trimmed = raw.trim()
  const candidates = [trimmed]

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced?.[1]) candidates.unshift(fenced[1].trim())

  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.push(trimmed.slice(firstBrace, lastBrace + 1))
  }

  for (const candidate of candidates) {
    const parsed = tryParseObject(candidate)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) continue
    const record = parsed as Record<string, unknown>
    const title = asNonEmptyString(record.title)
    const description = asNonEmptyString(record.description)
    if (title && description) return { title, description }
  }

  return null
}

export function extractTextFromAnthropicContent(content: unknown): string {
  if (!Array.isArray(content)) return typeof content === 'string' ? content : ''

  const parts: string[] = []
  for (const block of content) {
    if (
      block &&
      typeof block === 'object' &&
      'type' in block &&
      (block as { type?: string }).type === 'text' &&
      'text' in block &&
      typeof (block as { text?: unknown }).text === 'string'
    ) {
      parts.push((block as { text: string }).text)
    }
  }
  return parts.join('\n').trim()
}
