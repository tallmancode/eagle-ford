import type { SectionBackgroundStyleValue } from '@/lib/blocks/section-block/sectionBackgroundStyleField'

const sectionBackgroundStyleClassMap: Record<SectionBackgroundStyleValue, string> = {
  none: '',
  slanted: 'section-bg-slanted',
}

export function sectionBackgroundStyleToClass(value?: string | null): string {
  if (!value || value === 'none') return ''
  return sectionBackgroundStyleClassMap[value as SectionBackgroundStyleValue] ?? ''
}
