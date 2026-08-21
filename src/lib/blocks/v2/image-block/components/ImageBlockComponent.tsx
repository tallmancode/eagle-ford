import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import {
  aspectRatioClasses,
  cornerRadiusClasses,
  shadowClasses,
} from '@/lib/blocks/image-block/imageStyleMaps'
import { MediaImage } from '@/components/ui/media-image'
import { cn } from '@/lib/utils/cn'
import type { ImageV2, Media } from '@/payload-types'
import Link from 'next/link'

export function ImageV2BlockComponent(props: ImageV2) {
  const {
    image,
    alt,
    caption,
    linkUrl,
    newTab,
    cornerRadius = '2xl',
    aspectRatio = '4/3',
    shadow = 'lg',
    styles,
  } = props

  if (!image || typeof image !== 'object') return null

  const media = image as Media
  const cornerClass = cornerRadiusClasses[cornerRadius ?? '2xl'] ?? cornerRadiusClasses['2xl']
  const aspectClass = aspectRatioClasses[aspectRatio ?? '4/3'] ?? aspectRatioClasses['4/3']
  const shadowClass = shadowClasses[shadow ?? 'lg'] ?? shadowClasses.lg
  const isAutoAspect = aspectRatio === 'auto'
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const imageNode = isAutoAspect ? (
    <div className={cn('w-full overflow-hidden', cornerClass, shadowClass)}>
      <MediaImage
        resource={media}
        alt={alt ?? undefined}
        imgClassName="h-auto w-full object-cover object-center"
        maxWidth={1400}
        size="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  ) : (
    <div className={cn('relative w-full overflow-hidden', cornerClass, shadowClass, aspectClass)}>
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

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {}
  const linked = linkUrl ? (
    <Link href={linkUrl} className="block" {...newTabProps}>
      {imageNode}
    </Link>
  ) : (
    imageNode
  )

  return (
    <figure
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      {linked}
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
