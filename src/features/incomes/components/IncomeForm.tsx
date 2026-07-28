import { useEffect, useMemo, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button, Input } from '@/components/ui'
import AccountPicker from '@/features/accounts/components/AccountPicker'
import CategoryPicker from '@/features/categories/components/CategoryPicker'
import IncomeSourcePicker from './IncomeSourcePicker'
import { useSource } from '../hooks/useSources'
import { INCOME_TYPE_CONFIG, STABILITY_CONFIG } from '../constants'
import {
  Save, X, ChevronDown, ChevronUp, Calculator, Receipt,
  FileText, Tag, RefreshCw, AlertCircle, CheckCircle2,
} from 'lucide-react'
import type { CreateIncomeRequest, UpdateIncomeRequest } from '@/types/incomes'

const incomeSchema = z.object({
  account_id: z.string().min(1, 'Cuenta es requerida'),
  amount: z.number().positive('Monto debe ser positivo'),
  currency_code: z.string().default('DOP'),
  description: z.string().min(1, 'Descripcion es requerida').max(500),
  effective_date: z.string().min(1, 'Fecha es requerida'),
  category_id: z.string().optional().nullable(),
  subcategory_id: z.string().optional().nullable(),
  income_type: z.string().min(1, 'Tipo es requerido'),
  income_status: z.string().min(1, 'Estado es requerido'),
  stability: z.string().min(1, 'Estabilidad es requerida'),
  income_source_id: z.string().optional().nullable(),
  employer_name: z.string().optional().nullable(),
  employer_tax_id: z.string().optional().nullable(),
  gross_amount: z.number().optional().nullable(),
  tax_withheld: z.number().optional().nullable(),
  net_amount: z.number().optional().nullable(),
  frequency: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
})

type FormValues = z.input<typeof incomeSchema>

const INCOME_STATUS_OPTIONS = [
  { value: 'received', label: 'Recibido', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/10', dot: 'bg-emerald-500' },
  { value: 'pending', label: 'Pendiente', color: 'text-amber-600 bg-amber-100 dark:bg-amber-500/10', dot: 'bg-amber-500' },
  { value: 'expected', label: 'Esperado', color: 'text-blue-600 bg-blue-100 dark:bg-blue-500/10', dot: 'bg-blue-500' },
  { value: 'overdue', label: 'Vencido', color: 'text-red-600 bg-red-100 dark:bg-red-500/10', dot: 'bg-red-500' },
  { value: 'cancelled', label: 'Cancelado', color: 'text-gray-600 bg-gray-100 dark:bg-gray-500/10', dot: 'bg-gray-500' },
]

interface Props {
  defaultValues?: Partial<FormValues>
  onSubmit: (data: CreateIncomeRequest | UpdateIncomeRequest) => void
  onCancel?: () => void
  isSubmitting?: boolean
  mode?: 'create' | 'edit'
  className?: string
}

export default function IncomeForm({ defaultValues, onSubmit, onCancel, isSubmitting, mode = 'create', className }: Props) {
  const [showTaxFields, setShowTaxFields] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      currency_code: 'DOP',
      income_type: 'salary',
      income_status: 'received',
      stability: 'fixed',
      tags: [],
      ...defaultValues,
    },
  })

  const grossAmount = watch('gross_amount')
  const taxWithheld = watch('tax_withheld')
  const stability = watch('stability')
  const incomeType = watch('income_type')
  const incomeStatus = watch('income_status')
  const tags = watch('tags') || []
  const incomeSourceId = watch('income_source_id')
  const { data: selectedSource } = useSource(incomeSourceId || undefined)

  useEffect(() => {
    if (!selectedSource || mode !== 'create') return
    const source = selectedSource
    if (source.default_amount) {
      setValue('amount', Number(source.default_amount))
    }
    if (source.default_account_id) {
      setValue('account_id', source.default_account_id)
    }
    if (source.default_category_id) {
      setValue('category_id', source.default_category_id)
    }
    if (source.income_type) {
      setValue('income_type', source.income_type)
    }
    if (source.stability) {
      setValue('stability', source.stability)
    }
    if (source.name) {
      setValue('description', source.name)
    }
  }, [selectedSource, mode, setValue, incomeSourceId])

  useEffect(() => {
    if (grossAmount && taxWithheld) {
      const gross = Number(grossAmount)
      const tax = Number(taxWithheld)
      if (!isNaN(gross) && !isNaN(tax)) {
        setValue('net_amount', parseFloat((gross - tax).toFixed(2)))
      }
    }
  }, [grossAmount, taxWithheld, setValue])

  const addTag = useCallback(() => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setValue('tags', [...tags, trimmed])
      setTagInput('')
    }
  }, [tagInput, tags, setValue])

  const removeTag = useCallback((tag: string) => {
    setValue('tags', tags.filter((t) => t !== tag))
  }, [tags, setValue])

  const netAmount = useMemo(() => {
    if (grossAmount && taxWithheld) {
      return Number(grossAmount) - Number(taxWithheld)
    }
    return null
  }, [grossAmount, taxWithheld])

  const sectionClass = (section: string) => cn(
    'rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300',
    'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl',
    activeSection === section && 'ring-2 ring-primary-500/20 shadow-lg shadow-primary-500/5',
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-5', className)}>
      {/* Section 1: Basic Info */}
      <div
        className={sectionClass('basic')}
        onFocus={() => setActiveSection('basic')}
        tabIndex={-1}
      >
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-md shadow-primary-500/20">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Informacion Basica</h3>
              <p className="text-xs text-gray-400">Los campos marcados con * son obligatorios</p>
            </div>
          </div>

          {/* Income Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de Ingreso <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {Object.entries(INCOME_TYPE_CONFIG).map(([key, config]) => {
                const isActive = incomeType === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setValue('income_type', key)}
                    className={cn(
                      'group relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200 text-center',
                      isActive
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-md shadow-primary-500/10 scale-[1.02]'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm hover:-translate-y-0.5',
                    )}
                  >
                    {isActive && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </span>
                    )}
                    <config.icon className={cn('h-5 w-5 transition-transform', isActive ? 'scale-110' : 'group-hover:scale-110', config.color)} />
                    <span className={cn('text-[10px] font-medium transition-colors', isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400')}>
                      {config.label}
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.income_type && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-2">
                <AlertCircle className="h-3 w-3" />{errors.income_type.message}
              </p>
            )}
          </div>

          {/* Account & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cuenta <span className="text-red-400">*</span>
              </label>
              <AccountPicker
                value={watch('account_id') || ''}
                onChange={(id) => setValue('account_id', id)}
                error={errors.account_id?.message}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monto <span className="text-red-400">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                  className={cn(errors.amount && 'border-red-500')}
                />
                {errors.amount && <p className="text-xs text-red-500 mt-0.5">{errors.amount.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Moneda</label>
                <select
                  {...register('currency_code')}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="DOP">RD$</option>
                  <option value="USD">US$</option>
                  <option value="EUR">€</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha Efectiva <span className="text-red-400">*</span>
              </label>
              <Input
                type="date"
                {...register('effective_date')}
                className={cn(errors.effective_date && 'border-red-500')}
              />
              {errors.effective_date && <p className="text-xs text-red-500 mt-0.5">{errors.effective_date.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descripcion <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="Ej: Salario Julio 2026"
                {...register('description')}
                className={cn(errors.description && 'border-red-500')}
              />
              {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description.message}</p>}
            </div>
          </div>

          {/* Income Source */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fuente de Ingreso
              <span className="ml-1 text-xs font-normal text-gray-400">(opcional — hereda datos)</span>
            </label>
            <IncomeSourcePicker
              value={watch('income_source_id') || ''}
              onChange={(id) => setValue('income_source_id', id || null)}
              placeholder="Seleccione una fuente de ingreso"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Classification */}
      <div
        className={sectionClass('classification')}
        onFocus={() => setActiveSection('classification')}
        tabIndex={-1}
      >
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-md shadow-purple-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Clasificacion</h3>
              <p className="text-xs text-gray-400">Categoriza y organiza tu ingreso</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
              <CategoryPicker
                value={watch('subcategory_id') || watch('category_id') || ''}
                onChange={(categoryId, subcategoryId) => {
                  setValue('category_id', categoryId)
                  setValue('subcategory_id', subcategoryId || null)
                }}
                filterType="income"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
              <div className="grid grid-cols-2 gap-2">
                {INCOME_STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('income_status', opt.value)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      incomeStatus === opt.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                    )}
                  >
                    <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', opt.dot)} />
                    <span className={cn(
                      'text-xs',
                      incomeStatus === opt.value ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400',
                    )}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stability Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Estabilidad</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STABILITY_CONFIG).map(([key, config]) => {
                const isActive = stability === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setValue('stability', key)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border-2 p-3 transition-all duration-200 text-left',
                      isActive
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-sm scale-[1.01]'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm',
                    )}
                  >
                    <div className={cn('h-3 w-3 rounded-full shrink-0', config.dotColor)} />
                    <div className="text-left min-w-0">
                      <p className={cn('text-sm font-medium', isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-gray-100')}>
                        {config.label}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{config.description}</p>
                    </div>
                    {isActive && <CheckCircle2 className="h-4 w-4 text-primary-500 ml-auto shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Tax Info */}
      <div
        className={sectionClass('tax')}
        onFocus={() => setActiveSection('tax')}
        tabIndex={-1}
      >
        <button
          type="button"
          onClick={() => setShowTaxFields(!showTaxFields)}
          className="w-full p-5 sm:p-6 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300',
                'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/20',
                showTaxFields && 'ring-2 ring-amber-300',
              )}>
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Informacion Fiscal</h3>
                <p className="text-xs text-gray-400">Gross, retenciones y calculo automatico de neto</p>
              </div>
            </div>
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              showTaxFields ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400',
            )}>
              {showTaxFields ? 'Ocultar' : 'Mostrar'}
              {showTaxFields
                ? <ChevronUp className="h-3.5 w-3.5" />
                : <ChevronDown className="h-3.5 w-3.5" />
              }
            </div>
          </div>
        </button>

        {showTaxFields && (
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 animate-fade-in border-t border-gray-100 dark:border-gray-700/50 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ingres Bruto</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('gross_amount', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Retencion de impuestos</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('tax_withheld', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ingreso Neto</label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('net_amount', { valueAsNumber: true })}
                  />
                  {netAmount !== null && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <RefreshCw className="h-3 w-3 text-primary-400 animate-spin-slow" />
                      <span className="text-[11px] font-semibold text-primary-500 dark:text-primary-400">
                        {formatCurrencySimple(netAmount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empleador</label>
                <Input placeholder="Nombre del empleador" {...register('employer_name')} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RNC / Cedula</label>
                <Input placeholder="000-0000000-0" {...register('employer_tax_id')} />
              </div>
            </div>
            {netAmount !== null && (
              <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/5 dark:to-teal-500/5 p-4 border border-emerald-200/50 dark:border-emerald-800/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Neto calculado:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">{formatCurrencySimple(netAmount)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 4: Additional Config */}
      <div
        className={sectionClass('additional')}
        onFocus={() => setActiveSection('additional')}
        tabIndex={-1}
      >
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-md shadow-slate-500/20">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Configuracion Adicional</h3>
              <p className="text-xs text-gray-400">Notas, etiquetas y metadatos</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notas</label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Notas adicionales sobre este ingreso..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400 resize-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="Ej: bonus, anual, proyecto..."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 pl-9 pr-3 py-2.5 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400"
                />
              </div>
              <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim()} className="rounded-xl shrink-0">
                Agregar
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 animate-fade-in">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-500/10 dark:to-primary-500/5 border border-primary-200/50 dark:border-primary-800/30 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300 transition-all hover:shadow-sm"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 sm:p-6 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
        <p className="text-xs text-gray-400 hidden sm:block">
          {mode === 'create' ? 'Completa los campos para registrar un nuevo ingreso' : 'Actualiza los campos que deseas modificar'}
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl flex-1 sm:flex-none">
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl flex-1 sm:flex-none bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Guardando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {mode === 'create' ? 'Crear Ingreso' : 'Guardar Cambios'}
              </span>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

function formatCurrencySimple(amount: number): string {
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 2 }).format(amount)
}
