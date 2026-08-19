import { CollectionSlug, GlobalSlug } from 'payload'
import {
  Box,
  Car,
  ClipboardList,
  Download,
  ExternalLink,
  FileUp,
  Footprints,
  Form,
  Image,
  LayoutTemplate,
  Layers,
  LucideProps,
  Megaphone,
  PanelTopClose,
  Send,
  Settings,
  Sparkles,
  StickyNote,
  Tags,
  User,
} from 'lucide-react'
import { ExoticComponent } from 'react'

export const navIconMap: Partial<
  Record<CollectionSlug | GlobalSlug | 'live-stock', ExoticComponent<LucideProps>>
> = {
  pages: StickyNote,
  media: Image,
  users: User,
  header: PanelTopClose,
  footer: Footprints,
  settings: Settings,
  redirects: ExternalLink,
  forms: Form,
  'form-submissions': Send,
  exports: FileUp,
  imports: Download,
  'ai-seo-usage': Sparkles,
  specials: Megaphone,
  'special-categories': Tags,
  'special-templates': LayoutTemplate,
  vehicles: Car,
  'vehicle-models': Layers,
  'vehicle-variants': ClipboardList,
  'vehicle-categories': Tags,
  'vehicle-templates': LayoutTemplate,
  'vehicle-model-templates': LayoutTemplate,
  'live-stock': Car,
}

export const getNavIcon = (slug: string) =>
  Object.hasOwn(navIconMap, slug) ? navIconMap[slug as CollectionSlug | GlobalSlug | 'live-stock'] : Box
