import React from 'react'
import slide1 from '@/assets/Media/home-hero/homeSlide_0_desktop.webp'
import slide2 from '@/assets/Media/home-hero/homeSlide_2_desktop.webp'
import slide3 from '@/assets/Media/home-hero/homeSlide_3_desktop.webp'

import contactUs from '@/assets/Media/services/contact-us.webp'
import service from '@/assets/Media/services/service.webp'
import used from '@/assets/Media/services/used.webp'
import HomeCarousel from '@/components/home/HomeCarousel'
import HomeVehicleTabs from '@/components/home/HomeVehicleTabs'
import GoogleReviewsCarousel from '@/components/home/GoogleReviewsCarousel'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { YouTubeEmbed } from '@next/third-parties/google'

const slides = [
  { src: slide1, alt: 'Eagle Ford' },
  { src: slide2, alt: 'Eagle Ford' },
  { src: slide3, alt: 'Eagle Ford' },
]

export default function Page() {
  return (
    <div className="">
      <div>
        <HomeCarousel slides={slides} />
      </div>
      <section className="container mx-auto py-8">
        <h1 className="text-primary text-4xl font-bold text-center mb-8">Welcome to Eagle Ford</h1>
        <p className="text-center text-lg">
          Our experienced team provides 5 Star customer service and ensuring your automotive needs
          are met with excellence. Experience the difference with us today.
        </p>
      </section>
      <section className="container mx-auto py-8">
        <h1 className="text-neutral text-4xl text-center mb-8">View Our Vehicles</h1>
        <div>
          <HomeVehicleTabs />
        </div>
      </section>
      <section className="container mx-auto py-8">
        <h1 className="text-neutral text-4xl text-center mb-8">Get the Full Ford Experience</h1>
        <div className="grid grid-cols-3 space-x-4">
          <div className="flex flex-col justify-between">
            <div className="flex flex-col space-y-4 mb-4">
              <Image
                src={contactUs}
                alt={'image'}
                className="w-full mx-auto rounded-lg mb-4 object-contain"
              />
              <h3 className="text-primary text-2xl">Ford Offers</h3>
              <p>
                Our Ford Dealership features unbeatable deals on the latest models, financing
                options and Service packages.
              </p>
            </div>

            <Button className="rounded-full">Explore</Button>
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex flex-col space-y-4 mb-4">
              <Image
                src={service}
                alt={'image'}
                className="w-full mx-auto rounded-lg mb-4 object-contain"
              />
              <h3 className="text-primary text-2xl">Online Service Booking</h3>
              <p>Quick convenient service booking with instant confirmation.</p>
            </div>
            <Button className="rounded-full">Explore</Button>
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex flex-col space-y-4 mb-4">
              <Image
                src={used}
                alt={'image'}
                className="w-full mx-auto rounded-lg mb-4 object-contain"
              />
              <h3 className="text-primary text-2xl">Ford Approved Used Vehicles</h3>
              <p>Find a Ford that suits you. Explore our range of Ford Approved Used vehicles.</p>
            </div>
            <Button className="rounded-full">Explore</Button>
          </div>
        </div>
      </section>
      <section className="container mx-auto py-8">
        <h1 className="text-neutral text-4xl text-center mb-8">Our Reviews</h1>
        <GoogleReviewsCarousel />
      </section>
      <section className="container mx-auto py-8">
        <h1 className="text-neutral text-4xl text-center mb-8">Welcome to Eagle Ford</h1>
        <div className="grid grid-cols-2 gap-x-8">
          <div className="flex flex-col justify-center">
            <div className="flex flex-col space-y-4">
              <p>
                Trustworthy, reliable and versatile – that’s what you can expect from Eagle Ford’s
                range of cars, SUVs and commercial vehicles. For more than a century, Ford has been
                crafting vehicles to meet the needs of the motoring public, and since 1983.
              </p>
              <Button>Read More</Button>
            </div>
          </div>
          <div className="w-full aspect-video mt-8">
            <YouTubeEmbed videoid="6kFhM1cZf08" style="max-width:100%;height:100%" />
          </div>
        </div>
      </section>
    </div>
  )
}
