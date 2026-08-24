import type { DisplayOption } from '@/lib/blocks/v2/types'
import { applyPadding, applyMargin, applyInset } from '@/lib/blocks/v2/apply/box'
import { applyGap } from '@/lib/blocks/v2/apply/gap'
import { applyDisplay, applyPosition } from '@/lib/blocks/v2/apply/display'
import { applyOverflow } from '@/lib/blocks/v2/apply/overflow'
import { applyVisibility } from '@/lib/blocks/v2/apply/visibility'
import { applyContainer } from '@/lib/blocks/v2/apply/container'
import { applyColor } from '@/lib/blocks/v2/apply/color'
import { mergeApplyResults } from '@/lib/blocks/v2/apply/result'
import { mergeDisplayValue } from '@/lib/blocks/v2/apply/values'
import { resolveKeywordBreakpoints } from '@/lib/blocks/v2/apply/cascade'
import type {
  ApplyOptions,
  ApplyResult,
  BoxValue,
  ColorValue,
  ContainerValue,
  DisplayValue,
  GapValue,
  OverflowValue,
  PositionValue,
  VisibilityValue,
} from '@/lib/blocks/v2/types'

export type StyleValues = {
  padding?: BoxValue | null
  margin?: BoxValue | null
  inset?: BoxValue | null
  gap?: GapValue | null
  display?: DisplayValue | null
  position?: PositionValue | null
  overflow?: OverflowValue | null
  visibility?: VisibilityValue | null
  container?: ContainerValue | null
  backgroundColor?: ColorValue | string | null
}

export function applyStyles(values: StyleValues, options?: ApplyOptions): ApplyResult {
  const displayResolved = resolveKeywordBreakpoints(mergeDisplayValue(values.display).breakpoints)
  const restoreDisplay = (displayResolved.lg ||
    displayResolved.md ||
    displayResolved.base) as DisplayOption | ''

  return mergeApplyResults([
    applyContainer(values.container),
    applyPadding(values.padding, options),
    applyMargin(values.margin, options),
    applyInset(values.inset, options),
    applyGap(values.gap, options),
    applyDisplay(values.display),
    applyPosition(values.position),
    applyOverflow(values.overflow),
    applyVisibility(values.visibility, { restoreDisplay }),
    applyColor(values.backgroundColor, { property: 'backgroundColor' }),
  ])
}

export {
  applyPadding,
  applyMargin,
  applyInset,
  applyGap,
  applyDisplay,
  applyPosition,
  applyOverflow,
  applyVisibility,
  applyContainer,
  applyColor,
}
