import { Banknote, Wallet, CalendarClock, CircleDollarSign, Calendar } from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { LoanSummaryResponse } from '@/types/loans'

interface LoanSummaryCardsProps {
  summary?: LoanSummaryResponse
  loading?: boolean
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse">
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

export default function LoanSummaryCards({ summary, loading }: LoanSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!summary) return null

  const cards = [
    {
      label: 'Total Prestamos',
      value: summary.total_loans,
      icon: Banknote,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'Balance Total',
      value: formatCurrency(summary.total_balance),
      icon: Wallet,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10',
    },
    {
      label: 'Pago Mensual',
      value: formatCurrency(summary.total_monthly_payment),
      icon: CalendarClock,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Total Pagado',
      value: formatCurrency(summary.total_paid),
      icon: CircleDollarSign,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] dark:opacity-[0.06] pointer-events-none bg-current" />
              <div className="relative">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl mb-3', card.bgColor)}>
                  <Icon className={cn('h-5 w-5', card.color)} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {card.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-violet-500" />
          Proximos pagos (30 dias)
        </h4>
        {summary.upcoming_payments_30d.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {summary.upcoming_payments_30d.map((payment) => (
              <div
                key={payment.loan_id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {payment.loan_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {payment.next_payment_date
                      ? formatDate(payment.next_payment_date, 'long')
                      : 'Fecha no disponible'}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(payment.monthly_payment)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                        Saldo: {formatCurrency(payment.current_balance)}
                      </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
            No hay pagos proximos
          </p>
        )}
      </div>
    </div>
  )
}
