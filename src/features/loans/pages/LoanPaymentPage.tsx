import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft, DollarSign, CreditCard, Calendar,
  Building2, Phone, Landmark, Smartphone,
  Banknote, CheckSquare, FileText,
  Info,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { useLoan } from '../hooks/useLoans'
import { useMakePayment } from '../hooks/usePayments'
import { LOAN_PAYMENT_METHODS } from '@/types/loans'
import { formatCurrency, formatISODate } from '@/lib/utils'
import type { LoanPaymentMethod, MakePaymentRequest } from '@/types/loans'

const PAYMENT_METHOD_ICONS: Record<string, React.ElementType> = {
  bank_transfer: Building2,
  cash: Banknote,
  auto_debit: Smartphone,
  check: Landmark,
  online: Phone,
  mobile: Smartphone,
}

export default function LoanPaymentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const suggestedAmount = (location.state as any)?.suggestedAmount

  const { data: loan, isLoading } = useLoan(id!)
  const makePaymentMutation = useMakePayment(id!)

  const [amount, setAmount] = useState(suggestedAmount ? String(suggestedAmount) : '')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState<LoanPaymentMethod>('bank_transfer')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [isExtraPayment, setIsExtraPayment] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (suggestedAmount) {
      setAmount(String(suggestedAmount))
    }
  }, [suggestedAmount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) {
      toast.error('Ingrese un monto valido')
      return
    }
    if (loan && numAmount > loan.current_balance) {
      toast.error('El monto no puede exceder el balance actual')
      return
    }
    try {
      const payload: MakePaymentRequest = {
        amount: numAmount,
        payment_date: paymentDate || null,
        payment_method: paymentMethod,
        reference_number: referenceNumber || null,
        is_extra_payment: isExtraPayment,
        notes: notes || null,
      }
      await makePaymentMutation.mutateAsync(payload)
      toast.success('Pago registrado exitosamente')
      navigate(`/loans/${id}`)
    } catch (err: any) {
      toast.error(err?.message || 'Error al registrar el pago')
    }
  }

  const estimatedInterest = loan
    ? (loan.current_balance * loan.annual_interest_rate) / 100 / 12
    : 0

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
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
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Realizar Pago
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{loan.name}</p>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Balance Actual</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(loan.current_balance)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pago Mensual</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(loan.monthly_payment)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tasa de Interes</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{loan.annual_interest_rate}%</p>
          </div>
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Proximo Pago</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {loan.next_payment_date
                ? formatISODate(loan.next_payment_date)
                : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="relative animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Detalles del Pago
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Monto *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={loan.current_balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="0.00"
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setAmount(String(loan.monthly_payment))}
                    className="px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                  >
                    Pago Mensual ({formatCurrency(loan.monthly_payment)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(String(loan.current_balance))}
                    className="px-3 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors"
                  >
                    Pago Total ({formatCurrency(loan.current_balance)})
                  </button>
                </div>
              </div>

              {amount && parseFloat(amount) > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-amber-700 dark:text-amber-300">
                      <p>Interes estimado del periodo: <strong>{formatCurrency(estimatedInterest)}</strong></p>
                      <p>Monto minimo recomendado para cubrir intereses: <strong>{formatCurrency(estimatedInterest)}</strong></p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Fecha de Pago</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Metodo de Pago</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as LoanPaymentMethod)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none cursor-pointer"
                    >
                      {Object.entries(LOAN_PAYMENT_METHODS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Numero de Referencia</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Opcional"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <button
                  type="button"
                  onClick={() => setIsExtraPayment(!isExtraPayment)}
                  className={cn(
                    'flex items-center justify-center h-5 w-5 rounded border-2 transition-all',
                    isExtraPayment
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500',
                  )}
                >
                  {isExtraPayment && (
                    <CheckSquare className="h-3.5 w-3.5" />
                  )}
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                  Pago extra (no afecta la cuota del siguiente periodo)
                </span>
              </label>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Notas</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Opcional"
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={makePaymentMutation.isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {makePaymentMutation.isPending ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <DollarSign className="h-4 w-4" />
                  )}
                  {amount ? `Pagar ${formatCurrency(parseFloat(amount))}` : 'Pagar'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/loans/${id}`)}
                  className="px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-500" />
                Resumen
              </h3>
              <div className="space-y-2.5 divide-y divide-gray-100 dark:divide-gray-700/50">
                <div className="flex items-center justify-between text-sm pt-0">
                  <span className="text-gray-500 dark:text-gray-400">Balance actual</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(loan.current_balance)}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2.5">
                  <span className="text-gray-500 dark:text-gray-400">A pagar</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {amount ? formatCurrency(parseFloat(amount)) : '$0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2.5">
                  <span className="text-gray-500 dark:text-gray-400">Balance resultante</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {amount ? formatCurrency(Math.max(loan.current_balance - parseFloat(amount), 0)) : formatCurrency(loan.current_balance)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                Metodo de Pago
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                {(() => {
                  const Icon = PAYMENT_METHOD_ICONS[paymentMethod] || CreditCard
                  return <Icon className="h-5 w-5 text-gray-500" />
                })()}
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{LOAN_PAYMENT_METHODS[paymentMethod]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
