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
          // Unnamed tab — section is top-level so better-editor can target blocksField: 'section'
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
            {
              type: 'ui',
              name: 'aiSeoGenerate',
              label: 'Generate with AI',
              admin: {
                components: {
                  Field: '@/lib/fields/ai-seo-generate/AiSeoGenerateField#AiSeoGenerateField',
                },
              },
            },
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: false,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({ hasGenerateFn: false }),
            {
              type: 'ui',
              name: 'seoPreview',
              label: 'Preview',
              admin: {
                components: {
                  Field: '@/lib/fields/seo-preview/SeoPreviewField#SeoPreviewField',
                },
              },
            },
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
