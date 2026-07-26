import { cn } from '@/lib/utils'
import { GOAL_STATUS_CONFIG } from '../constants'
import type { GoalStatus } from '@/types/goals'

interface GoalStatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
  className?: string
}

export default function GoalStatusBadge({ status, size = 'sm', className }: GoalStatusBadgeProps) {
  const config = GOAL_STATUS_CONFIG[status as GoalStatus]
  if (!config) return null

  const sizeClasses = { sm: 'text-xs px-2 py-0.5 gap-1', md: 'text-sm px-3 py-1 gap-1.5' }
  const dotSizes = { sm: 'h-1.5 w-1.5', md: 'h-2 w-2' }

  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', config.bgColor, config.color, sizeClasses[size], className)}>
      <span className={cn('rounded-full', config.dotColor, dotSizes[size])} />
      {config.label}
    </span>
  )
}
