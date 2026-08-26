import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { FormBlockType } from '@/payload-types'
import type { FormBlockMeta } from '@/lib/blocks/form-block/types/formContext'
import {
  FormBlockClient,
  type FormBlockLayout,
} from '@/lib/blocks/form-block/components/FormBlockClient'

export async function FormBlockComponent(
  props: FormBlockType & { meta?: FormBlockMeta; layout?: FormBlockLayout },
) {
  const { enableIntro, form: formProp, introContent, meta, layout } = props

  const formId =
    typeof formProp === 'object' && formProp !== null
      ? formProp.id
      : typeof formProp === 'string'
        ? formProp
        : null

  if (!formId) {
    return null
  }

  // Always depth 2 so confirmation redirect.reference resolves to a Page with slug.
  const payload = await getPayload({ config: configPromise })
  const form = await payload.findByID({
    collection: 'forms',
    id: formId,
    depth: 2,
    disableErrors: true,
  })

  if (!form?.id) {
    return null
  }

  return (
    <FormBlockClient
      contextValues={meta?.contextValues}
      enableIntro={enableIntro}
      form={form}
      introContent={introContent as SerializedEditorState | null | undefined}
      layout={layout}
    />
  )
}
