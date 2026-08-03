import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CreatePortfolioRequest } from '@/types/investment'

const portfolioSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(200),
  description: z.string().max(1000).optional().or(z.literal('')),
})

type PortfolioFormData = z.infer<typeof portfolioSchema>

interface PortfolioFormProps {
  onSubmit: (data: CreatePortfolioRequest) => Promise<void>
  onCancel?: () => void
  isPending?: boolean
}

export default function PortfolioForm({ onSubmit, onCancel, isPending }: PortfolioFormProps) {
  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema) as any,
    defaultValues: { name: '', description: '' },
  })

  const { register, handleSubmit, formState: { errors } } = form

  const handleFormSubmit = async (data: PortfolioFormData) => {
    await onSubmit({
      name: data.name,
      description: data.description || null,
    })
  }

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all'

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Nombre del Portafolio <span className="text-red-500">*</span>
        </label>
        <input {...register('name')} placeholder="ej: Portafolio de Largo Plazo" className={inputClasses} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descripcion</label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Objetivo, estrategia, horizonte..."
          className={`${inputClasses} resize-none`}
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
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
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 disabled:opacity-50 transition-all duration-200"
        >
          {isPending ? 'Guardando...' : 'Crear Portafolio'}
        </button>
      </div>
    </form>
  )
}
