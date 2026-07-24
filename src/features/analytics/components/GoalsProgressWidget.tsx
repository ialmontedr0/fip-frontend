import { Target, CheckCircle2, TrendingUp } from 'lucide-react'
import type { GoalProgress } from '@/types/analytics'
import { Skeleton } from '@/components/ui'
import { ErrorMessage, EmptyState } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  goals: GoalProgress[] | undefined
  loading: boolean
  error: boolean
}

function GoalsSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <Skeleton className="mb-4 h-5 w-32" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

function getProgressColor(pct: number): string {
  if (pct >= 100) return 'from-green-400 to-emerald-500'
  if (pct >= 75) return 'from-green-400 to-emerald-400'
  if (pct >= 50) return 'from-amber-400 to-orange-500'
  if (pct >= 25) return 'from-orange-400 to-red-500'
  return 'from-red-400 to-rose-500'
}

function getProgressGlow(pct: number): string {
  if (pct >= 75) return 'shadow-[0_0_12px_rgba(34,197,94,0.3)]'
  if (pct >= 50) return 'shadow-[0_0_12px_rgba(245,158,11,0.3)]'
  return ''
}

export default function GoalsProgressWidget({ goals, loading, error }: Props) {
  if (loading) return <GoalsSkeleton />
  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <ErrorMessage message="No se pudieron cargar las metas" />
      </div>
    )
  }
  if (!goals || goals.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metas de Ahorro</h3>
        </div>
        <EmptyState
          icon={<Target className="h-6 w-6 text-gray-400" />}
          title="Sin metas activas"
          description="No tienes metas de ahorro activas. Crea una para empezar."
        />
      </div>
    )
  }

  const completed = goals.filter((g) => g.progress_pct >= 100).length

  return (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800',
      'bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700',
    )}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400" />

      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Metas de Ahorro
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-green-50 px-2 py-0.5 font-medium text-green-600 dark:bg-green-500/10 dark:text-green-400">
            {completed}/{goals.length} completadas
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {goals.map((goal, index) => {
          const progress = Math.min(goal.progress_pct, 100)
          const isComplete = goal.progress_pct >= 100
          const color = getProgressColor(progress)
          const glow = getProgressGlow(progress)

          return (
            <div key={index}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <CheckCircle2 className="h-[18px] w-[18px] text-green-500" />
                  ) : (
                    <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-2 w-2 rounded-full transition-all duration-700"
                        style={{
                          background: `linear-gradient(135deg, ${progress >= 50 ? '#22c55e' : '#f59e0b'}, ${progress >= 50 ? '#16a34a' : '#ea580c'})`,
                          width: `${Math.max(progress, 10)}%`,
                          minWidth: 4,
                          maxWidth: 18,
                        }}
                      />
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{goal.name}</span>
                </div>
                <div className="text-right">
                  <span className={cn(
                    'text-sm font-bold tabular-nums',
                    isComplete ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100',
                  )}>
                    {formatCurrency(goal.current)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {' / '}{formatCurrency(goal.target)}
                  </span>
                </div>
              </div>

              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={cn(
                    'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
                    color,
                    glow,
                  )}
                  style={{ width: `${progress}%` }}
                />
                {progress > 0 && progress < 100 && (
                  <div
                    className="absolute inset-y-0 w-4 rounded-full bg-white/40 blur-sm"
                    style={{
                      left: `calc(${progress}% - 8px)`,
                      animation: 'shimmer 2s infinite',
                    }}
                  />
                )}
              </div>

              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-400 dark:text-gray-500">
                  {progress.toFixed(0)}% completado
                </span>
                {goal.target_date && (
                  <span className="text-gray-400 dark:text-gray-500">
                    Meta: {formatDate(goal.target_date)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
