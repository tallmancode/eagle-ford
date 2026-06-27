import type { Form } from '@/payload-types'

import { getAllInputFields, type FormInputField } from '@/lib/blocks/form-block/utils/getFormSteps'

export const buildInitialFormState = (form: Form) => {
  const fields = getAllInputFields(form)

  if (!fields.length) {
    return {}
  }

  return fields.reduce<Record<string, unknown>>((initialSchema, field) => {
    if (!('name' in field) || !field.name) {
      return initialSchema
    }

    switch (field.blockType) {
      case 'checkbox':
        return {
          ...initialSchema,
          [field.name]: field.defaultValue ?? false,
        }
      case 'number':
        return {
          ...initialSchema,
          [field.name]: field.defaultValue ?? '',
        }
      case 'radio':
      case 'select':
        return {
          ...initialSchema,
          [field.name]: field.defaultValue ?? '',
        }
      case 'upload':
        return {
          ...initialSchema,
          [field.name]: null,
        }
      case 'country':
      case 'state':
        return {
          ...initialSchema,
          [field.name]: '',
        }
      case 'email':
        return {
          ...initialSchema,
          [field.name]: '',
        }
      case 'date':
      case 'text':
      case 'textarea':
        return {
          ...initialSchema,
          [field.name]: field.defaultValue ?? '',
        }
      default:
        return initialSchema
    }
  }, {})
}

export type { FormInputField }
