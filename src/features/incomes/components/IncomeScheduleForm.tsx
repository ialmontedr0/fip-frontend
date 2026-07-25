import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button, Input } from '@/components/ui'
import AccountPicker from '@/features/accounts/components/AccountPicker'
import IncomeSourcePicker from './IncomeSourcePicker'
import { FREQUENCY_OPTIONS } from '../constants'
import { Save } from 'lucide-react'
import type { CreateScheduleRequest, UpdateScheduleRequest } from '@/types/incomes'

const scheduleSchema = z.object({
  description: z.string().min(1, 'Descripcion es requerida').max(500),
  amount: z.string().min(1, 'Monto es requerido'),
  account_id: z.string().min(1, 'Cuenta es requerida'),
  expected_date: z.string().min(1, 'Fecha esperada es requerida'),
  income_source_id: z.string().optional().nullable(),
  currency_code: z.string().default('DOP'),
  frequency: z.string().optional().nullable(),
  projection_method: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

type FormValues = z.input<typeof scheduleSchema>

interface Props {
  defaultValues?: Partial<FormValues>
  onSubmit: (data: CreateScheduleRequest | UpdateScheduleRequest) => void
  onCancel?: () => void
  isSubmitting?: boolean
  mode?: 'create' | 'edit'
  className?: string
}

export default function IncomeScheduleForm({ defaultValues, onSubmit, onCancel, isSubmitting, mode = 'create', className }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      currency_code: 'DOP',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
      <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Programacion de Ingreso</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripcion *</label>
            <Input
              placeholder="Descripcion del ingreso programado"
              {...register('description')}
              className={cn(errors.description && 'border-red-500')}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto *</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount')}
              className={cn(errors.amount && 'border-red-500')}
            />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cuenta *</label>
            <AccountPicker
              value={watch('account_id') || ''}
              onChange={(id: string) => setValue('account_id', id)}
              error={errors.account_id?.message}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Esperada *</label>
            <Input
              type="date"
              {...register('expected_date')}
              className={cn(errors.expected_date && 'border-red-500')}
            />
            {errors.expected_date && <p className="text-xs text-red-500">{errors.expected_date.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fuente de Ingreso</label>
            <IncomeSourcePicker
              value={watch('income_source_id') || ''}
              onChange={(id: string) => setValue('income_source_id', id || null)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Moneda</label>
            <select
              {...register('currency_code')}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="DOP">DOP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frecuencia</label>
            <select
              {...register('frequency')}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Unico</option>
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Metodo de Proyeccion</label>
            <select
              {...register('projection_method')}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Manual</option>
              <option value="average">Promedio</option>
              <option value="last_value">Ultimo Valor</option>
              <option value="trend">Tendencia</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notas</label>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Notas adicionales..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="rounded-xl">
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear Programacion' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}
