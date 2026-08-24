'use client'

import styles from './field-ui.module.css'

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T | ''
  options: Array<{ value: T; label: string }>
  onChange: (value: T | '') => void
  ariaLabel: string
}) {
  return (
    <div className={styles.segmented} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            className={`${styles.segment} ${active ? styles.segmentActive : ''}`}
            aria-pressed={active}
            onClick={() => onChange(active ? '' : option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function ToggleControl({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button type="button" className={styles.toggle} onClick={() => onChange(!checked)} aria-pressed={checked}>
      <span className={`${styles.switch} ${checked ? styles.switchOn : ''}`} aria-hidden>
        <span className={styles.switchThumb} />
      </span>
      {label}
    </button>
  )
}
