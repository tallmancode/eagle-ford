import { afterEach, describe, expect, it } from 'vitest'

import { applyPadding, applyMargin, applyInset, applyGap, applyDisplay, applyVisibility, applyContainer, applyStyles, applyColor } from '@/lib/blocks/v2/apply/styles'
import {
  resolveBoxBreakpoints,
  resolveKeywordBreakpoints,
  resolveContainerBreakpoints,
} from '@/lib/blocks/v2/apply/cascade'
import {
  emptyBoxValue,
  mergeBoxValue,
  mergeColorValue,
  sanitizeHex,
  validatePaddingValue,
  validateMarginValue,
  validateGapValue,
  validateColorValue,
  measureToCss,
} from '@/lib/blocks/v2/apply/values'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { normalizeSavedColors, paletteHasHex } from '@/lib/blocks/v2/palette'
import { defineV2Theme, defaultV2Theme, v2Theme } from '@/lib/blocks/v2/theme'
import {
  boxValueFromStyleDefaults,
  defineV2BlocksConfig,
  getV2BlockBoxDefault,
  getV2BlockContainerEnabled,
  resetV2BlocksConfig,
} from '@/lib/blocks/v2/blocks-config'
import type { BoxValue, DisplayValue, VisibilityValue } from '@/lib/blocks/v2/types'

const boxDefaults = { linked: true, unit: 'rem' as const }

function box(partial: Partial<BoxValue['breakpoints']> & { unit?: BoxValue['unit']; linked?: boolean }): BoxValue {
  const empty = emptyBoxValue(boxDefaults)
  return {
    linked: partial.linked ?? true,
    unit: partial.unit ?? 'rem',
    breakpoints: {
      base: partial.base ?? empty.breakpoints.base,
      md: partial.md ?? empty.breakpoints.md,
      lg: partial.lg ?? empty.breakpoints.lg,
    },
  }
}

describe('v2 theme merge', () => {
  it('keeps Ford container defaults', () => {
    expect(v2Theme.container.className).toBe('container')
    expect(v2Theme.container.defaultEnabled).toBe(true)
    expect(v2Theme.defaultUnit).toBe('rem')
  })

  it('lets call-site / brand overrides win', () => {
    const theme = defineV2Theme({
      defaultUnit: 'px',
      padding: { linked: false, unit: 'px' },
      container: { className: 'shell', defaultEnabled: false },
    })
    expect(theme.defaultUnit).toBe('px')
    expect(theme.padding).toEqual({ linked: false, unit: 'px' })
    expect(theme.margin).toEqual(defaultV2Theme.margin)
    expect(theme.container).toEqual({ className: 'shell', defaultEnabled: false })
  })
})

describe('v2 blocks config', () => {
  afterEach(() => {
    resetV2BlocksConfig()
  })

  it('maps mobile/tablet/desktop aliases onto base/md/lg', () => {
    const value = boxValueFromStyleDefaults(
      {
        mobile: { top: '1', bottom: '1' },
        tablet: { top: '2' },
        desktop: { top: '3' },
      },
      { linked: true, unit: 'rem' },
    )
    expect(value.unit).toBe('rem')
    expect(value.linked).toBe(false)
    expect(value.breakpoints.base).toEqual({ top: '1', right: '', bottom: '1', left: '' })
    expect(value.breakpoints.md).toEqual({ top: '2', right: '', bottom: '', left: '' })
    expect(value.breakpoints.lg).toEqual({ top: '3', right: '', bottom: '', left: '' })
  })

  it('stores section padding defaults from defineV2BlocksConfig', () => {
    defineV2BlocksConfig({
      sectionBlock: {
        padding: {
          mobile: { top: '1', bottom: '1' },
        },
      },
    })
    const padding = getV2BlockBoxDefault('sectionBlock', 'padding')
    expect(padding.breakpoints.base.top).toBe('1')
    expect(padding.breakpoints.base.bottom).toBe('1')
    expect(padding.breakpoints.base.left).toBe('')
  })

  it('stores container defaultEnabled from defineV2BlocksConfig', () => {
    defineV2BlocksConfig({
      sectionBlock: {
        container: { defaultEnabled: false },
      },
    })
    expect(getV2BlockContainerEnabled('sectionBlock')).toBe(false)
  })
})

describe('v2 cascade', () => {
  it('applies mobile box values to larger breakpoints until overridden', () => {
    const resolved = resolveBoxBreakpoints({
      base: { top: '1', right: '1', bottom: '1', left: '1' },
      md: { top: '', right: '', bottom: '', left: '' },
      lg: { top: '2', right: '', bottom: '', left: '' },
    })
    expect(resolved.md).toEqual({ top: '1', right: '1', bottom: '1', left: '1' })
    expect(resolved.lg).toEqual({ top: '2', right: '1', bottom: '1', left: '1' })
  })

  it('cascades keyword values mobile-first', () => {
    const resolved = resolveKeywordBreakpoints({
      base: 'flex',
      md: '',
      lg: 'grid',
    })
    expect(resolved.md).toBe('flex')
    expect(resolved.lg).toBe('grid')
  })

  it('cascades container booleans and treats null as inherit', () => {
    expect(
      resolveContainerBreakpoints({
        base: true,
        md: null,
        lg: false,
      }),
    ).toEqual({ base: true, md: true, lg: false })
  })
})

describe('v2 validate', () => {
  it('accepts empty and valid padding', () => {
    expect(validatePaddingValue(undefined)).toBe(true)
    expect(
      validatePaddingValue(
        box({
          base: { top: '1.5', right: '1.5', bottom: '1.5', left: '1.5' },
        }),
      ),
    ).toBe(true)
  })

  it('rejects padding that is not a number', () => {
    expect(
      validatePaddingValue(
        box({
          base: { top: '10px', right: '', bottom: '', left: '' },
        }),
      ),
    ).toBe('Invalid values for base')
  })

  it('allows negative and auto margin', () => {
    expect(
      validateMarginValue(
        box({
          base: { top: '-1', right: 'auto', bottom: '0', left: 'auto' },
        }),
      ),
    ).toBe(true)
  })

  it('rejects negative gap', () => {
    expect(
      validateGapValue({
        linked: true,
        unit: 'rem',
        breakpoints: {
          base: { row: '-1', column: '-1' },
          md: { row: '', column: '' },
          lg: { row: '', column: '' },
        },
      }),
    ).toBe('Invalid row gap for base')
  })
})

describe('v2 apply helpers', () => {
  it('writes CSS vars only for breakpoints that have raw values', () => {
    const result = applyPadding(
      box({
        base: { top: '1', right: '', bottom: '', left: '' },
        md: { top: '2', right: '', bottom: '', left: '' },
      }),
    )
    expect(result.className).toBe('v2-box-padding')
    expect(result.style).toMatchObject({
      '--v2-pad-top': '1rem',
      '--v2-pad-top-md': '2rem',
    })
    expect(result.style).not.toHaveProperty('--v2-pad-top-lg')
    expect(result.attrs['data-v2-pad']).toBe('root')
  })

  it('namespaces CSS vars by slot without dropping the generic names', () => {
    const result = applyPadding(
      box({
        base: { top: '1', right: '1', bottom: '1', left: '1' },
      }),
      { slot: 'card' },
    )
    expect(result.style).toMatchObject({
      '--v2-pad-top': '1rem',
      '--v2-card-pad-top': '1rem',
    })
    expect(result.attrs['data-v2-pad']).toBe('card')
  })

  it('emits display classes only when the value changes', () => {
    const value: DisplayValue = {
      breakpoints: { base: 'flex', md: '', lg: 'grid' },
    }
    expect(applyDisplay(value).className).toBe('flex lg:grid')
  })

  it('emits flex direction and wrap only when display is flex', () => {
    expect(
      applyDisplay({
        breakpoints: { base: 'flex', md: '', lg: '' },
        flexDirection: { base: 'col', md: '', lg: '' },
        flexWrap: { base: 'wrap', md: '', lg: '' },
      }).className,
    ).toBe('flex flex-col flex-wrap')

    expect(
      applyDisplay({
        breakpoints: { base: 'block', md: '', lg: '' },
        flexDirection: { base: 'col', md: '', lg: '' },
        flexWrap: { base: 'wrap', md: '', lg: '' },
      }).className,
    ).toBe('block')
  })

  it('emits flex justify and align only when display is flex', () => {
    expect(
      applyDisplay({
        breakpoints: { base: 'flex', md: '', lg: '' },
        flexJustify: { base: 'between', md: '', lg: '' },
        flexAlign: { base: 'center', md: '', lg: '' },
      }).className,
    ).toBe('flex justify-between items-center')

    expect(
      applyDisplay({
        breakpoints: { base: 'grid', md: '', lg: '' },
        flexJustify: { base: 'between', md: '', lg: '' },
        flexAlign: { base: 'center', md: '', lg: '' },
      }).className,
    ).toBe('grid')
  })

  it('emits flex extras for inline-flex and grid-cols only under grid', () => {
    expect(
      applyDisplay({
        breakpoints: { base: 'inline-flex', md: '', lg: '' },
        flexDirection: { base: 'row', md: '', lg: '' },
      }).className,
    ).toBe('inline-flex flex-row')

    expect(
      applyDisplay({
        breakpoints: { base: 'grid', md: '', lg: '' },
        gridCols: { base: '3', md: '', lg: '' },
        flexDirection: { base: 'col', md: '', lg: '' },
      }).className,
    ).toBe('grid grid-cols-3')
  })

  it('cascades flex direction and only emits when it changes', () => {
    expect(
      applyDisplay({
        breakpoints: { base: 'flex', md: '', lg: '' },
        flexDirection: { base: 'col', md: '', lg: 'row' },
      }).className,
    ).toBe('flex flex-col lg:flex-row')
  })

  it('restores flex after hiding so visibility does not force block', () => {
    const value: VisibilityValue = {
      breakpoints: { base: 'hidden', md: 'visible', lg: '' },
    }
    expect(applyVisibility(value, { restoreDisplay: 'flex' }).className).toBe(
      'hidden md:flex md:visible',
    )
  })

  it('emits the Ford container class when the stored value is on', () => {
    expect(
      applyContainer({
        breakpoints: { base: true, md: null, lg: null },
      }).className,
    ).toBe('container')
  })

  it('does not invent a container class when no value is stored', () => {
    expect(applyContainer(undefined).className).toBe('')
    expect(applyContainer(null).className).toBe('')
    expect(
      applyStyles({
        display: { breakpoints: { base: 'flex', md: '', lg: '' } },
      }).className,
    ).toBe('flex')
  })

  it('turns container off from tablet up', () => {
    expect(
      applyContainer({
        breakpoints: { base: true, md: false, lg: null },
      }).className,
    ).toContain('md:max-w-none')
  })

  it('composes applyStyles class names', () => {
    const result = applyStyles({
      padding: box({
        base: { top: '1', right: '1', bottom: '1', left: '1' },
      }),
      display: { breakpoints: { base: 'flex', md: '', lg: '' } },
      container: { breakpoints: { base: true, md: null, lg: null } },
    })
    expect(result.className.split(' ').sort()).toEqual(['container', 'flex', 'v2-box-padding'].sort())
  })

  it('does not emit CSS for invalid measure drafts', () => {
    expect(measureToCss('a', 'rem')).toBe('')
    expect(measureToCss('auto', 'rem')).toBe('auto')
    const result = applyMargin(
      mergeBoxValue(
        box({
          base: { top: 'auto', right: '', bottom: '', left: '' },
        }),
        boxDefaults,
        { allowNegative: true, allowAuto: true },
      ),
    )
    expect(result.style).toMatchObject({ '--v2-mar-top': 'auto' })
  })

  it('applies inset as offsets (not a *-inset class — Tailwind 4 cannot parse that)', () => {
    const result = applyInset(
      mergeBoxValue(
        box({
          base: { top: '1', right: '1', bottom: '1', left: '1' },
        }),
        boxDefaults,
        { allowNegative: true, allowAuto: true },
      ),
    )
    expect(result.className).toBe('v2-box-offsets')
    expect(result.style).toMatchObject({ '--v2-pin-top': '1rem' })
  })

  it('applies gap vars for row and column', () => {
    const result = applyGap({
      linked: false,
      unit: 'px',
      breakpoints: {
        base: { row: '8', column: '16' },
        md: { row: '', column: '' },
        lg: { row: '', column: '' },
      },
    })
    expect(result.className).toBe('v2-box-gap')
    expect(result.style).toMatchObject({
      '--v2-gap-row': '8px',
      '--v2-gap-column': '16px',
    })
  })
})

describe('v2 color field', () => {
  it('normalizes hex to lowercase 6-digit', () => {
    expect(sanitizeHex('#AbC')).toBe('#aabbcc')
    expect(sanitizeHex('1E1654')).toBe('#1e1654')
    expect(sanitizeHex('red')).toBe('')
    expect(sanitizeHex('url(javascript:alert(1))')).toBe('')
  })

  it('merges legacy select strings', () => {
    expect(mergeColorValue('primary')).toEqual({ source: 'token', token: 'primary', hex: '' })
    expect(mergeColorValue('default')).toEqual({ source: '', token: '', hex: '' })
    expect(mergeColorValue('border')).toEqual({ source: 'token', token: 'border', hex: '' })
    expect(mergeColorValue('#fff')).toEqual({ source: 'custom', token: '', hex: '#ffffff' })
  })

  it('uses the default token when the value is empty', () => {
    expect(mergeColorValue(undefined, 'primary')).toEqual({
      source: 'token',
      token: 'primary',
      hex: '',
    })
    expect(mergeColorValue({ source: '', token: '', hex: '' }, 'primary')).toEqual({
      source: '',
      token: '',
      hex: '',
    })
  })

  it('accepts legacy strings in validate', () => {
    expect(validateColorValue('primary')).toBe(true)
    expect(validateColorValue('default')).toBe(true)
    expect(validateColorValue('#1E1654')).toBe(true)
    expect(validateColorValue({ source: 'custom', token: '', hex: '#ff00aa' })).toBe(true)
    expect(validateColorValue({ source: 'token', token: 'nope', hex: '' })).toBe('Invalid color token')
  })

  it('resolves tokens to CSS vars with fallbacks and custom hex as-is', () => {
    expect(resolveColorCss('primary')).toBe('var(--color-primary, #1e1654)')
    expect(resolveColorCss({ source: 'custom', token: '', hex: '#aabbcc' })).toBe('#aabbcc')
    expect(resolveColorCss({ source: '', token: '', hex: '' })).toBeUndefined()
  })

  it('applies color to the requested CSS property', () => {
    expect(applyColor('primary', { property: 'color' }).style).toEqual({
      color: 'var(--color-primary, #1e1654)',
    })
    expect(applyColor('border', { property: 'borderColor' }, 'border').style).toEqual({
      borderColor: 'var(--color-border, #ebebeb)',
    })
    expect(applyColor(undefined, { property: 'color' }).style).toEqual({})
  })

  it('applies backgroundColor through applyStyles', () => {
    const result = applyStyles({
      backgroundColor: { source: 'token', token: 'primary', hex: '' },
    })
    expect(result.style).toMatchObject({
      backgroundColor: 'var(--color-primary, #1e1654)',
    })
  })

  it('normalizes saved palette rows and skips duplicates', () => {
    expect(
      normalizeSavedColors([
        { id: 'a', label: ' Gold ', hex: '#FF0' },
        { id: 'b', label: 'Gold again', hex: '#ffff00' },
        { id: 'a', label: 'dup id', hex: '#000000' },
        { label: 'missing id', hex: '#111111' },
        { id: 'c', hex: 'not-a-color' },
      ]),
    ).toEqual([{ id: 'a', label: 'Gold', hex: '#ffff00' }])
    expect(paletteHasHex([{ id: 'a', label: '', hex: '#ffff00' }], '#FF0')).toBe(true)
  })
})
