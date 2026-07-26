import { useState } from 'react'
import { useSimulateSavings } from '../hooks/useAI'
import type { SavingsSimulateResponse } from '@/types/ai'
import ProjectionChart from './ProjectionChart'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Calculator, Loader2, PiggyBank, TrendingUp, DollarSign } from 'lucide-react'

function SavingsSimulatorPanel() {
  const [monthlyAmount, setMonthlyAmount] = useState(5000)
  const [months, setMonths] = useState(12)
  const [annualReturn, setAnnualReturn] = useState(0)
  const mutation = useSimulateSavings()
  const [result, setResult] = useState<SavingsSimulateResponse | null>(null)

  const handleSimulate = () => {
    mutation.mutate(
      { monthly_amount: monthlyAmount, months, annual_return_pct: annualReturn },
      { onSuccess: (data) => setResult(data) },
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Simulador</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Parametros de Ahorro</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-4 shadow-sm">
            <label className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
              <span>Ahorro mensual</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg">${monthlyAmount.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="100"
              max="100000"
              step="100"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
              <span>$100</span>
              <span>$100,000</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-4 shadow-sm">
            <label className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
              <span>Duracion</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg">{months} meses</span>
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
              <span>1</span>
              <span>60</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-4 shadow-sm">
            <label className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
              <span>Retorno anual</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-lg">{annualReturn}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
              <span>0%</span>
              <span>30%</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSimulate}
          disabled={mutation.isPending}
          className={cn(
            'w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300',
            'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg',
            'hover:from-emerald-600 hover:to-green-600 hover:shadow-xl hover:-translate-y-0.5',
            'active:scale-[0.98]',
            mutation.isPending && 'opacity-60 cursor-wait',
          )}
        >
          {mutation.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Simulando...</>
          ) : (
            <><Calculator className="h-4 w-4" /> Simular</>
          )}
        </button>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mb-1.5">
                <PiggyBank className="h-3.5 w-3.5" />
                Saldo Final
              </div>
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400">{formatCurrency(result.final_balance)}</p>
            </div>
            <div className="rounded-2xl border border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 mb-1.5">
                <DollarSign className="h-3.5 w-3.5" />
                Total Aportado
              </div>
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">{formatCurrency(result.total_contributed)}</p>
            </div>
            <div className="rounded-2xl border border-amber-200/50 dark:border-amber-700/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mb-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                Interes Generado
              </div>
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">{formatCurrency(result.total_interest)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm">
            <ProjectionChart projections={result.projections} />
          </div>
        </>
      )}
    </div>
  )
}

export default SavingsSimulatorPanel
