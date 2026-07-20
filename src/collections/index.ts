import { CollectionConfig } from 'payload'
import { PagesCollection } from '@/collections/Pages'
import { MediaCollection } from '@/collections/Media/MediaCollection'
import { SpecialsCollection } from '@/collections/Specials'
import { SpecialCategories } from '@/collections/SpecialCategories'
import { SpecialTemplatesCollection } from '@/collections/SpecialTemplates'
import { VehicleCategories } from '@/collections/VehicleCategories'
import { VehiclesCollection } from '@/collections/Vehicles'
import { VehicleModelsCollection } from '@/collections/VehicleModels'
import { VehicleTemplatesCollection } from '@/collections/VehicleTemplates'
import { VehicleModelTemplatesCollection } from '@/collections/VehicleModelTemplates'

const collections: CollectionConfig[] = [
  PagesCollection,
  SpecialsCollection,
  SpecialCategories,
  SpecialTemplatesCollection,
  MediaCollection,
  VehicleCategories,
  VehicleTemplatesCollection,
  VehicleModelTemplatesCollection,
  VehiclesCollection,
  VehicleModelsCollection,
]

export default collections
