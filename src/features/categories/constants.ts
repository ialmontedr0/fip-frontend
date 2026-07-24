import {
  ShoppingCart, Utensils, Coffee, Wine, Cake, Car, Plane, Bus, Fuel,
  Home, Heart, BookOpen, Shirt, Gamepad2, Gift, Zap, Droplets,
  Wifi, Cross, Dog, MoreHorizontal,
  Briefcase, TrendingUp, Award, Download, Banknote,
  ArrowLeftRight, Repeat, Send,
  Scale, ArrowUpDown,
  Tag, FolderOpen, FolderTree,
} from 'lucide-react'
import type { CategoryType } from '@/types/categories'
import type { LucideIcon } from 'lucide-react'

export const CATEGORY_TYPE_CONFIG: Record<CategoryType, {
  label: string
  color: string
  bgColor: string
  gradient: string
  icon: LucideIcon
}> = {
  expense: {
    label: 'Gasto',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    gradient: 'from-red-400 to-red-600',
    icon: ShoppingCart,
  },
  income: {
    label: 'Ingreso',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
    gradient: 'from-emerald-400 to-emerald-600',
    icon: TrendingUp,
  },
  transfer: {
    label: 'Transferencia',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    gradient: 'from-blue-400 to-blue-600',
    icon: ArrowLeftRight,
  },
  adjustment: {
    label: 'Ajuste',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-500/10',
    gradient: 'from-amber-400 to-amber-600',
    icon: Scale,
  },
}

export const ICON_CATEGORIES: Array<{
  name: string
  icons: Array<{ name: string; icon: LucideIcon }>
}> = [
  {
    name: 'Comida y Bebida',
    icons: [
      { name: 'utensils', icon: Utensils },
      { name: 'coffee', icon: Coffee },
      { name: 'wine', icon: Wine },
      { name: 'cake', icon: Cake },
    ],
  },
  {
    name: 'Transporte',
    icons: [
      { name: 'car', icon: Car },
      { name: 'plane', icon: Plane },
      { name: 'bus', icon: Bus },
      { name: 'fuel', icon: Fuel },
    ],
  },
  {
    name: 'Vivienda y Servicios',
    icons: [
      { name: 'home', icon: Home },
      { name: 'zap', icon: Zap },
      { name: 'droplets', icon: Droplets },
      { name: 'wifi', icon: Wifi },
    ],
  },
  {
    name: 'Compras y Entretenimiento',
    icons: [
      { name: 'shopping-cart', icon: ShoppingCart },
      { name: 'shirt', icon: Shirt },
      { name: 'gamepad', icon: Gamepad2 },
      { name: 'gift', icon: Gift },
    ],
  },
  {
    name: 'Salud y Educacion',
    icons: [
      { name: 'heart', icon: Heart },
      { name: 'cross', icon: Cross },
      { name: 'book-open', icon: BookOpen },
      { name: 'dog', icon: Dog },
    ],
  },
  {
    name: 'Ingresos',
    icons: [
      { name: 'briefcase', icon: Briefcase },
      { name: 'award', icon: Award },
      { name: 'download', icon: Download },
      { name: 'banknote', icon: Banknote },
    ],
  },
  {
    name: 'Transferencias y Ajustes',
    icons: [
      { name: 'arrow-left-right', icon: ArrowLeftRight },
      { name: 'repeat', icon: Repeat },
      { name: 'send', icon: Send },
      { name: 'arrow-up-down', icon: ArrowUpDown },
    ],
  },
  {
    name: 'Generales',
    icons: [
      { name: 'tag', icon: Tag },
      { name: 'folder-open', icon: FolderOpen },
      { name: 'folder-tree', icon: FolderTree },
      { name: 'more-horizontal', icon: MoreHorizontal },
    ],
  },
]

export const ICON_MAP: Record<string, LucideIcon> = {}
for (const cat of ICON_CATEGORIES) {
  for (const item of cat.icons) {
    ICON_MAP[item.name] = item.icon
  }
}

export const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#06b6d4', '#84cc16', '#a855f7', '#e11d48',
]
