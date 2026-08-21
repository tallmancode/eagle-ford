import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/ui/media-image'
import { resolveNavHref } from '@/lib/fields/navigation/resolveNavHref'
import type { CardV2, Media } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

export function CardV2BlockComponent(props: CardV2) {
  const {
    image,
    imageAlt,
    title,
    body,
    showButton,
    buttonLabel,
    buttonLinkType,
    buttonUrl,
    buttonReference,
    buttonNewTab,
    buttonVariant = 'default',
    styles,
  } = props

  const media = image && typeof image === 'object' ? (image as Media) : null
  const hasBody = Boolean(body)
  const hasContent = Boolean(media || title || hasBody || (showButton && buttonLabel))
  if (!hasContent) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  let buttonHref: string | null = null
  if (showButton && buttonLabel) {
    if (buttonLinkType === 'reference') {
      buttonHref = resolveNavHref({
        linkType: 'reference',
        reference: buttonReference ?? undefined,
      })
    } else if (buttonUrl) {
      buttonHref = buttonUrl
    }
  }

  const newTabProps = buttonNewTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {}

  return (
    <div
      className={[
        'overflow-hidden rounded-2xl border border-border bg-card shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      {media ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <MediaImage
            resource={media}
            alt={imageAlt ?? undefined}
            fill
            imgClassName="object-cover object-center"
            maxWidth={900}
            size="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-3 p-6">
        {title ? <h3 className="text-lg font-semibold text-foreground">{title}</h3> : null}
        {hasBody ? (
          <div className="text-sm leading-relaxed text-muted-foreground">
            <ConvertRichText converters={richTextConverters} data={body as SerializedEditorState} />
          </div>
        ) : null}
        {buttonHref && buttonLabel ? (
          <div className="pt-1">
            <Button asChild variant={buttonVariant ?? 'default'} size="default">
              <Link href={buttonHref} {...newTabProps}>
                {buttonLabel}
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
