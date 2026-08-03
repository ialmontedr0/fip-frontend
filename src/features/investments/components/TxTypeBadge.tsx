import { cn } from '@/lib/utils'
import { TX_TYPE_COLORS, TX_TYPE_LABELS } from '../constants'

interface TxTypeBadgeProps {
  type: string
}

export default function TxTypeBadge({ type }: TxTypeBadgeProps) {
  const color = TX_TYPE_COLORS[type] || '#6b7280'
  const label = TX_TYPE_LABELS[type] || type

  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium')}
      style={{ backgroundColor: `${color}26`, color }}
    >
      {label}
    </span>
  )
}
