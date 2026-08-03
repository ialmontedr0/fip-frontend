import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertTriangle, CalendarIcon, CheckCircle2, Landmark, ScanLine } from 'lucide-react'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import type { OcrSuggestions } from '@/types/ocr'
import type { CreateTransactionRequest } from '@/types/transactions'

const receiptSchema = z.object({
  transaction_type: z.enum(['expense', 'income', 'adjustment']),
  account_id: z.string().min(1, 'Selecciona una cuenta'),
  amount: z.coerce.number().positive('Monto debe ser > 0'),
  currency_code: z.string().length(3).default('DOP'),
  description: z.string().min(1, 'La descripcion es requerida').max(500),
  effective_date: z.string().min(1, 'La fecha es requerida'),
})

type ReceiptFormData = z.infer<typeof receiptSchema>

interface Props {
  suggestions: OcrSuggestions
  warnings: string[]
  rawText: string | null
  onSubmit: (data: CreateTransactionRequest) => Promise<void>
  isPending?: boolean
}

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all'

export default function ExtractedReceiptForm({ suggestions, warnings, rawText, onSubmit, isPending }: Props) {
  const { data: accountsData, isLoading: loadingAccounts } = useAccounts()

  const form = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema) as any,
    defaultValues: {
      transaction_type: (suggestions.type as ReceiptFormData['transaction_type']) || 'expense',
      account_id: '',
      amount: suggestions.amount ?? undefined,
      currency_code: suggestions.currency || 'DOP',
      description: suggestions.merchant || '',
      effective_date: suggestions.date || new Date().toISOString().slice(0, 10),
    },
  })

  const { register, handleSubmit, formState: { errors } } = form

  const handleFormSubmit = async (data: ReceiptFormData) => {
    await onSubmit({
      account_id: data.account_id,
      transaction_type: data.transaction_type,
      amount: data.amount,
      currency_code: data.currency_code,
      description: data.description,
      effective_date: data.effective_date,
      source: 'import',
      status: 'completed',
    })
  }

  const accounts = accountsData?.accounts ?? []

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {warnings.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Advertencias de extraccion</p>
            <ul className="mt-1 list-disc pl-4 space-y-0.5">
              {warnings.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-emerald-500" />
          Datos del recibo (verifica y ajusta)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Monto <span className="text-red-500">*</span>
            </label>
            <input
              {...register('amount')}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className={inputClass}
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Fecha <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('effective_date')}
                type="date"
                className={inputClass}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.effective_date && <p className="text-xs text-red-500 mt-1">{errors.effective_date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Descripcion / Comercio <span className="text-red-500">*</span>
            </label>
            <input
              {...register('description')}
              type="text"
              placeholder="Nombre del comercio"
              className={inputClass}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Moneda
            </label>
            <input
              {...register('currency_code')}
              type="text"
              maxLength={3}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Tipo
            </label>
            <select {...register('transaction_type')} className={inputClass}>
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
              <option value="adjustment">Ajuste</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Cuenta <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select {...register('account_id')} className={inputClass} disabled={loadingAccounts}>
                <option value="">{loadingAccounts ? 'Cargando cuentas...' : 'Seleccionar cuenta'}</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
              <Landmark className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.account_id && <p className="text-xs text-red-500 mt-1">{errors.account_id.message}</p>}
          </div>
        </div>
      </div>

      {rawText && (
        <details className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 p-4">
          <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            Texto extraido (OCR)
          </summary>
          <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-gray-500 dark:text-gray-400 font-mono">
            {rawText}
          </pre>
        </details>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isPending ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {isPending ? 'Creando transaccion...' : 'Confirmar y crear transaccion'}
        </button>
      </div>
    </form>
  )
}
