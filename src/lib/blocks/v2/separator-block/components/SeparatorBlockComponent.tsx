import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { applyColor } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { cn } from '@/lib/utils/cn'
import type { SeparatorV2 } from '@/payload-types'

const thicknessClass: Record<string, string> = {
  hairline: 'border-t',
  thin: 'border-t',
  medium: 'border-t-2',
  thick: 'border-t-4',
}

const variantClass: Record<string, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
}

export function SeparatorV2BlockComponent(props: SeparatorV2) {
  const { variant = 'solid', thickness = 'thin', color, styles } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })
  const colorResult = applyColor(color, { property: 'borderColor' }, 'border')

  return (
    <hr
      aria-hidden="true"
      className={cn(
        'w-full border-0 border-t',
        thicknessClass[thickness ?? 'thin'],
        variantClass[variant ?? 'solid'],
        className,
      )}
      style={{ ...style, ...colorResult.style }}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    />
  )
}
