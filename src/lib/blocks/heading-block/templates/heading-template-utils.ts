import type { JSX } from 'react'

export type HeadingColorKeys = 'heading' | 'tag' | 'tagOutline' | 'tagPlain'

export const colorMap: Record<string, Record<HeadingColorKeys, string>> = {
  primary: {
    heading: 'text-primary-500',
    tag: 'bg-primary-500/10 text-primary-500',
    tagOutline: 'border border-primary-500 text-primary-500',
    tagPlain: 'text-primary-500',
  },
  neutral: {
    heading: 'text-neutral-500',
    tag: 'bg-neutral-100 text-neutral-600',
    tagOutline: 'border border-neutral-400 text-neutral-600',
    tagPlain: 'text-neutral-600',
  },
  success: {
    heading: 'text-green-700',
    tag: 'bg-green-100 text-green-700',
    tagOutline: 'border border-green-500 text-green-700',
    tagPlain: 'text-green-700',
  },
  danger: {
    heading: 'text-red-700',
    tag: 'bg-red-100 text-red-700',
    tagOutline: 'border border-red-500 text-red-700',
    tagPlain: 'text-red-700',
  },
  warning: {
    heading: 'text-amber-700',
    tag: 'bg-amber-100 text-amber-700',
    tagOutline: 'border border-amber-500 text-amber-700',
    tagPlain: 'text-amber-700',
  },
  white: {
    heading: 'text-white',
    tag: 'bg-white/10 text-white',
    tagOutline: 'border border-white text-white',
    tagPlain: 'text-white',
  },
}

export const sizeMap: Record<string, { heading: string; subheading: string }> = {
  sm: { heading: 'text-xl', subheading: 'text-sm' },
  md: { heading: 'text-2xl', subheading: 'text-base' },
  lg: { heading: 'text-2xl sm:text-3xl md:text-4xl', subheading: 'text-base md:text-lg' },
  xl: { heading: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl', subheading: 'text-lg md:text-xl' },
}

export const alignmentMap: Record<string, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

export const rowAlignmentMap: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const headingTagMap: Record<string, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
}

export const fontWeightMap: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
}
