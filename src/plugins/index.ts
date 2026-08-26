import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import * as Sentry from '@sentry/nextjs'
import { Plugin } from 'payload'
import type { Field } from 'payload'
import { revalidateRedirects } from '@/lib/hooks/revalidateRedirects'
import { GenerateURL } from '@payloadcms/plugin-seo/types'
import generateDescription from '@/lib/utils/generateDescription'
import generateTitle from '@/lib/utils/generateTitle'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { Page } from '@/payload-types'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import {
  FORM_UPLOAD_COLLECTIONS,
  getFormInputBlocks,
  withFormFieldBlockLabel,
} from '@/plugins/form-builder/formInputBlocks'
import { SubheadingBlock } from '@/lib/blocks/form-block/SubheadingBlock'
import { handleMultiStepFormUploads } from '@/lib/blocks/form-block/hooks/handleMultiStepFormUploads'
import {
  denormalizeSubmissionContactFields,
  formSubmissionListAdmin,
  getFormSubmissionContactFields,
  withFormSubmissionExportFieldTweaks,
} from '@/lib/form-submissions/contactFields'
import { flattenFormSubmissionExportBatch } from '@/lib/form-submissions/flattenSubmissionExport'
import { getLmsLeadInjectionFields } from '@/lib/motor-city-leads/formFields'
import { getFormSubmissionAttributionFields } from '@/lib/form-submissions/attributionFields'
import { getMotorCityLeadSubmissionFields } from '@/lib/motor-city-leads/formSubmissionFields'
import { injectFormSubmissionLead } from '@/lib/motor-city-leads/injectFormSubmissionLead'
import { patchExportCollectionFields } from '@/components/admin/export/patchExportCollectionFields'
import { mediaGalleryPlugin } from '@sitebytom/payload-media-gallery'
import { imageOptimizer } from '@inoo-ch/payload-image-optimizer'
import { betterEditor } from 'payload-better-editor'

const formStepRowLabelPath = '@/lib/blocks/form-block/components/FormStepRowLabel#FormStepRowLabel'

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateDescription,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      date: true,
      radio: true,
      upload: true,
    },
    uploadCollections: [...FORM_UPLOAD_COLLECTIONS],
    redirectRelationships: ['pages'],
    formSubmissionOverrides: {
      admin: formSubmissionListAdmin,
      fields: ({ defaultFields }) => [
        ...withFormSubmissionExportFieldTweaks(defaultFields),
        ...getFormSubmissionContactFields(),
        ...getFormSubmissionAttributionFields(),
        ...getMotorCityLeadSubmissionFields(),
      ],
      hooks: {
        beforeChange: [handleMultiStepFormUploads, denormalizeSubmissionContactFields],
        afterChange: [injectFormSubmissionLead],
      },
    },
    formOverrides: {
      admin: {
        defaultColumns: ['title', 'lmsLeadInjection.enabled', 'updatedAt'],
      },
      fields: ({ defaultFields }) => {
        const formInputBlocks = getFormInputBlocks(FORM_UPLOAD_COLLECTIONS)
        const allFormBlocks = [...formInputBlocks, withFormFieldBlockLabel(SubheadingBlock)]
        const result: Field[] = []

        for (const field of defaultFields) {
          if ('name' in field && field.name === 'confirmationMessage') {
            result.push({
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            } as Field)
            continue
          }

          if (!('name' in field) || field.name !== 'fields' || field.type !== 'blocks') {
            result.push(field)
            continue
          }

          const blocksField = field as Field & { blocks?: typeof formInputBlocks }

          const labeledBlocks =
            blocksField.blocks?.map(
              (block) => allFormBlocks.find((b) => b.slug === block.slug) ?? block,
            ) ?? allFormBlocks

          result.push(
            {
              name: 'formLayout',
              type: 'radio',
              defaultValue: 'singlePage',
              admin: {
                description:
                  'Multi-step forms use the Steps list below. Single-page forms use the Fields list.',
                layout: 'horizontal',
              },
              options: [
                { label: 'Single page', value: 'singlePage' },
                { label: 'Multi-step', value: 'multiStep' },
              ],
            } as Field,
            {
              ...blocksField,
              blocks: labeledBlocks,
              admin: {
                ...blocksField.admin,
                condition: (_: unknown, siblingData: { formLayout?: string }) =>
                  siblingData?.formLayout !== 'multiStep',
              },
            } as Field,
            {
              name: 'steps',
              type: 'array',
              admin: {
                condition: (_: unknown, siblingData: { formLayout?: string }) =>
                  siblingData?.formLayout === 'multiStep',
                initCollapsed: false,
                components: {
                  RowLabel: formStepRowLabelPath,
                },
              },
              labels: {
                singular: 'Step',
                plural: 'Steps',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Step Title',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'richText',
                  label: 'Step Description',
                },
                {
                  name: 'nextButtonLabel',
                  type: 'text',
                  label: 'Next Button Label',
                  defaultValue: 'Next',
                },
                {
                  name: 'backButtonLabel',
                  type: 'text',
                  label: 'Back Button Label',
                  defaultValue: 'Back',
                },
                {
                  name: 'fields',
                  type: 'blocks',
                  label: 'Fields',
                  required: true,
                  minRows: 1,
                  blocks: allFormBlocks,
                },
              ],
            } as Field,
          )
        }

        return [...result, getLmsLeadInjectionFields()]
      },
    },
  }),
  importExportPlugin({
    overrideExportCollection: ({ collection }) => ({
      ...collection,
      admin: {
        ...collection.admin,
        group: 'Data Management',
      },
      depth: 5,
      fields: patchExportCollectionFields(collection.fields ?? []),
    }),
    overrideImportCollection: ({ collection }) => ({
      ...collection,
      admin: {
        ...collection.admin,
        group: 'Data Management',
      },
    }),
    collections: [
      {
        slug: 'form-submissions',
        export: {
          disableJobsQueue: true,
          hooks: {
            before: flattenFormSubmissionExportBatch,
          },
        },
        import: false,
      },
    ],
  }),
  // Keep enabled so AdminErrorBoundary stays in the import map (generate:importmap
  // runs in non-production). Sentry.init already gates reporting on NODE_ENV.
  sentryPlugin({
    enabled: true,
    Sentry,
  }),
  imageOptimizer({
    collections: {
      media: {
        format: { format: 'webp', quality: 80 },
        maxDimensions: { width: 3440, height: 1440 },
      },
    },
    stripMetadata: true,
    generateThumbHash: true,
    clientOptimization: true,
  }),
  mediaGalleryPlugin({
    collections: {
      media: true,
    },
    defaultView: 'justified', // 'justified' | 'masonry' | 'grid' | 'list'
    layouts: {
      justified: {
        enabled: true,
        footer: 'hover', // 'hover' | 'always'
      },
      masonry: {
        enabled: true,
        footer: 'hover', // 'hover' | 'always'
      },
      grid: {
        enabled: true,
        footer: 'hover', // 'hover' | 'always'
      },
    },
    lightbox: true,
    edit: true,
    disabled: false,
  }),
  betterEditor({
    blocksField: 'section',
    collections: ['pages', 'special-templates'],
  }),
]
