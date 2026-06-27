import type { Section, SectionInner, Config, Heading, Hero, RichText } from '@/payload-types'
import { SectionBlock } from '@/lib/blocks/section-block/components/SectionBlockComponent'
import React, { Fragment } from 'react'
import { HeadingBlockComponent } from '@/lib/blocks/heading-block/components/HeadingBlockComponent'
import { HeroBlock } from '@/lib/blocks/hero-block/components/HeroBlockComponent'
import { RichTextBlockComponent } from '@/lib/blocks/rich-text-block/components/RichTextBlockComponent'

type BlockComponentMap = {
  section: Section
  sectionInner: SectionInner
  heading: Heading
  hero: Hero
  'rich-text': RichText
}

type WithMeta<T> = T & { meta?: unknown }

const blockComponents: {
  [K in keyof BlockComponentMap]: React.ComponentType<WithMeta<BlockComponentMap[K]>>
} = {
  section: SectionBlock,
  sectionInner: SectionBlock as unknown as React.ComponentType<WithMeta<SectionInner>>,
  heading: HeadingBlockComponent,
  hero: HeroBlock,
  'rich-text': RichTextBlockComponent,
} as const

type Blocks = Config['blocks']

type BlockTypes = Blocks[keyof Blocks]
type BlockComponentKey = keyof typeof blockComponents

export function renderBlock(block: BlockTypes, index: number, meta?: unknown): React.ReactNode {
  const { blockType } = block
  if (blockType && blockType in blockComponents) {
    const Block = blockComponents[block.blockType as BlockComponentKey] as React.ComponentType<
      WithMeta<typeof block>
    >

    if (Block) {
      const key = 'id' in block && block.id ? block.id : `${blockType}-${index}`
      return <Block {...block} meta={meta} key={key} />
    }
  }
  return null
}

export const RenderBlocks: React.FC<{ blocks: BlockTypes[] | null | undefined; meta?: unknown }> = (
  props,
) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>{blocks.map((block, index) => renderBlock(block, index, props.meta))}</Fragment>
    )
  }

  return null
}
