'use client'

import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type HoursRow = {
  id?: string | null
  dayPreset?: string | null
  dayCustom?: string | null
  closed?: boolean | null
  hours?: string | null
}

type HoursTabsV2Props = {
  departments?: Array<{
    id?: string | null
    label: string
    rows?: HoursRow[] | null
  }> | null
  styles?: StyleValues | null
  blockType?: string
  id?: string | null
}

function resolveDayLabel(row: HoursRow): string {
  if (row.dayPreset === 'custom') return row.dayCustom?.trim() || 'Custom'
  return row.dayPreset || ''
}

function resolveHours(row: HoursRow): { text: string; closed: boolean } {
  if (row.closed) return { text: 'Closed', closed: true }
  return { text: row.hours?.trim() || '', closed: false }
}

export function HoursTabsV2BlockComponent(props: HoursTabsV2Props) {
  const { departments, styles } = props
  if (!departments?.length) return null

  const firstDeptId = departments[0]?.id ?? 'dept-0'
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <Tabs defaultValue={firstDeptId}>
        <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/60 p-1">
          {departments.map((dept, index) => {
            const value = dept.id ?? `dept-${index}`
            return (
              <TabsTrigger
                key={value}
                value={value}
                className="min-h-11 px-3 py-2.5 text-sm sm:min-h-0 sm:py-1.5"
              >
                {dept.label}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {departments.map((dept, index) => {
          const value = dept.id ?? `dept-${index}`
          return (
            <TabsContent key={value} value={value}>
              <div className="overflow-hidden rounded-xl border bg-card">
                <table className="w-full text-sm">
                  <tbody>
                    {dept.rows?.map((row, i) => {
                      const day = resolveDayLabel(row)
                      const hours = resolveHours(row)
                      return (
                        <tr
                          key={row.id ?? `${value}-${day}-${i}`}
                          className={i % 2 === 0 ? 'bg-muted/30' : 'bg-card'}
                        >
                          <td className="px-5 py-3.5 font-medium text-foreground">{day}</td>
                          <td
                            className={`px-5 py-3.5 text-right font-semibold ${
                              hours.closed ? 'text-muted-foreground' : 'text-primary'
                            }`}
                          >
                            {hours.text}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
