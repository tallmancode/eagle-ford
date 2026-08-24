import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { cn } from '@/lib/utils/cn'
import type { QuoteV2 } from '@/payload-types'

const alignClass: Record<string, string> = {
  left: 'text-left border-l-4 border-primary pl-6',
  center: 'text-center border-0',
}

export function QuoteV2BlockComponent(props: QuoteV2) {
  const { quote, attribution, source, align = 'left', styles } = props

  if (!quote) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })
  const citeParts = [attribution, source].filter(Boolean)

  return (
    <blockquote
      className={cn('my-0', alignClass[align ?? 'left'], className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <p className="text-lg font-medium leading-relaxed text-foreground md:text-xl">
        &ldquo;{quote}&rdquo;
      </p>
      {citeParts.length > 0 ? (
        <footer className="mt-3 text-sm text-muted-foreground">
          {attribution ? <cite className="not-italic font-medium text-foreground">{attribution}</cite> : null}
          {attribution && source ? <span> — </span> : null}
          {source ? <span>{source}</span> : null}
        </footer>
      ) : null}
    </blockquote>
  )
}
