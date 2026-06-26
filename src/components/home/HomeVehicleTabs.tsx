import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import hero from '@/assets/Media/home-vehicle-tabs/hero.webp'
import Image from 'next/image'
import VehicleTab from '@/components/home/VehicleTab'

export default function HomeVehicleTabs() {
  return (
    <Tabs defaultValue="all">
      <TabsList variant={'line'}>
        <TabsTrigger value="all">All Vehicles</TabsTrigger>
        <TabsTrigger value="bakkies">Bakkies</TabsTrigger>
        <TabsTrigger value="passenger-cars">Passenger-Cars</TabsTrigger>
        <TabsTrigger value="suv">SUV</TabsTrigger>
        <TabsTrigger value="vans-and-buses">Vans-And-Buses</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <VehicleTab value="all"></VehicleTab>
      </TabsContent>
      <TabsContent value="bakkies">
        <VehicleTab value="bakkies"></VehicleTab>
      </TabsContent>
      <TabsContent value="passenger-cars">
        <VehicleTab value="passenger-cars"></VehicleTab>
      </TabsContent>
      <TabsContent value="suv">
        <VehicleTab value="suv"></VehicleTab>
      </TabsContent>
      <TabsContent value="vans-and-buses">
        <VehicleTab value="vans-and-buses"></VehicleTab>
      </TabsContent>
    </Tabs>
  )
}
