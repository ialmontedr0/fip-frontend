import { useState, useMemo, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn, formatCurrency } from '@/lib/utils'
import {
  Calendar, DollarSign, Repeat, Hash, StickyNote, CheckCircle2,
  Search, ChevronDown, FileText,
} from 'lucide-react'
import { Button, Skeleton } from '@/components/ui'
import CategoryPicker from '@/features/categories/components/CategoryPicker'
import { RECURRING_FREQUENCY_CONFIG, TRANSACTION_TYPE_CONFIG } from '../constants'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import { ACCOUNT_TYPE_CONFIG } from '@/features/accounts/constants'
import type { CreateRecurringRequest, RecurringResponse } from '@/types/transactions'
import type { AccountType } from '@/types/accounts'

const recurringSchema = z.object({
  transaction_type: z.enum(['income', 'expense']),
  account_id: z.string().min(1, 'La cuenta es requerida'),
  amount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'El monto debe ser mayor a 0'),
  currency_code: z.string().length(3).default('DOP'),
  description: z.string().min(1, 'La descripcion es requerida').max(500),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.string().default('1'),
  start_date: z.string().min(1, 'La fecha de inicio es requerida'),
  end_date: z.string().optional().or(z.literal('')),
  max_executions: z.string().optional().or(z.literal('')),
  category_id: z.string().optional().or(z.literal('')),
  subcategory_id: z.string().optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
})

interface Props {
  defaultValues?: RecurringResponse
  onSubmit: (data: CreateRecurringRequest) => void
  isLoading?: boolean
  isEdit?: boolean
  className?: string
}

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-2.5 text-sm backdrop-blur-sm transition-all dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-gray-800 placeholder:text-gray-400'

function AccountPicker({ value, onChange, error }: { value: string; onChange: (id: string) => void; error?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useAccounts()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const accounts = data?.accounts || []
  const filtered = useMemo(() => {
    if (!search.trim()) return accounts
    const q = search.toLowerCase()
    return accounts.filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.institution?.toLowerCase().includes(q)
    )
  }, [accounts, search])

  const selected = accounts.find((a) => a.id === value)
  const selectedConfig = selected ? ACCOUNT_TYPE_CONFIG[selected.account_type as AccountType] : null
  const SelectedIcon = selectedConfig?.icon

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-sm backdrop-blur-sm transition-all',
          'bg-white/70 dark:bg-gray-800/70 dark:text-gray-200',
          'border-gray-200 dark:border-gray-700',
          'focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20',
          isOpen && 'border-primary-400 ring-2 ring-primary-500/20',
          error && 'border-red-400 ring-2 ring-red-500/20',
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 flex-1">
            <Skeleton className="h-6 w-6 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ) : selected && selectedConfig ? (
          <>
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', selectedConfig.bgColor)}>
              {SelectedIcon && <SelectedIcon className={cn('h-4 w-4', selectedConfig.color)} />}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selected.name}</p>
              <p className="text-xs text-gray-400">
                {formatCurrency(parseFloat(selected.balance), selected.currency_code)}
              </p>
            </div>
          </>
        ) : (
          <span className="flex-1 text-left text-gray-400">Seleccionar cuenta...</span>
        )}
        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform shrink-0', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-xl backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cuenta..."
              className="w-full rounded-lg border border-gray-200 bg-white/70 py-1.5 pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {isLoading ? (
            <div className="space-y-2 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-400">
              {search ? 'Sin resultados' : 'No hay cuentas disponibles'}
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {filtered.map((account) => {
                const cfg = ACCOUNT_TYPE_CONFIG[account.account_type as AccountType]
                const Icon = cfg?.icon
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => { onChange(account.id); setIsOpen(false) }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all',
                      value === account.id
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                    )}
                  >
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', cfg?.bgColor || 'bg-gray-100')}>
                      {Icon && <Icon className={cn('h-4 w-4', cfg?.color || 'text-gray-500')} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{account.name}</p>
                      {account.institution && (
                        <p className="text-xs text-gray-400 truncate">{account.institution}</p>
                      )}
                    </div>
                    <span className={cn(
                      'text-xs font-medium tabular-nums shrink-0',
                      parseFloat(account.balance) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500',
                    )}>
                      {formatCurrency(parseFloat(account.balance), account.currency_code)}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function RecurringForm({ defaultValues, onSubmit, isLoading, isEdit, className }: Props) {
  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recurringSchema) as any,
    defaultValues: defaultValues ? {
      transaction_type: defaultValues.transaction_type as 'income' | 'expense',
      account_id: '',
      amount: parseFloat(defaultValues.amount).toString(),
      currency_code: defaultValues.currency_code,
      description: defaultValues.description,
      frequency: defaultValues.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
      interval: defaultValues.interval.toString(),
      start_date: defaultValues.start_date,
      end_date: defaultValues.end_date || '',
      max_executions: defaultValues.max_executions?.toString() || '',
      category_id: '',
      subcategory_id: '',
      notes: '',
    } : {
      transaction_type: 'expense',
      account_id: '',
      amount: '',
      currency_code: 'DOP',
      description: '',
      frequency: 'monthly',
      interval: '1',
      start_date: new Date().toISOString().slice(0, 10),
      end_date: '',
      max_executions: '',
      category_id: '',
      subcategory_id: '',
      notes: '',
    },
  })

  const transactionType = watch('transaction_type')

  const handleFormSubmit = (data: Record<string, unknown>) => {
    onSubmit({
      ...data,
      currency_code: data.currency_code || 'DOP',
      account_id: data.account_id,
      amount: Number(data.amount),
      interval: Number(data.interval),
      start_date: data.start_date,
      max_executions: data.max_executions ? Number(data.max_executions) : null,
      end_date: data.end_date || null,
      category_id: data.category_id || null,
      subcategory_id: data.subcategory_id || null,
      notes: data.notes || null,
    } as unknown as CreateRecurringRequest)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn('space-y-8', className)}>
      {/* Tipo */}
      {!isEdit && (
        <div>
          <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Tipo de Transaccion Recurrente
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['income', 'expense'] as const).map((type) => {
              const isSelected = transactionType === type
              const config = TRANSACTION_TYPE_CONFIG[type]
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue('transaction_type', type)}
                  className={cn(
                    'group relative flex items-center gap-3 overflow-hidden rounded-xl border-2 p-4 transition-all duration-200',
                    isSelected
                      ? `${config.bgColor} ${config.color} border-current shadow-lg`
                      : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/80 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800/80',
                  )}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-current/5 to-transparent" />
                  )}
                  <config.icon className="h-6 w-6" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{config.label}</p>
                    <p className="text-xs opacity-70">Recurrente</p>
                  </div>
                  {isSelected && <CheckCircle2 className="h-5 w-5 ml-auto shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Cuenta */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Cuenta <span className="text-red-400">*</span>
        </label>
        <AccountPicker
          value={watch('account_id')}
          onChange={(id) => setValue('account_id', id, { shouldValidate: true })}
          error={errors.account_id?.message}
        />
      </div>

      {/* Monto y Fecha */}
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Configuracion del Patron
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Monto <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input {...register('amount')} type="number" step="0.01" min="0.01" placeholder="0.00"
                className={cn(inputClass, 'pl-9')} />
            </div>
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha de Inicio <span className="text-red-400">*</span>
            </label>
            <input {...register('start_date')} type="date" className={inputClass} />
            {errors.start_date && <p className="text-xs text-red-500">{errors.start_date.message}</p>}
          </div>
        </div>
      </div>

      {/* Descripcion */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Descripcion <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          <input {...register('description')} type="text" placeholder="ej. Pago de renta mensual"
            className={cn(inputClass, 'pl-9')} />
        </div>
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Frecuencia, Intervalo, Max Ejecuciones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Repeat className="h-3.5 w-3.5" /> Frecuencia
          </label>
          <select {...register('frequency')} className={inputClass}>
            {Object.entries(RECURRING_FREQUENCY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Hash className="h-3.5 w-3.5" /> Intervalo
          </label>
          <input {...register('interval')} type="number" min="1" placeholder="1" className={inputClass} />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Hash className="h-3.5 w-3.5" /> Max. Ejecuciones
          </label>
          <input {...register('max_executions')} type="number" min="1" placeholder="Sin limite" className={inputClass} />
        </div>
      </div>

      {/* Fecha de Fin y Categoria */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Calendar className="h-3.5 w-3.5" /> Fecha de Fin
          </label>
          <input {...register('end_date')} type="date" className={inputClass} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Categoria
          </label>
          <CategoryPicker
            value={watch('subcategory_id') || watch('category_id') || ''}
            onChange={(catId, subId) => {
              setValue('category_id', catId || '')
              setValue('subcategory_id', subId || '')
            }}
            filterType={transactionType as 'income' | 'expense'}
            placeholder="Seleccionar categoria..."
          />
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          <StickyNote className="h-3.5 w-3.5" /> Notas
        </label>
        <textarea {...register('notes')} rows={2} placeholder="Notas..."
          className={cn(inputClass, 'resize-none')} />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isLoading} className="flex-1 rounded-xl shadow-lg shadow-primary-500/20 h-11">
          <Repeat className="h-4 w-4 mr-2" />
          {isEdit ? 'Guardar Cambios' : 'Crear Patron Recurrente'}
        </Button>
      </div>
    </form>
  )
}
