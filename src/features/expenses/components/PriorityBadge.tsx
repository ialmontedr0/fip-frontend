import { cn } from '@/lib/utils'
import { Circle } from 'lucide-react'
import { PRIORITY_CONFIG } from '../constants'
import type { Priority } from '@/types/expenses'

interface Props {
  priority?: Priority | string | null
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const FALLBACK = { label: 'N/A', color: 'text-gray-400 dark:text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800', icon: Circle }

export default function PriorityBadge({ priority, size = 'sm', showLabel = false }: Props) {
  const config = (priority && PRIORITY_CONFIG[priority as Priority]) || FALLBACK
  const Icon = config.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium transition-all',
        config.bgColor,
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3', config.color)} />
      {showLabel && <span className={cn('font-semibold', config.color)}>{config.label}</span>}
    </span>
  )
}
