import { cn } from '@/lib/utils'

const PRIORITY_STYLES: Record<string, string> = {
  high: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 dark:from-red-500/10 dark:to-rose-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 shadow-sm shadow-red-500/10',
  medium: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 dark:from-amber-500/10 dark:to-yellow-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20 shadow-sm shadow-amber-500/5',
  low: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 dark:from-gray-800 dark:to-slate-800 dark:text-gray-400 border border-gray-200/50 dark:border-gray-600/50 shadow-sm',
}

const PRIORITY_LABELS: Record<string, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}

interface PriorityBadgeProps {
  priority: string
  className?: string
}

function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105',
      PRIORITY_STYLES[priority] || PRIORITY_STYLES.low,
      className,
    )}>
      {PRIORITY_LABELS[priority] || priority}
    </span>
  )
}

export default PriorityBadge
