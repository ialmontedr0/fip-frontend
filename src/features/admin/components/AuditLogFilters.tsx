import { Search, Filter, RotateCcw } from 'lucide-react'
import type { AuditLogFilters as AuditLogFiltersType } from '@/types/admin'

interface AuditLogFiltersProps {
  filters: AuditLogFiltersType
  onChange: (filters: AuditLogFiltersType) => void
  onReset: () => void
}

const ACTION_OPTIONS = [
  'login', 'logout', 'create', 'update', 'delete', 'export', 'import',
]
const RESOURCE_OPTIONS = [
  'user', 'role', 'transaction', 'budget', 'goal', 'account', 'wallet', 'system',
]
const STATUS_OPTIONS = ['success', 'failure', 'pending']

export default function AuditLogFilters({ filters, onChange, onReset }: AuditLogFiltersProps) {
  const hasFilters = filters.user_id || filters.action || filters.resource || filters.status

  const update = (key: keyof AuditLogFiltersType, value: string) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Filtros</span>
        </div>
        {hasFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700"
          >
            <RotateCcw className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={filters.user_id || ''}
            onChange={(e) => update('user_id', e.target.value)}
            placeholder="User ID..."
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        </div>
        <select
          value={filters.action || ''}
          onChange={(e) => update('action', e.target.value)}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
        >
          <option value="">Todas las acciones</option>
          {ACTION_OPTIONS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          value={filters.resource || ''}
          onChange={(e) => update('resource', e.target.value)}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
        >
          <option value="">Todos los recursos</option>
          {RESOURCE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={filters.status || ''}
          onChange={(e) => update('status', e.target.value)}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
