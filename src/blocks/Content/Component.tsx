import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type ContentBlockProps = {
  id?: string | null
  blockType?: string
  columns?: Array<{
    size?: 'full' | 'half' | 'oneThird' | 'twoThirds' | null
    richText?: import('@payloadcms/richtext-lexical').DefaultTypedEditorState | null
    enableLink?: boolean | null
    link?: Record<string, unknown>
  }> | null
}

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
