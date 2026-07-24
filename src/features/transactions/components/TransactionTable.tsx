import { cn } from '@/lib/utils'
import TransactionRow from './TransactionRow'
import { ArrowUpDown } from 'lucide-react'
import type { TransactionListItem } from '@/types/transactions'
import { Skeleton } from '@/components/ui'

interface Props {
  transactions: TransactionListItem[]
  onSort?: (field: string) => void
  sortBy?: string
  sortOrder?: string
  isLoading?: boolean
  className?: string
}

const COLUMNS = [
  { key: 'type', label: 'Tipo', sortable: false },
  { key: 'description', label: 'Descripcion', sortable: true },
  { key: 'tags', label: 'Tags', sortable: false },
  { key: 'status', label: 'Estado', sortable: true },
  { key: 'source', label: 'Origen', sortable: true },
  { key: 'amount', label: 'Monto', sortable: true, className: 'text-right' },
  { key: 'actions', label: '', sortable: false, className: 'w-8' },
]

export default function TransactionTable({   transactions, onSort, sortBy, isLoading, className }: Props) {
  return (
    <div className={cn('rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden', className)}>
      <div className="grid grid-cols-[40px_1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            className={cn(
              'flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider',
              col.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300',
              col.className,
            )}
            onClick={() => col.sortable && onSort?.(col.key === 'type' ? 'transaction_type' : col.key)}
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
            <div key={i} className="grid grid-cols-[40px_1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24" />
              <div />
            </div>
          ))
        ) : transactions.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-400">
            No hay transacciones
          </div>
        ) : (
          transactions.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))
        )}
      </div>
    </div>
  )
}
