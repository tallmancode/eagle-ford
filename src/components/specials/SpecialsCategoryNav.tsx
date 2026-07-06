import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SPECIAL_SECTIONS } from '@/lib/data/specialsData'

export default function SpecialsCategoryNav() {
  return (
    <section className="container mx-auto py-10 px-4">
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
        {SPECIAL_SECTIONS.map((section) => (
          <div
            key={section.id}
            className="snap-start shrink-0 w-[260px] sm:w-[280px] bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col"
          >
            <div className="relative h-36 bg-muted/30">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-contain p-3"
                sizes="280px"
              />
            </div>
            <div className="p-4 flex flex-col flex-1 gap-3">
              <h2 className="font-semibold text-foreground text-sm leading-snug flex-1">
                {section.title}
              </h2>
              <Button asChild variant="outline" size="sm" className="rounded-full w-full">
                <a href={`#${section.id}`}>View Specials</a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
