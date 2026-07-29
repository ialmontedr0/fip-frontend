import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calculator, ArrowLeft } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useSimulateCreditPurchase } from '../hooks/useCreditPurchases'
import { INSTALLMENT_FREQUENCIES } from '@/types/creditPurchases'
import { FREQUENCY_LABELS } from '../constants'

export default function CreditPurchaseSimulatorPage() {
  const navigate = useNavigate()
  const simulate = useSimulateCreditPurchase()

  const [totalPrice, setTotalPrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [installmentCount, setInstallmentCount] = useState('12')
  const [frequency, setFrequency] = useState('monthly')

  const handleSimulate = () => {
    simulate.mutate({
      total_price: parseFloat(totalPrice) || 0,
      down_payment: parseFloat(downPayment) || 0,
      annual_interest_rate: parseFloat(interestRate) || 0,
      installment_count: parseInt(installmentCount) || 1,
      installment_frequency: frequency as any,
    })
  }

  const data = simulate.data
  const totalCost = data ? data.total_paid + (parseFloat(downPayment) || 0) : 0

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl dark:bg-teal-500/10" />
      </div>

      <div className="relative flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/credit-purchases')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
          <Calculator className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Simulador de Compras a Credito</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Calcula cuotas y costos totales</p>
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Precio Total (RD$)</label>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Pago Inicial (RD$)</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Tasa de Interes Anual (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Cantidad de Cuotas</label>
            <input
              type="number"
              value={installmentCount}
              onChange={(e) => setInstallmentCount(e.target.value)}
              min={1}
              max={120}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Frecuencia</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {Object.entries(INSTALLMENT_FREQUENCIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleSimulate}
            disabled={simulate.isPending}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all"
          >
            <Calculator className="h-4 w-4" />
            {simulate.isPending ? 'Calculando...' : 'Simular'}
          </button>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {data ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Monto Financiado</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(data.financed_amount)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cuota {FREQUENCY_LABELS[frequency] || frequency}</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(data.installment_amount)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total de Interes</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatCurrency(data.total_interest)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total a Pagar (cuotas)</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(data.total_paid)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Costo Total</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalCost)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cant. Cuotas</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{data.installment_count}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Calendario de Cuotas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">#</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Vence</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Monto</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Principal</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Interes</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.schedule.map((inst) => (
                        <tr key={inst.installment_number} className="border-b border-gray-50 dark:border-gray-700/30">
                          <td className="py-2 px-2 text-gray-900 dark:text-gray-100">{inst.installment_number}</td>
                          <td className="py-2 px-2 text-gray-600 dark:text-gray-400">
                            {new Date(inst.due_date).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-2 px-2 text-right font-medium text-gray-900 dark:text-gray-100">{formatCurrency(inst.amount)}</td>
                          <td className="py-2 px-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(inst.principal_portion)}</td>
                          <td className="py-2 px-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(inst.interest_portion)}</td>
                          <td className="py-2 px-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(inst.balance_after)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <Calculator className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Simula tu Compra a Credito</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Ingresa los datos del lado izquierdo y presiona &quot;Simular&quot; para ver el calendario de pagos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
