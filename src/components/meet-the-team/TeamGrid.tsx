'use client'

import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import { PlayCircle, UserCircle2, X } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'

export type TeamMember = {
  name: string
  image: string | null
  videoUrl: string | null
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Adrian Victor',
    image: '/meet-the-team/adrian-victor.webp',
    videoUrl: 'https://www.youtube.com/embed/amIGgf-KOK8',
  },
  {
    name: 'Sergio Fernandez',
    image: '/meet-the-team/sergio-fernandez.webp',
    videoUrl: 'https://www.youtube.com/embed/IaYiuCDPPj0',
  },
  {
    name: 'Evans Mpeko',
    image: '/meet-the-team/evans-mpeko.webp',
    videoUrl: 'https://www.youtube.com/embed/9tYsqovZSXE',
  },
  {
    name: 'Humprey Mabuza',
    image: '/meet-the-team/humphrey-mabuza.webp',
    videoUrl: 'https://youtube.com/shorts/IU1lFSz5NIg',
  },
  {
    name: 'Daphney Maruana',
    image: '/meet-the-team/daphney-maruana.webp',
    videoUrl: 'https://youtube.com/shorts/N4aEOJKeVTY',
  },
  {
    name: 'Mzi Twala',
    image: '/meet-the-team/mzi-twala.webp',
    videoUrl: 'https://youtube.com/shorts/N1Teq1nlOyA',
  },
  {
    name: 'Rob Wood',
    image: '/meet-the-team/rob-wood.webp',
    videoUrl: 'https://youtube.com/shorts/gz2WGxGOggQ',
  },
  {
    name: 'Thabang Molefe',
    image: '/meet-the-team/thabang-molefe.webp',
    videoUrl: 'https://www.youtube.com/embed/t7o85xyaM40',
  },
  {
    name: 'Eugene Jonker',
    image: null,
    videoUrl: null,
  },
  {
    name: 'Charline Clark',
    image: '/meet-the-team/charline-clark.webp',
    videoUrl: 'https://youtube.com/shorts/xH7TQfJkbGk',
  },
]

function resolveEmbedUrl(url: string): { src: string; isShorts: boolean } {
  if (url.includes('youtube.com/shorts/')) {
    const id = url.split('youtube.com/shorts/')[1]
    return {
      src: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0&loop=1`,
      isShorts: true,
    }
  }
  return {
    src: `${url}?autoplay=1&rel=0`,
    isShorts: false,
  }
}

type TeamGridProps = {
  members?: TeamMember[]
}

export function TeamGrid({ members = DEFAULT_TEAM_MEMBERS }: TeamGridProps) {
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null)

  const embedData = activeVideo ? resolveEmbedUrl(activeVideo) : null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {members.map((member) => {
          const clickable = !!member.videoUrl
          return (
            <article
              key={member.name}
              onClick={() => clickable && setActiveVideo(member.videoUrl)}
              className={[
                'group flex flex-col items-center gap-3',
                clickable ? 'cursor-pointer' : 'cursor-default',
              ].join(' ')}
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-neutral-100">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={[
                      'object-cover object-top transition-transform duration-300',
                      clickable ? 'group-hover:scale-105' : '',
                    ].join(' ')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                    <UserCircle2 className="w-1/2 h-1/2 text-neutral-400" />
                  </div>
                )}

                {clickable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
                    <PlayCircle className="w-14 h-14 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                )}
              </div>

              <p className="text-sm font-medium tracking-widest uppercase text-center text-foreground">
                {member.name}
              </p>
            </article>
          )
        })}
      </div>

      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent
          className={[
            'p-0 border-0 bg-transparent shadow-none',
            embedData?.isShorts ? 'max-w-sm' : 'max-w-3xl',
          ].join(' ')}
        >
          <div className="relative w-full">
            <DialogClose className="absolute -top-10 right-0 flex items-center gap-2 text-white hover:text-neutral-300 transition-colors z-10">
              <span className="text-xs uppercase tracking-widest font-bold">Close</span>
              <X className="w-5 h-5" />
            </DialogClose>

            {embedData && (
              <div
                className={[
                  'w-full rounded-lg overflow-hidden shadow-2xl bg-black border border-white/10',
                  embedData.isShorts ? 'aspect-[9/16]' : 'aspect-video',
                ].join(' ')}
              >
                <iframe
                  src={embedData.src}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Team member video"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
