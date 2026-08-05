import { cn, formatCurrency, formatISODate } from '@/lib/utils'
import { ArrowUpDown } from 'lucide-react'
import { Skeleton } from '@/components/ui'
import PriorityBadge from './PriorityBadge'
import type { ExpenseResponse } from '@/types/expenses'

interface Props {
  expenses: ExpenseResponse[]
  onSort?: (field: string) => void
  sortBy?: string
  sortOrder?: string
  isLoading?: boolean
  className?: string
}

const COLUMNS = [
  { key: 'priority', label: '', sortable: false },
  { key: 'description', label: 'Descripcion', sortable: true },
  { key: 'category_id', label: 'Categoria', sortable: false },
  { key: 'amount', label: 'Monto', sortable: true, className: 'text-right' },
  { key: 'effective_date', label: 'Fecha', sortable: true },
  { key: 'source', label: 'Origen', sortable: true },
  { key: 'actions', label: '', sortable: false, className: 'w-8' },
]

export default function ExpenseTable({ expenses, onSort, sortBy, isLoading, className }: Props) {
  return (
    <div className={cn('rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden', className)}>
      <div className="grid grid-cols-[32px_1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            className={cn(
              'flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider',
              col.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300',
              col.className,
            )}
            onClick={() => col.sortable && onSort?.(col.key)}
          >
            {col.label}
            {col.sortable && (
              <ArrowUpDown className={cn(
                'h-3 w-3 transition-opacity',
                sortBy === col.key ? 'opacity-100 text-primary-500' : 'opacity-30',
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[32px_1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
              <div />
            </div>
          ))
        ) : expenses.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-400">No hay gastos</div>
        ) : (
          expenses.map((exp) => (
            <div
              key={exp.id}
              onClick={() => window.location.href = `/expenses/${exp.id}`}
              className="grid grid-cols-[32px_1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
            >
              <div className="flex items-center">
                <PriorityBadge priority={exp.priority} size="sm" />
              </div>
              <div className="flex items-center min-w-0">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {exp.description}
                </span>
              </div>
              <div className="flex items-center">
                {exp.category_id && (
                  <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                    Cat
                  </span>
                )}
              </div>
              <div className="flex items-center justify-end">
                <span className="text-sm font-bold tabular-nums text-red-600 dark:text-red-400">
                  -{formatCurrency(exp.amount, exp.currency_code)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {exp.effective_date ? formatISODate(exp.effective_date) : '—'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-400 dark:text-gray-500">{exp.source}</span>
              </div>
              <div />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
