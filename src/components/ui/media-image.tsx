import Image from 'next/image'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'
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
  size?: string // for NextImage only
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
      const { height: fullHeight, url, width: fullWidth, updatedAt } = resource

      width = fullWidth!
      height = fullHeight!

      src = getMediaUrl(url, updatedAt)
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
