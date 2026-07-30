import type { GenerateDescription } from '@payloadcms/plugin-seo/types'
import type { Page } from '@/payload-types'

const MAX_LENGTH = 155

const generateDescription: GenerateDescription<Page> = ({ doc }) => {
  const title = typeof doc?.title === 'string' ? doc.title.trim() : ''
  if (!title) return ''

  const description = `${title} — Eagle Ford. Explore features, specs, and offers.`
  if (description.length <= MAX_LENGTH) return description
  return `${description.slice(0, MAX_LENGTH - 1).trimEnd()}…`
}

export default generateDescription
