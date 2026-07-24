import { cn } from '@/lib/utils'
import type { TransactionStatus } from '@/types/transactions'
import { TRANSACTION_STATUS_CONFIG } from '../constants'

interface Props {
  status: TransactionStatus | string
  size?: 'sm' | 'md'
  className?: string
}

export default function TransactionStatusBadge({ status, size = 'sm', className }: Props) {
  const config = TRANSACTION_STATUS_CONFIG[status as TransactionStatus]
  if (!config) return <span className="text-xs text-gray-400">{status}</span>

  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium backdrop-blur-sm border border-white/20 shadow-sm',
        config.bgColor,
        config.color,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {config.label}
    </span>
  )
}
