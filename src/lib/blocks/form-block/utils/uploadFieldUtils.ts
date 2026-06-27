export function mimePatternsToAccept(mimeTypes?: { mimeType: string }[] | null): string {
  if (!mimeTypes?.length) {
    return 'image/jpeg,image/png,image/gif'
  }

  return mimeTypes.map((entry) => entry.mimeType).join(',')
}

export function buildUploadHelperText(
  mimeTypes?: { mimeType: string }[] | null,
  maxFileSize?: number | null,
): string {
  const typeLabels: string[] = []

  if (mimeTypes?.length) {
    for (const { mimeType } of mimeTypes) {
      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        typeLabels.push('JPG')
      } else if (mimeType === 'image/png') {
        typeLabels.push('PNG')
      } else if (mimeType === 'image/gif') {
        typeLabels.push('GIF')
      } else if (mimeType === 'image/webp') {
        typeLabels.push('WEBP')
      } else if (mimeType.startsWith('image/')) {
        typeLabels.push(mimeType.replace('image/', '').toUpperCase())
      }
    }
  }

  const typesPart = typeLabels.length > 0 ? [...new Set(typeLabels)].join(', ') : 'JPG, PNG, GIF'

  const sizePart =
    maxFileSize && maxFileSize > 0
      ? `max ${(maxFileSize / (1024 * 1024)).toFixed(0)} MB`
      : 'max 10 MB'

  return `Drag images here or select from library, ${typesPart}, ${sizePart}`
}

export function fileMatchesMimePatterns(
  file: File,
  mimeTypes?: { mimeType: string }[] | null,
): boolean {
  if (!mimeTypes?.length) {
    return true
  }

  return mimeTypes.some(({ mimeType }) => {
    if (mimeType.endsWith('/*')) {
      const prefix = mimeType.slice(0, -1)
      return file.type.startsWith(prefix)
    }
    return file.type === mimeType
  })
}

export function normalizeUploadValue(value: unknown): File[] {
  if (!value) {
    return []
  }
  if (value instanceof File) {
    return [value]
  }
  if (Array.isArray(value)) {
    return value.filter((item): item is File => item instanceof File)
  }
  return []
}
