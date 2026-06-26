export type SectionDividerColor = 'primary' | 'secondary' | 'neutral'

const dividerColorClassMap: Record<SectionDividerColor, string> = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  neutral: 'bg-neutral-300',
}

export function sectionDividerColorToClass(color: SectionDividerColor | null | undefined): string {
  if (!color) return dividerColorClassMap.primary
  return dividerColorClassMap[color] ?? dividerColorClassMap.primary
}

const dividerVisibilityClassMap: Record<string, string> = {
  '2': 'hidden lg:block',
  '3': 'hidden lg:block',
  '4': 'hidden md:block',
}

export function sectionDividerVisibilityClass(gridCols: string | null | undefined): string {
  if (!gridCols || gridCols === '1') return 'hidden'
  return dividerVisibilityClassMap[gridCols] ?? 'hidden lg:block'
}
