import React, { Fragment } from 'react'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

type BlockComponentProps = Record<string, unknown> & { disableInnerContainer?: boolean }

const blockComponents: Record<string, React.ComponentType<BlockComponentProps>> = {
  archive: ArchiveBlock as unknown as React.ComponentType<BlockComponentProps>,
  content: ContentBlock as unknown as React.ComponentType<BlockComponentProps>,
  cta: CallToActionBlock as unknown as React.ComponentType<BlockComponentProps>,
  formBlock: FormBlock as unknown as React.ComponentType<BlockComponentProps>,
  mediaBlock: MediaBlock as unknown as React.ComponentType<BlockComponentProps>,
}

export const RenderBlocks: React.FC<{
  blocks: Array<{ blockType?: string; [key: string]: unknown }> | null | undefined
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block {...(block as Record<string, unknown>)} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
