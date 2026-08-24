type BlockLike = {
  blockType?: string | null
  content?: unknown
}

const NESTED_CONTENT_BLOCK_TYPES = new Set([
  'section',
  'sectionInner',
  'sectionV2',
  'wrapperV2',
  'columnV2',
  'row',
])

export function contentContainsSpecialsTabs(blocks: BlockLike[] | null | undefined): boolean {
  if (!blocks?.length) return false

  for (const block of blocks) {
    if (block.blockType === 'specialsTabsV2') return true

    if (
      block.blockType &&
      NESTED_CONTENT_BLOCK_TYPES.has(block.blockType) &&
      Array.isArray(block.content) &&
      contentContainsSpecialsTabs(block.content as BlockLike[])
    ) {
      return true
    }
  }

  return false
}
