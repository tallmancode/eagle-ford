'use client'

import { PasswordField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import React from 'react'

export const RedactedApiKeyField: TextFieldClientComponent = (props) => {
  const { field, path } = props
  const fieldPath = path || field.name
  const fieldWithPlaceholder = {
    ...field,
    admin: { ...field.admin, placeholder: 'Enter API key' },
  }

  return (
    <div className="field-type redacted-api-key-field">
      <PasswordField field={fieldWithPlaceholder} path={fieldPath} validate={() => true} />
    </div>
  )
}
