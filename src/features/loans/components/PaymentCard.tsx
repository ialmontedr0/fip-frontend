import { formatCurrency } from '@/lib/utils'
import { LOAN_PAYMENT_METHODS, LOAN_PAYMENT_STATUSES, type LoanPaymentStatus, type LoanPaymentMethod } from '@/types/loans'
import { LOAN_STATUS_COLORS } from '../constants'
import type { PaymentResponse } from '@/types/loans'

interface PaymentCardProps {
  payment: PaymentResponse
  index?: number
}

export default function PaymentCard({ payment }: PaymentCardProps) {
  const statusColor = LOAN_STATUS_COLORS[payment.status] || '#6b7280'
  const methodLabel = LOAN_PAYMENT_METHODS[payment.payment_method as LoanPaymentMethod] || payment.payment_method
  const statusLabel = LOAN_PAYMENT_STATUSES[payment.status as LoanPaymentStatus] || payment.status

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 sm:min-w-[160px]">
          <div className="text-center min-w-[60px]">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {new Date(payment.payment_date).getDate()}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium">
              {new Date(payment.payment_date).toLocaleDateString('es-DO', { month: 'short', year: '2-digit' })}
            </p>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-gray-100 dark:bg-gray-700 font-medium">
              {methodLabel}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(payment.amount)}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Principal: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(payment.principal_portion)}</span></span>
            <span>Interes: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(payment.interest_portion)}</span></span>
            {payment.penalty_portion > 0 && (
              <span>Penalizacion: <span className="font-medium text-red-500">{formatCurrency(payment.penalty_portion)}</span></span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
              backgroundColor: `${statusColor}26`,
              color: statusColor,
            }}
          >
            {statusLabel}
          </span>
          {payment.is_extra_payment && (
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Extra
            </span>
          )}
        </div>
      </div>

      {payment.reference_number && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Ref: <span className="font-mono text-gray-600 dark:text-gray-400">{payment.reference_number}</span>
          </p>
        </div>
      )}
    </div>
  )
}
