import { useCategoryStats } from '../hooks/useCategories'
import { Skeleton } from '@/components/ui'
import { cn } from '@/lib/utils'
import { CATEGORY_TYPE_CONFIG } from '../constants'
import { Tag, Lock, Users } from 'lucide-react'
import type { CategoryType } from '@/types/categories'

export default function CategoryStatsWidget() {
  const { data: stats, isLoading } = useCategoryStats()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100/80 bg-white/80 p-5 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/80">
        <Skeleton className="mb-4 h-5 w-40" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const typeEntries = Object.entries(stats.by_type) as [CategoryType, number][]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-5 backdrop-blur-xl shadow-sm dark:border-gray-800/80 dark:bg-gray-900/80">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-purple-400 to-primary-400" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Resumen de Categorias
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 p-3 dark:from-primary-500/10 dark:to-primary-500/5">
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-400 tabular-nums">{stats.total_categories}</p>
            <p className="text-xs font-medium text-primary-600/70 dark:text-primary-500/70">Total Categorias</p>
          </div>

          {typeEntries.map(([type, count]) => {
            const config = CATEGORY_TYPE_CONFIG[type]
            const Icon = config?.icon
            return (
              <div key={type} className={cn(
                'rounded-xl p-3',
                config?.bgColor ?? 'bg-gray-50',
              )}>
                <div className="flex items-center gap-2 mb-1">
                  {Icon && <Icon className={cn('h-4 w-4', config?.color)} />}
                  <span className={cn('text-xs font-semibold', config?.color)}>{config?.label}</span>
                </div>
                <p className={cn('text-lg font-bold tabular-nums', config?.color)}>{count}</p>
              </div>
            )
          })}

          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500">Sistema</span>
            </div>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{stats.system_categories}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500">Usuario</span>
            </div>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{stats.user_categories}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
