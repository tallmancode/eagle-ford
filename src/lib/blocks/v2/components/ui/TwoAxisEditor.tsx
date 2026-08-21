'use client'

import { Link2, Link2Off } from 'lucide-react'
import { MeasureInput } from './BoxSidesEditor'
import { SPACING_UNITS } from '@/lib/blocks/v2/theme'
import type { SpacingUnit } from '@/lib/blocks/v2/types'
import styles from './field-ui.module.css'

export function TwoAxisEditor({
  linked,
  unit,
  first,
  second,
  firstLabel,
  secondLabel,
  placeholder = '0',
  showUnit = true,
  onToggleLinked,
  onUnitChange,
  onFirstChange,
  onSecondChange,
  ariaLabel,
}: {
  linked: boolean
  unit?: SpacingUnit
  first: string
  second: string
  firstLabel: string
  secondLabel: string
  placeholder?: string
  showUnit?: boolean
  onToggleLinked: () => void
  onUnitChange?: (unit: SpacingUnit) => void
  onFirstChange: (value: string) => void
  onSecondChange: (value: string) => void
  ariaLabel: string
}) {
  return (
    <div>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.linkBtn} ${linked ? styles.linkBtnActive : ''}`}
          onClick={onToggleLinked}
          aria-pressed={linked}
          title={linked ? 'Unlink axes' : 'Link axes'}
        >
          {linked ? <Link2 size={16} /> : <Link2Off size={16} />}
          <span className={styles.srOnly}>{linked ? 'Unlink axes' : 'Link axes'}</span>
        </button>
        {showUnit && unit && onUnitChange ? (
          <select
            className={styles.unitSelect}
            value={unit}
            onChange={(event) => onUnitChange(event.target.value as SpacingUnit)}
            aria-label={`${ariaLabel} unit`}
          >
            {SPACING_UNITS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        ) : (
          <span />
        )}
      </div>
      {linked ? (
        <MeasureInput
          label="Both"
          value={first}
          placeholder={placeholder}
          onChange={onFirstChange}
          ariaLabel={`${ariaLabel} both`}
        />
      ) : (
        <div className={styles.axisRow}>
          <div className={styles.axisField}>
            <MeasureInput
              label={firstLabel}
              value={first}
              placeholder={placeholder}
              onChange={onFirstChange}
              ariaLabel={`${ariaLabel} ${firstLabel}`}
            />
          </div>
          <div className={styles.axisField}>
            <MeasureInput
              label={secondLabel}
              value={second}
              placeholder={placeholder}
              onChange={onSecondChange}
              ariaLabel={`${ariaLabel} ${secondLabel}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}
