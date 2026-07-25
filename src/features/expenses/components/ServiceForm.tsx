import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { CreateServiceRequest } from '@/types/expenses'

const schema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  service_type: z.string().min(1, 'Tipo de servicio es requerido'),
  provider: z.string().optional().nullable(),
  estimated_amount: z.string().optional().nullable(),
  due_day: z.coerce.number().min(1).max(31).optional().nullable(),
  account_number: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  onSubmit: (data: CreateServiceRequest) => Promise<void>
  isSubmitting?: boolean
  initialData?: Partial<FormData>
}

export default function ServiceForm({ onSubmit, isSubmitting, initialData }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { is_active: true, ...initialData },
  })

  const submit = async (data: FormData) => {
    await onSubmit({
      ...data,
      provider: data.provider || null,
      estimated_amount: data.estimated_amount || null,
      due_day: data.due_day ?? null,
      account_number: data.account_number || null,
      notes: data.notes || null,
    } as unknown as CreateServiceRequest)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {initialData ? 'Editar Servicio' : 'Nuevo Servicio'}
      </h3>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Nombre <span className="text-red-400">*</span></label>
        <Input {...register('name')} placeholder="Ej: Electricidad" className={cn('rounded-xl', errors.name && 'border-red-400')} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tipo <span className="text-red-400">*</span></label>
        <select {...register('service_type')} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200">
          <option value="">Seleccionar tipo...</option>
          <option value="electricity">Electricidad</option>
          <option value="water">Agua</option>
          <option value="internet">Internet</option>
          <option value="phone">Telefono</option>
          <option value="gas">Gas</option>
          <option value="insurance">Seguro</option>
          <option value="maintenance">Mantenimiento</option>
          <option value="other">Otro</option>
        </select>
        {errors.service_type && <p className="text-xs text-red-500">{errors.service_type.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Proveedor</label>
          <Input {...register('provider')} placeholder="Ej: Edenorte" className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto Estimado</label>
          <Input {...register('estimated_amount')} type="number" step="0.01" placeholder="0.00" className="rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Dia de Vencimiento</label>
          <Input {...register('due_day')} type="number" min="1" max="31" placeholder="15" className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">No. Cuenta / Contrato</label>
          <Input {...register('account_number')} placeholder="Ej: 123-456" className="rounded-xl" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Notas</label>
        <textarea {...register('notes')} rows={2} placeholder="Notas adicionales..." className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400 resize-none" />
      </div>

      <Button type="submit" disabled={isSubmitting} className="rounded-xl">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar Servicio'}
      </Button>
    </form>
  )
}
