import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Search, Filter, X, Calendar, DollarSign, Type, Circle,
} from 'lucide-react'
import { Button } from '@/components/ui'
import type { IncomesFilters as TFilter } from '@/types/incomes'
import { INCOME_TYPE_CONFIG, INCOME_STATUS_CONFIG, STABILITY_CONFIG } from '../constants'
import { useSources } from '../hooks/useSources'

interface Props {
  filters: TFilter
  onChange: (filters: TFilter) => void
  onClear: () => void
  className?: string
}

export default function IncomeFilters({ filters, onChange, onClear, className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: sourcesData } = useSources()

  const activeCount = Object.entries(filters).filter(([k, v]) =>
    k !== 'page' && k !== 'page_size' && k !== 'sort_by' && k !== 'sort_order' && v !== undefined && v !== '' && v !== null,
  ).length

  const update = (key: keyof TFilter, value: string | number | undefined) => {
    onChange({ ...filters, [key]: value || undefined, page: undefined })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Buscar ingresos..."
            className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 pl-10 pr-4 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => update('search', undefined)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          variant={activeCount > 0 ? 'default' : 'outline'}
          onClick={() => setIsOpen(!isOpen)}
          className={cn('rounded-xl relative', activeCount > 0 && 'shadow-lg shadow-primary-500/20')}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-white/20 text-[11px] font-bold px-1">
              {activeCount}
            </span>
          )}
        </Button>

        {activeCount > 0 && (
          <Button variant="ghost" onClick={onClear} className="rounded-xl text-sm">
            <X className="h-4 w-4 mr-1.5" />
            Limpiar
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-lg animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Type className="h-3.5 w-3.5" />
                Tipo
              </label>
              <select
                value={filters.income_type || ''}
                onChange={(e) => update('income_type', e.target.value || undefined)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Todos</option>
                {Object.entries(INCOME_TYPE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Circle className="h-3.5 w-3.5" />
                Estado
              </label>
              <select
                value={filters.income_status || ''}
                onChange={(e) => update('income_status', e.target.value || undefined)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Todos</option>
                {Object.entries(INCOME_STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Circle className="h-3.5 w-3.5" />
                Estabilidad
              </label>
              <select
                value={filters.stability || ''}
                onChange={(e) => update('stability', e.target.value || undefined)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Todas</option>
                {Object.entries(STABILITY_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Circle className="h-3.5 w-3.5" />
                Fuente
              </label>
              <select
                value={filters.income_source_id || ''}
                onChange={(e) => update('income_source_id', e.target.value || undefined)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Todas</option>
                {sourcesData?.sources.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                Desde
              </label>
              <input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => update('date_from', e.target.value || undefined)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                Hasta
              </label>
              <input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => update('date_to', e.target.value || undefined)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <DollarSign className="h-3.5 w-3.5" />
                Monto Min
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={filters.min_amount ?? ''}
                onChange={(e) => update('min_amount', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <DollarSign className="h-3.5 w-3.5" />
                Monto Max
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={filters.max_amount ?? ''}
                onChange={(e) => update('max_amount', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                Ordenar por
              </label>
              <div className="flex gap-2">
                <select
                  value={filters.sort_by || 'effective_date'}
                  onChange={(e) => update('sort_by', e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="effective_date">Fecha</option>
                  <option value="amount">Monto</option>
                  <option value="description">Descripcion</option>
                  <option value="created_at">Creado</option>
                </select>
                <button
                  onClick={() => update('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc')}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  title={filters.sort_order === 'asc' ? 'Ascendente' : 'Descendente'}
                >
                  {filters.sort_order === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
