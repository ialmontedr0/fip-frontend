import type { DebtStrategy } from '@/types/ai'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Landmark, ArrowDown, Zap, TrendingDown, Percent } from 'lucide-react'

interface DebtStrategyCardProps {
  debtStrategy: DebtStrategy | undefined
  className?: string
}

function DebtStrategyCard({ debtStrategy, className }: DebtStrategyCardProps) {
  const hasLoans = debtStrategy && debtStrategy.loans && debtStrategy.loans.length > 0

  if (!debtStrategy) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm', className)}>
        <div className="flex items-center justify-center py-6 text-sm text-gray-400">
          <Landmark className="h-4 w-4 mr-2" />
          Sin deudas registradas
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80 dark:hover:border-gray-600/80',
      className,
    )}>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 shadow-md shadow-purple-500/20">
          <Landmark className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Estrategia de Deuda</span>
      </div>

      {!hasLoans ? (
        <div className="flex items-center justify-center py-4 text-sm text-gray-400">
          Sin deudas activas
        </div>
      ) : (
        <>
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10 px-3 py-1.5 mb-4 border border-purple-200/50 dark:border-purple-700/30">
            <Zap className="h-3.5 w-3.5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Estrategia recomendada: <span className="font-bold text-purple-600 dark:text-purple-400">{debtStrategy.strategy}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-500/5 dark:to-indigo-500/5 p-3.5 border border-blue-200/50 dark:border-blue-700/30 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md shadow-blue-500/20">
                  <ArrowDown className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Bola de nieve</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                {debtStrategy.snowball_order?.map((name, i) => (
                  <span key={name} className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/50 text-[9px] font-bold text-blue-600 dark:text-blue-400">{i + 1}</span>
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-500/5 dark:to-orange-500/5 p-3.5 border border-amber-200/50 dark:border-amber-700/30 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/20">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Avalancha</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                {debtStrategy.avalanche_order?.map((name, i) => (
                  <span key={name} className="flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800/50 text-[9px] font-bold text-amber-600 dark:text-amber-400">{i + 1}</span>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {debtStrategy.estimated_savings_avalanche_vs_snowball > 0 && (
            <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 px-4 py-3 mb-4 border border-emerald-200/50 dark:border-emerald-700/30">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-emerald-500" />
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Ahorro con avalancha vs bola de nieve: <span className="font-bold">{formatCurrency(debtStrategy.estimated_savings_avalanche_vs_snowball)}</span>
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="h-3 w-3" />
              Prestamos
            </p>
            {debtStrategy.loans.map((loan) => (
              <div key={loan.loan_id} className="flex items-center justify-between rounded-lg bg-gray-50/70 dark:bg-gray-800/40 px-3.5 py-2.5 border border-gray-100/50 dark:border-gray-700/30 transition-all duration-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/60">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{loan.name}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(loan.balance)}</span>
                  <span className="inline-flex items-center gap-0.5 font-mono text-gray-500 dark:text-gray-400">
                    <Percent className="h-2.5 w-2.5" />
                    {loan.interest_rate.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default DebtStrategyCard
