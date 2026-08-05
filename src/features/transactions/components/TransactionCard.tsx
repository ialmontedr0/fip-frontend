import { useNavigate } from 'react-router-dom'
import { cn, formatCurrency, formatISODate } from '@/lib/utils'
import { TRANSACTION_TYPE_CONFIG } from '../constants'
import TransactionStatusBadge from './TransactionStatusBadge'
import type { TransactionListItem } from '@/types/transactions'

interface Props {
  transaction: TransactionListItem
  className?: string
  style?: React.CSSProperties
}

export default function TransactionCard({ transaction, className, style }: Props) {
  const navigate = useNavigate()
  const typeConfig = TRANSACTION_TYPE_CONFIG[transaction.transaction_type as keyof typeof TRANSACTION_TYPE_CONFIG]
  const amount = parseFloat(transaction.amount)
  const isNegative = transaction.transaction_type === 'expense' || transaction.transaction_type === 'adjustment'

  return (
    <div
      onClick={() => navigate(`/transactions/${transaction.id}`)}
      className={cn(
        'group relative cursor-pointer rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl',
        'border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-xl',
        'transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5',
        'overflow-hidden',
        className,
      )}
      style={style}
    >
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b transition-all duration-300 group-hover:w-1.5',
          typeConfig?.gradient || 'from-gray-400 to-gray-600',
        )}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {transaction.description}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {transaction.effective_date ? formatISODate(transaction.effective_date) : 'Sin fecha'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <TransactionStatusBadge status={transaction.status} size="sm" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {transaction.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {transaction.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
                {transaction.tags.length > 3 && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                    +{transaction.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <span
            className={cn(
              'text-base font-bold tabular-nums tracking-tight',
              isNegative ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
            )}
          >
            {isNegative ? '-' : '+'}{formatCurrency(amount, transaction.currency_code)}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/5 dark:ring-white/5 pointer-events-none" />
    </div>
  )
}
