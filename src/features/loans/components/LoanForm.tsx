import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon, ChevronDown, Info, Calculator } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import {
  LOAN_TYPES, INTEREST_TYPES, PAYMENT_FREQUENCIES,
  type LoanType, type InterestType, type PaymentFrequency,
} from '@/types/loans'
import type { LoanDetailResponse, CreateLoanRequest } from '@/types/loans'

const loanSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(150),
  principal_amount: z.coerce.number().positive('Monto debe ser > 0'),
  annual_interest_rate: z.coerce.number().min(0, 'Tasa no negativa'),
  term_months: z.coerce.number().int().min(1).max(600, 'Maximo 600 meses'),
  loan_type: z.string().default('personal'),
  interest_type: z.string().default('fixed'),
  payment_frequency: z.string().default('monthly'),
  lender_name: z.string().max(200).optional().or(z.literal('')),
  account_number: z.string().max(100).optional().or(z.literal('')),
  disbursement_date: z.string().optional().or(z.literal('')),
  grace_period_days: z.coerce.number().min(0).default(0),
  early_payoff_allowed: z.boolean().default(true),
  early_payoff_penalty_pct: z.coerce.number().min(0).optional().or(z.nan()),
  penalty_rate_monthly: z.coerce.number().min(0).optional().or(z.nan()),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

type LoanFormData = z.infer<typeof loanSchema>

interface LoanFormProps {
  initialData?: Partial<LoanDetailResponse>
  onSubmit: (data: CreateLoanRequest) => Promise<void>
  onCancel?: () => void
  isPending?: boolean
}

export default function LoanForm({ initialData, onSubmit, onCancel, isPending }: LoanFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      principal_amount: initialData?.principal_amount || 0,
      annual_interest_rate: initialData?.annual_interest_rate || 0,
      term_months: 12,
      loan_type: initialData?.loan_type || 'personal',
      interest_type: initialData?.interest_type || 'fixed',
      payment_frequency: initialData?.payment_frequency || 'monthly',
      lender_name: initialData?.lender_name || '',
      account_number: initialData?.account_number || '',
      disbursement_date: initialData?.disbursement_date || '',
      grace_period_days: initialData?.grace_period_days || 0,
      early_payoff_allowed: initialData?.early_payoff_allowed ?? true,
      early_payoff_penalty_pct: initialData?.early_payoff_penalty_pct ?? ('' as any),
      penalty_rate_monthly: initialData?.penalty_rate_monthly ?? ('' as any),
      notes: initialData?.notes || '',
    },
  })

  const { register, handleSubmit, watch, formState: { errors } } = form
  const principal = watch('principal_amount')
  const rate = watch('annual_interest_rate')
  const term = watch('term_months')

  const monthlyEstimate = useMemo(() => {
    const p = Number(principal)
    const r = Number(rate) / 100 / 12
    const n = Number(term)
    if (!p || !r || !n || p <= 0 || r <= 0 || n <= 0) return null
    const M = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    return isFinite(M) ? M : null
  }, [principal, rate, term])

  const handleFormSubmit = async (data: LoanFormData) => {
    const payload: CreateLoanRequest = {
      name: data.name,
      principal_amount: data.principal_amount,
      annual_interest_rate: data.annual_interest_rate,
      term_months: data.term_months,
      loan_type: data.loan_type as LoanType,
      interest_type: data.interest_type as InterestType,
      payment_frequency: data.payment_frequency as PaymentFrequency,
      lender_name: data.lender_name || null,
      account_number: data.account_number || null,
      disbursement_date: data.disbursement_date || null,
      grace_period_days: data.grace_period_days,
      early_payoff_allowed: data.early_payoff_allowed,
      early_payoff_penalty_pct: isNaN(data.early_payoff_penalty_pct as any) ? null : data.early_payoff_penalty_pct,
      penalty_rate_monthly: isNaN(data.penalty_rate_monthly as any) ? null : data.penalty_rate_monthly,
      notes: data.notes || null,
    }
    await onSubmit(payload)
  }

  const selectClasses = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all'
  const inputClasses = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all'

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Informacion Basica</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            placeholder="ej: Prestamo personal Scotiabank"
            className={inputClasses}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo <span className="text-red-500">*</span></label>
            <select {...register('loan_type')} className={selectClasses}>
              {Object.entries(LOAN_TYPES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Interes <span className="text-red-500">*</span></label>
            <select {...register('interest_type')} className={selectClasses}>
              {Object.entries(INTEREST_TYPES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Frecuencia <span className="text-red-500">*</span></label>
            <select {...register('payment_frequency')} className={selectClasses}>
              {Object.entries(PAYMENT_FREQUENCIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Financial */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Datos Financieros</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Monto Principal <span className="text-red-500">*</span>
            </label>
            <input
              {...register('principal_amount')}
              type="number"
              step="0.01"
              min="0"
              placeholder="100000"
              className={inputClasses}
            />
            {errors.principal_amount && <p className="text-xs text-red-500 mt-1">{errors.principal_amount.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Tasa Anual % <span className="text-red-500">*</span>
            </label>
            <input
              {...register('annual_interest_rate')}
              type="number"
              step="0.01"
              min="0"
              placeholder="12.5"
              className={inputClasses}
            />
            {errors.annual_interest_rate && <p className="text-xs text-red-500 mt-1">{errors.annual_interest_rate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Plazo (meses) <span className="text-red-500">*</span>
            </label>
            <input
              {...register('term_months')}
              type="number"
              min="1"
              max="600"
              placeholder="48"
              className={inputClasses}
            />
            {errors.term_months && <p className="text-xs text-red-500 mt-1">{errors.term_months.message}</p>}
          </div>
        </div>

        {monthlyEstimate !== null && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
            <Calculator className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0" />
            <div>
              <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">Pago mensual estimado</p>
              <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
                {formatCurrency(monthlyEstimate)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lender */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Prestamista</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre del Prestamista</label>
            <input
              {...register('lender_name')}
              placeholder="ej: Scotiabank, prestamista particular"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Numero de Cuenta</label>
            <input
              {...register('account_number')}
              placeholder="Opcional"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Calendario</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fecha de Desembolso</label>
            <div className="relative">
              <input
                {...register('disbursement_date')}
                type="date"
                className={inputClasses}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Dias de Gracia</label>
            <input
              {...register('grace_period_days')}
              type="number"
              min="0"
              placeholder="0"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Opciones Avanzadas
          </span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', showAdvanced && 'rotate-180')} />
        </button>
        {showAdvanced && (
          <div className="p-5 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center gap-3">
              <input
                {...register('early_payoff_allowed')}
                type="checkbox"
                id="early_payoff_allowed"
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="early_payoff_allowed" className="text-sm text-gray-700 dark:text-gray-300">
                Permitir pago anticipado
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Penalizacion por pago anticipado %</label>
                <input
                  {...register('early_payoff_penalty_pct')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tasa de mora mensual %</label>
                <input
                  {...register('penalty_rate_monthly')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notas Adicionales</h4>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Notas opcionales sobre el prestamo..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Guardando...
            </>
          ) : initialData ? 'Guardar Cambios' : 'Crear Prestamo'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
