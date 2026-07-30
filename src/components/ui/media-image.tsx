import Image from 'next/image'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'
import { getOptimalMediaSize } from '@/lib/utils/getOptimalMediaSize'
import { cssVariables } from '@/cssVariables'
import { cn } from '@/lib/utils/cn'
import React from 'react'

interface Props {
  className?: string
  fill?: boolean // for NextImage only
  pictureClassName?: string
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  loading?: 'lazy' | 'eager' // for NextImage only
  priority?: boolean // for NextImage only
  resource?: Media | string | null // for Payload media
  alt?: string
  size?: string // Next.js sizes attribute (layout hint for srcset)
  /** Max CSS pixel width of the layout slot; picks the matching Payload size. Default 1920. */
  maxWidth?: number
  videoClassName?: string
  width?: number
  height?: number
  quality?: number // override default image quality (1-100)
}

const { breakpoints } = cssVariables

function getDefaultSizes(): string {
  const sorted = Object.entries(breakpoints)
    .map(([, value]) => value)
    .sort((a, b) => a - b)

  const mediaQueries = sorted.map((value) => `(max-width: ${value}px) 100vw`)
  return [...mediaQueries, '100vw'].join(', ')
}

export const MediaImage: React.FC<Props> = (props) => {
  const {
    resource,
    alt: altFromProps,
    fill,
    size: sizeFromProps,
    maxWidth = 1920,
    className,
    imgClassName,
    priority,
    loading,
    quality: qualityFromProps,
  } = props

  let width: number | undefined
  let height: number | undefined

  let src = ''
  if (resource) {
    if (typeof resource === 'string') {
      src = resource
      width = props.width
      height = props.height
    }
    if (typeof resource === 'object') {
      const optimal = getOptimalMediaSize(resource, maxWidth)

      if (optimal) {
        src = optimal.url
        width = optimal.width
        height = optimal.height
      } else {
        const { height: fullHeight, url, width: fullWidth, updatedAt } = resource
        width = fullWidth ?? undefined
        height = fullHeight ?? undefined
        src = getMediaUrl(url, updatedAt)
      }
    }
  }

  let alt = altFromProps || ''
  if (!altFromProps && resource && typeof resource === 'object') {
    alt = resource?.alt
  }

  const sizes = sizeFromProps ? sizeFromProps : getDefaultSizes()
  const isPriority = Boolean(priority)

  const image = (
    <Image
      src={src}
      alt={alt || ''}
      fill={fill}
      className={imgClassName}
      sizes={sizes}
      height={!fill ? height : undefined}
      width={!fill ? width : undefined}
      priority={isPriority}
      fetchPriority={isPriority ? 'high' : undefined}
      quality={qualityFromProps ?? 75}
      loading={isPriority ? undefined : (loading ?? 'lazy')}
    />
  )

  if (className) {
    return <span className={cn(fill && 'relative block size-full', className)}>{image}</span>
  }

  return image
}
