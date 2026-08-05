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
  /** Optional art-direction crop; used via <picture> when set. */
  mobileResource?: Media | string | null
  /** Media query for mobileResource. Default: max-width 767px (below Tailwind md). */
  mobileMediaQuery?: string
  alt?: string
  size?: string // Next.js sizes attribute (layout hint for srcset)
  /** Max CSS pixel width of the layout slot; picks the matching Payload size. Default 1920. */
  maxWidth?: number
  /** Max CSS pixel width when resolving mobileResource. Default 768. */
  mobileMaxWidth?: number
  videoClassName?: string
  width?: number
  height?: number
  quality?: number // override default image quality (1-100)
}

const { breakpoints } = cssVariables
const DEFAULT_MOBILE_MEDIA_QUERY = '(max-width: 767px)'

function getDefaultSizes(): string {
  const sorted = Object.entries(breakpoints)
    .map(([, value]) => value)
    .sort((a, b) => a - b)

  const mediaQueries = sorted.map((value) => `(max-width: ${value}px) 100vw`)
  return [...mediaQueries, '100vw'].join(', ')
}

function resolveMediaSource(
  resource: Media | string | null | undefined,
  maxWidth: number,
  altFromProps: string | undefined,
  widthFromProps: number | undefined,
  heightFromProps: number | undefined,
): { src: string; width?: number; height?: number; alt: string } {
  let width: number | undefined
  let height: number | undefined
  let src = ''

  if (resource) {
    if (typeof resource === 'string') {
      src = resource
      width = widthFromProps
      height = heightFromProps
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

  return { src, width, height, alt }
}

export const MediaImage: React.FC<Props> = (props) => {
  const {
    resource,
    mobileResource,
    mobileMediaQuery = DEFAULT_MOBILE_MEDIA_QUERY,
    alt: altFromProps,
    fill,
    size: sizeFromProps,
    maxWidth = 1920,
    mobileMaxWidth = 768,
    className,
    pictureClassName,
    imgClassName,
    priority,
    loading,
    quality: qualityFromProps,
  } = props

  const desktop = resolveMediaSource(
    resource,
    maxWidth,
    altFromProps,
    props.width,
    props.height,
  )
  const mobile = mobileResource
    ? resolveMediaSource(mobileResource, mobileMaxWidth, altFromProps, undefined, undefined)
    : null

  if (!desktop.src) return null

  const sizes = sizeFromProps ? sizeFromProps : getDefaultSizes()
  const isPriority = Boolean(priority)

  const image = (
    <Image
      src={desktop.src}
      alt={desktop.alt || ''}
      fill={fill}
      className={imgClassName}
      sizes={sizes}
      height={!fill ? desktop.height : undefined}
      width={!fill ? desktop.width : undefined}
      priority={isPriority}
      fetchPriority={isPriority ? 'high' : undefined}
      quality={qualityFromProps ?? 75}
      loading={isPriority ? undefined : (loading ?? 'lazy')}
    />
  )

  const content =
    mobile?.src ? (
      <picture className={pictureClassName}>
        <source media={mobileMediaQuery} srcSet={mobile.src} />
        {image}
      </picture>
    ) : (
      image
    )

  if (className) {
    return <span className={cn(fill && 'relative block size-full', className)}>{content}</span>
  }

  return content
}
