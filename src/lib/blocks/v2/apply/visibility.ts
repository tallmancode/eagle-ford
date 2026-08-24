import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import type { ApplyResult, DisplayOption, VisibilityOption, VisibilityValue } from '@/lib/blocks/v2/types'
import { BP_CLASS_PREFIX, resolveKeywordBreakpoints } from '@/lib/blocks/v2/apply/cascade'
import { DISPLAY_CLASS } from '@/lib/blocks/v2/apply/display'
import { emptyApplyResult } from '@/lib/blocks/v2/apply/result'
import { keywordHasValues, mergeVisibilityValue } from '@/lib/blocks/v2/apply/values'

function restoreClass(display: DisplayOption | '' | undefined): string {
  if (!display || display === 'none') return 'block'
  return DISPLAY_CLASS[display]
}

/**
 * Hidden uses `hidden` (display: none). Invisible uses `invisible` (keeps space).
 * When showing again after `hidden`, restore the display field class (flex/grid/block)
 * so this field does not force `md:block` on a flex slot.
 */
export function applyVisibility(
  value: VisibilityValue | null | undefined,
  options?: { restoreDisplay?: DisplayOption | '' },
): ApplyResult {
  const merged = mergeVisibilityValue(value)
  if (!keywordHasValues(merged.breakpoints)) return emptyApplyResult()

  const resolved = resolveKeywordBreakpoints(merged.breakpoints)
  const restore = restoreClass(options?.restoreDisplay)
  const classes: string[] = []
  let previous: VisibilityOption | '' = ''

  for (const bp of BREAKPOINTS) {
    const current = resolved[bp] as VisibilityOption | ''
    if (current === '' || current === previous) continue
    const prefix = BP_CLASS_PREFIX[bp]

    if (current === 'hidden') {
      classes.push(`${prefix}hidden`)
    } else if (current === 'invisible') {
      if (previous === 'hidden') classes.push(`${prefix}${restore}`)
      classes.push(`${prefix}invisible`)
    } else {
      if (previous === 'hidden') classes.push(`${prefix}${restore}`)
      if (previous === 'invisible' || previous === 'hidden') classes.push(`${prefix}visible`)
    }

    previous = current
  }

  return {
    className: classes.join(' '),
    style: {},
    attrs: {},
  }
}
