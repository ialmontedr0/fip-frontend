import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon, Wallet } from 'lucide-react'
import { PAYMENT_METHODS } from '@/types/insurance'
import type { CreateInsurancePremiumRequest } from '@/types/insurance'

const premiumSchema = z.object({
  amount: z.coerce.number().positive('Monto debe ser > 0'),
  due_date: z.string().min(1, 'Fecha de vencimiento requerida'),
  paid_date: z.string().optional().or(z.literal('')),
  payment_method: z.string().optional().or(z.literal('')),
})

type PremiumFormData = z.infer<typeof premiumSchema>

interface PremiumFormProps {
  defaultAmount?: number
  onSubmit: (data: CreateInsurancePremiumRequest) => Promise<void>
  onCancel?: () => void
  isPending?: boolean
}

export default function PremiumForm({ defaultAmount, onSubmit, onCancel, isPending }: PremiumFormProps) {
  const form = useForm<PremiumFormData>({
    resolver: zodResolver(premiumSchema) as any,
    defaultValues: {
      amount: defaultAmount || 0,
      due_date: '',
      paid_date: '',
      payment_method: '',
    },
  })

  const { register, handleSubmit, formState: { errors } } = form

  const handleFormSubmit = async (data: PremiumFormData) => {
    await onSubmit({
      amount: data.amount,
      due_date: data.due_date,
      paid_date: data.paid_date || null,
      payment_method: (data.payment_method as any) || null,
    })
  }

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all'

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Datos de la Prima</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Monto <span className="text-red-500">*</span>
          </label>
          <input
            {...register('amount')}
            type="number"
            step="0.01"
            min="0"
            placeholder="1500.00"
            className={inputClasses}
          />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Fecha de Vencimiento <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('due_date')}
                type="date"
                className={inputClasses}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.due_date && <p className="text-xs text-red-500 mt-1">{errors.due_date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fecha de Pago</label>
            <div className="relative">
              <input
                {...register('paid_date')}
                type="date"
                className={inputClasses}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Metodo de Pago</label>
          <div className="relative">
            <select
              {...register('payment_method')}
              className={inputClasses}
            >
              <option value="">Seleccionar metodo</option>
              {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <Wallet className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Guardando...
            </>
          ) : 'Crear Prima'}
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
