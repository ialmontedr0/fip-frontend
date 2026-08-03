import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { INVESTMENT_TX_TYPES, type InvestmentTxType } from '@/types/investment'
import type { CreateInvestmentTransactionRequest, Portfolio } from '@/types/investment'

const txSchema = z.object({
  type: z.string().min(1, 'Tipo requerido'),
  quantity: z.coerce.number().positive('Cantidad debe ser > 0'),
  price_per_unit: z.coerce.number().min(0, 'Precio no puede ser negativo'),
  fees: z.coerce.number().min(0).optional().or(z.nan()),
  portfolio_id: z.string().optional().or(z.literal('')),
  date: z.string().optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

type TxFormData = z.infer<typeof txSchema>

interface InvestmentTransactionFormProps {
  assetName: string
  portfolios: Portfolio[]
  onSubmit: (data: CreateInvestmentTransactionRequest) => Promise<void>
  onCancel?: () => void
  isPending?: boolean
}

export default function InvestmentTransactionForm({
  assetName,
  portfolios,
  onSubmit,
  onCancel,
  isPending,
}: InvestmentTransactionFormProps) {
  const form = useForm<TxFormData>({
    resolver: zodResolver(txSchema) as any,
    defaultValues: {
      type: 'buy',
      quantity: '' as any,
      price_per_unit: '' as any,
      fees: 0,
      portfolio_id: '',
      date: '',
      notes: '',
    },
  })

  const { register, handleSubmit, formState: { errors } } = form

  const handleFormSubmit = async (data: TxFormData) => {
    await onSubmit({
      type: data.type as InvestmentTxType,
      quantity: data.quantity,
      price_per_unit: data.price_per_unit,
      fees: isNaN(data.fees as any) ? 0 : data.fees,
      portfolio_id: data.portfolio_id || null,
      date: data.date || null,
      notes: data.notes || null,
    })
  }

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all'
  const selectClasses = inputClasses

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Registrar transaccion para <span className="font-semibold text-gray-900 dark:text-white">{assetName}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo <span className="text-red-500">*</span></label>
          <select {...register('type')} className={selectClasses}>
            {Object.entries(INVESTMENT_TX_TYPES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cantidad <span className="text-red-500">*</span></label>
          <input type="number" step="0.00000001" min="0" {...register('quantity')} placeholder="ej: 10" className={inputClasses} />
          {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Precio por Unidad <span className="text-red-500">*</span></label>
          <input type="number" step="0.0001" min="0" {...register('price_per_unit')} placeholder="ej: 150.50" className={inputClasses} />
          {errors.price_per_unit && <p className="text-xs text-red-500 mt-1">{errors.price_per_unit.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Comisiones</label>
          <input type="number" step="0.01" min="0" {...register('fees')} placeholder="0.00" className={inputClasses} />
          {errors.fees && <p className="text-xs text-red-500 mt-1">{errors.fees.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Portafolio</label>
          <select {...register('portfolio_id')} className={selectClasses}>
            <option value="">Sin portafolio</option>
            {portfolios.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fecha</label>
          <input type="date" {...register('date')} className={inputClasses} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notas</label>
        <input {...register('notes')} placeholder="Notas opcionales" className={inputClasses} />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all duration-200"
        >
          {isPending ? 'Guardando...' : 'Registrar'}
        </button>
      </div>
    </form>
  )
}
