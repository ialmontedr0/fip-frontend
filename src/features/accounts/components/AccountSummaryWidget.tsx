import { useAccountSummary } from '../hooks/useAccounts'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui'
import { Wallet } from 'lucide-react'

export default function AccountSummaryWidget() {
  const { data: summary, isLoading } = useAccountSummary()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100/80 bg-white/80 p-5 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/80">
        <Skeleton className="mb-4 h-5 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!summary || summary.total_accounts === 0) return null

  const entries = Object.entries(summary.by_currency)
  const totalBalance = entries.reduce((sum, [, curr]) => sum + parseFloat(curr.total_balance), 0)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-5 backdrop-blur-xl shadow-sm dark:border-gray-800/80 dark:bg-gray-900/80">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-purple-400 to-primary-400" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary-500" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Resumen por Moneda
            </h3>
          </div>
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
            {summary.total_accounts} {summary.total_accounts === 1 ? 'cuenta' : 'cuentas'}
          </span>
        </div>

        <div className="space-y-2">
          {entries.map(([currency, data]) => {
            const pct = totalBalance > 0 ? (parseFloat(data.total_balance) / totalBalance) * 100 : 0
            return (
              <div
                key={currency}
                className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 p-3 transition-all hover:from-gray-100 hover:to-gray-200/50 dark:from-gray-800/50 dark:to-gray-800/30 dark:hover:from-gray-800 dark:hover:to-gray-700/50"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{currency}</span>
                    <span className="rounded-full bg-gray-200/50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
                      {data.account_count} {data.account_count === 1 ? 'cta' : 'ctas'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                    {formatCurrency(parseFloat(data.total_balance), currency)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/70 dark:bg-gray-700/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
