import { cn } from '@/lib/utils'
import { INSURANCE_TYPE_COLORS } from '../constants'
import { INSURANCE_TYPES, type InsuranceType } from '@/types/insurance'
import {
  Heart, Stethoscope, Car, Home, Plane, Accessibility, Shield, type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Stethoscope, Car, Home, Plane, Accessibility, Shield,
}

interface InsuranceTypeBadgeProps {
  type: string
}

export default function InsuranceTypeBadge({ type }: InsuranceTypeBadgeProps) {
  const color = INSURANCE_TYPE_COLORS[type] || '#6b7280'
  const label = INSURANCE_TYPES[type as InsuranceType] || type
  const Icon = ICON_MAP[type]

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium')}
      style={{ backgroundColor: `${color}26`, color }}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </span>
  )
}
