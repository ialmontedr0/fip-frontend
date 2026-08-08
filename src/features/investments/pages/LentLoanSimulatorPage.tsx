import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Calculator, DollarSign, Percent, Calendar,
  TrendingUp, PiggyBank, Target, Sparkles, Plus, HandCoins, BarChart3,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { useSimulateLentLoan } from '../hooks/useLentLoans'
import { formatCurrency, formatISODate } from '@/lib/utils'
import type { SimulateLentLoanResponse } from '@/types/lentLoan'

function ResultCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className={cn(
      'bg-white dark:bg-gray-800/80 rounded-xl border p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
      'border-gray-100 dark:border-gray-700/50',
    )}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={cn('h-3.5 w-3.5', color || 'text-gray-400')} />
        <p className="text-[10px] text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className={cn('text-sm font-semibold', color || 'text-gray-900 dark:text-gray-100')}>{value}</p>
    </div>
  )
}

export default function LentLoanSimulatorPage() {
  const navigate = useNavigate()
  const [principalAmount, setPrincipalAmount] = useState('')
  const [annualInterestRate, setAnnualInterestRate] = useState('')
  const [termMonths, setTermMonths] = useState('')
  const [startDate, setStartDate] = useState('')
  const [result, setResult] = useState<SimulateLentLoanResponse | null>(null)

  const simulateMutation = useSimulateLentLoan()

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault()
    const principal = parseFloat(principalAmount)
    const rate = parseFloat(annualInterestRate)
    const term = parseInt(termMonths)

    if (!principal || principal <= 0) {
      toast.error('Ingrese un monto a prestar valido')
      return
    }
    if (!rate || rate <= 0) {
      toast.error('Ingrese una tasa de interes valida')
      return
    }
    if (!term || term <= 0) {
      toast.error('Ingrese un plazo valido')
      return
    }

    try {
      const res = await simulateMutation.mutateAsync({
        principal_amount: principal,
        annual_interest_rate: rate,
        term_months: term,
        start_date: startDate || null,
      })
      setResult(res)
    } catch (err: any) {
      toast.error(err?.message || 'Error al simular el prestamo')
    }
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-500/10" />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => navigate('/investments/lent-loans')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver a Prestamos Otorgados
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Simulador de Prestamos Otorgados
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Calcula tu cuota fija, intereses a recibir y rentabilidad
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative animate-fade-in">
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-blue-500" />
              Parametros
            </h3>

            <form onSubmit={handleSimulate} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Monto a Prestar *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={principalAmount}
                    onChange={(e) => setPrincipalAmount(e.target.value)}
                    required
                    placeholder="0.00"
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Tasa de Interes Anual *</label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={annualInterestRate}
                      onChange={(e) => setAnnualInterestRate(e.target.value)}
                      required
                      placeholder="0.00"
                      className="w-full px-4 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Plazo (meses) *</label>
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={termMonths}
                    onChange={(e) => setTermMonths(e.target.value)}
                    required
                    placeholder="12"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Fecha de Inicio</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={simulateMutation.isPending}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {simulateMutation.isPending ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <Calculator className="h-4 w-4" />
                )}
                Simular
              </button>
            </form>
          </div>
        </div>

        <div className="relative animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
          {result ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cuota Fija (a recibir)</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.monthly_payment)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <ResultCard icon={HandCoins} label="Total a Recibir" value={formatCurrency(result.total_to_receive)} color="text-emerald-600 dark:text-emerald-400" />
                  <ResultCard icon={TrendingUp} label="Ganancia (Interes)" value={formatCurrency(result.total_profit)} color="text-blue-600 dark:text-blue-400" />
                  <ResultCard icon={Percent} label="Rentabilidad" value={`${result.interest_to_principal_ratio.toFixed(1)}%`} color="text-purple-600 dark:text-purple-400" />
                  <ResultCard icon={PiggyBank} label="Interes Total" value={formatCurrency(result.total_interest)} color="text-amber-600 dark:text-amber-400" />
                  <ResultCard icon={Calendar} label="Plazo" value={`${result.term_months} meses`} />
                  <ResultCard icon={Target} label="Capital" value={formatCurrency(result.principal_amount)} />
                </div>
              </div>

              {result.schedule_preview && result.schedule_preview.length > 0 && (
                <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                      <BarChart3 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Vista Previa de Cuotas</h3>
                    <span className="text-xs text-gray-400 ml-auto">Primeros {result.schedule_preview.length} meses</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700/50">
                          <th className="text-left py-2 px-2 text-gray-500 dark:text-gray-400 font-medium">#</th>
                          <th className="text-right py-2 px-2 text-gray-500 dark:text-gray-400 font-medium">Fecha</th>
                          <th className="text-right py-2 px-2 text-gray-500 dark:text-gray-400 font-medium">Cuota</th>
                          <th className="text-right py-2 px-2 text-gray-500 dark:text-gray-400 font-medium">Capital</th>
                          <th className="text-right py-2 px-2 text-gray-500 dark:text-gray-400 font-medium">Interes</th>
                          <th className="text-right py-2 px-2 text-gray-500 dark:text-gray-400 font-medium">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.schedule_preview.map((entry) => (
                          <tr key={entry.entry_number} className="border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                            <td className="py-2 px-2 text-gray-900 dark:text-gray-100">{entry.entry_number}</td>
                            <td className="py-2 px-2 text-right text-gray-600 dark:text-gray-400">
                              {formatISODate(entry.due_date)}
                            </td>
                            <td className="py-2 px-2 text-right font-medium text-gray-900 dark:text-gray-100">{formatCurrency(entry.amount)}</td>
                            <td className="py-2 px-2 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(entry.principal_portion)}</td>
                            <td className="py-2 px-2 text-right text-amber-600 dark:text-amber-400">{formatCurrency(entry.interest_portion)}</td>
                            <td className="py-2 px-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(entry.balance_after)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams()
                  params.set('principal', principalAmount)
                  params.set('rate', annualInterestRate)
                  params.set('term', termMonths)
                  if (startDate) params.set('start', startDate)
                  navigate(`/investments/lent-loans/new?${params.toString()}`)
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Crear Prestamo Otorgado con estos datos
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
              <Calculator className="h-24 w-24 mb-6 text-gray-200 dark:text-gray-600" />
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <p className="text-base font-semibold text-gray-500 dark:text-gray-400">Completa los parametros</p>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-sm leading-relaxed">
                Ingresa el monto que prestas, la tasa de interes y el plazo para simular la cuota fija que recibiras. Los resultados apareceran aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
