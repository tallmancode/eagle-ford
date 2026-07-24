type BlockLike = {
  blockType?: string | null
  content?: unknown
}

const NESTED_CONTENT_BLOCK_TYPES = new Set(['section', 'sectionInner', 'row'])

export function contentContainsVehicleSpecialCategories(
  blocks: BlockLike[] | null | undefined,
): boolean {
  if (!blocks?.length) return false

  for (const block of blocks) {
    if (block.blockType === 'vehicle-special-categories') return true

    if (
      block.blockType &&
      NESTED_CONTENT_BLOCK_TYPES.has(block.blockType) &&
      Array.isArray(block.content) &&
      contentContainsVehicleSpecialCategories(block.content as BlockLike[])
    ) {
      return true
    }
  }

  return false
}
