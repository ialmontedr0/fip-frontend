import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, HandCoins, Calculator, DollarSign, Calendar,
  TrendingUp, Save, ShieldCheck, User, FileText, Wallet,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn, formatCurrency, formatISODate } from '@/lib/utils'
import { useCreateLentLoan, useSimulateLentLoan } from '../hooks/useLentLoans'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import type { LentLoan } from '@/types/lentLoan'

const FREQUENCIES = {
  monthly: 'Mensual',
  bi_weekly: 'Quincenal',
  weekly: 'Semanal',
}

const CURRENCIES = ['DOP', 'USD', 'EUR']

export default function LentLoanCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [borrowerName, setBorrowerName] = useState('')
  const [principalAmount, setPrincipalAmount] = useState(searchParams.get('principal') || '')
  const [annualInterestRate, setAnnualInterestRate] = useState(searchParams.get('rate') || '')
  const [termMonths, setTermMonths] = useState(searchParams.get('term') || '')
  const [paymentFrequency, setPaymentFrequency] = useState('monthly')
  const [currencyCode, setCurrencyCode] = useState('DOP')
  const [accountId, setAccountId] = useState('')
  const [startDate, setStartDate] = useState(searchParams.get('start') || '')
  const [isCollateralized, setIsCollateralized] = useState(false)
  const [notes, setNotes] = useState('')
  const [preview, setPreview] = useState<{ monthly_payment: number; total_to_receive: number; total_interest: number; total_profit: number; interest_to_principal_ratio: number } | null>(null)

  const createMutation = useCreateLentLoan()
  const simulateMutation = useSimulateLentLoan()
  const { data: accountsData } = useAccounts()

  const accounts = accountsData?.accounts || []

  useEffect(() => {
    if (preview && !preview.monthly_payment) return
    const principal = parseFloat(principalAmount)
    const rate = parseFloat(annualInterestRate)
    const term = parseInt(termMonths)
    if (principal > 0 && rate >= 0 && term > 0) {
      const timer = setTimeout(() => {
        simulateMutation.mutate(
          {
            principal_amount: principal,
            annual_interest_rate: rate,
            term_months: term,
            start_date: startDate || null,
          },
          {
            onSuccess: (res) => setPreview(res),
            onError: () => setPreview(null),
          },
        )
      }, 400)
      return () => clearTimeout(timer)
    }
    setPreview(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principalAmount, annualInterestRate, termMonths, startDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const principal = parseFloat(principalAmount)
    const rate = parseFloat(annualInterestRate)
    const term = parseInt(termMonths)

    if (!borrowerName.trim()) {
      toast.error('Ingrese el nombre del deudor')
      return
    }
    if (!principal || principal <= 0) {
      toast.error('Ingrese un monto a prestar valido')
      return
    }
    if (rate < 0) {
      toast.error('Ingrese una tasa de interes valida')
      return
    }
    if (!term || term <= 0) {
      toast.error('Ingrese un plazo valido')
      return
    }

    try {
      const payload = {
        borrower_name: borrowerName.trim(),
        principal_amount: principal,
        annual_interest_rate: rate,
        term_months: term,
        payment_frequency: paymentFrequency,
        currency_code: currencyCode,
        account_id: accountId || null,
        start_date: startDate || null,
        is_collateralized: isCollateralized,
        notes: notes.trim() || null,
      }
      const result: LentLoan = await createMutation.mutateAsync(payload as never)
      toast.success('Prestamo otorgado creado exitosamente')
      navigate(`/investments/lent-loans/${result.id}`)
    } catch (err: any) {
      toast.error(err?.message || 'Error al crear el prestamo')
    }
  }

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all'

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
            <HandCoins className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Nuevo Prestamo Otorgado</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Registra un prestamo con plazo y cuota fija
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative space-y-6">
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              Datos del Deudor
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Nombre del Deudor *</label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Ej: Juan Perez"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Notas</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Condiciones del acuerdo, garantias, comentarios..."
                  rows={3}
                  className={cn(inputClass, 'resize-none')}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Condiciones del Prestamo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="0.00"
                    className={cn(inputClass, 'pl-7')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Tasa de Interes Anual *</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={annualInterestRate}
                    onChange={(e) => setAnnualInterestRate(e.target.value)}
                    placeholder="0.00"
                    className={cn(inputClass, 'pr-8')}
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
                  placeholder="12"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Frecuencia de Pago</label>
                <select
                  value={paymentFrequency}
                  onChange={(e) => setPaymentFrequency(e.target.value)}
                  className={inputClass}
                >
                  {Object.entries(FREQUENCIES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Moneda</label>
                <select
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className={inputClass}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Cuenta de Origen</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Sin cuenta vinculada</option>
                  {accounts.map((a: { id: string; name: string }) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Fecha de Inicio</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={cn(inputClass, 'pl-10')}
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isCollateralized}
                onChange={(e) => setIsCollateralized(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <ShieldCheck className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Prestamo con garantia / colateral</span>
            </label>
          </div>
        </div>

        <div className="relative space-y-4">
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 lg:sticky lg:top-20">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-blue-500" />
              Resumen
            </h3>

            {preview ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-lg shadow-blue-500/25">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="h-4 w-4" />
                    <p className="text-xs opacity-90">Cuota Fija por recibir</p>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(preview.monthly_payment)}</p>
                  <p className="text-[11px] opacity-75 mt-0.5">
                    {FREQUENCIES[paymentFrequency as keyof typeof FREQUENCIES]} · {termMonths} meses
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-gray-100 dark:border-gray-700/50 p-3">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">Total a Recibir</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(preview.total_to_receive)}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 dark:border-gray-700/50 p-3">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">Ganancia (Interes)</p>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(preview.total_profit)}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 dark:border-gray-700/50 p-3">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">Interes Total</p>
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(preview.total_interest)}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 dark:border-gray-700/50 p-3">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">Rentabilidad</p>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{preview.interest_to_principal_ratio.toFixed(1)}%</p>
                  </div>
                </div>

                {startDate && (
                  <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    Inicio: {formatISODate(startDate)}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calculator className="h-12 w-12 text-gray-200 dark:text-gray-600 mb-3" />
                <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[200px]">
                  Completa monto, tasa y plazo para ver la cuota calculada
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {createMutation.isPending ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Save className="h-4 w-4" />
              )}
              Crear Prestamo
            </button>
            <button
              type="button"
              onClick={() => navigate('/investments/lent-loans')}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Cancelar
            </button>
          </div>

          {!preview && (parseFloat(principalAmount) > 0) && (
            <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl p-3">
              <TrendingUp className="h-4 w-4 shrink-0 mt-0.5" />
              Completa la tasa y el plazo para previsualizar la cuota mensual antes de crear.
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
