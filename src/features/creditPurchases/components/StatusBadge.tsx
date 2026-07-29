import { cn } from '@/lib/utils'
import { CREDIT_PURCHASE_STATUS_COLORS, CREDIT_PURCHASE_STATUS_LABELS } from '../constants'

export default function StatusBadge({ status }: { status: string }) {
  const color = CREDIT_PURCHASE_STATUS_COLORS[status] || '#6b7280'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      )}
      style={{
        backgroundColor: `${color}15`,
        color,
        borderColor: `${color}30`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {CREDIT_PURCHASE_STATUS_LABELS[status] || status}
    </span>
  )
}
