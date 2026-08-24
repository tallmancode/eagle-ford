import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { getOptimizedBackgroundUrl } from '@/lib/utils/getOptimizedBackgroundUrl'
import { cn } from '@/lib/utils/cn'
import type { Media, SectionV2 } from '@/payload-types'

export function SectionV2BlockComponent(props: SectionV2 & { meta?: BlockRenderMeta }) {
  const { content, styles, meta, enableFixedBackground, backgroundImage, overlayOpacity } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const image =
    enableFixedBackground && backgroundImage && typeof backgroundImage === 'object'
      ? (backgroundImage as Media)
      : null
  const bgUrl = getOptimizedBackgroundUrl(image)
  const opacity = Math.min(100, Math.max(0, overlayOpacity ?? 0))

  if (bgUrl) {
    return (
      <section
        className={cn('relative isolate flex min-h-[50vh] items-center', className)}
        style={style}
        {...attrs}
        {...getBetterEditorBlockProps(props)}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
        {opacity > 0 ? (
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dark-950"
            style={{ opacity: opacity / 100 }}
          />
        ) : null}
        <div className="relative z-10 w-full">
          <RenderBlocks blocks={content} meta={meta} />
        </div>
      </section>
    )
  }

  return (
    <section
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <RenderBlocks blocks={content} meta={meta} />
    </section>
  )
}
