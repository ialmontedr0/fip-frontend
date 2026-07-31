import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import CategoryPicker from '@/features/categories/components/CategoryPicker'
import type { CreateSubscriptionRequest } from '@/types/expenses'

const schema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  description: z.string().optional().nullable(),
  provider: z.string().optional().nullable(),
  amount: z.string().min(1, 'Monto es requerido'),
  billing_frequency: z.string().min(1, 'Frecuencia es requerida'),
  category_id: z.string().optional().nullable(),
  start_date: z.string().min(1, 'Fecha de inicio es requerida'),
  end_date: z.string().optional().nullable(),
  next_billing_date: z.string().optional().nullable(),
  website_url: z.string().optional().nullable(),
})

type FormData = z.infer<typeof schema>

interface Props {
  onSubmit: (data: CreateSubscriptionRequest) => Promise<void>
  isSubmitting?: boolean
  initialData?: Partial<FormData>
}

export default function SubscriptionForm({ onSubmit, isSubmitting, initialData }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      billing_frequency: 'monthly',
      start_date: new Date().toISOString().slice(0, 10),
      ...initialData,
    },
  })

  const submit = async (data: FormData) => {
    await onSubmit({
      ...data,
      description: data.description || null,
      provider: data.provider || null,
      category_id: data.category_id || null,
      end_date: data.end_date || null,
      next_billing_date: data.next_billing_date || null,
      website_url: data.website_url || null,
    } as CreateSubscriptionRequest)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {initialData ? 'Editar Suscripcion' : 'Nueva Suscripcion'}
      </h3>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Nombre <span className="text-red-400">*</span></label>
        <Input {...register('name')} placeholder="Ej: Netflix" className={cn('rounded-xl', errors.name && 'border-red-400')} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto <span className="text-red-400">*</span></label>
          <Input {...register('amount')} type="number" step="0.01" placeholder="0.00" className={cn('rounded-xl', errors.amount && 'border-red-400')} />
          {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Frecuencia <span className="text-red-400">*</span></label>
          <select {...register('billing_frequency')} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200">
            <option value="monthly">Mensual</option>
            <option value="biweekly">Quincenal</option>
            <option value="weekly">Semanal</option>
            <option value="quarterly">Trimestral</option>
            <option value="bimonthly">Bimestral</option>
            <option value="quadrimensual">Cuatrimestral</option>
            <option value="semestral">Semestral</option>
            <option value="yearly">Anual</option>
          </select>
          {errors.billing_frequency && <p className="text-xs text-red-500">{errors.billing_frequency.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Proveedor</label>
          <Input {...register('provider')} placeholder="Ej: Netflix Inc." className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sitio Web</label>
          <Input {...register('website_url')} type="url" placeholder="https://netflix.com" className="rounded-xl" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Descripcion</label>
        <textarea {...register('description')} rows={2} placeholder="Descripcion de la suscripcion..." className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400 resize-none" />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Categoria</label>
        <CategoryPicker
          value={watch('category_id') || ''}
          onChange={(catId) => setValue('category_id', catId || null)}
          filterType="expense"
          placeholder="Seleccionar categoria..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Inicio <span className="text-red-400">*</span></label>
          <input {...register('start_date')} type="date" className={cn('w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200', errors.start_date && 'border-red-400')} />
          {errors.start_date && <p className="text-xs text-red-500">{errors.start_date.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fin</label>
          <input {...register('end_date')} type="date" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Prox. Facturacion</label>
          <input {...register('next_billing_date')} type="date" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200" />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="rounded-xl">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar Suscripcion'}
      </Button>
    </form>
  )
}
