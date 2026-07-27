import { CalendarDays, Filter, X } from 'lucide-react'
import type { ExportTransactionsFilters } from '@/types/exports'

interface ExportFilterPanelProps {
  filters: ExportTransactionsFilters
  onChange: (filters: ExportTransactionsFilters) => void
}

export default function ExportFilterPanel({ filters, onChange }: ExportFilterPanelProps) {
  const update = (key: keyof ExportTransactionsFilters, value: string) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '')

  return (
    <div className="mb-6 p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100/80 dark:border-gray-700/50 animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          Filtros de exportaci\u00f3n
        </div>
        {hasFilters && (
          <button
            onClick={() => onChange({})}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:text-red-600 transition-all"
          >
            <X className="h-3 w-3" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            Fecha desde
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => update('date_from', e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 pl-8 pr-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            Fecha hasta
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => update('date_to', e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 pl-8 pr-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            Tipo
          </label>
          <select
            value={filters.transaction_type || ''}
            onChange={(e) => update('transaction_type', e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            <option value="">Todos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
            <option value="transfer">Transferencias</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            Categor\u00eda
          </label>
          <input
            type="text"
            value={filters.category || ''}
            onChange={(e) => update('category', e.target.value)}
            placeholder="Nombre de categor\u00eda"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  )
}
