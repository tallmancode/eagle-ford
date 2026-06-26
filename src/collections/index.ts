import { CollectionConfig } from 'payload'
import { PagesCollection } from '@/collections/Pages'
import { Blogs } from '@/collections/Blogs'
import { MediaCollection } from '@/collections/Media/MediaCollection'
import { Categories } from '@/collections/Categories'

const collections: CollectionConfig[] = [PagesCollection, Blogs, MediaCollection, Categories]

export default collections
