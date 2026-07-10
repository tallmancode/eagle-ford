import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { getVisibleEntities } from '@payloadcms/ui/shared'

import { LiveStockContent } from '@/views/LiveStock/LiveStockContent'

export default function LiveStockView({ initPageResult, searchParams }: AdminViewServerProps) {
  const { req, permissions, locale } = initPageResult
  const visibleEntities = getVisibleEntities({ req })

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={{}}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <LiveStockContent searchParams={searchParams} />
    </DefaultTemplate>
  )
}
