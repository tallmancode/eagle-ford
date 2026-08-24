import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { CheckCircle2 } from 'lucide-react'

type FeatureListV2Props = {
  showCheckIcon?: boolean | null
  features?: Array<{ id?: string | null; title: string; description: string }> | null
  styles?: StyleValues | null
  blockType?: string
  id?: string | null
}

export function FeatureListV2BlockComponent(props: FeatureListV2Props) {
  const { features, showCheckIcon = true, styles } = props
  if (!features?.length) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <ul
      className={['space-y-6', className].filter(Boolean).join(' ')}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      {features.map((feature, index) => (
        <li key={feature.id ?? index} className="flex gap-4">
          {showCheckIcon ? (
            <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
          ) : null}
          <div>
            <h3 className="mb-1 font-semibold text-foreground">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
