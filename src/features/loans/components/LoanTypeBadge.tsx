import { cn } from '@/lib/utils'
import { LoanType, LOAN_TYPES } from '@/types/loans'
import { LOAN_TYPE_ICONS, LOAN_TYPE_COLORS } from '../constants'
import { User, Home, Car, GraduationCap, Building2, CreditCard, CalendarCheck, Coins, PiggyBank, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  User, Home, Car, GraduationCap, Building2, CreditCard, CalendarCheck, Coins, PiggyBank,
}

interface LoanTypeBadgeProps {
  type: string
}

export default function LoanTypeBadge({ type }: LoanTypeBadgeProps) {
  const color = LOAN_TYPE_COLORS[type] || '#6b7280'
  const label = LOAN_TYPES[type as LoanType] || type
  const iconName = LOAN_TYPE_ICONS[type]
  const Icon = iconName ? ICON_MAP[iconName] : null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
      )}
      style={{
        backgroundColor: `${color}26`,
        color: color,
      }}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </span>
  )
}
