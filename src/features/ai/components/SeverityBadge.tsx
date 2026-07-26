import { cn } from '@/lib/utils'

const SEVERITY_STYLES: Record<string, string> = {
  low: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 dark:from-gray-800 dark:to-slate-800 dark:text-gray-400 border border-gray-200/50 dark:border-gray-600/50 shadow-sm',
  medium: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 dark:from-amber-500/10 dark:to-yellow-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20 shadow-sm shadow-amber-500/5',
  high: 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 dark:from-orange-500/10 dark:to-amber-500/10 dark:text-orange-400 border border-orange-200/50 dark:border-orange-500/20 shadow-sm shadow-orange-500/5',
  critical: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 dark:from-red-500/10 dark:to-rose-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 shadow-sm shadow-red-500/10',
}

const SEVERITY_LABELS: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Critica',
}

interface SeverityBadgeProps {
  severity: string
  className?: string
}

function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105',
      SEVERITY_STYLES[severity] || SEVERITY_STYLES.low,
      className,
    )}>
      {SEVERITY_LABELS[severity] || severity}
    </span>
  )
}

export default SeverityBadge
