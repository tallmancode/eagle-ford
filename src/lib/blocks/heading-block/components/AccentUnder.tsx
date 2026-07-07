const PRIMARY_ACCENT_COLOR = 'var(--color-primary-500)'

type AccentUnderProps = {
  children: React.ReactNode
  color?: string
}

export function AccentUnder({ children, color }: AccentUnderProps) {
  const accentColor = color ?? PRIMARY_ACCENT_COLOR

  return (
    <span
      className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{
        backgroundImage: `linear-gradient(to top, ${accentColor} 38%, transparent 38%)`,
      }}
    >
      {children}
    </span>
  )
}
