import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 dark:from-gray-800 dark:to-slate-800 dark:text-gray-400 border border-gray-200/50 dark:border-gray-600/50 shadow-sm',
  training: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-500/10 dark:to-indigo-500/10 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20 shadow-sm shadow-blue-500/10',
  completed: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 dark:from-green-500/10 dark:to-emerald-500/10 dark:text-green-400 border border-green-200/50 dark:border-green-500/20 shadow-sm shadow-green-500/10',
  failed: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 dark:from-red-500/10 dark:to-rose-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 shadow-sm shadow-red-500/10',
  deprecated: 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 dark:from-yellow-500/10 dark:to-amber-500/10 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-500/20 shadow-sm shadow-yellow-500/5',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  training: 'Entrenando',
  completed: 'Completado',
  failed: 'Fallido',
  deprecated: 'Obsoleto',
}

interface TrainingStatusBadgeProps {
  status: string
  className?: string
}

function TrainingStatusBadge({ status, className }: TrainingStatusBadgeProps) {
  const isTraining = status === 'training'

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105',
      STATUS_STYLES[status] || STATUS_STYLES.pending,
      className,
    )}>
      {isTraining && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-[ping_1.5s_ease-in-out_infinite]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/30" />
        </span>
      )}
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export default TrainingStatusBadge
