'use client'

import type { HoursTabs } from '@/payload-types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

export const HoursTabsBlockComponent: React.FC<HoursTabs> = ({ departments }) => {
  if (!departments || departments.length === 0) return null

  const firstDeptId = departments[0]?.id
  if (!firstDeptId) return null

  return (
    <Tabs defaultValue={firstDeptId}>
      <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/60 p-1">
        {departments.map((dept) => {
          if (!dept.id) return null

          return (
            <TabsTrigger key={dept.id} value={dept.id} className="text-xs sm:text-sm">
              {dept.label}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {departments.map((dept) => {
        if (!dept.id) return null

        return (
          <TabsContent key={dept.id} value={dept.id}>
            <div className="bg-card border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {dept.rows?.map((row, i) => (
                    <tr
                      key={row.id ?? `${dept.id}-${row.day}`}
                      className={i % 2 === 0 ? 'bg-muted/30' : 'bg-card'}
                    >
                      <td className="px-5 py-3.5 font-medium text-foreground">{row.day}</td>
                      <td
                        className={`px-5 py-3.5 text-right font-semibold ${
                          row.hours === 'Closed' ? 'text-muted-foreground' : 'text-primary'
                        }`}
                      >
                        {row.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
