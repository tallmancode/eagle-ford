'use client'

import { getTranslation } from '@payloadcms/translations'
import {
  CodeEditorLazy,
  Pagination,
  PerPage,
  Table,
  Translation,
  useConfig,
  useDebouncedEffect,
  useDocumentInfo,
  useFormFields,
  useTranslation,
} from '@payloadcms/ui'
import React, { useEffect, useRef, useState, useTransition } from 'react'

const DEFAULT_PREVIEW_LIMIT = 10
const PREVIEW_LIMIT_OPTIONS = [10, 25, 50]
const baseClass = 'export-preview'

type PreviewColumn = {
  accessor: string
  active: boolean
  field: { name: string }
  Heading: React.ReactNode
  renderedCells: Array<string | null>
}

type PaginationState = {
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: number
  page: number
  prevPage: number
  totalPages: number
}

/**
 * Fork of the plugin ExportPreview that reads `collectionSlug` from the form
 * instead of ImportExportProvider context (which is only set from the list menu).
 */
export function SyncExportPreview() {
  const [isPending, startTransition] = useTransition()
  const {
    config: { routes },
  } = useConfig()
  const { collectionSlug: exportCollectionSlug } = useDocumentInfo()
  const { collectionSlug, draft, fields, format, limit, locale, sort, where } = useFormFields(
    ([formFields]) => ({
      collectionSlug: formFields.collectionSlug?.value,
      draft: formFields.drafts?.value,
      fields: formFields.fields?.value,
      format: formFields.format?.value,
      limit: formFields.limit?.value,
      locale: formFields.locale?.value,
      sort: formFields.sort?.value,
      where: formFields.where?.value,
    }),
  )

  const [dataToRender, setDataToRender] = useState<Record<string, unknown>[] | null>(null)
  const [exportTotalDocs, setExportTotalDocs] = useState(0)
  const [maxLimit, setMaxLimit] = useState<number | undefined>(undefined)
  const [columns, setColumns] = useState<PreviewColumn[]>([])
  const { i18n, t } = useTranslation()
  const translate = t as never
  const [previewPage, setPreviewPage] = useState(1)
  const [previewLimit, setPreviewLimit] = useState(DEFAULT_PREVIEW_LIMIT)
  const [paginationData, setPaginationData] = useState<PaginationState | null>(null)

  const prevExportConfigRef = useRef({
    draft,
    fields,
    format,
    limit,
    locale,
    sort,
    where,
  })

  useEffect(() => {
    const prevConfig = prevExportConfigRef.current
    const configChanged =
      prevConfig.draft !== draft ||
      prevConfig.limit !== limit ||
      prevConfig.locale !== locale ||
      prevConfig.sort !== sort ||
      JSON.stringify(prevConfig.fields) !== JSON.stringify(fields) ||
      JSON.stringify(prevConfig.where) !== JSON.stringify(where)

    if (configChanged) {
      setPreviewPage(1)
      prevExportConfigRef.current = {
        draft,
        fields,
        format,
        limit,
        locale,
        sort,
        where,
      }
    }
  }, [draft, fields, format, limit, locale, sort, where])

  const targetCollectionSlug =
    typeof collectionSlug === 'string' && collectionSlug.length > 0 ? collectionSlug : undefined
  const isCSV = format === 'csv'

  useDebouncedEffect(
    () => {
      if (!exportCollectionSlug || !targetCollectionSlug) {
        return
      }

      const abortController = new AbortController()

      const fetchData = async () => {
        try {
          const res = await fetch(`${routes.api}/${exportCollectionSlug}/export-preview`, {
            body: JSON.stringify({
              collectionSlug: targetCollectionSlug,
              draft,
              fields,
              format,
              limit,
              locale,
              previewLimit,
              previewPage,
              sort,
              where,
            }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            signal: abortController.signal,
          })

          if (!res.ok) {
            setColumns([])
            setDataToRender([])
            return
          }

          const {
            columns: serverColumns,
            docs,
            exportTotalDocs: serverExportTotalDocs,
            hasNextPage,
            hasPrevPage,
            limit: responseLimit,
            maxLimit: serverMaxLimit,
            page: responsePage,
            totalPages,
          } = await res.json()

          const allKeys = Array.from(
            new Set(
              (docs as Record<string, unknown>[]).flatMap((doc) => Object.keys(doc)),
            ),
          )
          const fieldKeys =
            Array.isArray(serverColumns) && serverColumns.length > 0 ? serverColumns : allKeys

          const newColumns: PreviewColumn[] = fieldKeys.map((key: string) => ({
            accessor: key,
            active: true,
            field: {
              name: key,
            },
            Heading: getTranslation(key, i18n),
            renderedCells: (docs as Record<string, unknown>[]).map((doc) => {
              const val = doc[key]
              if (val === undefined || val === null) {
                return null
              }
              if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                return String(val)
              }
              if (Array.isArray(val)) {
                return val.map(String).join(', ')
              }
              return JSON.stringify(val)
            }),
          }))

          setExportTotalDocs(serverExportTotalDocs)
          setMaxLimit(serverMaxLimit)
          setPaginationData({
            hasNextPage,
            hasPrevPage,
            limit: responseLimit,
            nextPage: responsePage + 1,
            page: responsePage,
            prevPage: responsePage - 1,
            totalPages,
          })
          setColumns(newColumns)
          setDataToRender(docs)
        } catch (error) {
          if (!abortController.signal.aborted) {
            console.error('Error fetching preview data:', error)
          }
        }
      }

      startTransition(async () => {
        await fetchData()
      })

      return () => {
        if (!abortController.signal.aborted) {
          abortController.abort('Component unmounted')
        }
      }
    },
    [
      exportCollectionSlug,
      draft,
      fields,
      format,
      i18n,
      limit,
      locale,
      previewLimit,
      previewPage,
      sort,
      where,
      routes.api,
      targetCollectionSlug,
    ],
    500,
  )

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__header`}>
        <h3>
          <Translation i18nKey="version:preview" t={translate} />
        </h3>
        {exportTotalDocs > 0 && !isPending ? (
          <div className={`${baseClass}__export-info`}>
            <span className={`${baseClass}__export-count`}>
              <Translation
                i18nKey={'plugin-import-export:documentsToExport' as never}
                t={translate}
                variables={{
                  count: exportTotalDocs,
                }}
              />
            </span>
            {typeof maxLimit === 'number' &&
            maxLimit > 0 &&
            typeof limit === 'number' &&
            limit > maxLimit ? (
              <span className={`${baseClass}__limit-capped`}>
                <Translation
                  i18nKey={'plugin-import-export:limitCapped' as never}
                  t={translate}
                  variables={{
                    limit: maxLimit,
                  }}
                />
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {isPending && dataToRender === null ? (
        <div className={`${baseClass}__loading`}>
          <Translation i18nKey="general:loading" t={translate} />
        </div>
      ) : null}

      {dataToRender !== null ? (
        isCSV ? (
          <Table columns={columns as never} data={dataToRender} />
        ) : (
          <CodeEditorLazy
            language="json"
            readOnly
            value={JSON.stringify(dataToRender, null, 2)}
          />
        )
      ) : null}

      {paginationData && exportTotalDocs > 0 ? (
        <div className={`${baseClass}__pagination`}>
          {paginationData.totalPages > 1 ? (
            <Pagination
              hasNextPage={paginationData.hasNextPage}
              hasPrevPage={paginationData.hasPrevPage}
              nextPage={paginationData.nextPage ?? undefined}
              numberOfNeighbors={1}
              onChange={setPreviewPage}
              page={paginationData.page}
              prevPage={paginationData.prevPage ?? undefined}
              totalPages={paginationData.totalPages}
            />
          ) : null}
          <span className={`${baseClass}__page-info`}>
            <Translation
              i18nKey={'plugin-import-export:previewPageInfo' as never}
              t={translate}
              variables={{
                end: Math.min((paginationData.page ?? 1) * previewLimit, exportTotalDocs),
                start: ((paginationData.page ?? 1) - 1) * previewLimit + 1,
                total: exportTotalDocs,
              }}
            />
          </span>
          <PerPage
            handleChange={(newLimit: number) => {
              setPreviewLimit(newLimit)
              setPreviewPage(1)
            }}
            limit={previewLimit}
            limits={PREVIEW_LIMIT_OPTIONS}
          />
        </div>
      ) : null}
    </div>
  )
}
