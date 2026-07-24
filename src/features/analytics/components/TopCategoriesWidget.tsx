import type { TopCategoriesResponse } from '@/types/analytics'
import { Skeleton } from '@/components/ui'
import { ErrorMessage } from '@/components/ui'
import FIPPieChart from '@/components/charts/PieChart'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  topCategories: TopCategoriesResponse | undefined
  loading: boolean
  error: boolean
}

const DEFAULT_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
]

function CategoriesSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <Skeleton className="mb-4 h-5 w-36" />
      <Skeleton variant="rectangular" className="mb-4 h-[240px] w-full rounded-xl" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton variant="circular" className="h-3 w-3" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TopCategoriesWidget({ topCategories, loading, error }: Props) {
  if (loading) return <CategoriesSkeleton />
  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <ErrorMessage message="No se pudieron cargar las categorias" />
      </div>
    )
  }

  const categories = topCategories?.top_categories ?? []
  const isEmpty = categories.length === 0

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex h-[300px] items-center justify-center text-sm text-gray-400">
          Sin categorias para mostrar
        </div>
      </div>
    )
  }

  const pieData = categories.map((c) => ({
    name: c.category,
    value: c.total,
    color: c.color ?? undefined,
  }))

  const totalSpent = categories.reduce((sum, c) => sum + c.total, 0)

  return (
    <div className={cn(
      'group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800',
      'bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700',
    )}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400" />

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Categorias Principales
        </h3>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          {topCategories?.transaction_type === 'expense' ? 'Gastos' : 'Ingresos'} · {categories.length} categorias
        </p>
      </div>

      <FIPPieChart data={pieData} innerRadius={55} outerRadius={95} height={250} />

      <div className="mt-4 space-y-1.5">
        {categories.map((cat, index) => {
          const color = cat.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]
          return (
            <div
              key={cat.category}
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200',
                'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                'group/item cursor-default',
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-900 transition-transform group-hover/item:scale-125"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{cat.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span className="w-14 text-right text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums">
                  {cat.percentage.toFixed(1)}%
                </span>
                <span className="w-24 text-right text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                  {formatCurrency(cat.total)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3 text-center dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Total: <span className="font-semibold text-gray-600 dark:text-gray-300">{formatCurrency(totalSpent)}</span>
        </p>
      </div>
    </div>
  )
}
