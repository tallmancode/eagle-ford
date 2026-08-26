export type FormMetricsByForm = {
  formId: string
  formTitle: string
  count: number
}

export type FormMetricsByDay = {
  date: string
  count: number
}

export type FormSubmissionsMetricsResponse = {
  siteKey: string
  from: string
  to: string
  total: number
  byForm: FormMetricsByForm[]
  byDay: FormMetricsByDay[]
}

export type FormSubmissionFeedDoc = {
  id: string
  formId: string | null
  formTitle: string | null
  firstName: string | null
  lastName: string | null
  phone: string | null
  email: string | null
  createdAt: string
}

export type FormSubmissionsFeedResponse = {
  siteKey: string
  docs: FormSubmissionFeedDoc[]
  totalDocs: number
  page: number
  limit: number
  hasNextPage: boolean
}

export type FormSubmissionMetricsSourceDoc = {
  id?: string | number
  form?: string | number | { id?: string | number; title?: string | null } | null
  createdAt?: string | null
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  email?: string | null
}
