type SizeEntry = { css: Record<string, string>; label: string }
type SizeStateMap = Record<string, SizeEntry>

export const richTextSizeState: SizeStateMap = {
  'text-sm': { label: 'Small Text', css: { 'font-size': '0.875rem', 'line-height': '1.25rem' } },
}
