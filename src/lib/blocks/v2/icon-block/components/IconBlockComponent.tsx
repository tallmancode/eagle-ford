import type { CSSProperties } from 'react'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { cn } from '@/lib/utils/cn'
import type { IconV2 } from '@/payload-types'
import Link from 'next/link'

const sizeClass: Record<string, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
  xl: 'size-10',
}

const alignClass: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export function IconV2BlockComponent(props: IconV2) {
  const {
    icon,
    label,
    size = 'md',
    color,
    align = 'left',
    enableLink,
    url,
    newTab,
    styles,
  } = props

  if (!icon) return null

  const Icon = lucideIconMap[icon]
  if (!Icon) return null

  const colorCss = resolveColorCss(color, 'primary')
  const colorStyle: CSSProperties | undefined = colorCss ? { color: colorCss } : undefined
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const content = (
    <>
      <Icon className={cn(sizeClass[size ?? 'md'], 'shrink-0')} aria-hidden={!label} style={colorStyle} />
      {label ? (
        <span className="text-sm font-medium" style={colorStyle}>
          {label}
        </span>
      ) : null}
    </>
  )

  const innerClass = cn('inline-flex items-center gap-2', enableLink && url && 'hover:opacity-80')
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {}

  return (
    <div
      className={cn('flex w-full', alignClass[align ?? 'left'], className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      {enableLink && url ? (
        <Link href={url} className={innerClass} aria-label={label || undefined} {...newTabProps}>
          {content}
        </Link>
      ) : (
        <div className={innerClass}>{content}</div>
      )}
    </div>
  )
}
