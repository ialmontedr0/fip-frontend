import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Banknote, DollarSign, TrendingUp,
  PiggyBank, AlertCircle, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePaymentList } from '../hooks/usePayments'
import PaymentCard from '../components/PaymentCard'
import { formatCurrency } from '@/lib/utils'

function SummaryCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={cn('h-4 w-4', color || 'text-gray-400')} />
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className={cn('text-lg font-bold', color || 'text-gray-900 dark:text-gray-100')}>{value}</p>
    </div>
  )
}

const PAGE_SIZE = 10

export default function LoanPaymentHistoryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [offset, setOffset] = useState(0)

  const { data, isLoading } = usePaymentList(id!, { limit: PAGE_SIZE, offset })

  const summary = data?.summary

  const handlePrev = () => setOffset(Math.max(0, offset - PAGE_SIZE))
  const handleNext = () => {
    if (data && offset + PAGE_SIZE < data.total) {
      setOffset(offset + PAGE_SIZE)
    }
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl dark:bg-teal-500/10" />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => navigate(`/loans/${id}`)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver a Detalle
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Banknote className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Historial de Pagos
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data ? `${data.total} pago${data.total !== 1 ? 's' : ''} registrado${data.total !== 1 ? 's' : ''}` : 'Todos los pagos realizados'}
            </p>
          </div>
        </div>
      </div>

      {summary && !isLoading && (
        <div className="relative animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <SummaryCard icon={DollarSign} label="Total Pagado" value={formatCurrency(summary.total_paid)} color="text-emerald-600 dark:text-emerald-400" />
            <SummaryCard icon={TrendingUp} label="Interes" value={formatCurrency(summary.total_interest)} color="text-amber-600 dark:text-amber-400" />
            <SummaryCard icon={PiggyBank} label="Principal" value={formatCurrency(summary.total_principal)} color="text-blue-600 dark:text-blue-400" />
            <SummaryCard icon={AlertCircle} label="Penalidades" value={formatCurrency(summary.total_penalties)} color="text-red-600 dark:text-red-400" />
            <SummaryCard icon={Banknote} label="Cantidad" value={summary.payment_count} color="text-gray-900 dark:text-gray-100" />
          </div>
        </div>
      )}

      <div className="relative animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        ) : data && data.payments.length > 0 ? (
          <div className="space-y-3">
            {data.payments.map((payment, idx) => (
              <PaymentCard key={payment.id} payment={payment} index={idx} />
            ))}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Mostrando {offset + 1}-{Math.min(offset + PAGE_SIZE, data.total)} de {data.total} pagos
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={offset === 0}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all',
                    offset === 0
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={offset + PAGE_SIZE >= data.total}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all',
                    offset + PAGE_SIZE >= data.total
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
                  )}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <Banknote className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No hay pagos registrados</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Aun no se han registrado pagos para este prestamo
            </p>
            <button
              type="button"
              onClick={() => navigate(`/loans/${id}/pay`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
            >
              <DollarSign className="h-4 w-4" />
              Hacer Pago
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
