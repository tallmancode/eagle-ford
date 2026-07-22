import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { isAnyone, isAuthenticated } from '@/lib/utils/accessUtil'
import { altFromFilename } from '@/lib/utils/altFromFilename'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const MediaCollection: CollectionConfig = {
  slug: 'media',
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAnyone,
    update: isAuthenticated,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (!data.alt?.trim()) {
          const source = req.file?.name ?? data.filename
          if (typeof source === 'string' && source.trim()) {
            data.alt = altFromFilename(source)
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        components: {
          Field: '@/lib/components/media-alt-field/MediaAltField#MediaAltField',
          Description: {
            path: '/lib/components/media-description/MediaDescription',
            exportName: 'MediaDescription',
            clientProps: { length: 150 },
          },
        },
      },
      required: true,
    },
    {
      name: 'creditText',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
    formatOptions: {
      format: 'webp',
    },
    mimeTypes: [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
