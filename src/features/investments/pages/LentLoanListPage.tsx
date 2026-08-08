import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Calculator, Search, SlidersHorizontal,
  HandCoins, Banknote, TrendingUp, Percent, Users,
} from 'lucide-react'
import { cn, formatCurrency, formatISODate } from '@/lib/utils'
import { useLentLoans, useLentLoanSummary } from '../hooks/useLentLoans'
import type { LentLoan } from '@/types/lentLoan'

const STATUS_META: Record<string, { label: string; className: string }> = {
  active: { label: 'Activo', className: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20' },
  paid_off: { label: 'Pagado', className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' },
  defaulted: { label: 'En mora', className: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-100 dark:border-red-500/20' },
  cancelled: { label: 'Cancelado', className: 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border-gray-100 dark:border-gray-500/20' },
}

function SummaryCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      </div>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

function LentLoanCard({ loan }: { loan: LentLoan }) {
  const navigate = useNavigate()
  const meta = STATUS_META[loan.status] || STATUS_META.active
  const progress = Math.min(100, loan.progress_pct || 0)

  return (
    <div
      onClick={() => navigate(`/investments/lent-loans/${loan.id}`)}
      className="group cursor-pointer bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20">
              <HandCoins className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{loan.borrower_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {loan.payment_frequency === 'single_payment'
                  ? `Pago unico: ${formatCurrency(loan.monthly_payment)}`
                  : `${formatCurrency(loan.monthly_payment)} / mes`}
              </p>
            </div>
          </div>
          <span className={cn('shrink-0 text-[10px] font-medium px-2 py-1 rounded-full border', meta.className)}>
            {meta.label}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">Saldo pendiente</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(loan.current_balance)}</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50 dark:border-gray-700/50">
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">Capital</p>
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{formatCurrency(loan.principal_amount)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">Tasa</p>
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{loan.annual_interest_rate}%</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">Recibido</p>
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(loan.total_received)}</p>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500">
          {loan.payment_frequency === 'single_payment'
            ? loan.next_payment_date
              ? `Vence: ${formatISODate(loan.next_payment_date)}`
              : loan.paid_off_date
                ? `Pagado: ${formatISODate(loan.paid_off_date)}`
                : 'Pago unico'
            : loan.next_payment_date
              ? `Proxima cuota: ${formatISODate(loan.next_payment_date)}`
              : loan.paid_off_date
                ? `Pagado: ${formatISODate(loan.paid_off_date)}`
                : `${loan.term_months} meses`}
        </p>
      </div>
    </div>
  )
}

export default function LentLoanListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading } = useLentLoans(statusFilter || undefined)
  const { data: summary } = useLentLoanSummary()

  const loans = data?.items || []

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return loans
    const q = searchQuery.toLowerCase()
    return loans.filter((l) => l.borrower_name.toLowerCase().includes(q))
  }, [loans, searchQuery])

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-500/10" />
      </div>

      {summary && !isLoading && (
        <div className="relative animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <SummaryCard
              icon={Banknote}
              label="Pendiente por recibir"
              value={formatCurrency(summary.total_outstanding)}
              sub={`${summary.count} prestamo${summary.count !== 1 ? 's' : ''}`}
              color="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
            <SummaryCard
              icon={Users}
              label="Capital prestado"
              value={formatCurrency(summary.total_principal)}
              color="bg-gradient-to-br from-violet-500 to-purple-600"
            />
            <SummaryCard
              icon={TrendingUp}
              label="Total recibido"
              value={formatCurrency(summary.total_received)}
              color="bg-gradient-to-br from-emerald-500 to-teal-600"
            />
            <SummaryCard
              icon={Percent}
              label="Intereses esperados"
              value={formatCurrency(summary.total_interest_expected)}
              color="bg-gradient-to-br from-amber-500 to-orange-600"
            />
          </div>
        </div>
      )}

      <div className="relative animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <HandCoins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Prestamos Otorgados</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data?.total ? `${data.total} prestamo${data.total !== 1 ? 's' : ''}` : 'Controla el dinero que prestas'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/investments/lent-loans/simulator')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Simulador
            </button>
            <button
              type="button"
              onClick={() => navigate('/investments/lent-loans/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nuevo Prestamo
            </button>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por deudor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
              showFilters
                ? 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
        </div>
      </div>

      <div className={cn('relative overflow-hidden transition-all duration-300', showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
        <div className="p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Todos los estados</option>
              {Object.entries(STATUS_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                  </div>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex gap-2 mt-3">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            {searchQuery && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para &quot;{searchQuery}&quot;
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((loan) => (
                <LentLoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <HandCoins className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchQuery ? `Sin resultados para "${searchQuery}"` : 'No tienes prestamos otorgados aun'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              {searchQuery ? 'Intenta con otros terminos de busqueda' : 'Registra el dinero que prestas con plazo y cuota fija para dar seguimiento'}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/investments/lent-loans/new')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Nuevo Prestamo
              </button>
              <button
                type="button"
                onClick={() => navigate('/investments/lent-loans/simulator')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Calculator className="h-4 w-4" />
                Simulador
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
