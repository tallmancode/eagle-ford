import type { FixedBackgroundBlockType, Media } from '@/payload-types'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'
import { cn } from '@/lib/utils/cn'
import React from 'react'

export const FixedBackgroundBlockComponent: React.FC<FixedBackgroundBlockType> = (props) => {
  const { backgroundImage, content, container = true, overlayOpacity = 0 } = props

  const image =
    backgroundImage && typeof backgroundImage === 'object' ? (backgroundImage as Media) : null

  if (!image?.url) return null

  const bgUrl = getMediaUrl(image.url, image.updatedAt)
  const opacity = Math.min(100, Math.max(0, overlayOpacity ?? 0))

  return (
    <section className="relative isolate flex min-h-[50vh] items-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url('${bgUrl}')` }}
      />
      {opacity > 0 && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dark-950"
          style={{ opacity: opacity / 100 }}
        />
      )}
      <div
        className={cn(
          'relative z-10 flex w-full flex-col items-center py-12',
          container && 'container',
        )}
      >
        <RenderBlocks blocks={content} />
      </div>
    </section>
  )
}
