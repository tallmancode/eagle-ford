import type { ImageBlock as ImageBlockType, Media } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'
import { cn } from '@/lib/utils/cn'
import {
  aspectRatioClasses,
  cornerRadiusClasses,
  shadowClasses,
} from '@/lib/blocks/image-block/imageStyleMaps'
import React from 'react'

export const ImageBlockComponent: React.FC<ImageBlockType> = ({
  image,
  alt,
  cornerRadius = '2xl',
  aspectRatio = '4/3',
  shadow = 'lg',
}) => {
  if (!image || typeof image !== 'object') return null

  const media = image as Media
  const cornerClass = cornerRadiusClasses[cornerRadius ?? '2xl'] ?? cornerRadiusClasses['2xl']
  const aspectClass = aspectRatioClasses[aspectRatio ?? '4/3'] ?? aspectRatioClasses['4/3']
  const shadowClass = shadowClasses[shadow ?? 'lg'] ?? shadowClasses.lg
  const isAutoAspect = aspectRatio === 'auto'

  const wrapperClass = cn(
    'w-full overflow-hidden',
    cornerClass,
    shadowClass,
    !isAutoAspect && 'relative',
    aspectClass,
  )

  if (isAutoAspect) {
    return (
      <div className={wrapperClass}>
        <MediaImage
          resource={media}
          alt={alt ?? undefined}
          imgClassName="h-auto w-full object-cover object-center"
          maxWidth={1400}
          size="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    )
  }

  return (
    <div className={wrapperClass}>
      <MediaImage
        resource={media}
        alt={alt ?? undefined}
        fill
        imgClassName="object-cover object-center"
        maxWidth={1400}
        size="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  )
}
