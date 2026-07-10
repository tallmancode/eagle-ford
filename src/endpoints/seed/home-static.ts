import type { RequiredDataFromCollectionSlug } from 'payload'

import { DEFAULT_OG_DESCRIPTION, SITE_NAME } from '@/constants/site'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  meta: {
    description: DEFAULT_OG_DESCRIPTION,
    title: SITE_NAME,
  },
  title: 'Home',
}
