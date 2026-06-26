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
  blog: LayoutGrid,
  pages: StickyNote,
  header: PanelTopClose,
  footer: Footprints,
  tags: Tags,
  vehicles: Car,
  'vehicle-makes': Car,
  redirects: ExternalLink,
  forms: Form,
  'form-submissions': Send,
  'ai-provider-settings': LucideSparkle,
}

export const getNavIcon = (slug: string) =>
  Object.hasOwn(navIconMap, slug)
    ? navIconMap[slug as CollectionSlug | GlobalSlug]
    : GamepadDirectional
