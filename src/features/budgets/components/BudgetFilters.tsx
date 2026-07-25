import { RotateCcw } from 'lucide-react'
import { BUDGET_TYPE_OPTIONS, PERIOD_OPTIONS } from '../constants'
import type { BudgetFilters as BudgetFiltersType } from '@/types/budgets'

interface BudgetFiltersProps {
  filters: BudgetFiltersType
  onChange: (filters: BudgetFiltersType) => void
}

export default function BudgetFilters({ filters, onChange }: BudgetFiltersProps) {
  const hasFilters = filters.budget_type || filters.is_active !== undefined || filters.period

  const update = (key: keyof BudgetFiltersType, value: unknown) => {
    const next = { ...filters, [key]: value || undefined }
    onChange(next)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filters.budget_type || ''}
        onChange={(e) => update('budget_type', e.target.value || undefined)}
        className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors"
        aria-label="Filtrar por tipo"
      >
        <option value="">Todos los tipos</option>
        {BUDGET_TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={filters.period || ''}
        onChange={(e) => update('period', e.target.value || undefined)}
        className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors"
        aria-label="Filtrar por periodo"
      >
        <option value="">Todos los periodos</option>
        {PERIOD_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={filters.is_active === undefined ? '' : filters.is_active ? 'active' : 'inactive'}
        onChange={(e) => {
          if (e.target.value === 'active') update('is_active', true)
          else if (e.target.value === 'inactive') update('is_active', false)
          else update('is_active', undefined)
        }}
        className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors"
        aria-label="Filtrar por estado"
      >
        <option value="">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Limpiar
        </button>
      )}
    </div>
  )
}
