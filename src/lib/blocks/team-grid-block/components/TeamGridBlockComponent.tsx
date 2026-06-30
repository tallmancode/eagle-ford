import type { TeamGrid } from '@/payload-types'
import { TeamGrid as TeamGridUI } from '@/components/meet-the-team/TeamGrid'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'
import React from 'react'

export const TeamGridBlockComponent: React.FC<TeamGrid> = ({ members }) => {
  if (!members?.length) return null

  const mapped = members.map((member) => ({
    name: member.name,
    image:
      member.image && typeof member.image === 'object'
        ? getMediaUrl(member.image.url, member.image.updatedAt)
        : null,
    videoUrl: member.videoUrl ?? null,
  }))

  return <TeamGridUI members={mapped} />
}
