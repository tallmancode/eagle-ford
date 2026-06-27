'use client'

import type { Hero, Media } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'
import { MediaVideo, resolveMediaVideo } from '@/components/ui/media-video'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'
import { cn } from '@/lib/utils/cn'
import React from 'react'

function resolvePosterUrl(resource?: Media | string | null): string {
  if (!resource || typeof resource === 'string') return ''
  return getMediaUrl(resource.url, resource.updatedAt)
}

export const VideoBannerHero: React.FC<Hero> = (props) => {
  const content = props.videoBannerHeroContent
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isPageReady, setIsPageReady] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)

  React.useEffect(() => {
    const onReady = () => setIsPageReady(true)

    if (document.readyState === 'complete') {
      onReady()
      return
    }

    window.addEventListener('load', onReady, { once: true })
    return () => window.removeEventListener('load', onReady)
  }, [])

  React.useEffect(() => {
    if (!isPageReady) return

    const video = videoRef.current
    if (!video) return

    const startPlayback = () => {
      void video.play().catch(() => {
        requestAnimationFrame(() => {
          void video.play().catch(() => {})
        })
      })
    }

    const onPlaying = () => setIsPlaying(true)
    video.addEventListener('playing', onPlaying)

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startPlayback()
    } else {
      const onCanPlay = () => startPlayback()
      video.addEventListener('canplay', onCanPlay, { once: true })
      video.load()
    }

    return () => {
      video.removeEventListener('playing', onPlaying)
    }
  }, [isPageReady])

  if (!content?.video || !content?.poster) return null

  const loop = content.loop ?? true
  const posterUrl = resolvePosterUrl(content.poster)
  const videoResolved = resolveMediaVideo(content.video)

  if (!videoResolved?.src) return null

  const showPoster = !isPlaying || !isPageReady

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className={cn(
          'relative z-0 w-full transition-opacity duration-500',
          showPoster ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden={!showPoster}
      >
        <MediaImage
          resource={content.poster}
          imgClassName="w-full h-auto block"
          priority
          loading="eager"
        />
      </div>
      <MediaVideo
        ref={videoRef}
        resource={content.video}
        className={cn(
          'absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500',
          showPoster ? 'opacity-0' : 'opacity-100',
        )}
        poster={posterUrl || undefined}
        muted
        playsInline
        loop={loop}
        controls={false}
        preload={isPageReady ? 'auto' : 'metadata'}
        aria-hidden
      />
    </section>
  )
}
