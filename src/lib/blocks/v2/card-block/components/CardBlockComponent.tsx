import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/ui/media-image'
import { resolveNavHref } from '@/lib/fields/navigation/resolveNavHref'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import type { CardV2, Media } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

export function CardV2BlockComponent(props: CardV2) {
  const {
    image,
    imageAlt,
    icon,
    title,
    body,
    enableCardLink,
    cardLinkType,
    cardUrl,
    cardReference,
    cardNewTab,
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
  const Icon = icon ? lucideIconMap[icon] : undefined
  const hasBody = Boolean(body)
  const hasContent = Boolean(media || Icon || title || hasBody || (showButton && buttonLabel))
  if (!hasContent) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  let cardHref: string | null = null
  if (enableCardLink) {
    if (cardLinkType === 'reference') {
      cardHref = resolveNavHref({
        linkType: 'reference',
        reference: cardReference ?? undefined,
      })
    } else if (cardUrl) {
      cardHref = cardUrl
    }
  }

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

  const cardNewTabProps = cardNewTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {}
  const buttonNewTabProps = buttonNewTab
    ? { rel: 'noopener noreferrer', target: '_blank' as const }
    : {}

  const titleNode = title ? (
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
  ) : null

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
          {cardHref ? (
            <Link href={cardHref} className="absolute inset-0 block" {...cardNewTabProps}>
              <MediaImage
                resource={media}
                alt={imageAlt ?? undefined}
                fill
                imgClassName="object-cover object-center"
                maxWidth={900}
                size="(max-width: 768px) 100vw, 50vw"
              />
            </Link>
          ) : (
            <MediaImage
              resource={media}
              alt={imageAlt ?? undefined}
              fill
              imgClassName="object-cover object-center"
              maxWidth={900}
              size="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      ) : null}
      <div className="flex flex-col gap-3 p-6">
        {Icon ? <Icon className="size-8 shrink-0 text-primary" aria-hidden /> : null}
        {cardHref && titleNode ? (
          <Link href={cardHref} className="hover:underline" {...cardNewTabProps}>
            {titleNode}
          </Link>
        ) : (
          titleNode
        )}
        {hasBody ? (
          <div className="text-sm leading-relaxed text-muted-foreground">
            <ConvertRichText converters={richTextConverters} data={body as SerializedEditorState} />
          </div>
        ) : null}
        {buttonHref && buttonLabel ? (
          <div className="pt-1">
            <Button asChild variant={buttonVariant ?? 'default'} size="default">
              <Link href={buttonHref} {...buttonNewTabProps}>
                {buttonLabel}
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
