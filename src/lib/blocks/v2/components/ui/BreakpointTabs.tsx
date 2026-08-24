'use client'

import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { BREAKPOINT_META, BREAKPOINTS } from '@/lib/blocks/v2/theme'
import type { BreakpointKey } from '@/lib/blocks/v2/types'
import styles from './field-ui.module.css'

const ICONS = {
  base: Smartphone,
  md: Tablet,
  lg: Monitor,
} as const

export function BreakpointTabs({
  value,
  onChange,
  overrides,
}: {
  value: BreakpointKey
  onChange: (next: BreakpointKey) => void
  overrides: Record<BreakpointKey, boolean>
}) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Breakpoint">
      {BREAKPOINTS.map((bp) => {
        const Icon = ICONS[bp]
        const meta = BREAKPOINT_META[bp]
        const selected = value === bp
        return (
          <button
            key={bp}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`${styles.tab} ${selected ? styles.tabActive : ''}`}
            onClick={() => onChange(bp)}
          >
            {overrides[bp] ? <span className={styles.dot} aria-hidden /> : null}
            <Icon size={16} aria-hidden />
            {meta.shortLabel}
          </button>
        )
      })}
    </div>
  )
}
