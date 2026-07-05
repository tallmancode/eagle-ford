import {
  TrendingUp,
  ShieldCheck,
  Handshake,
  CheckCircle,
  Star,
  Shield,
  Car,
  Wrench,
  Info,
  Calendar,
  Fuel,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Zap,
  Heart,
  ThumbsUp,
  DollarSign,
  Paintbrush,
  PanelTop,
  Droplets,
  Layers,
  Settings,
  Package,
  GraduationCap,
  Wifi,
  Truck,
  Coffee,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type LucideIconEntry = {
  label: string
  Icon: LucideIcon
}

export const LUCIDE_ICONS: Record<string, LucideIconEntry> = {
  'trending-up': { label: 'Trending Up', Icon: TrendingUp },
  'shield-check': { label: 'Shield Check', Icon: ShieldCheck },
  handshake: { label: 'Handshake', Icon: Handshake },
  'check-circle': { label: 'Check Circle', Icon: CheckCircle },
  star: { label: 'Star', Icon: Star },
  shield: { label: 'Shield', Icon: Shield },
  car: { label: 'Car', Icon: Car },
  wrench: { label: 'Wrench (Service)', Icon: Wrench },
  info: { label: 'Info', Icon: Info },
  calendar: { label: 'Calendar', Icon: Calendar },
  fuel: { label: 'Fuel', Icon: Fuel },
  'map-pin': { label: 'Map Pin (Location)', Icon: MapPin },
  phone: { label: 'Phone', Icon: Phone },
  mail: { label: 'Mail (Email)', Icon: Mail },
  clock: { label: 'Clock (Hours)', Icon: Clock },
  award: { label: 'Award', Icon: Award },
  zap: { label: 'Zap', Icon: Zap },
  heart: { label: 'Heart', Icon: Heart },
  'thumbs-up': { label: 'Thumbs Up', Icon: ThumbsUp },
  'dollar-sign': { label: 'Dollar Sign', Icon: DollarSign },
  paintbrush: { label: 'Paintbrush', Icon: Paintbrush },
  'panel-top': { label: 'Panel Top', Icon: PanelTop },
  droplets: { label: 'Droplets', Icon: Droplets },
  layers: { label: 'Layers', Icon: Layers },
  settings: { label: 'Settings', Icon: Settings },
  package: { label: 'Package', Icon: Package },
  'graduation-cap': { label: 'Graduation Cap', Icon: GraduationCap },
  wifi: { label: 'Wi-Fi', Icon: Wifi },
  truck: { label: 'Truck (Delivery)', Icon: Truck },
  coffee: { label: 'Coffee', Icon: Coffee },
}

export const LUCIDE_ICON_KEYS = Object.keys(LUCIDE_ICONS)

export const DEFAULT_LUCIDE_ICON = 'check-circle'
