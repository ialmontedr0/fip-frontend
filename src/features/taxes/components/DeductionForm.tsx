import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon } from 'lucide-react'
import { TAX_YEAR_MAX, TAX_YEAR_MIN } from '@/types/taxes'
import type { CreateTaxDeductionRequest, TaxCategory, TaxDeduction } from '@/types/taxes'

const deductionSchema = z.object({
  description: z.string().min(1, 'Descripcion requerida').max(500),
  amount: z.coerce.number().positive('Monto debe ser > 0'),
  date: z.string().min(1, 'Fecha requerida'),
  tax_year: z.coerce
    .number()
    .int()
    .min(TAX_YEAR_MIN, `Minimo ${TAX_YEAR_MIN}`)
    .max(TAX_YEAR_MAX, `Maximo ${TAX_YEAR_MAX}`),
  category_id: z.string().optional().or(z.literal('')),
  deductible: z.coerce.number().min(0).optional().or(z.nan()),
  receipt_url: z.string().max(500).optional().or(z.literal('')),
})

type DeductionFormData = z.infer<typeof deductionSchema>

interface DeductionFormProps {
  initialData?: TaxDeduction
  categories: TaxCategory[]
  defaultYear: number
  onSubmit: (data: CreateTaxDeductionRequest) => Promise<void>
  onCancel?: () => void
  isPending?: boolean
}

export default function DeductionForm({
  initialData,
  categories,
  defaultYear,
  onSubmit,
  onCancel,
  isPending,
}: DeductionFormProps) {
  const form = useForm<DeductionFormData>({
    resolver: zodResolver(deductionSchema) as any,
    defaultValues: {
      description: initialData?.description || '',
      amount: initialData?.amount || 0,
      date: initialData?.date || '',
      tax_year: initialData?.tax_year || defaultYear,
      category_id: initialData?.category_id || '',
      deductible: initialData?.deductible ?? ('' as any),
      receipt_url: initialData?.receipt_url || '',
    },
  })

  const { register, handleSubmit, formState: { errors } } = form

  const handleFormSubmit = async (data: DeductionFormData) => {
    await onSubmit({
      description: data.description,
      amount: data.amount,
      date: data.date,
      tax_year: data.tax_year,
      category_id: data.category_id || null,
      deductible: isNaN(data.deductible as any) ? null : data.deductible,
      receipt_url: data.receipt_url || null,
    })
  }

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all'
  const selectClasses = inputClasses

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Datos de la Deduccion</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Descripcion <span className="text-red-500">*</span>
          </label>
          <input
            {...register('description')}
            placeholder="ej: Consulta medica anual"
            className={inputClasses}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>
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
              placeholder="1000.00"
              className={inputClasses}
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Monto Deducible
            </label>
            <input
              {...register('deductible')}
              type="number"
              step="0.01"
              min="0"
              placeholder="Opcional"
              className={inputClasses}
            />
            {errors.deductible && <p className="text-xs text-red-500 mt-1">{errors.deductible.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Fecha <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('date')}
                type="date"
                className={inputClasses}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Año Fiscal <span className="text-red-500">*</span>
            </label>
            <input
              {...register('tax_year')}
              type="number"
              min={TAX_YEAR_MIN}
              max={TAX_YEAR_MAX}
              className={inputClasses}
            />
            {errors.tax_year && <p className="text-xs text-red-500 mt-1">{errors.tax_year.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Categoria</label>
            <select {...register('category_id')} className={selectClasses}>
              <option value="">Sin categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL del Recibo</label>
          <input
            {...register('receipt_url')}
            placeholder="https://... (opcional)"
            className={inputClasses}
          />
        </div>
      </div>

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
          ) : initialData ? 'Guardar Cambios' : 'Crear Deduccion'}
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
