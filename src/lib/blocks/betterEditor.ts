/**
 * Spread on a block's own root element so Better Editor can target it.
 * Do not wrap blocks in a layout div — that breaks section/flex/grid styling.
 *
 * Same contract as `getBlockProps` from `payload-better-editor/client`, inlined
 * so server components do not import the plugin's client entry.
 */
export type BetterEditorBlockProps = {
  'data-better-editor-id'?: string
}

export function getBetterEditorBlockProps(block: {
  id?: string | null
  'data-better-editor-id'?: string
}): BetterEditorBlockProps {
  const id = block['data-better-editor-id'] ?? (block.id != null ? String(block.id) : undefined)
  return id ? { 'data-better-editor-id': id } : {}
}
