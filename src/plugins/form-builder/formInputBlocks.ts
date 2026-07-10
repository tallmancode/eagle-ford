import { fields as formBuilderFields } from '@payloadcms/plugin-form-builder'
import { deepMergeWithSourceArrays } from 'payload'
import type { Block, Field, UploadCollectionSlug } from 'payload'

const formFieldBlockLabelPath =
  '@/lib/blocks/form-block/components/FormFieldRowLabel#FormFieldRowLabel'

const formFieldNameInputPath =
  '@/lib/blocks/form-block/components/FormFieldNameInput#FormFieldNameInput'

export const FORM_UPLOAD_COLLECTIONS = ['media'] as const satisfies readonly UploadCollectionSlug[]

/**
 * Overrides the `name` text field in a form input block to use the
 * FormFieldNameInput component, which auto-populates from the sibling `label`.
 * Handles both top-level fields and fields nested inside `row` containers.
 */
function withFormFieldNameInput(block: Block): Block {
  const patchField = (field: Field): Field => {
    if ('name' in field && field.name === 'name' && field.type === 'text') {
      return {
        ...field,
        admin: {
          ...(field as { admin?: Record<string, unknown> }).admin,
          components: {
            ...(field as { admin?: { components?: Record<string, unknown> } }).admin?.components,
            Field: formFieldNameInputPath,
          },
        },
      }
    }
    return field
  }

  return {
    ...block,
    fields: (block.fields ?? []).map((field) => {
      if (field.type === 'row' && 'fields' in field && Array.isArray(field.fields)) {
        return { ...field, fields: field.fields.map(patchField) }
      }
      return patchField(field)
    }),
  }
}

/** Blocks fields use `admin.components.Label`, not RowLabel (arrays only). */
export function withFormFieldBlockLabel(block: Block): Block {
  return {
    ...block,
    admin: {
      ...block.admin,
      components: {
        ...block.admin?.components,
        Label: formFieldBlockLabelPath,
      },
    },
  }
}

/** Matches merged field config from formBuilderPlugin in src/plugins/index.ts */
const enabledFormBuilderFields: Record<string, boolean | Field> = {
  checkbox: true,
  country: true,
  date: true,
  email: true,
  message: true,
  number: true,
  payment: false,
  radio: true,
  select: true,
  state: true,
  text: true,
  textarea: true,
  upload: true,
}

function resolveFormBuilderBlock(
  fieldKey: string,
  fieldConfig: boolean | Field | undefined,
  uploadCollections: readonly UploadCollectionSlug[],
): Block | null {
  if (fieldConfig === false) {
    return null
  }

  const block = formBuilderFields[fieldKey as keyof typeof formBuilderFields]

  if (block === undefined && typeof fieldConfig === 'object' && fieldConfig !== null) {
    return fieldConfig as unknown as Block
  }

  if (fieldKey === 'upload' && typeof block === 'function') {
    return block([...uploadCollections]) as Block
  }

  if (typeof block === 'function') {
    return null
  }

  if (typeof block === 'object' && typeof fieldConfig === 'object' && fieldConfig !== null) {
    return deepMergeWithSourceArrays(block, fieldConfig) as Block
  }

  if (typeof block === 'object') {
    return block
  }

  return null
}

function withNumberMinMax(block: Block): Block {
  if (block.slug !== 'number') {
    return block
  }

  return {
    ...block,
    fields: [
      ...(block.fields ?? []),
      {
        type: 'row',
        fields: [
          {
            name: 'min',
            type: 'number',
            admin: { width: '50%' },
            label: 'Minimum Value',
          },
          {
            name: 'max',
            type: 'number',
            admin: { width: '50%' },
            label: 'Maximum Value',
          },
        ],
      },
    ],
  }
}

export function getFormInputBlocks(
  uploadCollections: readonly UploadCollectionSlug[] = FORM_UPLOAD_COLLECTIONS,
): Block[] {
  return Object.entries(enabledFormBuilderFields)
    .map(([fieldKey, fieldConfig]) =>
      resolveFormBuilderBlock(fieldKey, fieldConfig, uploadCollections),
    )
    .filter((block): block is Block => block !== null)
    .map(withNumberMinMax)
    .map(withFormFieldBlockLabel)
    .map(withFormFieldNameInput)
}
