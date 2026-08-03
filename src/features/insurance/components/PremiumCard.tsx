import { useState } from 'react'
import { Calendar, CheckCircle2, Trash2, Wallet } from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import PremiumStatusBadge from './PremiumStatusBadge'
import { PAYMENT_METHODS } from '@/types/insurance'
import type { InsurancePremium } from '@/types/insurance'

interface PremiumCardProps {
  premium: InsurancePremium
  onMarkPaid?: () => void
  onDelete?: () => void
  index?: number
}

export default function PremiumCard({ premium, onMarkPaid, onDelete, index = 0 }: PremiumCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isPaid = premium.status === 'paid'
  const isOverdue = premium.status === 'overdue'

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800/80 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300',
        'opacity-0 animate-fade-in',
        isHovered ? 'border-gray-300 dark:border-gray-600 shadow-md' : 'border-gray-100 dark:border-gray-700/50',
        isOverdue && 'border-red-200 dark:border-red-500/30',
      )}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                isPaid
                  ? 'bg-emerald-50 dark:bg-emerald-500/10'
                  : isOverdue
                    ? 'bg-red-50 dark:bg-red-500/10'
                    : 'bg-amber-50 dark:bg-amber-500/10',
              )}
            >
              <Calendar
                className={cn(
                  'h-5 w-5',
                  isPaid
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isOverdue
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-amber-600 dark:text-amber-400',
                )}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Vence: {formatDate(premium.due_date, 'long')}
              </p>
              {premium.paid_date && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Pagada: {formatDate(premium.paid_date, 'long')}
                </p>
              )}
            </div>
          </div>
          <PremiumStatusBadge status={premium.status} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {premium.payment_method && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Wallet className="h-3 w-3" />
                {PAYMENT_METHODS[premium.payment_method] || premium.payment_method}
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(premium.amount)}
          </p>
        </div>

        {!isPaid && premium.status !== 'cancelled' && (
          <div className="flex items-center gap-2 pt-1">
            {onMarkPaid && (
              <button
                type="button"
                onClick={onMarkPaid}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Marcar pagada
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
