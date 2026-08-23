import { v2Theme } from '@/lib/blocks/v2/theme'
import type { ApplyResult, ContainerValue } from '@/lib/blocks/v2/types'
import { resolveContainerBreakpoints } from '@/lib/blocks/v2/apply/cascade'
import { emptyApplyResult } from '@/lib/blocks/v2/apply/result'
import { mergeContainerValue } from '@/lib/blocks/v2/apply/values'

const OFF_AT_MD = ['md:max-w-none', 'md:!mx-0', 'md:!px-0']
const OFF_AT_LG = ['lg:max-w-none', 'lg:!mx-0', 'lg:!px-0']

export function applyContainer(value: ContainerValue | null | undefined): ApplyResult {
  // Theme `defaultEnabled` is for Section/Wrapper field defaultValue only.
  // Content blocks call applyStyles without a container field — do not invent the class.
  if (value == null || typeof value !== 'object') return emptyApplyResult()

  const merged = mergeContainerValue(value, false)
  const resolved = resolveContainerBreakpoints(merged.breakpoints)
  const name = v2Theme.container.className || 'container'
  const { base, md, lg } = resolved

  if (!base && !md && !lg) return emptyApplyResult()

  const classes: string[] = []

  if (base) {
    classes.push(name)
    if (!md) classes.push(...OFF_AT_MD)
    if (md && !lg) classes.push(...OFF_AT_LG)
    if (!md && lg) classes.push(`lg:${name}`)
  } else if (md) {
    classes.push(`md:${name}`)
    if (!lg) classes.push(...OFF_AT_LG)
  } else {
    classes.push(`lg:${name}`)
  }

  return {
    className: classes.join(' '),
    style: {},
    attrs: {},
  }
}
