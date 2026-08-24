import type { CSSProperties } from 'react'

export type SpacingUnit = 'rem' | 'px' | '%'

export type BreakpointKey = 'base' | 'md' | 'lg'

export type BoxSide = 'top' | 'right' | 'bottom' | 'left'

export type BoxSides = Record<BoxSide, string>

export type BoxValue = {
  linked: boolean
  unit: SpacingUnit
  breakpoints: Record<BreakpointKey, BoxSides>
}

export type AxisPair = {
  row: string
  column: string
}

export type GapValue = {
  linked: boolean
  unit: SpacingUnit
  breakpoints: Record<BreakpointKey, AxisPair>
}

export type DisplayOption = 'block' | 'flex' | 'inline-flex' | 'grid' | 'inline-block' | 'none'

export type FlexDirectionOption = 'row' | 'row-reverse' | 'col' | 'col-reverse'

export type FlexWrapOption = 'nowrap' | 'wrap' | 'wrap-reverse'

export type FlexJustifyOption = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'

export type FlexAlignOption = 'start' | 'end' | 'center' | 'baseline' | 'stretch'

export type GridColsOption =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'

export type PositionOption = 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed'

export type OverflowOption = 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip'

export type VisibilityOption = 'visible' | 'hidden' | 'invisible'

export type KeywordBreakpoints<T extends string> = Record<BreakpointKey, T | ''>

export type DisplayValue = {
  breakpoints: KeywordBreakpoints<DisplayOption>
  flexDirection?: KeywordBreakpoints<FlexDirectionOption>
  flexWrap?: KeywordBreakpoints<FlexWrapOption>
  flexJustify?: KeywordBreakpoints<FlexJustifyOption>
  flexAlign?: KeywordBreakpoints<FlexAlignOption>
  gridCols?: KeywordBreakpoints<GridColsOption>
}

export type PositionValue = {
  breakpoints: KeywordBreakpoints<PositionOption>
}

export type VisibilityValue = {
  breakpoints: KeywordBreakpoints<VisibilityOption>
}

export type OverflowAxes = {
  x: OverflowOption | ''
  y: OverflowOption | ''
}

export type OverflowValue = {
  linked: boolean
  breakpoints: Record<BreakpointKey, OverflowAxes>
}

export type ContainerValue = {
  breakpoints: Record<BreakpointKey, boolean | null>
}

export type ColorTokenKey =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'success'
  | 'danger'
  | 'warning'
  | 'white'
  | 'foreground'
  | 'background'
  | 'border'
  | 'muted'

export type ColorSource = 'token' | 'custom' | ''

export type ColorValue = {
  source: ColorSource
  token: ColorTokenKey | ''
  hex: string
}

export type ColorCssProperty = 'color' | 'backgroundColor' | 'borderColor'

export type ApplyOptions = {
  slot?: string
}

export type ApplyResult = {
  className: string
  style: CSSProperties
  attrs: Record<string, string>
}

export type StyleFieldKey =
  | 'padding'
  | 'margin'
  | 'display'
  | 'position'
  | 'container'
  | 'gap'
  | 'inset'
  | 'overflow'
  | 'visibility'
  | 'backgroundColor'

export type BoxKind = 'padding' | 'margin' | 'inset'

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[]
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}
