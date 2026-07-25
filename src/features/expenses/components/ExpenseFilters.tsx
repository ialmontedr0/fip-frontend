import { useState } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Input, Button } from '@/components/ui'
import type { Priority } from '@/types/expenses'
import { PRIORITY_OPTIONS } from '../constants'

interface Props {
  filters: {
    search?: string
    date_from?: string
    date_to?: string
    priority?: Priority
    source?: string
  }
  onChange: (filters: Record<string, string>) => void
  activeCount: number
}

export default function ExpenseFilters({ filters, onChange, activeCount }: Props) {
  const [open, setOpen] = useState(false)

  const update = (key: string, value: string) => {
    if (value === '' || value === undefined || value === null) {
      const rest = { ...filters }
      delete (rest as any)[key]
      onChange(rest as Record<string, string>)
    } else {
      onChange({ ...filters, [key]: value } as Record<string, string>)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={filters.search || ''}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Buscar gastos..."
            className="pl-9 rounded-xl h-9 text-sm"
          />
          {filters.search && (
            <button onClick={() => update('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <Button variant="outline" onClick={() => setOpen(!open)} className="rounded-xl h-9 relative">
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary-500 text-[10px] font-bold text-white flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {open && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Desde</label>
            <Input
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => update('date_from', e.target.value)}
              className="rounded-xl h-8 text-xs w-36"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Hasta</label>
            <Input
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => update('date_to', e.target.value)}
              className="rounded-xl h-8 text-xs w-36"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Prioridad</label>
            <select
              value={filters.priority || ''}
              onChange={(e) => update('priority', e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-1.5 text-xs h-8"
            >
              <option value="">Todas</option>
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Origen</label>
            <input
              value={filters.source || ''}
              onChange={(e) => update('source', e.target.value)}
              placeholder="Ej: manual"
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-1.5 text-xs h-8 w-28"
            />
          </div>
        </div>
      )}
    </div>
  )
}
