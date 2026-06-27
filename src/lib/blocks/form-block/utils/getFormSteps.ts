import type { Form } from '@/payload-types'

type FormFieldsBlock = NonNullable<Form['fields']>[number]
type FormStepFieldsBlock = NonNullable<NonNullable<Form['steps']>[number]['fields']>[number]

export type FormInputField = FormFieldsBlock | FormStepFieldsBlock

export type FormUploadField = Extract<FormInputField, { blockType: 'upload' }>

export type FormStep =
  | NonNullable<Form['steps']>[number]
  | {
      title?: string | null
      description?: Form['confirmationMessage'] | null
      nextButtonLabel?: string | null
      backButtonLabel?: string | null
      fields?: FormInputField[] | null
    }

export function isMultiStepForm(form: Form): boolean {
  return form.formLayout === 'multiStep' && Boolean(form.steps?.length)
}

export function getFormSteps(form: Form): FormStep[] {
  if (isMultiStepForm(form) && form.steps) {
    return form.steps
  }

  return [
    {
      title: form.title,
      fields: form.fields ?? [],
    },
  ]
}

export function getAllInputFields(form: Form): FormInputField[] {
  return getFormSteps(form).flatMap((step) => step.fields ?? [])
}

export function getUploadFieldsFromForm(form: Form): FormUploadField[] {
  return getAllInputFields(form).filter(
    (field): field is FormUploadField => field.blockType === 'upload',
  )
}

export function getStepInputNames(step: FormStep): string[] {
  if (!step.fields?.length) {
    return []
  }

  return step.fields
    .filter((field): field is FormInputField & { name: string } => {
      return field.blockType !== 'message' && 'name' in field && Boolean(field.name)
    })
    .map((field) => field.name)
}
