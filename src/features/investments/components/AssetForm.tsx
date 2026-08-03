import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ASSET_TYPES, type AssetType } from '@/types/investment'
import type { CreateAssetRequest } from '@/types/investment'

const assetSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(200),
  symbol: z.string().max(20).optional().or(z.literal('')),
  asset_type: z.string().default('stock'),
  currency: z.string().min(3, 'Codigo de moneda requerido').max(3),
  current_price: z.coerce.number().min(0).optional().or(z.nan()),
})

type AssetFormData = z.infer<typeof assetSchema>

interface AssetFormProps {
  onSubmit: (data: CreateAssetRequest) => Promise<void>
  onCancel?: () => void
  isPending?: boolean
}

export default function AssetForm({ onSubmit, onCancel, isPending }: AssetFormProps) {
  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema) as any,
    defaultValues: {
      name: '',
      symbol: '',
      asset_type: 'stock',
      currency: 'USD',
      current_price: '' as any,
    },
  })

  const { register, handleSubmit, formState: { errors } } = form

  const handleFormSubmit = async (data: AssetFormData) => {
    await onSubmit({
      name: data.name,
      symbol: data.symbol || null,
      asset_type: data.asset_type as AssetType,
      currency: data.currency.toUpperCase(),
      current_price: isNaN(data.current_price as any) ? null : data.current_price,
    })
  }

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all'
  const selectClasses = inputClasses

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Nombre del Activo <span className="text-red-500">*</span>
        </label>
        <input {...register('name')} placeholder="ej: Apple Inc." className={inputClasses} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Simbolo</label>
          <input {...register('symbol')} placeholder="ej: AAPL" className={inputClasses} />
          {errors.symbol && <p className="text-xs text-red-500 mt-1">{errors.symbol.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo de Activo <span className="text-red-500">*</span></label>
          <select {...register('asset_type')} className={selectClasses}>
            {Object.entries(ASSET_TYPES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Moneda <span className="text-red-500">*</span></label>
          <input {...register('currency')} placeholder="USD" className={inputClasses} />
          {errors.currency && <p className="text-xs text-red-500 mt-1">{errors.currency.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Precio Actual</label>
          <input type="number" step="0.0001" min="0" {...register('current_price')} placeholder="0.00" className={inputClasses} />
          {errors.current_price && <p className="text-xs text-red-500 mt-1">{errors.current_price.message}</p>}
        </div>
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
          {isPending ? 'Guardando...' : 'Crear Activo'}
        </button>
      </div>
    </form>
  )
}
