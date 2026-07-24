import { cn } from '@/lib/utils'
import type { CategoryType } from '@/types/categories'
import { CATEGORY_TYPE_CONFIG } from '../constants'

interface Props {
  type: CategoryType | string
  showLabel?: boolean
  className?: string
}

export default function CategoryTypeBadge({ type, showLabel = true, className }: Props) {
  const config = CATEGORY_TYPE_CONFIG[type as CategoryType]
  if (!config) return <span className="text-xs text-gray-500">{type}</span>

  const Icon = config.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium',
      'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm border border-white/20',
      config.color, className,
    )}>
      <Icon className="h-3.5 w-3.5" />
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
