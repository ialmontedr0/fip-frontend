import { useState, useMemo, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn, formatCurrency } from '@/lib/utils'
import {
  ArrowLeftRight, DollarSign, ArrowUpDown, Calendar, FileText, Search, ChevronDown, StickyNote,
} from 'lucide-react'
import { Button, Skeleton } from '@/components/ui'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import { ACCOUNT_TYPE_CONFIG } from '@/features/accounts/constants'
import type { CreateTransferRequest } from '@/types/transactions'
import type { AccountType } from '@/types/accounts'

const transferSchema = z.object({
  source_account_id: z.string().min(1, 'Cuenta origen requerida'),
  destination_account_id: z.string().min(1, 'Cuenta destino requerida'),
  amount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'El monto debe ser mayor a 0'),
  currency_code: z.string().length(3).default('DOP'),
  description: z.string().min(1, 'La descripcion es requerida').max(500),
  effective_date: z.string().min(1, 'La fecha es requerida'),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

interface Props {
  onSubmit: (data: CreateTransferRequest) => void
  isLoading?: boolean
  className?: string
}

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-2.5 text-sm backdrop-blur-sm transition-all dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-gray-800 placeholder:text-gray-400'

function AccountPicker({ value, onChange, exclude, label, color }: {
  value: string
  onChange: (id: string) => void
  exclude?: string
  label: string
  color: 'red' | 'emerald'
}) {
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

  const accounts = useMemo(() => {
    if (!data?.accounts) return []
    return exclude ? data.accounts.filter((a) => a.id !== exclude) : data.accounts
  }, [data, exclude])

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

  const focusColor = color === 'red'
    ? 'focus:border-red-400 focus:ring-red-500/20'
    : 'focus:border-emerald-400 focus:ring-emerald-500/20'

  return (
    <div ref={ref} className="relative">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label} <span className="text-red-400">*</span>
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-sm backdrop-blur-sm transition-all',
          'bg-white/70 dark:bg-gray-800/70 dark:text-gray-200',
          'border-gray-200 dark:border-gray-700',
          focusColor,
          isOpen && 'border-current ring-2',
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
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{selected.name}</p>
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

export default function TransferForm({ onSubmit, isLoading, className }: Props) {
  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transferSchema) as any,
    defaultValues: {
      source_account_id: '',
      destination_account_id: '',
      amount: '',
      currency_code: 'DOP',
      description: '',
      effective_date: new Date().toISOString().slice(0, 10),
      notes: '',
    },
  })

  const amount = watch('amount')
  const sourceId = watch('source_account_id')
  const destId = watch('destination_account_id')

  const handleSwap = () => {
    setValue('source_account_id', destId)
    setValue('destination_account_id', sourceId)
  }

  const handleFormSubmit = (data: Record<string, unknown>) => {
    onSubmit({
      ...data,
      currency_code: data.currency_code || 'DOP',
      amount: Number(data.amount),
      notes: data.notes || null,
    } as CreateTransferRequest)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn('space-y-8', className)}>
      {/* Cuentas */}
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Cuentas
        </label>
        <div className="relative flex items-start gap-3">
          <div className="flex-1">
            <AccountPicker
              value={sourceId}
              onChange={(id) => setValue('source_account_id', id, { shouldValidate: true })}
              exclude={destId}
              label="Cuenta Origen"
              color="red"
            />
            {errors.source_account_id && (
              <p className="mt-1 text-xs text-red-500">{errors.source_account_id.message}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="mt-7 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white/70 text-gray-400 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50 transition-all dark:border-gray-700 dark:bg-gray-800/70 dark:hover:bg-primary-500/10"
            title="Intercambiar cuentas"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>

          <div className="flex-1">
            <AccountPicker
              value={destId}
              onChange={(id) => setValue('destination_account_id', id, { shouldValidate: true })}
              exclude={sourceId}
              label="Cuenta Destino"
              color="emerald"
            />
            {errors.destination_account_id && (
              <p className="mt-1 text-xs text-red-500">{errors.destination_account_id.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-400">
          <ArrowLeftRight className="h-4 w-4" />
          <span>
            Transferir <strong className="text-gray-600 dark:text-gray-300">
              {formatCurrency(amount)}
            </strong>
          </span>
        </div>
      </div>

      {/* Monto y Fecha */}
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Detalles de la Transferencia
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

      {/* Moneda */}
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
            placeholder="ej. Transferencia a cuenta de ahorros"
            className={cn(inputClass, 'pl-9')}
          />
        </div>
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
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
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Crear Transferencia
        </Button>
      </div>
    </form>
  )
}
