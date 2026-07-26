import { cn, formatCurrency } from '@/lib/utils'
import { PAYMENT_STATUS_CONFIG } from '../constants'
import { FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import type { CardBillResponse } from '@/types/expenses'

interface Props {
  bill: CardBillResponse
  onPay: (bill: CardBillResponse) => void
  currencyCode?: string
  className?: string
}

export default function CardBillCard({ bill, onPay, currencyCode, className }: Props) {
  const statusConfig = PAYMENT_STATUS_CONFIG[bill.payment_status] || PAYMENT_STATUS_CONFIG.pending
  const isOverdue = bill.payment_status === 'pending' && bill.due_date && new Date(bill.due_date) < new Date()

  return (
    <div className={cn(
      'rounded-2xl backdrop-blur-xl border shadow-sm p-4 transition-all duration-300',
      isOverdue
        ? 'bg-red-50/80 dark:bg-red-900/20 border-red-200/50 dark:border-red-700/30'
        : 'bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50',
      className,
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl',
            isOverdue ? 'bg-red-100 dark:bg-red-500/10' : 'bg-gray-100 dark:bg-gray-700/50',
          )}>
            <FileText className={cn('h-4 w-4', isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500')} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {bill.statement_date
                ? `Estado de Cuenta - ${new Date(bill.statement_date).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })}`
                : 'Estado de Cuenta'}
            </p>
            {bill.due_date && (
              <p className="text-[11px] text-gray-400">
                Vence: {new Date(bill.due_date).toLocaleDateString('es-DO')}
                {isOverdue && <span className="text-red-500 font-medium ml-1">(Vencida)</span>}
              </p>
            )}
          </div>
        </div>
        <div className={cn(
          'rounded-full px-2 py-0.5 text-[10px] font-semibold',
          statusConfig.bgColor,
          statusConfig.color,
        )}>
          {statusConfig.label}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total a Pagar</span>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(bill.total_amount, currencyCode)}</p>
        </div>
        {bill.minimum_payment && (
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Pago Minimo</span>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(bill.minimum_payment, currencyCode)}</p>
          </div>
        )}
      </div>

      {bill.payment_status === 'pending' && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700/30">
          <Button onClick={() => onPay(bill)} variant={isOverdue ? 'default' : 'outline'} size="sm" className="rounded-xl w-full gap-1.5">
            {isOverdue ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            {isOverdue ? 'Pagar Ahora' : 'Pagar'}
          </Button>
        </div>
      )}
    </div>
  )
}
