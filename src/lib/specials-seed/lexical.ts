function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\uFFFD/g, '•')
    .replace(/[•·]/g, '•')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

type LexicalTextNode = {
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  type: 'text'
  version: 1
}

type LexicalParagraphNode = {
  children: LexicalTextNode[]
  direction: 'ltr' | null
  format: 'start' | ''
  indent: number
  type: 'paragraph'
  version: 1
  textFormat: number
  textStyle: string
}

type LexicalRoot = {
  children: LexicalParagraphNode[]
  direction: 'ltr' | null
  format: ''
  indent: number
  type: 'root'
  version: 1
}

function textNode(text: string, format = 0): LexicalTextNode {
  return {
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  }
}

function paragraph(text: string, format = 0): LexicalParagraphNode {
  return {
    children: text.trim() ? [textNode(text, format)] : [],
    direction: 'ltr',
    format: 'start',
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: format,
    textStyle: '',
  }
}

function emptyParagraph(): LexicalParagraphNode {
  return paragraph('')
}

function parseInlineHtml(html: string): LexicalTextNode[] {
  const nodes: LexicalTextNode[] = []
  const tokenRegex = /(<strong>|<\/strong>|<b>|<\/b>)/gi
  let lastIndex = 0
  let bold = false
  let match: RegExpExecArray | null

  while ((match = tokenRegex.exec(html)) !== null) {
    const text = stripHtml(html.slice(lastIndex, match.index))
    if (text) nodes.push(textNode(text, bold ? 1 : 0))

    const tag = match[1].toLowerCase()
    bold = tag === '<strong>' || tag === '<b>'
    lastIndex = match.index + match[0].length
  }

  const remainder = stripHtml(html.slice(lastIndex))
  if (remainder) nodes.push(textNode(remainder, bold ? 1 : 0))

  return nodes.length > 0 ? nodes : [textNode(stripHtml(html))]
}

function paragraphFromHtml(html: string): LexicalParagraphNode {
  const children = parseInlineHtml(html)
  const isBold = children.length === 1 && children[0].format === 1
  return {
    children,
    direction: 'ltr',
    format: 'start',
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: isBold ? 1 : 0,
    textStyle: '',
  }
}

/** Normalize lists into bullet paragraphs so nested <ul>/<li> survive Lexical conversion. */
function normalizeLists(html: string): string {
  return html
    .replace(/<ul[^>]*>/gi, '')
    .replace(/<\/ul>/gi, '')
    .replace(/<ol[^>]*>/gi, '')
    .replace(/<\/ol>/gi, '')
    .replace(/<li[^>]*>/gi, '<p>• ')
    .replace(/<\/li>/gi, '</p>')
}

export function htmlToLexicalRoot(html: string): { root: LexicalRoot } {
  if (!html.trim()) {
    return {
      root: {
        children: [emptyParagraph()],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }
  }

  const normalized = normalizeLists(html)
  const segments = normalized
    .split(/<\/p>/i)
    .map((segment) =>
      segment
        .replace(/^<p[^>]*>/i, '')
        .replace(/<br\s*\/?>/gi, '')
        .trim(),
    )
    .filter((segment) => segment.length > 0)

  const children =
    segments.length > 0
      ? segments.flatMap((segment, index) => {
          const node = paragraphFromHtml(segment)
          return index < segments.length - 1 ? [node, emptyParagraph()] : [node]
        })
      : [paragraph(stripHtml(html))]

  return {
    root: {
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}
