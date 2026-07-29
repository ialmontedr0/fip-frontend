import { cn } from '@/lib/utils'
import { INSTALLMENT_STATUS_COLORS, INSTALLMENT_STATUS_LABELS } from '../constants'

export default function InstallmentStatusBadge({ status }: { status: string }) {
  const color = INSTALLMENT_STATUS_COLORS[status] || '#6b7280'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
      )}
      style={{
        backgroundColor: `${color}15`,
        color,
      }}
    >
      {INSTALLMENT_STATUS_LABELS[status] || status}
    </span>
  )
}
