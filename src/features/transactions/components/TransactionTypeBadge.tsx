import { cn } from '@/lib/utils'
import type { TransactionType } from '@/types/transactions'
import { TRANSACTION_TYPE_CONFIG } from '../constants'

interface Props {
  type: TransactionType | string
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function TransactionTypeBadge({ type, showLabel = true, size = 'sm', className }: Props) {
  const config = TRANSACTION_TYPE_CONFIG[type as TransactionType]
  if (!config) return <span className="text-xs text-gray-400">{type}</span>

  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium backdrop-blur-sm border border-white/20 shadow-sm transition-all',
        config.bgColor,
        config.color,
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
