import { cn, formatCurrency, formatISODate } from '@/lib/utils'
import { CheckCircle2, Loader2 } from 'lucide-react'
import type { AmortizationEntry } from '@/types/loans'

interface AmortizationTableProps {
  entries: AmortizationEntry[]
  loading?: boolean
}

export default function AmortizationTable({ entries, loading }: AmortizationTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!entries.length) {
    return (
      <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">
        No hay registros de amortizacion
      </div>
    )
  }

  const totals = entries.reduce(
    (acc, e) => ({
      payment_amount: acc.payment_amount + e.payment_amount,
      principal_portion: acc.principal_portion + e.principal_portion,
      interest_portion: acc.interest_portion + e.interest_portion,
    }),
    { payment_amount: 0, principal_portion: 0, interest_portion: 0 },
  )

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">#</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell">Fecha</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Pago</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden md:table-cell">Principal</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden md:table-cell">Interes</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Balance</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell">Pagado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {entries.map((entry) => (
            <tr
              key={entry.entry_number}
              className={cn(
                'transition-colors',
                entry.is_paid
                  ? 'bg-green-50/50 dark:bg-green-500/5 hover:bg-green-100/50 dark:hover:bg-green-500/10'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/30',
                entry.entry_number % 2 === 0 && !entry.is_paid && 'bg-gray-50/50 dark:bg-gray-800/20',
              )}
            >
              <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-mono text-xs">
                {entry.entry_number}
              </td>
              <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                {formatISODate(entry.due_date)}
              </td>
              <td className="px-4 py-2.5 text-right font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(entry.payment_amount)}
              </td>
              <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300 hidden md:table-cell">
                {formatCurrency(entry.principal_portion)}
              </td>
              <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300 hidden md:table-cell">
                {formatCurrency(entry.interest_portion)}
              </td>
              <td className="px-4 py-2.5 text-right font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(entry.balance_after)}
              </td>
              <td className="px-4 py-2.5 text-center hidden sm:table-cell">
                {entry.is_paid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 inline-block" />
                ) : (
                  <span className="text-gray-300 dark:text-gray-600">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50 dark:bg-gray-800/50 border-t-2 border-gray-200 dark:border-gray-700 font-semibold">
            <td colSpan={2} className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total
            </td>
            <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
              {formatCurrency(totals.payment_amount)}
            </td>
            <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 hidden md:table-cell">
              {formatCurrency(totals.principal_portion)}
            </td>
            <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 hidden md:table-cell">
              {formatCurrency(totals.interest_portion)}
            </td>
            <td colSpan={2} className="px-4 py-3" />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
