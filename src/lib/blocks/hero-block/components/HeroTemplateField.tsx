'use client'

import Image from 'next/image'
import { SelectField, useField } from '@payloadcms/ui'
import type { SelectFieldClientComponent } from 'payload'
import { getHeroTemplatePreview } from '@/lib/blocks/hero-block/heroTemplatePreviews'

export const HeroTemplateField: SelectFieldClientComponent = (props) => {
  const { field, path } = props
  const fieldPath = path || field.name
  const { value } = useField<string>({ path: fieldPath })
  const preview = getHeroTemplatePreview(value)

  return (
    <div className="field-type hero-template-field">
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <SelectField {...props} path={fieldPath} />
        </div>

        {preview && (
          <div
            style={{
              flexShrink: 0,
              width: '200px',
            }}
          >
            <Image
              src={preview.src}
              alt={preview.alt}
              width={200}
              height={112}
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: '16 / 9',
                objectFit: 'cover',
                borderRadius: '6px',
                border: '1px solid var(--theme-elevation-150)',
                background: 'var(--theme-elevation-50)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
