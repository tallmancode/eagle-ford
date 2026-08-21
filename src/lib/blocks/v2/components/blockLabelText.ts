import { extractPlainTextFromRichText } from '@/lib/blocks/form-block/utils/extractPlainTextFromRichText'

export const BLOCK_LABEL_MAX_CHARS = 48

const labelTruncateStyle = {
  display: 'inline-block',
  maxWidth: '100%',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  verticalAlign: 'bottom',
  whiteSpace: 'nowrap',
} as const

export { labelTruncateStyle }

export function stripMarkup(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

export function truncateLabel(value: string, max = BLOCK_LABEL_MAX_CHARS): string {
  if (value.length <= max) return value
  return `${value.slice(0, max).trimEnd()}…`
}

function isLexical(value: unknown): value is { root: { children?: unknown[] } } {
  return Boolean(value && typeof value === 'object' && 'root' in value)
}

/** Payload may wrap field values or pass boolean `label: false` from the parent blocks field. */
export function unwrapFormValue(value: unknown): unknown {
  if (value === true || value === false || value == null) return undefined

  if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'value' in value &&
    !('root' in value) &&
    !('blockType' in value)
  ) {
    return unwrapFormValue((value as { value: unknown }).value)
  }

  return value
}

export function coerceBlockType(value: unknown): string | undefined {
  const unwrapped = unwrapFormValue(value)
  if (typeof unwrapped === 'string' && unwrapped.trim()) return unwrapped.trim()
  if (typeof value === 'string' && value.trim()) return value.trim()
  return undefined
}

export function previewBlockText(value: unknown, max = BLOCK_LABEL_MAX_CHARS): string | undefined {
  const unwrapped = unwrapFormValue(value)

  if (typeof unwrapped === 'string') {
    const plain = stripMarkup(unwrapped)
    if (!plain) return undefined
    return truncateLabel(plain, max)
  }

  if (isLexical(unwrapped)) {
    return extractPlainTextFromRichText(
      unwrapped as Parameters<typeof extractPlainTextFromRichText>[0],
      max,
    )
  }

  return undefined
}

export function readField(data: Record<string, unknown> | undefined, field: string): unknown {
  if (!data) return undefined
  if (!field.includes('.')) return data[field]

  return field.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, data)
}
