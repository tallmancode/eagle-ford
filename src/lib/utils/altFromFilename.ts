/** "2024-f-150-hero.jpg" → "2024 f 150 hero" */
export function altFromFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '')
  return base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
}
