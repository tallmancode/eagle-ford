export type HeadingMarkupSegment =
  | { type: 'text'; value: string }
  | { type: 'colored'; children: HeadingMarkupSegment[]; color: string }
  | { type: 'accentUnder'; children: HeadingMarkupSegment[]; color?: string }

/** @deprecated Use HeadingMarkupSegment */
export type HeadingColorSegment = HeadingMarkupSegment

const COLOR_TAG_RE = /<color=(#[0-9A-Fa-f]{3,8})>([\s\S]*?)<\/color>/gi
const ACCENT_UNDER_TAG_RE =
  /<accent-under(?:\s+color=["'](#[0-9A-Fa-f]{3,8})["'])?>([\s\S]*?)<\/accent-under>/gi

const HEX_COLOR_RE = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/

type TagMatch = {
  index: number
  length: number
  raw: string
  type: 'colored' | 'accentUnder'
  color?: string
  inner: string
}

export function isValidHexColor(color: string): boolean {
  return HEX_COLOR_RE.test(color)
}

export function hasHeadingMarkup(input: string): boolean {
  return /<color=|<accent-under/i.test(input)
}

function findNextTag(input: string, fromIndex: number): TagMatch | null {
  const substring = input.slice(fromIndex)

  const colorRe = /<color=(#[0-9A-Fa-f]{3,8})>([\s\S]*?)<\/color>/i
  const accentRe =
    /<accent-under(?:\s+color=["'](#[0-9A-Fa-f]{3,8})["'])?>([\s\S]*?)<\/accent-under>/i

  const colorMatch = colorRe.exec(substring)
  const accentMatch = accentRe.exec(substring)

  let earliest: TagMatch | null = null

  if (colorMatch?.index != null) {
    earliest = {
      index: fromIndex + colorMatch.index,
      length: colorMatch[0].length,
      raw: colorMatch[0],
      type: 'colored',
      color: colorMatch[1],
      inner: colorMatch[2],
    }
  }

  if (accentMatch?.index != null) {
    const accentIndex = fromIndex + accentMatch.index
    if (!earliest || accentIndex < earliest.index) {
      earliest = {
        index: accentIndex,
        length: accentMatch[0].length,
        raw: accentMatch[0],
        type: 'accentUnder',
        color: accentMatch[1],
        inner: accentMatch[2],
      }
    }
  }

  return earliest
}

export function parseHeadingColorTags(input: string): HeadingMarkupSegment[] {
  if (!input) {
    return []
  }

  const segments: HeadingMarkupSegment[] = []
  let pos = 0

  while (pos < input.length) {
    const match = findNextTag(input, pos)

    if (!match) {
      segments.push({ type: 'text', value: input.slice(pos) })
      break
    }

    if (match.index > pos) {
      segments.push({ type: 'text', value: input.slice(pos, match.index) })
    }

    if (match.type === 'colored' && match.color && isValidHexColor(match.color)) {
      segments.push({
        type: 'colored',
        color: match.color,
        children: parseHeadingColorTags(match.inner),
      })
    } else if (match.type === 'accentUnder') {
      segments.push({
        type: 'accentUnder',
        color: match.color && isValidHexColor(match.color) ? match.color : undefined,
        children: parseHeadingColorTags(match.inner),
      })
    } else {
      segments.push({ type: 'text', value: match.raw })
    }

    pos = match.index + match.length
  }

  if (segments.length === 0) {
    segments.push({ type: 'text', value: input })
  }

  return segments
}

/** Removes markup tags for display in admin labels (keeps inner text). */
export function stripHeadingColorTags(input: string): string {
  COLOR_TAG_RE.lastIndex = 0
  ACCENT_UNDER_TAG_RE.lastIndex = 0

  return input
    .replace(COLOR_TAG_RE, (_, __, inner: string) => inner.trim())
    .replace(ACCENT_UNDER_TAG_RE, (_, __, inner: string) => inner.trim())
}
