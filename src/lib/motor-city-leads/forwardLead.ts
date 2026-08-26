import type { Payload, PayloadRequest } from 'payload'

import {
  LEAD_MAX_FORWARD_ATTEMPTS,
  LEAD_STATUS_EXHAUSTED,
  LEAD_STATUS_FAILED,
  LEAD_STATUS_PENDING_RETRY,
} from '@/lib/motor-city-leads/constants'
import { mapFormSubmissionToLeadRequest } from '@/lib/motor-city-leads/mapFormSubmission'
import { captureLeadForwardEvent } from '@/lib/motor-city-leads/sentry'
import { submitSiteFormLead } from '@/lib/motor-city-leads/submitLead'
import type { FormLmsConfig, FormSubmissionDataItem, LeadAttribution } from '@/lib/motor-city-leads/types'
import { MotorCityLeadsError } from '@/lib/motor-city-leads/types'
import { computeNextRetryAt, DEFAULT_RETRY_BASE_DELAY_MS, DEFAULT_RETRY_MAX_DELAY_MS } from '@/lib/http/retryPolicy'

type FormWithLms = {
  id: string
  title?: string | null
  lmsLeadInjection?: FormLmsConfig | null
}

export type FormSubmissionLeadDoc = {
  id: string
  form?: string | { id: string } | null
  submissionData?: FormSubmissionDataItem[] | null
  attribution?: LeadAttribution | null
  motorCityLeadId?: string | null
  motorCityLeadStatus?: string | null
  motorCityLeadAttempts?: number | null
}

export type ForwardLeadResult =
  | { outcome: 'skipped'; reason: string }
  | { outcome: 'success'; motorCityLeadId: string; status: string }
  | { outcome: 'pending_retry'; attempt: number; nextRetryAt: string; code: string }
  | { outcome: 'failed'; attempt: number; code: string; exhausted: boolean }

type ForwardArgs = {
  payload: Payload
  submission: FormSubmissionLeadDoc
  req?: PayloadRequest
  /** When true, do not schedule another Payload job (used by the job handler itself). */
  skipEnqueue?: boolean
}

async function updateSubmission(
  args: ForwardArgs,
  data: Record<string, unknown>,
): Promise<void> {
  await args.payload.update({
    collection: 'form-submissions',
    id: args.submission.id,
    data,
    overrideAccess: true,
    req: args.req,
    context: { skipMotorCityLeadInject: true },
  })
}

/**
 * Forward one opted-in form submission to Motor City (idempotent via extLeadRef = submission id).
 * Persists status on the form-submission so transient failures are not silently lost.
 */
export async function forwardFormSubmissionLead(args: ForwardArgs): Promise<ForwardLeadResult> {
  const { payload, submission, req } = args

  if (submission.motorCityLeadId) {
    return { outcome: 'skipped', reason: 'already_forwarded' }
  }

  const formId = typeof submission.form === 'string' ? submission.form : submission.form?.id
  if (!formId) {
    return { outcome: 'skipped', reason: 'missing_form' }
  }

  const form = (await payload.findByID({
    collection: 'forms',
    id: formId,
    depth: 0,
    overrideAccess: true,
    req,
  })) as FormWithLms

  const lmsConfig = form.lmsLeadInjection
  if (!lmsConfig?.enabled) {
    return { outcome: 'skipped', reason: 'lms_disabled' }
  }

  const priorAttempts = Math.max(0, Number(submission.motorCityLeadAttempts ?? 0))
  const attempt = priorAttempts + 1

  try {
    const mapped = mapFormSubmissionToLeadRequest({
      submissionData: submission.submissionData ?? [],
      formConfig: lmsConfig,
      extLeadRef: String(submission.id),
      formTitle: form.title,
      attribution: submission.attribution,
    })

    const result = await submitSiteFormLead(mapped.request)

    await updateSubmission(args, {
      motorCityLeadId: result.id,
      motorCityLeadStatus: result.status,
      motorCityLeadError: null,
      motorCityLeadAttempts: attempt,
      motorCityLeadNextRetryAt: null,
      motorCityLeadRetryable: false,
    })

    return {
      outcome: 'success',
      motorCityLeadId: result.id,
      status: result.status,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Motor City lead error'
    const code = error instanceof MotorCityLeadsError ? error.code : 'UNKNOWN'
    const retryable = error instanceof MotorCityLeadsError ? error.retryable : true
    const retryAfterMs = error instanceof MotorCityLeadsError ? error.retryAfterMs : undefined
    const exhausted = attempt >= LEAD_MAX_FORWARD_ATTEMPTS || !retryable
    const nextRetryAt = exhausted
      ? null
      : computeNextRetryAt({
          attempt,
          baseDelayMs: DEFAULT_RETRY_BASE_DELAY_MS,
          maxDelayMs: DEFAULT_RETRY_MAX_DELAY_MS,
          retryAfterMs,
        })

    const status = exhausted
      ? retryable
        ? LEAD_STATUS_EXHAUSTED
        : LEAD_STATUS_FAILED
      : LEAD_STATUS_PENDING_RETRY

    await updateSubmission(args, {
      motorCityLeadStatus: status,
      motorCityLeadError: message.slice(0, 2000),
      motorCityLeadAttempts: attempt,
      motorCityLeadNextRetryAt: nextRetryAt,
      motorCityLeadRetryable: retryable && !exhausted,
    })

    captureLeadForwardEvent(error, {
      event: exhausted ? 'forward_exhausted' : 'forward_failure',
      formSubmissionId: String(submission.id),
      formId: String(formId),
      errorCode: code,
      httpStatus: error instanceof MotorCityLeadsError ? error.status : undefined,
      retryable: retryable && !exhausted,
      attempt,
      maxAttempts: LEAD_MAX_FORWARD_ATTEMPTS,
      nextRetryAt,
      detail: exhausted
        ? 'Motor City lead forward exhausted or permanent failure'
        : 'Motor City lead forward failed; durable retry scheduled',
    })

    payload.logger.error(
      {
        err: error,
        formSubmissionId: submission.id,
        code,
        attempt,
        status,
      },
      'Failed to forward form submission lead to Eagle Motor City',
    )

    if (!exhausted && !args.skipEnqueue && nextRetryAt) {
      try {
        await payload.jobs.queue({
          task: 'forwardMotorCityLead',
          queue: 'motor-city-leads',
          input: { formSubmissionId: String(submission.id) },
          waitUntil: new Date(nextRetryAt),
          req,
        })
      } catch (enqueueError) {
        captureLeadForwardEvent(enqueueError, {
          event: 'enqueue_failure',
          formSubmissionId: String(submission.id),
          formId: String(formId),
          errorCode: 'ENQUEUE',
          detail: 'Failed to queue durable Motor City lead retry job',
        })
        // Sweeper will still pick up pending_retry rows.
      }
    }

    if (exhausted) {
      return { outcome: 'failed', attempt, code, exhausted: true }
    }

    return {
      outcome: 'pending_retry',
      attempt,
      nextRetryAt: nextRetryAt!,
      code,
    }
  }
}
