'use client'

import { Link2, Link2Off } from 'lucide-react'
import type { BoxSide, BoxSides, SpacingUnit } from '@/lib/blocks/v2/types'
import { SPACING_UNITS } from '@/lib/blocks/v2/theme'
import styles from './field-ui.module.css'

const SIDE_LABEL: Record<BoxSide, string> = {
  top: 'Top',
  right: 'Right',
  bottom: 'Bottom',
  left: 'Left',
}

export function BoxSidesEditor({
  sides,
  linked,
  unit,
  placeholder = '0',
  onSideChange,
  onToggleLinked,
  onUnitChange,
  ariaLabel,
}: {
  sides: BoxSides
  linked: boolean
  unit: SpacingUnit
  placeholder?: string
  onSideChange: (side: BoxSide, value: string) => void
  onToggleLinked: () => void
  onUnitChange: (unit: SpacingUnit) => void
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
          title={linked ? 'Unlink sides' : 'Link sides'}
        >
          {linked ? <Link2 size={16} /> : <Link2Off size={16} />}
          <span className={styles.srOnly}>{linked ? 'Unlink sides' : 'Link sides'}</span>
        </button>
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
      </div>
      <div className={styles.box}>
        <div className={styles.boxTop}>
          <MeasureInput
            label={SIDE_LABEL.top}
            value={sides.top}
            placeholder={placeholder}
            onChange={(next) => onSideChange('top', next)}
            ariaLabel={`${ariaLabel} top`}
          />
        </div>
        <div className={styles.boxLeft}>
          <MeasureInput
            label={SIDE_LABEL.left}
            value={sides.left}
            placeholder={placeholder}
            onChange={(next) => onSideChange('left', next)}
            ariaLabel={`${ariaLabel} left`}
          />
        </div>
        <div className={styles.boxCenter}>
          <span className={styles.measureLabel}>{linked ? 'All' : 'Box'}</span>
        </div>
        <div className={styles.boxRight}>
          <MeasureInput
            label={SIDE_LABEL.right}
            value={sides.right}
            placeholder={placeholder}
            onChange={(next) => onSideChange('right', next)}
            ariaLabel={`${ariaLabel} right`}
          />
        </div>
        <div className={styles.boxBottom}>
          <MeasureInput
            label={SIDE_LABEL.bottom}
            value={sides.bottom}
            placeholder={placeholder}
            onChange={(next) => onSideChange('bottom', next)}
            ariaLabel={`${ariaLabel} bottom`}
          />
        </div>
      </div>
    </div>
  )
}

export function MeasureInput({
  label,
  value,
  placeholder,
  onChange,
  ariaLabel,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  ariaLabel: string
}) {
  return (
    <label className={styles.measure}>
      <input
        className={styles.measureInput}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
      />
      <span className={styles.measureLabel}>{label}</span>
    </label>
  )
}
