import type { CollectionAfterChangeHook } from 'payload'
import * as Sentry from '@sentry/nextjs'

import { mapFormSubmissionToLeadRequest } from '@/lib/motor-city-leads/mapFormSubmission'
import { submitSiteFormLead } from '@/lib/motor-city-leads/submitLead'
import type { FormLmsConfig } from '@/lib/motor-city-leads/types'
import { MotorCityLeadsError } from '@/lib/motor-city-leads/types'

type FormWithLms = {
  id: string
  title?: string | null
  lmsLeadInjection?: FormLmsConfig | null
}

/**
 * After a form submission is created, optionally forward the lead to Eagle Motor City.
 * Failures are logged and never block the existing email / confirmation flow.
 */
export const injectFormSubmissionLead: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  context,
}) => {
  if (operation !== 'create') return doc
  if (context?.skipMotorCityLeadInject) return doc

  try {
    const formId = typeof doc.form === 'string' ? doc.form : doc.form?.id
    if (!formId) return doc

    const form = (await req.payload.findByID({
      collection: 'forms',
      id: formId,
      depth: 0,
      overrideAccess: true,
      req,
    })) as FormWithLms

    const lmsConfig = form.lmsLeadInjection
    if (!lmsConfig?.enabled) return doc

    const mapped = mapFormSubmissionToLeadRequest({
      submissionData: doc.submissionData,
      formConfig: lmsConfig,
      extLeadRef: String(doc.id),
      formTitle: form.title,
    })

    const result = await submitSiteFormLead(mapped.request)

    await req.payload.update({
      collection: 'form-submissions',
      id: doc.id,
      data: {
        motorCityLeadId: result.id,
        motorCityLeadStatus: result.status,
        motorCityLeadError: null,
      },
      overrideAccess: true,
      req,
      context: { skipMotorCityLeadInject: true },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Motor City lead error'
    const code = error instanceof MotorCityLeadsError ? error.code : 'UNKNOWN'

    req.payload.logger.error(
      { err: error, formSubmissionId: doc.id, code },
      'Failed to forward form submission lead to Eagle Motor City',
    )

    Sentry.captureException(error, {
      tags: {
        feature: 'motor-city-leads',
        formSubmissionId: String(doc.id),
        code,
      },
    })

    try {
      await req.payload.update({
        collection: 'form-submissions',
        id: doc.id,
        data: {
          motorCityLeadStatus: 'failed',
          motorCityLeadError: message.slice(0, 2000),
        },
        overrideAccess: true,
        req,
        context: { skipMotorCityLeadInject: true },
      })
    } catch {
      // ignore secondary update failures
    }
  }

  return doc
}
