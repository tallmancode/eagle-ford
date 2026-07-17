import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'
import { populatePublishedAt } from '@/lib/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/lib/utils/generatePreviewPath'
import { sanitizePageNullBlocks } from './hooks/sanitizePageNullBlocks'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { isAuthenticated, isAuthenticatedOrPublished } from '@/lib/utils/accessUtil'

export const PagesCollection: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticatedOrPublished,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'title',
              label: 'Page Title',
              type: 'text',
              required: true,
            },
            {
              name: 'overlayHeader',
              type: 'checkbox',
              label: 'Overlay header on hero',
              defaultValue: false,
              admin: {
                description:
                  'When enabled, the header is transparent at the top of the page (for hero blocks) and turns solid white on scroll. When disabled (default), the header is always solid white with dark navigation links.',
              },
            },
          ],
        },
        {
          name: 'content',
          label: 'Content',
          fields: [
            {
              name: 'section',
              label: false,
              type: 'blocks',
              blocks: [],
              blockReferences: ['section'],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({ hasGenerateFn: true }),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [sanitizePageNullBlocks, populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
