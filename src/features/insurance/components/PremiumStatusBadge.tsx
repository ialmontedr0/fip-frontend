import { cn } from '@/lib/utils'
import { PREMIUM_STATUS_COLORS, PREMIUM_STATUS_LABELS } from '../constants'

interface PremiumStatusBadgeProps {
  status: string
}

export default function PremiumStatusBadge({ status }: PremiumStatusBadgeProps) {
  const color = PREMIUM_STATUS_COLORS[status] || '#6b7280'
  const label = PREMIUM_STATUS_LABELS[status] || status

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium')}
      style={{ backgroundColor: `${color}26`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
