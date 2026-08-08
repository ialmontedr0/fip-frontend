import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  DollarSign, PiggyBank, Percent, Calendar,
  TrendingUp, Banknote, ShieldCheck, Info,
  Calculator, HandCoins, Plus, Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn, formatCurrency, formatISODate } from '@/lib/utils'
import { useLentLoan, useRecordLentLoanPayment, useDeleteLentLoan } from '../hooks/useLentLoans'
import { Modal } from '@/components/ui'

type Tab = 'overview' | 'schedule' | 'payments'

const STATUS_META: Record<string, { label: string; className: string }> = {
  active: { label: 'Activo', className: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20' },
  paid_off: { label: 'Pagado', className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' },
  defaulted: { label: 'En mora', className: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-100 dark:border-red-500/20' },
  cancelled: { label: 'Cancelado', className: 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border-gray-100 dark:border-gray-500/20' },
}

const PAYMENT_METHODS: Record<string, string> = {
  bank_transfer: 'Transferencia',
  cash: 'Efectivo',
  auto_debit: 'Debito automatico',
  check: 'Cheque',
  online: 'En linea',
  mobile: 'Pago movil',
}

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
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

export default function LentLoanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) || 'overview'
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [amount, setAmount] = useState('')
  const [receivedDate, setReceivedDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')

  const { data: loan, isLoading } = useLentLoan(id!)
  const recordPaymentMutation = useRecordLentLoanPayment(id!)
  const deleteMutation = useDeleteLentLoan()

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

  useEffect(() => {
    if (loan && !amount) {
      setAmount(String(loan.monthly_payment ?? ''))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loan])

  const openPaymentModal = () => {
    setAmount(String(loan?.monthly_payment ?? ''))
    setReceivedDate('')
    setPaymentMethod('bank_transfer')
    setReferenceNumber('')
    setPaymentNotes('')
    setShowPaymentModal(true)
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      toast.error('Ingrese un monto valido')
      return
    }
    try {
      await recordPaymentMutation.mutateAsync({
        amount: amt,
        received_date: receivedDate || null,
        payment_method: paymentMethod,
        reference_number: referenceNumber.trim() || null,
        notes: paymentNotes.trim() || null,
      })
      setShowPaymentModal(false)
    } catch (err: any) {
      toast.error(err?.message || 'Error al registrar el pago')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id!)
      toast.success('Prestamo eliminado')
      navigate('/investments/lent-loans')
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar el prestamo')
    }
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
        <HandCoins className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Prestamo no encontrado</h2>
        <button type="button" onClick={() => navigate('/investments/lent-loans')} className="mt-4 text-sm text-blue-500 hover:underline">
          Volver a prestamos otorgados
        </button>
      </div>
    )
  }

  const meta = STATUS_META[loan.status] || STATUS_META.active
  const schedule = loan.schedule || []
  const payments = loan.payments || []
  const paidCount = payments.length
  const progress = Math.min(100, loan.progress_pct || 0)

  return (
    <div className="relative space-y-6 pb-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-500/10" />
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
              onClick={() => navigate('/investments/lent-loans')}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Volver"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none">{loan.borrower_name}</h2>
          </div>
          <div className="flex items-center gap-1.5">
            {loan.status === 'active' && (
              <button
                type="button"
                onClick={openPaymentModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
              >
                <Plus className="h-3.5 w-3.5" />
                Registrar Pago
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <HandCoins className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{loan.borrower_name}</h1>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('text-[10px] font-medium px-2 py-1 rounded-full border', meta.className)}>{meta.label}</span>
                {loan.is_collateralized && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full border border-purple-100 dark:border-purple-500/20 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                    <ShieldCheck className="h-3 w-3" />
                    Con garantia
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center gap-2 border-b border-gray-100 dark:border-gray-700/50 pb-3 overflow-x-auto">
        <TabButton tab="overview" active={activeTab} label="Resumen" icon={Info} />
        <TabButton tab="schedule" active={activeTab} label="Calendario de Cuotas" icon={Calculator} />
        <TabButton tab="payments" active={activeTab} label="Pagos Recibidos" icon={Banknote} />
      </div>

      {activeTab === 'overview' && (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <StatCard icon={DollarSign} label="Capital Prestado" value={formatCurrency(loan.principal_amount)} color="text-gray-900 dark:text-gray-100" />
            <StatCard icon={PiggyBank} label="Saldo Pendiente" value={formatCurrency(loan.current_balance)} color="text-blue-600 dark:text-blue-400" />
            <StatCard icon={Percent} label="Tasa Anual" value={`${loan.annual_interest_rate}%`} color="text-amber-600 dark:text-amber-400" />
            <StatCard icon={Calendar} label="Cuota Fija" value={formatCurrency(loan.monthly_payment)} color="text-indigo-600 dark:text-indigo-400" />
            <StatCard icon={Banknote} label="Total Recibido" value={formatCurrency(loan.total_received)} color="text-emerald-600 dark:text-emerald-400" />
            <StatCard icon={TrendingUp} label="Interes Recibido" value={formatCurrency(loan.total_interest_received)} color="text-emerald-600 dark:text-emerald-400" />
            <StatCard icon={TrendingUp} label="Interes Esperado" value={formatCurrency(loan.total_interest_expected)} color="text-amber-600 dark:text-amber-400" />
            <StatCard icon={Calendar} label="Plazo" value={`${loan.term_months} meses`} />
          </div>

          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Progreso de Cobro</h3>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full h-4 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-gray-500 dark:text-gray-400">Recibido: {formatCurrency(loan.total_received)}</span>
              <span className="text-gray-500 dark:text-gray-400">Pendiente: {formatCurrency(loan.current_balance)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Fechas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Inicio</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{loan.start_date ? formatISODate(loan.start_date) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Primera cuota</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{loan.first_payment_date ? formatISODate(loan.first_payment_date) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Proxima cuota</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{loan.next_payment_date ? formatISODate(loan.next_payment_date) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Cuota final</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{loan.final_payment_date ? formatISODate(loan.final_payment_date) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Pagado</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{loan.paid_off_date ? formatISODate(loan.paid_off_date) : '—'}</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Detalles</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Moneda</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{loan.currency_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Frecuencia</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">{loan.payment_frequency.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Cuotas pagadas</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{payments.length} / {loan.term_months}</span>
                </div>
                {loan.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-50 dark:border-gray-700/50 leading-relaxed">
                    {loan.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {loan.status === 'active' && (
            <button
              type="button"
              onClick={openPaymentModal}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Registrar Pago Recibido
            </button>
          )}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Calendario de Amortizacion
              <span className="text-xs font-normal text-gray-400 ml-2">({schedule.length} cuotas)</span>
            </h3>
          </div>

          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
                    <th className="text-left py-3 px-4 text-xs text-gray-500 dark:text-gray-400 font-medium">#</th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 dark:text-gray-400 font-medium">Fecha</th>
                    <th className="text-right py-3 px-4 text-xs text-gray-500 dark:text-gray-400 font-medium">Cuota</th>
                    <th className="text-right py-3 px-4 text-xs text-gray-500 dark:text-gray-400 font-medium">Capital</th>
                    <th className="text-right py-3 px-4 text-xs text-gray-500 dark:text-gray-400 font-medium">Interes</th>
                    <th className="text-right py-3 px-4 text-xs text-gray-500 dark:text-gray-400 font-medium">Saldo</th>
                    <th className="text-right py-3 px-4 text-xs text-gray-500 dark:text-gray-400 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((entry) => {
                    const isPaid = entry.entry_number <= paidCount
                    return (
                      <tr
                        key={entry.entry_number}
                        className={cn(
                          'border-b border-gray-50 dark:border-gray-700/30 transition-colors',
                          isPaid ? 'bg-emerald-50/40 dark:bg-emerald-500/5' : 'hover:bg-gray-50 dark:hover:bg-gray-700/20',
                        )}
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{entry.entry_number}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatISODate(entry.due_date)}</td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-gray-100">{formatCurrency(entry.amount)}</td>
                        <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(entry.principal_portion)}</td>
                        <td className="py-3 px-4 text-right text-amber-600 dark:text-amber-400">{formatCurrency(entry.interest_portion)}</td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{formatCurrency(entry.balance_after)}</td>
                        <td className="py-3 px-4 text-right">
                          {isPaid ? (
                            <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                              Pagada
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-medium text-gray-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mr-1.5" />
                              Pendiente
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Pagos Recibidos
              <span className="text-xs font-normal text-gray-400 ml-2">({payments.length})</span>
            </h3>
            {loan.status === 'active' && (
              <button
                type="button"
                onClick={openPaymentModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
              >
                <Plus className="h-3.5 w-3.5" />
                Registrar Pago
              </button>
            )}
          </div>

          {payments.length > 0 ? (
            <div className="space-y-3">
              {[...payments]
                .sort((a, b) => (b.received_date || '').localeCompare(a.received_date || ''))
                .map((payment) => (
                  <div key={payment.id} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                        <Banknote className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(payment.amount)}
                          <span className="text-xs font-normal text-gray-400 ml-2">
                            {payment.received_date ? formatISODate(payment.received_date) : 'Fecha no especificada'}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {PAYMENT_METHODS[payment.payment_method] || payment.payment_method}
                          {payment.reference_number ? ` · Ref: ${payment.reference_number}` : ''}
                        </p>
                        {payment.notes && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{payment.notes}</p>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Capital: {formatCurrency(payment.principal_portion)}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">Interes: {formatCurrency(payment.interest_portion)}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <Banknote className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Aun no se han registrado pagos</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Registrar Pago Recibido">
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Monto Recibido *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                required
              />
            </div>
            {loan && (
              <p className="text-[11px] text-gray-400 mt-1">
                Cuota fija: {formatCurrency(loan.monthly_payment)} · Saldo pendiente: {formatCurrency(loan.current_balance)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Fecha de Recepcion</label>
            <input
              type="date"
              value={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Metodo de Pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            >
              {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Numero de Referencia</label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Opcional"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Notas</label>
            <textarea
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              rows={2}
              placeholder="Opcional"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={recordPaymentMutation.isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {recordPaymentMutation.isPending ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Banknote className="h-4 w-4" />
              )}
              Registrar Pago
            </button>
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Eliminar Prestamo">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Esta seguro de eliminar el prestamo de <span className="font-semibold">{loan.borrower_name}</span>? Esta accion no se puede deshacer.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
