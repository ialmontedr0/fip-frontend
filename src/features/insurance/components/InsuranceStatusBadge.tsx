import { cn } from '@/lib/utils'
import { INSURANCE_STATUS_COLORS, INSURANCE_STATUS_LABELS } from '../constants'

interface InsuranceStatusBadgeProps {
  status: string
}

export default function InsuranceStatusBadge({ status }: InsuranceStatusBadgeProps) {
  const color = INSURANCE_STATUS_COLORS[status] || '#6b7280'
  const label = INSURANCE_STATUS_LABELS[status] || status

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
