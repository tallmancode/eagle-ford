import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { TeamGrid as TeamGridUI } from '@/components/meet-the-team/TeamGrid'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'
import type { Media } from '@/payload-types'

type TeamGridV2Props = {
  columns?: '2' | '3' | '4' | null
  members?: Array<{
    id?: string | null
    name: string
    image?: number | Media | null
    videoUrl?: string | null
  }> | null
  styles?: StyleValues | null
  blockType?: string
  id?: string | null
}

export function TeamGridV2BlockComponent(props: TeamGridV2Props) {
  const { members, styles } = props
  if (!members?.length) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  const mapped = members.map((member) => ({
    name: member.name,
    image:
      member.image && typeof member.image === 'object'
        ? getMediaUrl(member.image.url, member.image.updatedAt)
        : null,
    videoUrl: member.videoUrl ?? null,
  }))

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <TeamGridUI members={mapped} />
    </div>
  )
}
