/** Normalize YouTube / Vimeo URLs to an embeddable iframe src. */
export function resolveVideoEmbedUrl(raw: string): string | null {
  const url = raw.trim()
  if (!url) return null

  try {
    if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/video/')) {
      return url
    }

    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split(/[?&#]/)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (url.includes('youtube.com/shorts/')) {
      const id = url.split('youtube.com/shorts/')[1]?.split(/[?&#]/)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (url.includes('youtube.com/watch')) {
      const parsed = new URL(url)
      const id = parsed.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split(/[?&#/]/)[0]
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {
    return null
  }

  return null
}
