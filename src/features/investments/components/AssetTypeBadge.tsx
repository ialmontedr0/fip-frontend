import { cn } from '@/lib/utils'
import { ASSET_TYPE_COLORS, ASSET_TYPE_ICONS } from '../constants'
import { ASSET_TYPES, type AssetType } from '@/types/investment'
import {
  LineChart, Landmark, PieChart, Bitcoin, Wallet, Building2, Package,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  LineChart, Landmark, PieChart, Bitcoin, Wallet, Building2, Package,
}

interface AssetTypeBadgeProps {
  type: string
}

export default function AssetTypeBadge({ type }: AssetTypeBadgeProps) {
  const color = ASSET_TYPE_COLORS[type] || '#6b7280'
  const label = ASSET_TYPES[type as AssetType] || type
  const iconName = ASSET_TYPE_ICONS[type] || 'Package'
  const Icon = ICON_MAP[iconName] || Package

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium')}
      style={{ backgroundColor: `${color}26`, color }}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}
