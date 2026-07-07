import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import type { Field } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateURL } from '@payloadcms/plugin-seo/types'
import generateTitle from '@/lib/utils/generateTitle'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Blog } from '@/payload-types'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import {
  FORM_UPLOAD_COLLECTIONS,
  getFormInputBlocks,
  withFormFieldBlockLabel,
} from '@/plugins/form-builder/formInputBlocks'
import { SubheadingBlock } from '@/lib/blocks/form-block/SubheadingBlock'
import { handleMultiStepFormUploads } from '@/lib/blocks/form-block/hooks/handleMultiStepFormUploads'
import { importExportPlugin } from '@payloadcms/plugin-import-export'

const formStepRowLabelPath = '@/lib/blocks/form-block/components/FormStepRowLabel#FormStepRowLabel'

const generateURL: GenerateURL<Blog | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'blogs'],
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
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
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
      hooks: {
        beforeChange: [handleMultiStepFormUploads],
      },
    },
    formOverrides: {
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

        return result
      },
    },
  }),
  searchPlugin({
    collections: ['blogs'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
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
    }),
    overrideImportCollection: ({ collection }) => ({
      ...collection,
      admin: {
        ...collection.admin,
        group: 'Data Management',
      },
    }),
    collections: [
      { slug: 'users', export: { disableJobsQueue: true }, import: { disableJobsQueue: true } },
      { slug: 'pages', export: { disableJobsQueue: true }, import: { disableJobsQueue: true } },
    ],
  }),
]
