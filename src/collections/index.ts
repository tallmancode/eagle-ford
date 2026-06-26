import { CollectionConfig } from 'payload'
import { PagesCollection } from '@/collections/Pages'
import { Blogs } from '@/collections/Blogs'
import { Media } from '@/collections/Media'
import { Categories } from '@/collections/Categories'

const collections: CollectionConfig[] = [PagesCollection, Blogs, Media, Categories]

export default collections
