import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import AccountPicker from '@/features/accounts/components/AccountPicker'
import { cn } from '@/lib/utils'
import type { CreateTemplateRequest } from '@/types/expenses'

const schema = z.object({
  name: z.string().min(1, 'Nombre es requerido').max(200),
  description: z.string().min(1, 'Descripcion es requerida'),
  default_amount: z.number().optional().nullable(),
  default_currency: z.string().optional(),
  default_account_id: z.string().optional().nullable(),
  default_category_id: z.string().optional().nullable(),
  default_notes: z.string().optional().nullable(),
  default_frequency: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
})

type FormData = z.infer<typeof schema>

interface Props {
  onSubmit: (data: CreateTemplateRequest) => Promise<void>
  isSubmitting?: boolean
}

export default function TemplateForm({ onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { default_currency: 'DOP' },
  })

  const selectedAccountId = watch('default_account_id')

  const submit = async (data: FormData) => {
    await onSubmit({
      name: data.name,
      description: data.description,
      default_amount: (typeof data.default_amount === 'number' && !Number.isNaN(data.default_amount)) ? data.default_amount : null,
      default_currency: data.default_currency,
      default_account_id: data.default_account_id || null,
      default_notes: data.default_notes || null,
      default_frequency: data.default_frequency || null,
    } as CreateTemplateRequest)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Nueva Plantilla</h3>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Nombre <span className="text-red-400">*</span></label>
        <Input {...register('name')} placeholder="Ej: Supermercado" className={cn('rounded-xl', errors.name && 'border-red-400')} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Descripcion <span className="text-red-400">*</span></label>
        <textarea
          {...register('description')}
          rows={2}
          placeholder="Descripcion de la plantilla..."
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400 resize-none"
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto por defecto</label>
          <Input {...register('default_amount', { valueAsNumber: true })} type="number" step="0.01" placeholder="0.00" className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Moneda</label>
          <select {...register('default_currency')} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200">
            <option value="DOP">DOP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cuenta por defecto</label>
        <AccountPicker
          value={selectedAccountId || ''}
          onChange={(id) => setValue('default_account_id', id, { shouldDirty: true })}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="rounded-xl">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear Plantilla'}
      </Button>
    </form>
  )
}
