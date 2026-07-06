import { CollectionConfig } from 'payload'
import { PagesCollection } from '@/collections/Pages'
import { Blogs } from '@/collections/Blogs'
import { MediaCollection } from '@/collections/Media/MediaCollection'
import { Categories } from '@/collections/Categories'
import { SpecialsCollection } from '@/collections/Specials'

const collections: CollectionConfig[] = [
  PagesCollection,
  Blogs,
  SpecialsCollection,
  MediaCollection,
  Categories,
]

export default collections
