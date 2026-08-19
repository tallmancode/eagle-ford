type RichTextNode = {
  type?: string
  text?: string
  children?: RichTextNode[]
}

type RichTextRoot = {
  root?: {
    children?: RichTextNode[]
  }
}

export function extractPlainTextFromRichText(
  data: RichTextRoot | null | undefined,
  maxLength = 120,
): string | undefined {
  if (!data?.root?.children?.length) {
    return undefined
  }

  const parts: string[] = []

  const walk = (nodes: RichTextNode[]) => {
    for (const node of nodes) {
      if (typeof node.text === 'string' && node.text.trim()) {
        parts.push(node.text.trim())
      }
      if (node.children?.length) {
        walk(node.children)
      }
    }
  }

  walk(data.root.children)

  const text = parts.join(' ').replace(/\s+/g, ' ').trim()

  if (!text) {
    return undefined
  }

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trim()}…`
}
