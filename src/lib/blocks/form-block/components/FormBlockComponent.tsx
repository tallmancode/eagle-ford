import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Form } from '@/payload-types'
import type { FormBlockType } from '@/payload-types'
import { FormBlockClient } from '@/lib/blocks/form-block/components/FormBlockClient'

export async function FormBlockComponent(props: FormBlockType) {
  const { enableIntro, form: formProp, introContent } = props

  let form: Form | null = null

  if (typeof formProp === 'object' && formProp !== null) {
    form = formProp
  } else if (typeof formProp === 'string') {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.findByID({
      collection: 'forms',
      id: formProp,
      depth: 2,
    })
    form = result
  }

  if (!form?.id) {
    return null
  }

  return (
    <FormBlockClient
      enableIntro={enableIntro}
      form={form}
      introContent={introContent as SerializedEditorState | null | undefined}
    />
  )
}
