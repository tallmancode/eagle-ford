import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Form, Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/utils/getGlobals'

type QuoteFormSettingKey = 'showroomQuoteForm' | 'newVehicleQuoteForm'

function getFormId(form: Setting[QuoteFormSettingKey]): string | null {
  if (!form) return null
  if (typeof form === 'object') return form.id
  return form
}

/**
 * Always load forms at depth 2 so redirect.reference.value is a populated Page
 * (depth-1 Settings globals often leave it as a bare id string).
 */
async function resolveFormFromSetting(key: QuoteFormSettingKey): Promise<Form | null> {
  const settings = (await getCachedGlobal('settings', 1)) as Setting
  const formRef = settings[key]
  const formId = getFormId(formRef)

  if (!formId) return null

  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'forms',
    id: formId,
    depth: 2,
    disableErrors: true,
    overrideAccess: false,
  })

  return result ?? null
}

export const getShowroomQuoteForm = cache(async (): Promise<Form | null> => {
  return resolveFormFromSetting('showroomQuoteForm')
})

export const getNewVehicleQuoteForm = cache(async (): Promise<Form | null> => {
  return resolveFormFromSetting('newVehicleQuoteForm')
})
