import { CollectionConfig } from 'payload'
import { PagesCollection } from '@/collections/Pages'
import { Blogs } from '@/collections/Blogs'
import { MediaCollection } from '@/collections/Media/MediaCollection'
import { Categories } from '@/collections/Categories'
import { SpecialsCollection } from '@/collections/Specials'
import { VehicleCategories } from '@/collections/VehicleCategories'
import { VehiclesCollection } from '@/collections/Vehicles'
import { VehicleModelsCollection } from '@/collections/VehicleModels'
import { VehicleTemplatesCollection } from '@/collections/VehicleTemplates'
import { VehicleModelTemplatesCollection } from '@/collections/VehicleModelTemplates'

const collections: CollectionConfig[] = [
  PagesCollection,
  Blogs,
  SpecialsCollection,
  MediaCollection,
  Categories,
  VehicleCategories,
  VehicleTemplatesCollection,
  VehicleModelTemplatesCollection,
  VehiclesCollection,
  VehicleModelsCollection,
]

export default collections
