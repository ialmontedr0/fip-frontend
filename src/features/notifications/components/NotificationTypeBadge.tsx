import { cn } from '@/lib/utils'
import { NOTIFICATION_TYPE_CONFIG } from '../constants'
import type { NotificationType } from '@/types/notifications'

interface NotificationTypeBadgeProps {
  type: NotificationType
  showIcon?: boolean
  size?: 'sm' | 'md'
}

export default function NotificationTypeBadge({ type, showIcon = true, size = 'md' }: NotificationTypeBadgeProps) {
  const config = NOTIFICATION_TYPE_CONFIG[type]
  const Icon = config?.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        'bg-white/80 dark:bg-gray-800/80 border-gray-200/60 dark:border-gray-700/50',
        'text-gray-700 dark:text-gray-300',
      )}
    >
      {showIcon && Icon && (
        <div className={cn(
          'rounded-md flex items-center justify-center',
          size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
          config?.gradient ? `bg-gradient-to-br ${config.gradient}` : 'bg-gray-400',
        )}>
          <Icon className={cn(size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5')} stroke="white" strokeWidth={3} />
        </div>
      )}
      {config?.label ?? type}
    </span>
  )
}
