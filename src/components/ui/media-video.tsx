import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'
import React from 'react'

export function resolveMediaVideo(
  resource?: Media | string | null,
): { src: string; mimeType?: string } | null {
  if (!resource) return null

  if (typeof resource === 'string') {
    if (resource.startsWith('/') || resource.startsWith('http')) {
      return { src: resource }
    }
    return null
  }

  const { url, updatedAt, mimeType } = resource
  const src = getMediaUrl(url, updatedAt)
  if (!src) return null

  const videoMimeType = mimeType && mimeType.startsWith('video/') ? mimeType : undefined

  return { src, mimeType: videoMimeType }
}

interface MediaVideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'resource'> {
  resource?: Media | string | null
}

export const MediaVideo = React.forwardRef<HTMLVideoElement, MediaVideoProps>(function MediaVideo(
  { resource, children, ...props },
  ref,
) {
  const resolved = resolveMediaVideo(resource)
  if (!resolved) return null

  return (
    <video ref={ref} src={resolved.src} {...props}>
      {resolved.mimeType ? <source src={resolved.src} type={resolved.mimeType} /> : null}
      {children}
    </video>
  )
})
