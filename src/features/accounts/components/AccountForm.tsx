import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { AccountType } from '@/types/accounts'
import { ACCOUNT_TYPE_CONFIG as AT, SUPPORTED_CURRENCIES } from '@/features/accounts/constants'

const accountSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  account_type: z.enum(['bank', 'cash', 'savings', 'checking', 'wallet', 'crypto']),
  currency_code: z.string().length(3),
  initial_balance: z.string().refine(
    (v) => v === '' || !isNaN(Number(v)),
    'Debe ser un numero valido',
  ),
  institution: z.string().max(200).optional().or(z.literal('')),
  account_number_last4: z.string().max(4).optional().or(z.literal('')),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un hex valido (#RRGGBB)').optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
  include_in_net_worth: z.boolean(),
  include_in_totals: z.boolean(),
})

export type AccountFormData = z.infer<typeof accountSchema>

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#06b6d4', '#84cc16', '#a855f7', '#e11d48',
]

interface Props {
  defaultValues?: Partial<AccountFormData>
  onSubmit: (data: AccountFormData) => Promise<void>
  isSubmitting: boolean
  mode: 'create' | 'edit'
}

export default function AccountForm({ defaultValues, onSubmit, isSubmitting, mode }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      account_type: 'bank',
      currency_code: 'DOP',
      initial_balance: '0',
      include_in_net_worth: true,
      include_in_totals: true,
      ...defaultValues,
    },
  })

  const selectedType = watch('account_type') as AccountType
  const selectedColor = watch('color')

  const inputClass = 'w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-2.5 text-sm backdrop-blur-sm transition-all dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-gray-800 placeholder:text-gray-400'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Tipo de Cuenta */}
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Tipo de Cuenta
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(Object.entries(AT) as [AccountType, typeof AT[AccountType]][]).map(([type, config]) => {
            const Icon = config.icon
            const isSelected = selectedType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => setValue('account_type', type)}
                className={cn(
                  'group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border-2 p-4 transition-all duration-200',
                  isSelected
                    ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/50 shadow-md dark:from-primary-500/20 dark:to-primary-500/5'
                    : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/80 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800/80',
                )}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
                )}
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-200',
                  isSelected ? 'scale-110' : 'group-hover:scale-105',
                  isSelected ? config.bgColor : 'bg-gray-100 dark:bg-gray-700',
                )}>
                  <Icon className={cn('h-4 w-4', isSelected ? config.color : 'text-gray-400')} />
                </div>
                <span className={cn(
                  'text-xs font-medium transition-colors',
                  isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400',
                )}>
                  {config.label}
                </span>
              </button>
            )
          })}
        </div>
        {errors.account_type && (
          <p className="mt-1.5 text-xs text-red-500">{errors.account_type.message}</p>
        )}
      </div>

      {/* Nombre */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Nombre de la Cuenta
        </label>
        <Input
          {...register('name')}
          placeholder="Ej: Cuenta de Nomina"
          error={errors.name?.message}
          className={inputClass}
        />
      </div>

      {/* Moneda y Balance Inicial */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Moneda
          </label>
          <select
            {...register('currency_code')}
            className={inputClass}
          >
            {Object.entries(SUPPORTED_CURRENCIES).map(([code, name]) => (
              <option key={code} value={code}>{code} - {name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Balance Inicial
          </label>
          <Input
            {...register('initial_balance')}
            type="text"
            placeholder="0.00"
            error={errors.initial_balance?.message}
            className={inputClass}
          />
        </div>
      </div>

      {/* Institucion y Ultimos 4 Digitos */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Institucion
          </label>
          <Input
            {...register('institution')}
            placeholder="Ej: Banco Popular"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Ultimos 4 Digitos
          </label>
          <Input
            {...register('account_number_last4')}
            placeholder="1234"
            maxLength={4}
            className={inputClass}
          />
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', selectedColor === color ? '' : color)}
              className={cn(
                'relative h-9 w-9 rounded-full transition-all duration-200',
                'hover:scale-110 hover:ring-2 hover:ring-gray-400',
                selectedColor === color && 'ring-2 ring-primary-500 scale-110 shadow-lg',
              )}
              style={{ backgroundColor: color }}
              title={color}
            >
              {selectedColor === color && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-white/80" />
                </span>
              )}
            </button>
          ))}
          <div className="relative">
            <input
              type="color"
              value={selectedColor || '#3b82f6'}
              onChange={(e) => setValue('color', e.target.value)}
              className="h-9 w-9 cursor-pointer rounded-full border-0 p-0"
            />
          </div>
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Notas
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className={inputClass + ' resize-none'}
          placeholder="Notas opcionales sobre esta cuenta..."
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-6 rounded-xl bg-gray-50/50 p-4 dark:bg-gray-800/50">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            {...register('include_in_net_worth')}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">Incluir en Patrimonio Neto</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            {...register('include_in_totals')}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">Incluir en Totales</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {mode === 'create' ? 'Creando...' : 'Guardando...'}
            </span>
          ) : mode === 'create' ? 'Crear Cuenta' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}
