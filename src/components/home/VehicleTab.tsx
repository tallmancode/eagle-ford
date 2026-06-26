import Image from 'next/image'

const vehicles = [
  // Bakkies
  { name: 'Next Level Ranger', image: '/vehicle-tabs/next-level-ranger.webp', category: 'bakkies' },
  { name: 'Ranger Double Cab', image: '/vehicle-tabs/ranger-double-cab.webp', category: 'bakkies' },
  { name: 'Ranger Super Cab', image: '/vehicle-tabs/ranger-super-cab.webp', category: 'bakkies' },
  { name: 'Ranger Single Cab', image: '/vehicle-tabs/ranger-single-cab.webp', category: 'bakkies' },
  { name: 'Ranger', image: '/vehicle-tabs/ranger.webp', category: 'bakkies' },
  { name: 'Ranger Platinum', image: '/vehicle-tabs/ranger-platinum.webp', category: 'bakkies' },
  { name: 'Ranger Raptor', image: '/vehicle-tabs/ranger-raptor.webp', category: 'bakkies' },
  { name: 'Ranger Sport', image: '/vehicle-tabs/ranger-sport.webp', category: 'bakkies' },
  { name: 'Ranger Tremor', image: '/vehicle-tabs/ranger-tremor.webp', category: 'bakkies' },
  { name: 'Ranger Wildtrak', image: '/vehicle-tabs/ranger-wildtrak.webp', category: 'bakkies' },
  {
    name: 'Ranger Wildtrak Super Cab',
    image: '/vehicle-tabs/ranger-wildtrak-super-cab.webp',
    category: 'bakkies',
  },
  { name: 'Ranger Wildtrak X', image: '/vehicle-tabs/ranger-wildtrak-x.webp', category: 'bakkies' },
  { name: 'Ranger XL', image: '/vehicle-tabs/ranger-xl.webp', category: 'bakkies' },
  { name: 'Ranger XLT', image: '/vehicle-tabs/ranger-xlt.webp', category: 'bakkies' },

  // Passenger Cars
  { name: 'Mustang GT', image: '/vehicle-tabs/mustang-gt.webp', category: 'passenger-cars' },
  {
    name: 'Mustang Dark Horse',
    image: '/vehicle-tabs/mustang-dark-horse.webp',
    category: 'passenger-cars',
  },

  // SUV
  { name: 'Next Level Everest', image: '/vehicle-tabs/next-level-everest.webp', category: 'suv' },
  { name: 'New Level Territory', image: '/vehicle-tabs/new-level-territory.webp', category: 'suv' },
  { name: 'Everest', image: '/vehicle-tabs/everest.webp', category: 'suv' },

  // Vans & Buses
  {
    name: 'New Tourneo Custom',
    image: '/vehicle-tabs/new-tourneo-custom.webp',
    category: 'vans-and-buses',
  },
  {
    name: 'New Transit Custom',
    image: '/vehicle-tabs/new-transit-custom.webp',
    category: 'vans-and-buses',
  },
  { name: 'Transit Van', image: '/vehicle-tabs/transit-van.webp', category: 'vans-and-buses' },
]

export default function VehicleTab({ value }: { value: string }) {
  const filtered = value === 'all' ? vehicles : vehicles.filter((v) => v.category === value)

  return (
    <div className="grid grid-cols-4 gap-4">
      {filtered.map((vehicle) => (
        <a key={vehicle.image} href="#" className="bg-light-50 shadow-lg rounded-lg p-4">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            width={300}
            height={200}
            className="w-full max-w-[300px] mx-auto rounded-lg mb-4 object-contain"
          />
          <h2 className="uppercase text-primary text-center font-bold">{vehicle.name}</h2>
        </a>
      ))}
    </div>
  )
}
