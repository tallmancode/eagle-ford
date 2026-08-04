import type { Field, Tab } from 'payload'

function patchExportTabFields(fields: Field[]): Field[] {
  return fields.map((field) => {
    if ('type' in field && field.type === 'tabs' && 'tabs' in field) {
      return {
        ...field,
        tabs: field.tabs.map((tab: Tab) => {
          if (!('fields' in tab) || !Array.isArray(tab.fields)) return tab
          return {
            ...tab,
            fields: patchExportTabFields(tab.fields),
          }
        }),
      } as Field
    }

    if ('fields' in field && Array.isArray(field.fields)) {
      return {
        ...field,
        fields: patchExportTabFields(field.fields),
      } as Field
    }

    if ('name' in field && field.name === 'preview' && field.type === 'ui') {
      return {
        ...field,
        admin: {
          ...field.admin,
          components: {
            ...field.admin?.components,
            Field: '@/components/admin/export/SyncExportPreview#SyncExportPreview',
          },
        },
      } as Field
    }

    return field
  })
}

/** Use a form-aware ExportPreview so preview works without list-menu context. */
export function patchExportCollectionFields(fields: Field[]): Field[] {
  return patchExportTabFields(fields)
}
