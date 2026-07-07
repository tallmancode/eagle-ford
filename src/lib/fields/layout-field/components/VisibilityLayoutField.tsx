'use client'

import { useCallback, useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import { ChevronDown, ChevronRight, Monitor, Smartphone, Tablet } from 'lucide-react'
import type { JSONFieldClientProps } from 'payload'
import type {
  LayoutVisibilityValue,
  SpacingBreakpointKey,
} from '@/lib/fields/layout-field/utils/layout-utils'
import {
  defaultLayoutVisibilityValue,
  mergeLayoutVisibilityWithDefaults,
  SPACING_BREAKPOINTS,
} from '@/lib/fields/layout-field/utils/layout-utils'
import styles from './SpacingLayoutField.module.css'

const BP_META: Record<SpacingBreakpointKey, { hideLabel: string; Icon: typeof Smartphone }> = {
  base: { hideLabel: 'Hide on mobile', Icon: Smartphone },
  md: { hideLabel: 'Hide on tablet', Icon: Tablet },
  lg: { hideLabel: 'Hide on desktop', Icon: Monitor },
}

export function VisibilityLayoutField(props: JSONFieldClientProps) {
  const { path, field } = props
  const { value, setValue } = useField<LayoutVisibilityValue | null | undefined>({ path })

  const merged = useMemo(() => mergeLayoutVisibilityWithDefaults(value), [value])
  const [open, setOpen] = useState(true)

  const toggleHideAt = useCallback(
    (bp: SpacingBreakpointKey) => {
      const base = mergeLayoutVisibilityWithDefaults(value)
      const hideAt = { ...defaultLayoutVisibilityValue().hideAt, ...base.hideAt }
      hideAt[bp] = !hideAt[bp]
      setValue({ hideAt })
    },
    [setValue, value],
  )

  const description =
    field?.admin && typeof field.admin === 'object' && 'description' in field.admin
      ? (field.admin.description as string | undefined)
      : undefined

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <button type="button" className={styles.trigger} onClick={() => setOpen((o) => !o)}>
          <span className={styles.triggerIcon} aria-hidden>
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <span>{typeof field.label === 'string' ? field.label : 'Visibility'}</span>
        </button>

        {open ? (
          <div className={styles.body}>
            {description ? <p className={styles.hint}>{description}</p> : null}

            <div className={styles.toggleGroup}>
              {SPACING_BREAKPOINTS.map((bp) => {
                const { hideLabel, Icon } = BP_META[bp]
                const hidden = merged.hideAt?.[bp] === true
                return (
                  <button
                    key={bp}
                    type="button"
                    className={`${styles.toggleBtn} ${hidden ? styles.toggleBtnActive : ''}`}
                    onClick={() => toggleHideAt(bp)}
                    aria-pressed={hidden}
                  >
                    <Icon size={14} aria-hidden />
                    {hideLabel}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
