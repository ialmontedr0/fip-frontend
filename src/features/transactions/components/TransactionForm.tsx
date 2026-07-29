import { useEffect, useRef, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import {
  TrendingUp, TrendingDown, Scale,
  Calendar, DollarSign, FileText, StickyNote,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui'
import TagInput from './TagInput'
import CategoryPicker from '@/features/categories/components/CategoryPicker'
import FundingSourcePicker from '@/features/accounts/components/FundingSourcePicker'
import IncomeSourcePicker from '@/features/incomes/components/IncomeSourcePicker'
import { useSource } from '@/features/incomes/hooks/useSources'
import { useTemplates } from '@/features/expenses/hooks/useTemplates'
import { useServices } from '@/features/expenses/hooks/useServices'
import { useSubscriptions } from '@/features/expenses/hooks/useSubscriptions'
import TemplatePicker from '@/features/expenses/components/TemplatePicker'
import type { CombinedOption } from '@/features/expenses/components/TemplatePicker'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { TRANSACTION_TYPE_CONFIG } from '../constants'
import type { TransactionType, CreateTransactionRequest, TransactionResponse } from '@/types/transactions'

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-2.5 text-sm backdrop-blur-sm transition-all dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-gray-800 placeholder:text-gray-400'

const transactionSchema = z.object({
  transaction_type: z.enum(['income', 'expense', 'adjustment']),
  account_id: z.string().optional().or(z.literal('')),
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
  income_source_id: z.string().optional().nullable(),
  expense_template_id: z.string().optional().nullable(),
  credit_card_id: z.string().optional().nullable(),
  debit_card_id: z.string().optional().nullable(),
}).refine(
  (data) => data.account_id || data.credit_card_id || data.debit_card_id,
  { message: 'Debe seleccionar una cuenta, tarjeta de credito o tarjeta de debito', path: ['account_id'] }
)

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
      credit_card_id: (defaultValues as any).credit_card_id || '',
      debit_card_id: (defaultValues as any).debit_card_id || '',
      income_source_id: (defaultValues as any).income_source_id || null,
      expense_template_id: (defaultValues as any).expense_template_id || null,
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
      credit_card_id: '',
      debit_card_id: '',
      income_source_id: null,
      expense_template_id: null,
    },
  })

  const transactionType = watch('transaction_type')
  const adjustmentOp = watch('adjustment_operation')
  const tags = watch('tags') || []
  const incomeSourceId = watch('income_source_id')

  const { data: selectedSource } = useSource(
    transactionType === 'income' && incomeSourceId ? incomeSourceId : undefined,
  )
  const { data: templatesData, isLoading: templatesLoading } = useTemplates()
  const templates = templatesData?.templates || (Array.isArray(templatesData) ? templatesData : [])
  const { data: servicesData, isLoading: servicesLoading } = useServices()
  const services = Array.isArray(servicesData) ? servicesData : servicesData?.services || []
  const { data: subscriptionsData, isLoading: subsLoading } = useSubscriptions()
  const subscriptions = subscriptionsData?.subscriptions || []
  const { data: categoriesData } = useCategories()
  const categories = categoriesData?.categories || []

  const catMap = useMemo(() => {
    const m: Record<string, string> = {}
    for (const c of categories) {
      m[c.id] = c.name
      if (c.subcategories) {
        for (const sc of c.subcategories) {
          m[sc.id] = sc.name
        }
      }
    }
    return m
  }, [categories])

  const combinedOptions: CombinedOption[] = useMemo(() => [
    ...templates.map((t: any) => ({
      id: `template_${t.id}`,
      label: `[Plantilla] ${t.name}`,
      type: 'template' as const,
      amount: t.default_amount,
      account_id: t.default_account_id,
      category_id: t.default_category_id,
      category: t.default_category_id ? (catMap[t.default_category_id] || null) : null,
      notes: t.default_notes,
      description: t.description || t.name,
      account_name: null as string | null,
    })),
    ...services.map((s: any) => ({
      id: `service_${s.id}`,
      label: `[Servicio] ${s.name}${s.provider ? ` - ${s.provider}` : ''}`,
      type: 'service' as const,
      amount: s.estimated_amount,
      category_id: s.category_id,
      category: s.category_id ? (catMap[s.category_id] || null) : null,
      account_name: null as string | null,
      description: s.name,
    })),
    ...subscriptions.map((s: any) => ({
      id: `sub_${s.id}`,
      label: `[Suscripcion] ${s.name}${s.provider ? ` - ${s.provider}` : ''}`,
      type: 'subscription' as const,
      amount: s.amount,
      category_id: s.category_id,
      category: s.category_id ? (catMap[s.category_id] || null) : null,
      account_name: null as string | null,
      description: s.description || s.name,
    })),
  ], [templates, services, subscriptions, catMap])

  const isCombinedLoading = templatesLoading || servicesLoading || subsLoading

  const selectedOptionId = watch('expense_template_id')
  const selectedOption = selectedOptionId
    ? combinedOptions.find((o) => o.id === selectedOptionId)
    : null

  const prevTemplateIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (selectedSource && transactionType === 'income') {
      if (selectedSource.default_amount && !watch('amount')) {
        setValue('amount', parseFloat(selectedSource.default_amount).toString())
      }
      if (selectedSource.default_account_id && !watch('account_id')) {
        setValue('account_id', selectedSource.default_account_id)
      }
      if (selectedSource.default_category_id && !watch('category_id')) {
        setValue('category_id', selectedSource.default_category_id)
      }
    }
  }, [selectedSource, transactionType, setValue, watch])

  useEffect(() => {
    const currentId = selectedOption?.id || null
    if (currentId && currentId !== prevTemplateIdRef.current) {
      prevTemplateIdRef.current = currentId
      if (transactionType === 'expense' && selectedOption) {
        if (selectedOption.amount) {
          setValue('amount', parseFloat(selectedOption.amount).toString())
        }
        if (selectedOption.account_id) {
          setValue('account_id', selectedOption.account_id)
        }
        if (selectedOption.category_id) {
          setValue('category_id', selectedOption.category_id)
        }
        if (selectedOption.notes) {
          setValue('notes', selectedOption.notes)
        }
        if (selectedOption.description) {
          setValue('description', selectedOption.description)
        }
      }
    }
  }, [selectedOption, transactionType, setValue])

  const handleFormSubmit = (data: Record<string, unknown>) => {
    const payload: Record<string, unknown> = {
      ...data,
      currency_code: data.currency_code || 'DOP',
      amount: Number(data.amount),
      category_id: data.category_id || null,
      subcategory_id: data.subcategory_id || null,
      notes: data.notes || null,
      account_id: data.account_id || null,
      credit_card_id: data.credit_card_id || null,
      debit_card_id: data.debit_card_id || null,
      income_source_id: data.income_source_id || null,
    }
    if (transactionType === 'adjustment') {
      payload.adjustment_operation = data.adjustment_operation || 'subtract'
    } else {
      delete payload.adjustment_operation
    }
    if (transactionType !== 'expense') {
      delete payload.expense_template_id
    }
    if (transactionType !== 'income') {
      delete payload.income_source_id
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

      {/* Source / Template selector */}
      {transactionType === 'income' && (
        <div className="animate-fade-in">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Fuente de Ingreso (opcional)
          </label>
          <p className="mb-2 text-xs text-gray-400">Selecciona una fuente para heredar datos</p>
          <IncomeSourcePicker
            value={watch('income_source_id') || ''}
            onChange={(id) => setValue('income_source_id', id || null)}
            placeholder="Seleccionar fuente..."
          />
        </div>
      )}

      {transactionType === 'expense' && (
        <div className="animate-fade-in">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Plantilla (opcional)
          </label>
          <p className="mb-2 text-xs text-gray-400">Selecciona una plantilla, servicio o suscripcion para heredar datos</p>
          <TemplatePicker
            value={watch('expense_template_id') || ''}
            onChange={(id) => setValue('expense_template_id', id)}
            options={combinedOptions}
            isLoading={isCombinedLoading}
            placeholder="Seleccionar plantilla..."
          />
        </div>
      )}

      {/* Origen */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Origen de Fondos <span className="text-red-400">*</span>
        </label>
        <FundingSourcePicker
          value={{
            account_id: watch('account_id') || undefined,
            credit_card_id: watch('credit_card_id') || undefined,
            debit_card_id: watch('debit_card_id') || undefined,
          }}
          onChange={(source) => {
            setValue('account_id', source.account_id || '')
            setValue('credit_card_id', source.credit_card_id || '')
            setValue('debit_card_id', source.debit_card_id || '')
          }}
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
