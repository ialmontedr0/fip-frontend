import type { EarlyPayoffResponse } from '@/types/loans'
import { formatCurrency } from '@/lib/utils'

interface EarlyPayoffResultProps {
  data: EarlyPayoffResponse
  onPayNow?: () => void
}

export default function EarlyPayoffResult({ data, onPayNow }: EarlyPayoffResultProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <p className="text-sm text-white/80 mb-1">Total de Liquidacion</p>
        <p className="text-4xl font-bold">
          {formatCurrency(data.total_payoff_amount, 'USD')}
        </p>
        <p className="text-sm text-white/60 mt-1">
          Fecha: {data.payoff_date}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Capital Pendiente</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(data.outstanding_principal, 'USD')}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Interes Pro-rata</p>
          <p className="text-lg font-semibold text-amber-600">
            {formatCurrency(data.pro_rata_interest, 'USD')}
          </p>
        </div>
        {data.early_payoff_penalty > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Penalizacion</p>
            <p className="text-lg font-semibold text-red-600">
              {formatCurrency(data.early_payoff_penalty, 'USD')}
            </p>
          </div>
        )}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-green-100 bg-green-50/50">
          <p className="text-sm text-green-600 font-medium">Ahorro en Intereses</p>
          <p className="text-lg font-semibold text-green-700">
            {formatCurrency(data.interest_saved, 'USD')}
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-gray-100 space-y-3">
        <h4 className="font-medium text-gray-900">Detalles</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-gray-500">Meses Restantes</p>
            <p className="text-sm font-semibold">{data.remaining_months_scheduled}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pago Mensual</p>
            <p className="text-sm font-semibold">{formatCurrency(data.monthly_payment_current, 'USD')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Balance Actual</p>
            <p className="text-sm font-semibold">{formatCurrency(data.current_balance, 'USD')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Pagado</p>
            <p className="text-sm font-semibold">{formatCurrency(data.total_paid_so_far, 'USD')}</p>
          </div>
        </div>
      </div>

      {onPayNow && (
        <button
          type="button"
          onClick={onPayNow}
          className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
        >
          Pagar {formatCurrency(data.total_payoff_amount, 'USD')} ahora
        </button>
      )}
    </div>
  )
}
