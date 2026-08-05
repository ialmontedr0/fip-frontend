import { CheckCircle2, Circle } from 'lucide-react'
import type { CreditPurchaseInstallment } from '@/types/creditPurchases'
import { formatCurrency, formatISODate } from '@/lib/utils'
import InstallmentStatusBadge from './InstallmentStatusBadge'
import { useMarkInstallmentPaid } from '../hooks/useCreditPurchases'

export default function InstallmentTable({
  installments,
  purchaseId,
  canPay,
}: {
  installments: CreditPurchaseInstallment[]
  purchaseId: string
  canPay: boolean
}) {
  const markPaid = useMarkInstallmentPaid()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-700/50">
            <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">#</th>
            <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Vence</th>
            <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Monto</th>
            <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Principal</th>
            <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Interes</th>
            <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Balance</th>
            <th className="text-center py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Estado</th>
            {canPay && <th className="text-center py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pagar</th>}
          </tr>
        </thead>
        <tbody>
          {installments.map((inst) => (
            <tr
              key={inst.id}
              className="border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
            >
              <td className="py-3 px-2 text-gray-900 dark:text-gray-100 font-medium">{inst.installment_number}</td>
              <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                {formatISODate(inst.due_date)}
              </td>
              <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-gray-100">{formatCurrency(inst.amount)}</td>
              <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(inst.principal_portion)}</td>
              <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(inst.interest_portion)}</td>
              <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(inst.balance_after)}</td>
              <td className="py-3 px-2 text-center">
                <InstallmentStatusBadge status={inst.status} />
              </td>
              {canPay && (
                <td className="py-3 px-2 text-center">
                  {inst.status === 'pending' ? (
                    <button
                      type="button"
                      onClick={() => markPaid.mutate({ purchaseId, installmentId: inst.id })}
                      className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                      title="Marcar como pagada"
                    >
                      <Circle className="h-4 w-4" />
                    </button>
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
