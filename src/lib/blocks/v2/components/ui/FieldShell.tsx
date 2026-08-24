'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { BREAKPOINT_META } from '@/lib/blocks/v2/theme'
import type { BreakpointKey } from '@/lib/blocks/v2/types'
import { BreakpointTabs } from './BreakpointTabs'
import styles from './field-ui.module.css'
import './v2-field-shell-gap.css'

export function FieldShell({
  label,
  description,
  activeBp,
  onBreakpoint,
  overrides,
  overflow = 'hidden',
  defaultOpen = false,
  children,
}: {
  label: string
  description?: string
  activeBp?: BreakpointKey
  onBreakpoint?: (next: BreakpointKey) => void
  overrides?: Record<BreakpointKey, boolean>
  overflow?: 'hidden' | 'visible'
  /** When true, the panel starts expanded (useful for fields with conditional extras). */
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const showBreakpoints = Boolean(activeBp && onBreakpoint && overrides)
  const inheritFrom = activeBp ? BREAKPOINT_META[activeBp].inheritsFrom : null
  const showInherit = Boolean(showBreakpoints && inheritFrom && activeBp && overrides && !overrides[activeBp])

  return (
    <div className={`v2-field-shell ${styles.fieldShell}`}>
      <div className={`${styles.panel} ${overflow === 'visible' ? styles.panelOverflowVisible : ''}`}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={styles.triggerIcon} aria-hidden>
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <span>{label}</span>
        </button>
        {open ? (
          <div className={styles.body}>
            {description ? <p className={styles.hint}>{description}</p> : null}
            {showBreakpoints && activeBp && onBreakpoint && overrides ? (
              <BreakpointTabs value={activeBp} onChange={onBreakpoint} overrides={overrides} />
            ) : null}
            {showInherit && inheritFrom ? (
              <p className={styles.inheritHint}>
                Inherits from {BREAKPOINT_META[inheritFrom].shortLabel.toLowerCase()} unless you set
                a value.
              </p>
            ) : null}
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}
