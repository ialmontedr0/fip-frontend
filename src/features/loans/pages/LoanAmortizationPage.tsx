import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Calculator, BarChart3, Table,
  CheckCheck, Clock, Percent,
  ToggleLeft, ToggleRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAmortizationSchedule, useAmortizationSummary } from '../hooks/useAmortization'
import AmortizationChart from '../components/AmortizationChart'
import AmortizationTable from '../components/AmortizationTable'

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

export default function LoanAmortizationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [paidOnly, setPaidOnly] = useState(false)

  const { data: amortizationData, isLoading } = useAmortizationSchedule(id!, paidOnly)
  const { data: summary } = useAmortizationSummary(id!)

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
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Tabla de Amortizacion
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {amortizationData?.loan_name || 'Calendario completo de pagos'}
            </p>
          </div>
        </div>
      </div>

      {summary && !isLoading && (
        <div className="relative animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard icon={BarChart3} label="Total Entradas" value={summary.total_entries} color="text-gray-900 dark:text-gray-100" />
            <SummaryCard icon={CheckCheck} label="Pagadas" value={summary.entries_paid} color="text-emerald-600 dark:text-emerald-400" />
            <SummaryCard icon={Clock} label="Restantes" value={summary.entries_remaining} color="text-amber-600 dark:text-amber-400" />
            <SummaryCard icon={Percent} label="Progreso" value={`${summary.progress_pct.toFixed(1)}%`} color="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      )}

      <div className="relative animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        <button
          type="button"
          onClick={() => setPaidOnly(!paidOnly)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all',
            paidOnly
              ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
          )}
        >
          {paidOnly ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
          Solo pagados
        </button>
      </div>

      <div className="relative animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          </div>
        ) : amortizationData && amortizationData.entries.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <BarChart3 className="h-3.5 w-3.5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Grafica de Amortizacion</h3>
              </div>
              <AmortizationChart entries={amortizationData.entries} />
            </div>
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-gray-500 to-gray-600">
                  <Table className="h-3.5 w-3.5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Detalle de Pagos</h3>
                <span className="text-xs text-gray-400 ml-auto">{amortizationData.entries.length} entradas</span>
              </div>
              <AmortizationTable entries={amortizationData.entries} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <Calculator className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {paidOnly ? 'No hay pagos registrados' : 'Tabla de amortizacion no disponible'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              {paidOnly ? 'Aun no se han registrado pagos para este prestamo' : 'No se pudo generar la tabla de amortizacion'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
