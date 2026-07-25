import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button, Input } from '@/components/ui'
import AccountPicker from '@/features/accounts/components/AccountPicker'
import CategoryPicker from '@/features/categories/components/CategoryPicker'
import { INCOME_TYPE_CONFIG, STABILITY_CONFIG, FREQUENCY_OPTIONS } from '../constants'
import { Save } from 'lucide-react'
import type { CreateSourceRequest, UpdateSourceRequest } from '@/types/incomes'

const sourceSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido').max(200),
  income_type: z.string().default('salary'),
  stability: z.string().default('fixed'),
  description: z.string().optional().nullable(),
  tax_id: z.string().optional().nullable(),
  default_amount: z.string().optional().nullable(),
  default_account_id: z.string().optional().nullable(),
  default_category_id: z.string().optional().nullable(),
  frequency: z.string().optional().nullable(),
  pay_day: z.number().min(1).max(31).optional().nullable(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
})

type FormValues = z.input<typeof sourceSchema>

interface Props {
  defaultValues?: Partial<FormValues>
  onSubmit: (data: CreateSourceRequest | UpdateSourceRequest) => void
  onCancel?: () => void
  isSubmitting?: boolean
  mode?: 'create' | 'edit'
  className?: string
}

const ICON_OPTIONS = [
  { value: 'briefcase', label: 'Maletin' },
  { value: 'code', label: 'Codigo' },
  { value: 'store', label: 'Tienda' },
  { value: 'trending-up', label: 'Tendencia' },
  { value: 'home', label: 'Hogar' },
  { value: 'heart', label: 'Corazon' },
  { value: 'building', label: 'Edificio' },
  { value: 'gift', label: 'Regalo' },
]

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { value: 'purple', label: 'Purpura', class: 'bg-purple-500' },
  { value: 'amber', label: 'Ambar', class: 'bg-amber-500' },
  { value: 'emerald', label: 'Esmeralda', class: 'bg-emerald-500' },
  { value: 'cyan', label: 'Cian', class: 'bg-cyan-500' },
  { value: 'rose', label: 'Rosa', class: 'bg-rose-500' },
  { value: 'slate', label: 'Gris', class: 'bg-slate-500' },
  { value: 'pink', label: 'Rosa', class: 'bg-pink-500' },
]

export default function IncomeSourceForm({ defaultValues, onSubmit, onCancel, isSubmitting, mode = 'create', className }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      income_type: 'salary',
      stability: 'fixed',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
      <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Informacion de la Fuente</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre *</label>
            <Input
              placeholder="Nombre de la fuente"
              {...register('name')}
              className={cn(errors.name && 'border-red-500')}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Ingreso</label>
            <select
              {...register('income_type')}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            >
              {Object.entries(INCOME_TYPE_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estabilidad</label>
            <select
              {...register('stability')}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            >
              {Object.entries(STABILITY_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripcion</label>
            <Input placeholder="Descripcion opcional" {...register('description')} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RNC (Si aplica)</label>
            <Input placeholder="000-0000000-0" {...register('tax_id')} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto</label>
            <Input type="number" step="0.01" placeholder="0.00" {...register('default_amount')} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cuenta por defecto</label>
            <AccountPicker
              value={watch('default_account_id') || ''}
              onChange={(id: string) => setValue('default_account_id', id || null)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria por defecto</label>
            <CategoryPicker
              value={watch('default_category_id') || ''}
              onChange={(id: string) => setValue('default_category_id', id || null)}
              filterType="income"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frecuencia</label>
            <select
              {...register('frequency')}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Sin frecuencia</option>
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dia de Pago</label>
            <Input type="number" min={1} max={31} placeholder="1-31" {...register('pay_day', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icono</label>
            <select
              {...register('icon')}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Sin icono</option>
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue('color', opt.value)}
                  className={cn('h-8 w-8 rounded-full transition-all', opt.class, watch('color') === opt.value && 'ring-2 ring-offset-2 ring-gray-400')}
                />
              ))}
            </div>
          </div>
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
          {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear Fuente' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}
