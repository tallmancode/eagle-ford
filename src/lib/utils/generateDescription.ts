import type { GenerateDescription } from '@payloadcms/plugin-seo/types'

const generateDescription: GenerateDescription = ({ doc }) => {
  const excerpt = (doc as { excerpt?: string })?.excerpt
  return typeof excerpt === 'string' ? excerpt.trim() : ''
}

export default generateDescription
