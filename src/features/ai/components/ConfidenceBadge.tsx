import { cn } from '@/lib/utils'

interface ConfidenceBadgeProps {
  value: number
  className?: string
}

function ConfidenceBadge({ value, className }: ConfidenceBadgeProps) {
  const color = value >= 0.8 ? 'green' : value >= 0.5 ? 'yellow' : 'red'
  const bg = {
    green: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 dark:from-green-500/10 dark:to-emerald-500/10 dark:text-green-400 border border-green-200/50 dark:border-green-500/20',
    yellow: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 dark:from-amber-500/10 dark:to-yellow-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20',
    red: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 dark:from-red-500/10 dark:to-rose-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20',
  }[color]
  const dot = {
    green: 'bg-green-500 shadow-sm shadow-green-500/30',
    yellow: 'bg-amber-500 shadow-sm shadow-amber-500/30',
    red: 'bg-red-500 shadow-sm shadow-red-500/30',
  }[color]

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm', bg, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full animate-[ping_2s_ease-in-out_infinite]', dot)} />
      {(value * 100).toFixed(0)}%
    </span>
  )
}

export default ConfidenceBadge
