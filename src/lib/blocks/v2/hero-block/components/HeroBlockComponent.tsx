import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { HeroBlock } from '@/lib/blocks/hero-block/components/HeroBlockComponent'
import type { Hero, HeroV2 } from '@/payload-types'

export function HeroV2BlockComponent(props: HeroV2) {
  const { styles, blockType: _blockType, ...hero } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <HeroBlock {...({ ...hero, blockType: 'hero' } as Hero)} />
    </div>
  )
}
