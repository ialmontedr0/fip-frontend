import { useState } from 'react'
import { Calendar, AlertCircle } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import LoanTypeBadge from './LoanTypeBadge'
import LoanStatusBadge from './LoanStatusBadge'
import type { LoanListItem } from '@/types/loans'
import { LOAN_TYPE_COLORS } from '../constants'

interface LoanCardProps {
  loan: LoanListItem
  onClick?: () => void
  index?: number
}

export default function LoanCard({ loan, onClick, index = 0 }: LoanCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const color = LOAN_TYPE_COLORS[loan.loan_type] || '#6366f1'

  const isNextPaymentSoon = loan.next_payment_date
    ? (new Date(loan.next_payment_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 7
    : false

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800/80 rounded-2xl border shadow-sm overflow-hidden cursor-pointer',
        'hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/30 transition-all duration-500',
        'opacity-0 animate-fade-in',
        isHovered ? 'border-gray-300 dark:border-gray-600 -translate-y-0.5' : 'border-gray-100 dark:border-gray-700/50',
      )}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.() }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-500"
        style={{ backgroundColor: color, opacity: isHovered ? 1 : 0.6 }}
      />

      <div className="relative p-5 space-y-4">
        <div className="flex items-start justify-between">
          <LoanTypeBadge type={loan.loan_type} />
          <LoanStatusBadge status={loan.status} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
            {loan.name}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Principal</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(loan.principal_amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Balance</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(loan.current_balance)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Tasa</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {loan.annual_interest_rate}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Pago Mensual</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(loan.monthly_payment)}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Progreso</span>
            <span>{loan.progress_pct.toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(loan.progress_pct, 100)}%`,
                background: `linear-gradient(to right, ${color}, ${color}88)`,
              }}
            />
          </div>
        </div>

        {loan.next_payment_date && (
          <div
            className={cn(
              'flex items-center gap-2 text-xs rounded-lg px-3 py-2',
              isNextPaymentSoon
                ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400',
            )}
          >
            {isNextPaymentSoon ? (
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Calendar className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>
              Proximo pago:{' '}
              {new Date(loan.next_payment_date).toLocaleDateString('es-DO', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
