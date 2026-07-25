import { useState, useMemo, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn, formatCurrency } from '@/lib/utils'
import {
  TrendingUp, TrendingDown, Scale,
  Calendar, DollarSign, FileText, StickyNote,
  CheckCircle2, ChevronDown, Search,
} from 'lucide-react'
import { Button, Skeleton } from '@/components/ui'
import TagInput from './TagInput'
import CategoryPicker from '@/features/categories/components/CategoryPicker'
import { TRANSACTION_TYPE_CONFIG } from '../constants'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import { ACCOUNT_TYPE_CONFIG } from '@/features/accounts/constants'
import type { TransactionType, CreateTransactionRequest, TransactionResponse } from '@/types/transactions'
import type { AccountType } from '@/types/accounts'

const transactionSchema = z.object({
  transaction_type: z.enum(['income', 'expense', 'adjustment']),
  account_id: z.string().min(1, 'La cuenta es requerida'),
  amount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'El monto debe ser mayor a 0'),
  currency_code: z.string().length(3).default('DOP'),
  description: z.string().min(1, 'La descripcion es requerida').max(500),
  effective_date: z.string().min(1, 'La fecha es requerida'),
  category_id: z.string().optional().or(z.literal('')),
  subcategory_id: z.string().optional().or(z.literal('')),
  status: z.string().default('completed'),
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  adjustment_operation: z.enum(['add', 'subtract']).optional(),
})

interface Props {
  defaultValues?: TransactionResponse
  onSubmit: (data: CreateTransactionRequest) => void
  isLoading?: boolean
  isEdit?: boolean
  className?: string
}

const TYPE_OPTIONS: Array<{ value: TransactionType; icon: typeof TrendingUp; label: string; desc: string }> = [
  { value: 'income', icon: TrendingUp, label: 'Ingreso', desc: 'Dinero que recibes' },
  { value: 'expense', icon: TrendingDown, label: 'Gasto', desc: 'Dinero que gastas' },
  { value: 'adjustment', icon: Scale, label: 'Ajuste', desc: 'Correccion de saldo' },
]

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
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', selectedConfig.bgColor)}>
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

export default function TransactionForm({ defaultValues, onSubmit, isLoading, isEdit, className }: Props) {
  const {
    register, handleSubmit, watch, setValue, formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: defaultValues ? {
      transaction_type: defaultValues.transaction_type as TransactionType,
      account_id: defaultValues.account_id,
      amount: parseFloat(defaultValues.amount).toString(),
      currency_code: defaultValues.currency_code,
      description: defaultValues.description,
      effective_date: defaultValues.effective_date || new Date().toISOString().slice(0, 10),
      category_id: defaultValues.category_id || '',
      subcategory_id: defaultValues.subcategory_id || '',
      status: defaultValues.status,
      notes: defaultValues.notes || '',
      tags: defaultValues.tags || [],
      adjustment_operation: (defaultValues as any).adjustment_operation || 'subtract',
    } : {
      transaction_type: 'expense',
      account_id: '',
      amount: '',
      currency_code: 'DOP',
      description: '',
      effective_date: new Date().toISOString().slice(0, 10),
      category_id: '',
      subcategory_id: '',
      status: 'completed',
      notes: '',
      tags: [],
      adjustment_operation: 'subtract',
    },
  })

  const transactionType = watch('transaction_type')
  const adjustmentOp = watch('adjustment_operation')
  const tags = watch('tags') || []

  const handleFormSubmit = (data: Record<string, unknown>) => {
    const payload: Record<string, unknown> = {
      ...data,
      currency_code: data.currency_code || 'DOP',
      amount: Number(data.amount),
      category_id: data.category_id || null,
      subcategory_id: data.subcategory_id || null,
      notes: data.notes || null,
    }
    if (transactionType === 'adjustment') {
      payload.adjustment_operation = data.adjustment_operation || 'subtract'
    } else {
      delete payload.adjustment_operation
    }
    if (isEdit) {
      delete payload.tags
    } else {
      payload.tags = data.tags || null
    }
    onSubmit(payload as unknown as CreateTransactionRequest)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn('space-y-8', className)}>
      {/* Tipo de Transaccion */}
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Tipo de Transaccion
        </label>
        <div className="grid grid-cols-3 gap-3">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isSelected = transactionType === opt.value
            const config = TRANSACTION_TYPE_CONFIG[opt.value]
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('transaction_type', opt.value)}
                className={cn(
                  'group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border-2 p-4 transition-all duration-200',
                  isSelected
                    ? `${config.bgColor} ${config.color} border-current shadow-lg scale-[1.02]`
                    : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/80 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800/80',
                )}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-current/5 to-transparent" />
                )}
                <Icon className="h-6 w-6" />
                <span className="text-xs font-semibold">{opt.label}</span>
                <span className="text-[10px] opacity-70">{opt.desc}</span>
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-current flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
        {errors.transaction_type && (
          <p className="mt-1.5 text-xs text-red-500">{errors.transaction_type.message}</p>
        )}
      </div>

      {transactionType === 'adjustment' && (
        <div className="animate-fade-in">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Tipo de Ajuste
          </label>
          <div className="flex gap-2">
            {[
              { value: 'subtract', label: 'Restar del balance', icon: TrendingDown, color: 'text-red-500' },
              { value: 'add', label: 'Sumar al balance', icon: TrendingUp, color: 'text-emerald-500' },
            ].map((opt) => {
              const isSelected = (adjustmentOp || 'subtract') === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue('adjustment_operation', opt.value as 'add' | 'subtract')}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all flex-1 justify-center',
                    isSelected
                      ? 'border-current bg-current/5 shadow-sm scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-white/50 dark:hover:border-gray-600',
                    opt.color,
                  )}
                >
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
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
          Detalles de la Transaccion
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Monto <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('amount')}
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={cn(inputClass, 'pl-9')}
              />
            </div>
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha Efectiva <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                {...register('effective_date')}
                type="date"
                className={cn(inputClass, 'pl-9')}
              />
            </div>
            {errors.effective_date && <p className="text-xs text-red-500">{errors.effective_date.message}</p>}
          </div>
        </div>
      </div>

      {/* Moneda y Estado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Moneda
          </label>
          <select {...register('currency_code')} className={inputClass}>
            <option value="DOP">DOP — Peso Dominicano</option>
            <option value="USD">USD — Dolar Estadounidense</option>
            <option value="EUR">EUR — Euro</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Estado
          </label>
          <select {...register('status')} className={inputClass}>
            <option value="completed">Completada</option>
            <option value="pending">Pendiente</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Descripcion */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Descripcion <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            {...register('description')}
            type="text"
            placeholder="ej. Pago de nomina, Compra en supermercado..."
            className={cn(inputClass, 'pl-9')}
          />
        </div>
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Categoria */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Categoria
        </label>
        <CategoryPicker
          value={watch('subcategory_id') || watch('category_id') || ''}
          onChange={(catId, subId) => {
            setValue('category_id', catId || '')
            setValue('subcategory_id', subId || '')
          }}
          filterType={transactionType === 'adjustment' ? undefined : transactionType as 'income' | 'expense'}
          placeholder="Seleccionar categoria..."
        />
      </div>

      {/* Etiquetas */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Etiquetas
        </label>
        <TagInput
          value={tags}
          onChange={(newTags) => setValue('tags', newTags)}
          placeholder="Agregar etiqueta y presiona Enter..."
        />
      </div>

      {/* Notas */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Notas
        </label>
        <div className="relative">
          <StickyNote className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Notas adicionales..."
            className={cn(inputClass, 'pl-9 resize-none')}
          />
        </div>
        {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          className="flex-1 rounded-xl shadow-lg shadow-primary-500/20 h-11"
        >
          {isEdit ? 'Guardar Cambios' : 'Crear Transaccion'}
        </Button>
      </div>
    </form>
  )
}
