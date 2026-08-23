import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { cn } from '@/lib/utils/cn'

const valueSizeClass: Record<string, string> = {
  md: 'text-2xl md:text-3xl',
  lg: 'text-3xl md:text-4xl',
  xl: 'text-4xl md:text-5xl',
}

type StatsV2Props = {
  valueSize?: 'md' | 'lg' | 'xl' | null
  stats?: Array<{ id?: string | null; value: string; label: string }> | null
  styles?: StyleValues | null
  blockType?: string
  id?: string | null
}

export function StatsV2BlockComponent(props: StatsV2Props) {
  const { stats, valueSize = 'lg', styles } = props
  if (!stats?.length) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={cn('bg-foreground px-4 py-12 text-background', className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <div className="container mx-auto grid grid-cols-2 gap-8 text-center md:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.id ?? index} className="flex flex-col items-center gap-1">
            <p className={cn('font-bold', valueSizeClass[valueSize ?? 'lg'])}>{stat.value}</p>
            <p className="text-sm uppercase tracking-widest opacity-70">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
