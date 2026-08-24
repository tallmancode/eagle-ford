'use client'

import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { CtaButtonBlockComponent } from '@/lib/blocks/cta-button-block/components/CtaButtonBlockComponent'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import type { ButtonV2, CtaButton } from '@/payload-types'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const alignClass: Record<string, string> = {
  left: 'justify-center md:justify-start',
  center: 'justify-center',
  right: 'justify-center md:justify-end',
}

function HistoryBackButton({
  label,
  variant = 'default',
  size = 'default',
  align = 'left',
  fallbackUrl = '/',
  showBackIcon = true,
  meta,
}: {
  label: string
  variant?: CtaButton['variant']
  size?: CtaButton['size']
  align?: CtaButton['align']
  fallbackUrl?: string | null
  showBackIcon?: boolean | null
  meta?: BlockRenderMeta
}) {
  const router = useRouter()
  const inRow = (meta as { inRow?: boolean } | undefined)?.inRow === true
  const wrapperClass = inRow ? undefined : cn('flex w-full', alignClass[align ?? 'left'])

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl || '/')
    }
  }

  const button = (
    <Button type="button" variant={variant ?? 'default'} size={size ?? 'default'} onClick={handleBack}>
      {showBackIcon ? <ArrowLeft /> : null}
      {label}
    </Button>
  )

  return wrapperClass ? <div className={wrapperClass}>{button}</div> : button
}

export function ButtonV2BlockComponent(props: ButtonV2 & { meta?: BlockRenderMeta }) {
  const { styles, meta, linkType, fallbackUrl, showBackIcon, ...ctaProps } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      {linkType === 'historyBack' ? (
        <HistoryBackButton
          label={ctaProps.label}
          variant={ctaProps.variant}
          size={ctaProps.size}
          align={ctaProps.align}
          fallbackUrl={fallbackUrl}
          showBackIcon={showBackIcon}
          meta={meta}
        />
      ) : (
        <CtaButtonBlockComponent
          {...(ctaProps as unknown as CtaButton)}
          linkType={linkType as CtaButton['linkType']}
          blockType="cta-button"
          meta={meta}
        />
      )}
    </div>
  )
}
