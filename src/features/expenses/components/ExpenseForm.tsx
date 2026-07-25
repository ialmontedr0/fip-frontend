import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, DollarSign, Calendar, FileText, AlertTriangle, Tag } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import AccountPicker from '@/features/accounts/components/AccountPicker'
import CategoryPicker from '@/features/categories/components/CategoryPicker'
import { cn } from '@/lib/utils'
import { PRIORITY_OPTIONS } from '../constants'
import type { CreateExpenseRequest, ExpenseResponse } from '@/types/expenses'

const schema = z.object({
  account_id: z.string().min(1, 'Cuenta es requerida'),
  amount: z.string().min(1, 'Monto es requerido').refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Monto debe ser mayor que 0'),
  currency_code: z.string().optional(),
  description: z.string().min(1, 'Descripcion es requerida').max(500),
  effective_date: z.string().min(1, 'Fecha es requerida'),
  category_id: z.string().optional().nullable(),
  subcategory_id: z.string().optional().nullable(),
  status: z.string().optional(),
  notes: z.string().optional().nullable(),
  source: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'critical']).optional(),
  template_id: z.string().optional().nullable(),
  service_id: z.string().optional().nullable(),
  subscription_id: z.string().optional().nullable(),
  credit_card_id: z.string().optional().nullable(),
})

type FormData = z.infer<typeof schema>

interface Props {
  mode: 'create' | 'edit'
  defaultValues?: ExpenseResponse
  onSubmit: (data: CreateExpenseRequest) => Promise<void>
  isSubmitting?: boolean
}

export default function ExpenseForm({ mode, defaultValues, onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ? {
      account_id: defaultValues.account_id,
      amount: defaultValues.amount,
      currency_code: defaultValues.currency_code,
      description: defaultValues.description,
      effective_date: defaultValues.effective_date || '',
      category_id: defaultValues.category_id,
      notes: defaultValues.notes || '',
      source: defaultValues.source || 'manual',
      priority: defaultValues.priority || 'normal',
    } : {
      currency_code: 'DOP',
      effective_date: new Date().toISOString().split('T')[0],
      source: 'manual',
      priority: 'normal',
    },
  })

  const priority = watch('priority')

  const submit = async (data: FormData) => {
    await onSubmit({
      ...data,
      amount: data.amount,
      notes: data.notes || null,
      category_id: data.category_id || null,
    } as CreateExpenseRequest)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="space-y-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {mode === 'create' ? 'Nuevo Gasto' : 'Editar Gasto'}
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Descripcion <span className="text-red-400">*</span>
          </label>
          <Input
            {...register('description')}
            placeholder="Ej: Supermercado del mes"
            className={cn('rounded-xl', errors.description && 'border-red-400')}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Monto <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                {...register('amount')}
                type="number"
                step="0.01"
                placeholder="0.00"
                className={cn('rounded-xl pl-9', errors.amount && 'border-red-400')}
              />
            </div>
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Fecha <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                {...register('effective_date')}
                type="date"
                max={today}
                className={cn('rounded-xl pl-9', errors.effective_date && 'border-red-400')}
              />
            </div>
            {errors.effective_date && <p className="text-xs text-red-500">{errors.effective_date.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Cuenta <span className="text-red-400">*</span>
          </label>
          <AccountPicker
            value={watch('account_id')}
            onChange={(id) => setValue('account_id', id, { shouldValidate: true })}
          />
          {errors.account_id && <p className="text-xs text-red-500">{errors.account_id.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Categoria
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <CategoryPicker
              value={watch('category_id') || ''}
              onChange={(categoryId) => setValue('category_id', categoryId, { shouldValidate: true })}
              filterType="expense"
              placeholder="Seleccionar categoria..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Prioridad
          </label>
          <div className="flex gap-2">
            {PRIORITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('priority', opt.value as FormData['priority'])}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-medium transition-all flex-1 justify-center',
                  priority === opt.value
                    ? 'border-current bg-current/5 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
                  opt.value === 'critical' ? 'text-red-500' :
                  opt.value === 'high' ? 'text-amber-500' :
                  opt.value === 'normal' ? 'text-blue-500' : 'text-gray-500',
                )}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Notas</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Notas opcionales..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 pl-9 pr-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>

        <input type="hidden" {...register('source')} />
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={isSubmitting} className="rounded-xl min-w-[160px]">
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : mode === 'create' ? (
            'Crear Gasto'
          ) : (
            'Guardar Cambios'
          )}
        </Button>
      </div>
    </form>
  )
}
