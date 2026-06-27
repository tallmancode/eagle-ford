import { fields as formBuilderFields } from '@payloadcms/plugin-form-builder'
import { deepMergeWithSourceArrays } from 'payload'
import type { Block, Field, UploadCollectionSlug } from 'payload'

const formFieldBlockLabelPath =
  '@/lib/blocks/form-block/components/FormFieldRowLabel#FormFieldRowLabel'

export const FORM_UPLOAD_COLLECTIONS = ['media'] as const satisfies readonly UploadCollectionSlug[]

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

export function getFormInputBlocks(
  uploadCollections: readonly UploadCollectionSlug[] = FORM_UPLOAD_COLLECTIONS,
): Block[] {
  return Object.entries(enabledFormBuilderFields)
    .map(([fieldKey, fieldConfig]) =>
      resolveFormBuilderBlock(fieldKey, fieldConfig, uploadCollections),
    )
    .filter((block): block is Block => block !== null)
    .map(withFormFieldBlockLabel)
}
