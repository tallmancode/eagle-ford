import { TeamGrid } from '@/components/meet-the-team/TeamGrid'
import type { Metadata } from 'next'
import Image from 'next/image'
import React from 'react'

export const metadata: Metadata = {
  title: 'Meet the Team | Eagle Ford',
  description:
    'Introducing the Eagle Ford Sales Team. Its important for our customers to know our sales team and that the same person will be at Eagle Corner year after year.',
}

export default function MeetTheTeamPage() {
  return (
    <div>
      <div className="relative w-full aspect-[16/5] overflow-hidden">
        <Image
          src="/meet-the-team/hero.webp"
          alt="Eagle Ford dealership exterior"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <section className="container mx-auto py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-foreground mb-4">
            Eagle Ford Sales Team
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Introducing the Eagle Ford Sales Team, its important for our customers to know our sales
            team and that the same person will be at Eagle Corner year after year.
          </p>
        </div>

        <TeamGrid />
      </section>
    </div>
  )
}
