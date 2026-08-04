import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import type { Form } from '@/payload-types'
import {
  CATALOG_VEHICLE_LMS_FIELD_NAMES,
  STOCK_VEHICLE_LMS_FIELD_NAMES,
} from '@/fixtures/form-fixtures/vehicleLmsSeedFields'
import { VEHICLE_LMS_FIELD_NAMES } from '@/lib/stock-vehicle/buildVehicleFormContext'
import { createSeedStreamResponse } from '@/lib/seed/createSeedStreamResponse'

export const maxDuration = 60

const SPECIAL_OFFER_CONTEXT_FIELD_NAMES = [
  'vehicleName',
  'modelName',
  'specialCategory',
  'specialType',
  'specialTitle',
] as const

type HideTarget = {
  title: string
  /** Field names to set hidden: true (kept on the form). */
  hideFieldNames: readonly string[]
  /** Field names to remove entirely (New Vehicle Quote stock attributes). */
  removeFieldNames?: readonly string[]
}

/** Forms to patch without replacing emails / LMS / other settings. */
const HIDE_FIELD_TARGETS: HideTarget[] = [
  {
    title: 'New Vehicle Quote',
    hideFieldNames: CATALOG_VEHICLE_LMS_FIELD_NAMES,
    removeFieldNames: STOCK_VEHICLE_LMS_FIELD_NAMES,
  },
  {
    title: 'Used Vehicle Quote',
    hideFieldNames: VEHICLE_LMS_FIELD_NAMES,
  },
  {
    title: 'Vehicle Quote',
    hideFieldNames: VEHICLE_LMS_FIELD_NAMES,
  },
  {
    title: 'Special Offer Enquiry Form',
    hideFieldNames: SPECIAL_OFFER_CONTEXT_FIELD_NAMES,
  },
]

type AnyFormField = {
  name?: string | null
  hidden?: boolean | null
  [key: string]: unknown
}

function patchFieldsHidden(
  fields: AnyFormField[] | null | undefined,
  namesToHide: Set<string>,
): { fields: AnyFormField[] | null | undefined; changedCount: number } {
  if (!fields?.length) {
    return { fields, changedCount: 0 }
  }

  let changedCount = 0
  const next = fields.map((field) => {
    if (
      typeof field.name === 'string' &&
      namesToHide.has(field.name) &&
      field.hidden !== true
    ) {
      changedCount += 1
      return { ...field, hidden: true }
    }
    return field
  })

  return { fields: next, changedCount }
}

function removeNamedFields(
  fields: AnyFormField[] | null | undefined,
  namesToRemove: Set<string>,
): { fields: AnyFormField[] | null | undefined; removedCount: number } {
  if (!fields?.length) {
    return { fields, removedCount: 0 }
  }

  const next = fields.filter((field) => {
    if (typeof field.name === 'string' && namesToRemove.has(field.name)) {
      return false
    }
    return true
  })

  return { fields: next, removedCount: fields.length - next.length }
}

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  return createSeedStreamResponse(async (log) => {
    log.info(
      'Hiding vehicle context fields and removing stock-only fields from New Vehicle Quote...',
    )

    const results: Array<{
      title: string
      status: 'updated' | 'unchanged' | 'missing'
      fieldsUpdated: number
      fieldsRemoved: number
    }> = []

    for (const target of HIDE_FIELD_TARGETS) {
      const namesToHide = new Set(target.hideFieldNames)
      const namesToRemove = new Set(target.removeFieldNames ?? [])
      const existing = await payload.find({
        collection: 'forms',
        depth: 0,
        limit: 1,
        where: {
          title: {
            equals: target.title,
          },
        },
      })

      const form = existing.docs[0]
      if (!form) {
        log.info(`Skipped "${target.title}" — form not found`)
        results.push({
          title: target.title,
          status: 'missing',
          fieldsUpdated: 0,
          fieldsRemoved: 0,
        })
        continue
      }

      let workingFields = form.fields as AnyFormField[] | null | undefined
      let fieldsRemoved = 0

      if (namesToRemove.size > 0) {
        const removed = removeNamedFields(workingFields, namesToRemove)
        workingFields = removed.fields
        fieldsRemoved += removed.removedCount
      }

      const fieldsPatch = patchFieldsHidden(workingFields, namesToHide)

      let stepsChanged = 0
      let stepsRemoved = 0
      const nextSteps = form.steps?.map((step) => {
        let stepFields = step.fields as AnyFormField[] | null | undefined
        if (namesToRemove.size > 0) {
          const removed = removeNamedFields(stepFields, namesToRemove)
          stepFields = removed.fields
          stepsRemoved += removed.removedCount
        }
        const stepPatch = patchFieldsHidden(stepFields, namesToHide)
        stepsChanged += stepPatch.changedCount
        return { ...step, fields: stepPatch.fields }
      })

      fieldsRemoved += stepsRemoved
      const fieldsUpdated = fieldsPatch.changedCount + stepsChanged
      if (fieldsUpdated === 0 && fieldsRemoved === 0) {
        log.info(`"${target.title}" already up to date (id ${form.id})`)
        results.push({
          title: target.title,
          status: 'unchanged',
          fieldsUpdated: 0,
          fieldsRemoved: 0,
        })
        continue
      }

      await payload.update({
        collection: 'forms',
        id: form.id,
        depth: 0,
        data: {
          ...(fieldsPatch.fields ? { fields: fieldsPatch.fields } : {}),
          ...(nextSteps ? { steps: nextSteps } : {}),
        } as Partial<Form>,
      })

      log.info(
        `"${target.title}" updated — hidden ${fieldsUpdated}, removed ${fieldsRemoved} (id ${form.id})`,
      )
      results.push({
        title: target.title,
        status: 'updated',
        fieldsUpdated,
        fieldsRemoved,
      })
    }

    const updated = results.filter((r) => r.status === 'updated').length
    const missing = results.filter((r) => r.status === 'missing').length
    log.info(
      `Done. ${updated} form(s) updated, ${results.length - updated - missing} unchanged, ${missing} missing.`,
    )

    return { success: true, results }
  }, payload.logger)
}
