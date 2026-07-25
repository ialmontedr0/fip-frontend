import { cn } from '@/lib/utils'
import { INCOME_STATUS_CONFIG } from '../constants'
import type { IncomeStatus } from '@/types/incomes'
import type { LucideIcon } from 'lucide-react'
import Badge from '@/components/ui/Badge'

interface Props {
  status: string
  size?: 'sm' | 'md'
  className?: string
}

export default function IncomeStatusBadge({ status, size = 'md', className }: Props) {
  const config = INCOME_STATUS_CONFIG[status as IncomeStatus]
  if (!config) return null

  const Icon = config.icon as LucideIcon

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={cn('inline-flex items-center gap-1', config.bgColor, config.color, className)}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      {config.label}
    </Badge>
  )
}
