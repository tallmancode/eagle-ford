import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { ReactNode } from 'react'

import type { Blog, Media, Page } from '@/payload-types'

export type HeroLink = {
  link: {
    type?: 'custom' | 'reference' | null
    newTab?: boolean | null
    reference?: {
      relationTo: 'pages' | 'blogs'
      value: Page | Blog | string | number
    } | null
    url?: string | null
    label?: string | null
    appearance?: 'default' | 'outline' | null
  }
}

export type PageHeroProps = {
  type?: 'highImpact' | 'lowImpact' | 'mediumImpact' | 'none' | null
  links?: HeroLink[] | null
  media?: string | Media | null
  richText?: DefaultTypedEditorState | null
  children?: ReactNode
  [key: string]: unknown
}
