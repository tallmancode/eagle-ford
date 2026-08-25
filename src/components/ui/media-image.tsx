import { getImageProps } from 'next/image'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'
import { getOptimalMediaSize } from '@/lib/utils/getOptimalMediaSize'
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

const DEFAULT_MOBILE_MEDIA_QUERY = '(max-width: 767px)'

type ResolvedSource = { src: string; width?: number; height?: number; alt: string }

function resolveMediaSource(
  resource: Media | string | null | undefined,
  maxWidth: number,
  altFromProps: string | undefined,
  widthFromProps: number | undefined,
  heightFromProps: number | undefined,
): ResolvedSource {
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

function imagePropArgs(
  source: ResolvedSource,
  fill: boolean | undefined,
  extras: {
    sizes: string
    quality: number
    className?: string
    priority?: boolean
    loading?: 'lazy' | 'eager'
  },
) {
  const alt = source.alt || ''
  if (fill) {
    return {
      src: source.src,
      alt,
      fill: true as const,
      ...extras,
    }
  }

  return {
    src: source.src,
    alt,
    width: source.width ?? 1920,
    height: source.height ?? 1080,
    ...extras,
  }
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

  const desktop = resolveMediaSource(resource, maxWidth, altFromProps, props.width, props.height)
  const mobile = mobileResource
    ? resolveMediaSource(mobileResource, mobileMaxWidth, altFromProps, undefined, undefined)
    : null

  if (!desktop.src) return null

  const sizes = sizeFromProps || '100vw'
  const isPriority = Boolean(priority)
  const quality = qualityFromProps ?? 75
  const loadingProp = isPriority ? undefined : (loading ?? 'lazy')

  let content: React.ReactNode

  if (mobile?.src) {
    // Dual srcSets for art-direction / PSI. Fallback <img> must use desktop width/height
    // so layout aspect ratio matches the desktop crop (mobile attrs were pushing heroes taller).
    const {
      props: { srcSet: desktopSrcSet, ...desktopImg },
    } = getImageProps(
      imagePropArgs(desktop, fill, {
        sizes,
        quality,
        className: imgClassName,
        priority: isPriority,
        loading: loadingProp,
      }),
    )
    const {
      props: { srcSet: mobileSrcSet },
    } = getImageProps(
      imagePropArgs(mobile, fill, {
        sizes,
        quality,
        className: imgClassName,
      }),
    )

    content = (
      <picture className={cn(fill && 'relative block size-full', pictureClassName)}>
        <source media={`not ${mobileMediaQuery}`} srcSet={desktopSrcSet} sizes={sizes} />
        <source media={mobileMediaQuery} srcSet={mobileSrcSet} sizes={sizes} />
        <img
          {...desktopImg}
          alt={desktopImg.alt ?? desktop.alt ?? ''}
          fetchPriority={isPriority ? 'high' : desktopImg.fetchPriority}
        />
      </picture>
    )
  } else {
    content = (
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
        quality={quality}
        loading={loadingProp}
      />
    )
  }

  if (className) {
    return <span className={cn(fill && 'relative block size-full', className)}>{content}</span>
  }

  return content
}
