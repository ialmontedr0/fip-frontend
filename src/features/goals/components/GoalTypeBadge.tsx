import { cn } from '@/lib/utils'
import { GOAL_TYPE_CONFIG } from '../constants'
import type { GoalType } from '@/types/goals'

interface GoalTypeBadgeProps {
  type: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export default function GoalTypeBadge({ type, size = 'sm', showIcon = true, className }: GoalTypeBadgeProps) {
  const config = GOAL_TYPE_CONFIG[type as GoalType]
  if (!config) return null

  const sizeClasses = { sm: 'text-xs px-2 py-0.5 gap-1', md: 'text-sm px-3 py-1 gap-1.5', lg: 'text-base px-4 py-1.5 gap-2' }
  const iconSizes = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' }
  const Icon = config.icon

  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', config.bgColor, config.color, sizeClasses[size], className)}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  )
}
