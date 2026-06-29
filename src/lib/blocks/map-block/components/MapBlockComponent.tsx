import type { Map } from '@/payload-types'
import React from 'react'

export const MapBlockComponent: React.FC<Map> = ({ embedUrl, title }) => {
  if (!embedUrl) return null

  return (
    <div className="w-full rounded-2xl overflow-hidden border shadow-sm aspect-video">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title ?? 'Location map'}
      />
    </div>
  )
}
