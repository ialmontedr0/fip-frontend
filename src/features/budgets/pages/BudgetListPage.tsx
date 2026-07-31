import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import BudgetNav from '../components/BudgetNav'
import BudgetCard from '../components/BudgetCard'
import BudgetFilters from '../components/BudgetFilters'
import BudgetEmptyState from '../components/BudgetEmptyState'
import { useBudgets } from '../hooks/useBudgets'
import { responsiveGrid } from '@/lib/utils'
import type { BudgetFilters as BudgetFiltersType } from '@/types/budgets'

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BudgetListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: BudgetFiltersType = useMemo(() => {
    const f: BudgetFiltersType = {}
    const bt = searchParams.get('budget_type')
    if (bt) f.budget_type = bt as BudgetFiltersType['budget_type']
    const p = searchParams.get('period')
    if (p) f.period = p as BudgetFiltersType['period']
    const ia = searchParams.get('is_active')
    if (ia === 'true') f.is_active = true
    else if (ia === 'false') f.is_active = false
    return f
  }, [searchParams])

  const { data, isLoading, isError, error, refetch } = useBudgets(filters)

  const handleFilterChange = (newFilters: BudgetFiltersType) => {
    const params = new URLSearchParams()
    if (newFilters.budget_type) params.set('budget_type', newFilters.budget_type)
    if (newFilters.period) params.set('period', newFilters.period)
    if (newFilters.is_active !== undefined) params.set('is_active', String(newFilters.is_active))
    setSearchParams(params, { replace: true })
  }

  const hasFilters = Object.keys(filters).length > 0

  return (
    <div>
      <BudgetNav />

      <div className="mb-6">
        <BudgetFilters filters={filters} onChange={handleFilterChange} />
      </div>

      {isLoading && <SkeletonGrid />}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 mb-4">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error al cargar presupuestos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'Ocurrio un error inesperado'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && data && data.budgets.length === 0 && (
        <BudgetEmptyState hasFilters={hasFilters} onClearFilters={() => handleFilterChange({})} />
      )}

      {!isLoading && !isError && data && data.budgets.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {data.total}
            {' '}
            presupuesto
            {data.total !== 1 ? 's' : ''}
          </p>
          <div className={responsiveGrid(data.budgets.length)}>
            {data.budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
