import { PiggyBank, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BudgetEmptyStateProps {
  hasFilters?: boolean
  onClearFilters?: () => void
}

export default function BudgetEmptyState({ hasFilters, onClearFilters }: BudgetEmptyStateProps) {
  const navigate = useNavigate()

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-500/20 dark:to-amber-600/20">
            <PiggyBank className="h-10 w-10 text-amber-500 dark:text-amber-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Sin resultados
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
          No hay presupuestos que coincidan con los filtros seleccionados.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Limpiar filtros
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-500/20 dark:to-purple-600/20">
          <PiggyBank className="h-12 w-12 text-violet-500 dark:text-violet-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No tienes presupuestos aun
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
        Crea tu primer presupuesto para empezar a controlar tus gastos y alcanzar tus metas financieras.
      </p>
      <button
        type="button"
        onClick={() => navigate('/budgets/new')}
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/30 active:scale-[0.98]"
      >
        <PiggyBank className="h-5 w-5" />
        Crear primer presupuesto
      </button>
    </div>
  )
}
