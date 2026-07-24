import { cn } from '@/lib/utils'
import { ICON_MAP } from '../constants'

interface Props {
  name: string
  icon?: string | null
  color?: string | null
  isSystem?: boolean
  showIcon?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function CategoryBadge({ name, icon, color, isSystem, showIcon = true, size = 'sm', className }: Props) {
  const Icon = icon ? ICON_MAP[icon] : null

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium transition-all',
      'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 shadow-sm',
      size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
      className,
    )}>
      {Icon && showIcon && <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} style={color ? { color } : undefined} />}
      {!Icon && showIcon && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color || '#6b7280' }}
        />
      )}
      <span className="text-gray-700 dark:text-gray-300">{name}</span>
      {isSystem && (
        <span className="ml-0.5 rounded bg-gray-200/50 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
          SYS
        </span>
      )}
    </span>
  )
}
