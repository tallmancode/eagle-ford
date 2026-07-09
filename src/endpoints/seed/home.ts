import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import { DEFAULT_OG_DESCRIPTION } from '@/constants/site'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

const welcomeRichText = {
  root: {
    type: 'root',
    children: [
      {
        type: 'heading',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Eagle Ford',
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        tag: 'h1',
        version: 1,
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Visit the admin dashboard',
                version: 1,
              },
            ],
            direction: 'ltr',
            fields: {
              linkType: 'custom',
              newTab: false,
              url: '/admin',
            },
            format: '',
            indent: 0,
            version: 3,
          },
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: " to begin managing this site's content.",
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    overlayHeader: true,
    content: {
      section: [
        {
          blockType: 'section',
          container: true,
          content: [
            {
              blockType: 'hero',
              template: 'banner',
              bannerHeroContent: {
                bannerTemplate: 'full-width',
                fullWidthBannerContent: {
                  image: heroImage.id,
                },
              },
            },
          ],
        },
        {
          blockType: 'section',
          container: true,
          content: [
            {
              blockType: 'rich-text',
              content: welcomeRichText,
            },
          ],
        },
      ],
    },
    meta: {
      description: DEFAULT_OG_DESCRIPTION,
      image: metaImage.id,
      title: 'Eagle Ford',
    },
    title: 'Home',
  }
}
