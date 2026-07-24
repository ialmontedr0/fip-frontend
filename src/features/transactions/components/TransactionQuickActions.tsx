import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  MoreHorizontal, Copy, Repeat, ExternalLink, Eye,
} from 'lucide-react'
import type { TransactionResponse } from '@/types/transactions'

interface Props {
  transaction: TransactionResponse
  className?: string
}

export default function TransactionQuickActions({ transaction, className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const actions = [
    {
      label: 'Ver detalle',
      icon: Eye,
      onClick: () => navigate(`/transactions/${transaction.id}`),
    },
    {
      label: 'Duplicar',
      icon: Copy,
      onClick: () => navigate('/transactions/new', {
        state: {
          prefill: {
            ...transaction,
            effective_date: new Date().toISOString().slice(0, 10),
          },
        },
      }),
    },
    {
      label: 'Convertir a recurrente',
      icon: Repeat,
      onClick: () => navigate('/transactions/recurring/new', {
        state: {
          prefill: {
            account_id: transaction.account_id,
            transaction_type: transaction.transaction_type,
            amount: parseFloat(transaction.amount),
            currency_code: transaction.currency_code,
            description: transaction.description,
            category_id: transaction.category_id,
            subcategory_id: transaction.subcategory_id,
          },
        },
      }),
    },
    ...(transaction.account_id ? [{
      label: 'Ver cuenta',
      icon: ExternalLink,
      onClick: () => navigate(`/accounts/${transaction.account_id}`),
    }] : []),
  ]

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden animate-fade-in">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => { action.onClick(); setIsOpen(false) }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <action.icon className="h-4 w-4 text-gray-400" />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
