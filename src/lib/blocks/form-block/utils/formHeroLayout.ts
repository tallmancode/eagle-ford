import type { FormInputField } from '@/lib/blocks/form-block/utils/getFormSteps'

export type FormHeroFieldGroups = {
  mainFields: FormInputField[]
  textareaField: FormInputField | null
  checkboxFields: FormInputField[]
  otherFields: FormInputField[]
}

export function partitionFieldsForHeroLayout(fields: FormInputField[]): FormHeroFieldGroups {
  const mainFields: FormInputField[] = []
  const checkboxFields: FormInputField[] = []
  const otherFields: FormInputField[] = []
  let textareaField: FormInputField | null = null

  for (const field of fields) {
    if (field.blockType === 'textarea' && !textareaField) {
      textareaField = field
      continue
    }

    if (field.blockType === 'checkbox') {
      checkboxFields.push(field)
      continue
    }

    if (field.blockType === 'message') {
      otherFields.push(field)
      continue
    }

    mainFields.push(field)
  }

  return { mainFields, textareaField, checkboxFields, otherFields }
}
