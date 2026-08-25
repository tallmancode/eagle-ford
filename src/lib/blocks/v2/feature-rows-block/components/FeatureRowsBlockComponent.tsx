import type { CSSProperties } from 'react'
import type { FeatureRowsV2 } from '@/payload-types'
import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { Button } from '@/components/ui/button'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function FeatureRowsV2BlockComponent(props: FeatureRowsV2) {
  const { rows, titleColor, descriptionColor, iconColor, styles } = props
  if (!rows?.length) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const titleCss = resolveColorCss(titleColor, 'foreground')
  const descriptionCss = resolveColorCss(descriptionColor, 'muted')
  const iconCss = resolveColorCss(iconColor, 'secondary')

  const titleStyle: CSSProperties | undefined = titleCss ? { color: titleCss } : undefined
  const descriptionStyle: CSSProperties | undefined = descriptionCss
    ? { color: descriptionCss }
    : undefined
  const iconStyle: CSSProperties | undefined = iconCss ? { color: iconCss } : undefined
  const iconBoxStyle: CSSProperties | undefined = iconCss ? { borderColor: iconCss } : undefined

  return (
    <ul
      className={['m-0 list-none divide-y divide-border border-y border-border p-0', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      {rows.map((row, index) => {
        const Icon = lucideIconMap[row.icon as keyof typeof lucideIconMap]
        const resolvedLink = resolveLinkFieldHref(row.link)
        const number = String(index + 1).padStart(2, '0')

        const newTabProps = resolvedLink?.openInNewTab
          ? { rel: 'noopener noreferrer', target: '_blank' as const }
          : {}

        return (
          <li
            key={row.id ?? index}
            className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:gap-6"
          >
            <div className="flex shrink-0 items-center gap-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center border border-secondary"
                style={iconBoxStyle}
              >
                {Icon ? (
                  <Icon className="size-5 text-secondary" strokeWidth={1.5} style={iconStyle} />
                ) : null}
              </div>
              <span className="font-medium tabular-nums text-secondary" style={iconStyle}>
                {number}
              </span>
              <h3 className="text-lg font-semibold text-foreground lg:hidden" style={titleStyle}>
                {row.title}
              </h3>
            </div>

            <h3
              className="hidden min-w-[12rem] max-w-[16rem] shrink-0 text-lg font-semibold text-foreground lg:block"
              style={titleStyle}
            >
              {row.title}
            </h3>

            <p
              className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground"
              style={descriptionStyle}
            >
              {row.description}
            </p>

            {resolvedLink ? (
              <Button
                variant="outline"
                className="w-fit shrink-0 rounded-none uppercase tracking-wide"
                asChild
              >
                <Link href={resolvedLink.href} {...newTabProps}>
                  Explore
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
