import { CollectionSlug, GlobalSlug } from 'payload'
import {
  GamepadDirectional,
  Image,
  LayoutGrid,
  LucideProps,
  StickyNote,
  User,
  Footprints,
  PanelTopClose,
  ExternalLink,
  Tags,
  Form,
  Send,
  LucideSparkle,
  Car,
} from 'lucide-react'
import { ExoticComponent } from 'react'

export const navIconMap: Partial<
  Record<CollectionSlug | GlobalSlug, ExoticComponent<LucideProps>>
> = {
  media: Image,
  users: User,
  blogs: LayoutGrid,
  pages: StickyNote,
  header: PanelTopClose,
  footer: Footprints,
  redirects: ExternalLink,
  forms: Form,
  'form-submissions': Send,
}

export const getNavIcon = (slug: string) =>
  Object.hasOwn(navIconMap, slug)
    ? navIconMap[slug as CollectionSlug | GlobalSlug]
    : GamepadDirectional
