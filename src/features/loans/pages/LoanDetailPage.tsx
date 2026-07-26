import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Edit3, RefreshCw,
  DollarSign, PiggyBank, Percent, Calendar,
  TrendingUp, Banknote, CreditCard, FileText,
  Info, Calculator,
  ChevronRight, ShieldCheck, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLoan, useUpdateLoanStatus } from '../hooks/useLoans'
import { useAmortizationSchedule } from '../hooks/useAmortization'
import { usePaymentList, useEarlyPayoff } from '../hooks/usePayments'
import LoanTypeBadge from '../components/LoanTypeBadge'
import LoanStatusBadge from '../components/LoanStatusBadge'
import AmortizationChart from '../components/AmortizationChart'
import AmortizationTable from '../components/AmortizationTable'
import PaymentCard from '../components/PaymentCard'
import EarlyPayoffResult from '../components/EarlyPayoffResult'
import { formatCurrency } from '@/lib/utils'

type Tab = 'overview' | 'amortization' | 'payments' | 'early-payoff'

function StatCard({ icon: Icon, label, value, color, sub }: { icon: React.ElementType; label: string; value: React.ReactNode; color?: string; sub?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={cn('h-4 w-4', color || 'text-gray-400')} />
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className={cn('text-lg font-bold', color || 'text-gray-900 dark:text-gray-100')}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function TabButton({ tab, active, label, icon: Icon }: { tab: Tab; active: Tab; label: string; icon: React.ElementType }) {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap',
        active === tab
          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) || 'overview'
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const { data: loan, isLoading } = useLoan(id!)
  const updateStatusMutation = useUpdateLoanStatus()

  const { data: amortizationData } = useAmortizationSchedule(id!, activeTab === 'amortization')
  const { data: paymentsData } = usePaymentList(id!, activeTab === 'payments' ? { limit: 5 } : undefined)
  const { data: earlyPayoff } = useEarlyPayoff(id!, activeTab === 'early-payoff' ? undefined : undefined)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        setIsScrolled(rect.top < 0)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const setTab = (tab: Tab) => {
    setSearchParams({ tab }, { replace: true })
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!loan) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <DollarSign className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Prestamo no encontrado</h2>
        <button type="button" onClick={() => navigate('/loans')} className="mt-4 text-sm text-emerald-500 hover:underline">
          Volver a prestamos
        </button>
      </div>
    )
  }

  const summary = loan.payments_summary
  const upcoming = loan.upcoming_payment

  return (
    <div className="relative space-y-6 pb-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl dark:bg-teal-500/10" />
      </div>

      <div
        ref={headerRef}
        className={cn(
          'sticky top-0 z-30 transition-all duration-300 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8',
          isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-700/50' : '',
        )}
      >
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/loans')}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Volver"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none">{loan.name}</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate(`/loans/${id}/edit`)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Editar"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{loan.name}</h1>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <LoanTypeBadge type={loan.loan_type} />
                <LoanStatusBadge status={loan.status} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center gap-2 border-b border-gray-100 dark:border-gray-700/50 pb-3 overflow-x-auto">
        <TabButton tab="overview" active={activeTab} label="Resumen" icon={Info} />
        <TabButton tab="amortization" active={activeTab} label="Amortizacion" icon={Calculator} />
        <TabButton tab="payments" active={activeTab} label="Pagos" icon={Banknote} />
        <TabButton tab="early-payoff" active={activeTab} label="Liquidacion" icon={CreditCard} />
      </div>

      {activeTab === 'overview' && (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <StatCard icon={DollarSign} label="Principal" value={formatCurrency(loan.principal_amount)} color="text-gray-900 dark:text-gray-100" />
            <StatCard icon={PiggyBank} label="Balance Actual" value={formatCurrency(loan.current_balance)} color="text-emerald-600 dark:text-emerald-400" />
            <StatCard icon={Percent} label="Tasa de Interes" value={`${loan.annual_interest_rate}%`} color="text-amber-600 dark:text-amber-400" />
            <StatCard icon={Calendar} label="Pago Mensual" value={formatCurrency(loan.monthly_payment)} color="text-blue-600 dark:text-blue-400" />
            <StatCard icon={Banknote} label="Total Pagado" value={formatCurrency(loan.total_paid)} color="text-emerald-600 dark:text-emerald-400" />
            <StatCard icon={TrendingUp} label="Interes Pagado" value={formatCurrency(loan.total_interest_paid)} color="text-red-600 dark:text-red-400" />
            <StatCard icon={TrendingUp} label="Interes Esperado" value={formatCurrency(loan.total_interest_expected)} color="text-amber-600 dark:text-amber-400" />
            <StatCard icon={ShieldCheck} label="Tipo de Interes" value={loan.interest_type === 'fixed' ? 'Fijo' : loan.interest_type === 'variable' ? 'Variable' : 'Mixto'} color="text-purple-600 dark:text-purple-400" />
          </div>

          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Progreso del Prestamo</h3>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{loan.progress_pct.toFixed(1)}%</span>
            </div>
            <div className="w-full h-4 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(loan.progress_pct, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-gray-500 dark:text-gray-400">Pagado: {formatCurrency(loan.total_paid)}</span>
              <span className="text-gray-500 dark:text-gray-400">Balance: {formatCurrency(loan.current_balance)}</span>
            </div>
          </div>

          {upcoming && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Proximo Pago</h3>
                {upcoming.days_until_payment <= 7 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ml-auto">
                    {upcoming.days_until_payment === 0 ? 'Hoy' : `${upcoming.days_until_payment} dias`}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fecha</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {new Date(upcoming.next_payment_date).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Monto</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(upcoming.monthly_payment)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dias restantes</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{upcoming.days_until_payment} dias</p>
                </div>
              </div>
            </div>
          )}

          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={Banknote} label="Total Pagado" value={formatCurrency(summary.total_paid)} color="text-emerald-600 dark:text-emerald-400" />
              <StatCard icon={TrendingUp} label="Interes" value={formatCurrency(summary.total_interest)} color="text-amber-600 dark:text-amber-400" />
              <StatCard icon={PiggyBank} label="Principal" value={formatCurrency(summary.total_principal)} color="text-blue-600 dark:text-blue-400" />
              <StatCard icon={AlertCircle} label="Penalidades" value={formatCurrency(summary.total_penalties)} color="text-red-600 dark:text-red-400" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/loans/${id}/edit`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200"
            >
              <Edit3 className="h-4 w-4" />
              Editar
            </button>
            <button
              type="button"
              onClick={() => {
                const newStatus = loan.status === 'active' ? 'suspended' : 'active'
                updateStatusMutation.mutateAsync({ id: id!, status: newStatus })
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Cambiar Status
            </button>
            <button
              type="button"
              onClick={() => navigate(`/loans/${id}/pay`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all duration-200"
            >
              <DollarSign className="h-4 w-4" />
              Hacer Pago
            </button>
            <button
              type="button"
              onClick={() => setTab('early-payoff')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl hover:from-purple-600 hover:to-violet-700 shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all duration-200"
            >
              <CreditCard className="h-4 w-4" />
              Liquidar
            </button>
          </div>

          {loan.notes && (
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                Notas
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{loan.notes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'amortization' && (
        <div className="animate-fade-in space-y-6">
          {amortizationData ? (
            <>
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
                <AmortizationChart entries={amortizationData.entries.slice(0, 24)} />
              </div>
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
                <AmortizationTable entries={amortizationData.entries} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <Calculator className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Tabla de Amortizacion</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cargando calendario de pagos...</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="animate-fade-in space-y-6">
          {paymentsData ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <StatCard icon={Banknote} label="Total Pagado" value={formatCurrency(paymentsData.summary.total_paid)} color="text-emerald-600 dark:text-emerald-400" />
                <StatCard icon={TrendingUp} label="Interes" value={formatCurrency(paymentsData.summary.total_interest)} color="text-amber-600 dark:text-amber-400" />
                <StatCard icon={PiggyBank} label="Principal" value={formatCurrency(paymentsData.summary.total_principal)} color="text-blue-600 dark:text-blue-400" />
                <StatCard icon={AlertCircle} label="Penalidades" value={formatCurrency(paymentsData.summary.total_penalties)} color="text-red-600 dark:text-red-400" />
                <StatCard icon={Banknote} label="Cantidad" value={paymentsData.summary.payment_count} color="text-gray-900 dark:text-gray-100" />
              </div>
              {paymentsData.payments.length > 0 ? (
                <div className="space-y-3">
                  {paymentsData.payments.map((payment, idx) => (
                    <PaymentCard key={payment.id} payment={payment} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                  <Banknote className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No hay pagos aun</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">Registra tu primer pago para este prestamo</p>
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
              {paymentsData.payments.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate(`/loans/${id}/payments`)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                >
                  Ver historial completo
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <Banknote className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Historial de Pagos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cargando pagos...</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'early-payoff' && (
        <div className="animate-fade-in space-y-6">
          {!loan.early_payoff_allowed ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <CreditCard className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Liquidacion no disponible</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">Este prestamo no permite liquidacion anticipada segun su configuracion</p>
            </div>
          ) : loan.status !== 'active' ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <CreditCard className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Prestamo no activo</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">El prestamo debe estar en estado activo para calcular su liquidacion</p>
            </div>
          ) : earlyPayoff ? (
            <EarlyPayoffResult
              data={earlyPayoff}
              onPayNow={() => navigate(`/loans/${id}/pay`, { state: { suggestedAmount: earlyPayoff.total_payoff_amount } })}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <Calculator className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Calculando liquidacion...</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Obteniendo los datos mas recientes</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
