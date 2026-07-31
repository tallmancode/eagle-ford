export const MOTOR_CITY_SITE_KEY = 'eagle-ford'
export const LMS_DEFAULT_BRAND = 'Ford'
export const LMS_DEFAULT_MODEL = 'General Enquiry'
export const LMS_DEFAULT_USED = '0'
export const LMS_DEFAULT_DEALER_FLOOR = 'CALLCENTRE'
export const LMS_DEFAULT_SOURCE = 'EAGLE-FORD-WEB'

/** Immediate POST attempts inside a request / job handler (short backoff). */
export const LEAD_IMMEDIATE_MAX_ATTEMPTS = 3
export const LEAD_POST_TIMEOUT_MS = 20_000

/**
 * Durable forward attempts stored on form-submissions (includes immediate + sweeper).
 * After this, status becomes failed (exhausted) and requires manual re-queue.
 */
export const LEAD_MAX_FORWARD_ATTEMPTS = 8

export const LEAD_STATUS_PENDING_RETRY = 'pending_retry'
export const LEAD_STATUS_FAILED = 'failed'
export const LEAD_STATUS_EXHAUSTED = 'exhausted'
