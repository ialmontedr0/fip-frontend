import { useNavigate } from 'react-router-dom'
import { cn, formatCurrency } from '@/lib/utils'
import { TRANSACTION_TYPE_CONFIG } from '../constants'
import TransactionStatusBadge from './TransactionStatusBadge'
import type { TransactionListItem } from '@/types/transactions'

interface Props {
  transaction: TransactionListItem
  className?: string
}

export default function TransactionRow({ transaction, className }: Props) {
  const navigate = useNavigate()
  const typeConfig = TRANSACTION_TYPE_CONFIG[transaction.transaction_type as keyof typeof TRANSACTION_TYPE_CONFIG]
  const amount = parseFloat(transaction.amount)
  const isNegative = transaction.transaction_type === 'expense' || transaction.transaction_type === 'adjustment'

  return (
    <div
      onClick={() => navigate(`/transactions/${transaction.id}`)}
      className={cn(
        'grid grid-cols-[40px_1fr_auto_auto_auto_auto_auto] gap-4 items-center',
        'px-4 py-3 rounded-xl cursor-pointer transition-all duration-200',
        'hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-sm',
        'group',
        className,
      )}
    >
      <div className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full',
        typeConfig?.bgColor || 'bg-gray-100 dark:bg-gray-700',
      )}>
        {typeConfig && <typeConfig.icon className={cn('h-4 w-4', typeConfig.color)} />}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {transaction.description}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {transaction.effective_date
            ? new Date(transaction.effective_date).toLocaleDateString('es-DO', { day: '2-digit', month: 'short' })
            : '—'}
        </p>
      </div>

      <div className="flex gap-1 flex-wrap max-w-[160px]">
        {transaction.tags.length > 0 && (
          <>
            {transaction.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {tag}
              </span>
            ))}
            {transaction.tags.length > 2 && (
              <span className="text-[10px] text-gray-400">+{transaction.tags.length - 2}</span>
            )}
          </>
        )}
      </div>

      <TransactionStatusBadge status={transaction.status} size="sm" />

      <span className="text-xs text-gray-400 dark:text-gray-500">
        {transaction.source}
      </span>

      <span
        className={cn(
          'text-sm font-bold tabular-nums tracking-tight text-right',
          isNegative ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
        )}
      >
        {isNegative ? '−' : '+'}{formatCurrency(amount, transaction.currency_code)}
      </span>

      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/transactions/${transaction.id}`) }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
