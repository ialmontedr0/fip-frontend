import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon } from 'lucide-react'
import {
  INSURANCE_TYPES, INSURANCE_STATUSES, PREMIUM_FREQUENCIES,
  type InsuranceType, type InsuranceStatus, type PremiumFrequency,
} from '@/types/insurance'
import type { CreateInsuranceRequest, InsuranceDetail } from '@/types/insurance'

const insuranceSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(200),
  type: z.string().default('other'),
  provider: z.string().max(200).optional().or(z.literal('')),
  policy_number: z.string().max(100).optional().or(z.literal('')),
  status: z.string().default('active'),
  start_date: z.string().min(1, 'Fecha de inicio requerida'),
  end_date: z.string().optional().or(z.literal('')),
  coverage_amount: z.coerce.number().min(0).optional().or(z.nan()),
  premium_amount: z.coerce.number().positive('Prima debe ser > 0'),
  premium_frequency: z.string().default('monthly'),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

type InsuranceFormData = z.infer<typeof insuranceSchema>

interface InsuranceFormProps {
  initialData?: InsuranceDetail
  onSubmit: (data: CreateInsuranceRequest) => Promise<void>
  onCancel?: () => void
  isPending?: boolean
}

export default function InsuranceForm({ initialData, onSubmit, onCancel, isPending }: InsuranceFormProps) {
  const form = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'other',
      provider: initialData?.provider || '',
      policy_number: initialData?.policy_number || '',
      status: initialData?.status || 'active',
      start_date: initialData?.start_date || '',
      end_date: initialData?.end_date || '',
      coverage_amount: initialData?.coverage_amount ?? ('' as any),
      premium_amount: initialData?.premium_amount || 0,
      premium_frequency: initialData?.premium_frequency || 'monthly',
      notes: initialData?.notes || '',
    },
  })

  const { register, handleSubmit, formState: { errors } } = form

  const handleFormSubmit = async (data: InsuranceFormData) => {
    await onSubmit({
      name: data.name,
      type: data.type as InsuranceType,
      provider: data.provider || null,
      policy_number: data.policy_number || null,
      status: data.status as InsuranceStatus,
      start_date: data.start_date,
      end_date: data.end_date || null,
      coverage_amount: isNaN(data.coverage_amount as any) ? null : data.coverage_amount,
      premium_amount: data.premium_amount,
      premium_frequency: data.premium_frequency as PremiumFrequency,
      notes: data.notes || null,
    })
  }

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all'
  const selectClasses = inputClasses

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Informacion Basica</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            placeholder="ej: Seguro medico SaludArs"
            className={inputClasses}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo <span className="text-red-500">*</span></label>
            <select {...register('type')} className={selectClasses}>
              {Object.entries(INSURANCE_TYPES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Estado</label>
            <select {...register('status')} className={selectClasses}>
              {Object.entries(INSURANCE_STATUSES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Frecuencia <span className="text-red-500">*</span></label>
            <select {...register('premium_frequency')} className={selectClasses}>
              {Object.entries(PREMIUM_FREQUENCIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Proveedor</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Proveedor</label>
            <input
              {...register('provider')}
              placeholder="ej: MetLife, ARS, aseguradora"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Numero de Poliza</label>
            <input
              {...register('policy_number')}
              placeholder="Opcional"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Cobertura y Primas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Cobertura
            </label>
            <input
              {...register('coverage_amount')}
              type="number"
              step="0.01"
              min="0"
              placeholder="Opcional"
              className={inputClasses}
            />
            {errors.coverage_amount && <p className="text-xs text-red-500 mt-1">{errors.coverage_amount.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Monto de la Prima <span className="text-red-500">*</span>
            </label>
            <input
              {...register('premium_amount')}
              type="number"
              step="0.01"
              min="0"
              placeholder="1500.00"
              className={inputClasses}
            />
            {errors.premium_amount && <p className="text-xs text-red-500 mt-1">{errors.premium_amount.message}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Vigencia</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Fecha de Inicio <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('start_date')}
                type="date"
                className={inputClasses}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fecha de Fin</label>
            <div className="relative">
              <input
                {...register('end_date')}
                type="date"
                className={inputClasses}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notas Adicionales</h4>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Notas opcionales sobre el seguro..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all resize-none"
        />
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
          ) : initialData ? 'Guardar Cambios' : 'Crear Seguro'}
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
