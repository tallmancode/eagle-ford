'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type Slide = {
  src: StaticImageData
  alt: string
}

type HomeCarouselProps = {
  slides: Slide[]
}

export default function HomeCarousel({ slides }: HomeCarouselProps) {
  return (
    <Carousel className="w-full select-none relative">
      <CarouselContent>
        {slides.map((slide, i) => (
          <CarouselItem key={i}>
            <Image src={slide.src} alt={slide.alt} className="w-full" />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        className="left-[clamp(0.75rem,2.5vw,1.75rem)]"
        size="icon"
        variant="outline"
        icon={ChevronLeft}
      />
      <CarouselNext
        className="right-[clamp(0.75rem,2.5vw,1.75rem)]"
        size="icon"
        variant="outline"
        icon={ChevronRight}
      />
    </Carousel>
  )
}
