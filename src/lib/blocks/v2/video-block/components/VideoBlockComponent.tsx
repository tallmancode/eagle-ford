'use client'

import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { MediaImage } from '@/components/ui/media-image'
import { cn } from '@/lib/utils/cn'
import type { Media, VideoV2 } from '@/payload-types'
import { Play } from 'lucide-react'
import { useState } from 'react'
import { resolveVideoEmbedUrl } from '@/lib/blocks/v2/video-block/resolveVideoEmbedUrl'

const aspectClass: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '9/16': 'aspect-[9/16]',
}

export function VideoV2BlockComponent(props: VideoV2) {
  const { embedUrl, title, poster, aspectRatio = '16/9', styles } = props
  const [playing, setPlaying] = useState(false)

  if (!embedUrl) return null

  const resolved = resolveVideoEmbedUrl(embedUrl)
  if (!resolved) return null

  const posterMedia = poster && typeof poster === 'object' ? (poster as Media) : null
  const showPoster = Boolean(posterMedia) && !playing
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })
  const frameClass = cn(
    'relative w-full overflow-hidden rounded-2xl bg-black',
    aspectClass[aspectRatio ?? '16/9'] ?? aspectClass['16/9'],
  )

  return (
    <div
      className={cn(className, aspectRatio === '9/16' && 'mx-auto max-w-sm')}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className={frameClass}>
        {showPoster && posterMedia ? (
          <button
            type="button"
            className="absolute inset-0 z-10 flex items-center justify-center"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title || 'video'}`}
          >
            <MediaImage
              resource={posterMedia}
              fill
              imgClassName="object-cover object-center"
              maxWidth={1400}
              size="(max-width: 1024px) 100vw, 50vw"
            />
            <span className="absolute inline-flex size-14 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg">
              <Play className="size-6 fill-current" />
            </span>
          </button>
        ) : (
          <iframe
            src={resolved}
            title={title || 'Video'}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
    </div>
  )
}
