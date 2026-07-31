import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { CreateCreditCardRequest } from '@/types/expenses'

const schema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  bank_name: z.string().optional().nullable(),
  last_four_digits: z.string().length(4, 'Deben ser 4 digitos').optional().nullable(),
  network: z.string().optional().nullable(),
  credit_limit: z.string().min(1, 'Limite de credito es requerido'),
  currency: z.string().optional(),
  current_balance: z.string().optional().nullable(),
  cutoff_day: z.coerce.number().min(1).max(31).optional().nullable(),
  due_day: z.coerce.number().min(1).max(31).optional().nullable(),
  color: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  onSubmit: (data: CreateCreditCardRequest) => Promise<void>
  isSubmitting?: boolean
  initialData?: Partial<FormData>
}

export default function CreditCardForm({ onSubmit, isSubmitting, initialData }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { currency: 'DOP', is_active: true, ...initialData },
  })

  const submit = async (data: FormData) => {
    await onSubmit({
      name: data.name,
      account_id: '',
      credit_limit: data.credit_limit,
      last_four_digits: data.last_four_digits || null,
      card_network: (data.network || null) as 'visa' | 'mastercard' | 'amex' | 'discover' | 'other' | null | undefined,
      statement_day: data.cutoff_day ?? null,
      payment_due_day: data.due_day ?? null,
      color: data.color || null,
      available_credit: data.current_balance || null,
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {initialData ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Nombre <span className="text-red-400">*</span></label>
          <Input {...register('name')} placeholder="Ej: Visa Personal" className={cn('rounded-xl', errors.name && 'border-red-400')} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Banco</label>
          <Input {...register('bank_name')} placeholder="Ej: Banco Popular" className="rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Ultimos 4 digitos</label>
          <Input {...register('last_four_digits')} maxLength={4} placeholder="1234" className={cn('rounded-xl', errors.last_four_digits && 'border-red-400')} />
          {errors.last_four_digits && <p className="text-xs text-red-500">{errors.last_four_digits.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Red</label>
          <select {...register('network')} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200">
            <option value="">Seleccionar...</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="amex">American Express</option>
            <option value="discover">Discover</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Moneda</label>
          <select {...register('currency')} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200">
            <option value="DOP">DOP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Limite de Credito <span className="text-red-400">*</span></label>
          <Input {...register('credit_limit')} type="number" step="0.01" placeholder="0.00" className={cn('rounded-xl', errors.credit_limit && 'border-red-400')} />
          {errors.credit_limit && <p className="text-xs text-red-500">{errors.credit_limit.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Balance Actual</label>
          <Input {...register('current_balance')} type="number" step="0.01" placeholder="0.00" className="rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Dia de Corte</label>
          <Input {...register('cutoff_day')} type="number" min="1" max="31" placeholder="15" className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Dia de Vencimiento</label>
          <Input {...register('due_day')} type="number" min="1" max="31" placeholder="15" className="rounded-xl" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Color de fondo</label>
        <div className="flex gap-2">
          {['#1e293b', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626'].map((c) => (
            <label key={c} className={cn(
              'flex h-8 w-8 cursor-pointer rounded-full border-2 transition-all',
              'hover:scale-110',
            )} style={{ backgroundColor: c }}>
              <input type="radio" {...register('color')} value={c} className="sr-only" />
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="rounded-xl">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar Tarjeta'}
      </Button>
    </form>
  )
}
