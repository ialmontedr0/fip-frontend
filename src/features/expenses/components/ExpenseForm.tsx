import { useEffect, useRef, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, DollarSign, Calendar, FileText, AlertTriangle, Tag, Save } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import FundingSourcePicker from '@/features/accounts/components/FundingSourcePicker'
import CategoryPicker from '@/features/categories/components/CategoryPicker'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { useTemplates, useCreateTemplate } from '../hooks/useTemplates'
import { useServices } from '../hooks/useServices'
import { useSubscriptions } from '../hooks/useSubscriptions'
import TemplatePicker from './TemplatePicker'
import { cn } from '@/lib/utils'
import { PRIORITY_OPTIONS } from '../constants'
import type { CreateExpenseRequest, ExpenseResponse } from '@/types/expenses'
import type { CombinedOption } from './TemplatePicker'

const schema = z.object({
  account_id: z.string().optional().nullable(),
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
  expense_template_id: z.string().optional().nullable(),
  save_as_template: z.boolean().optional(),
  new_template_name: z.string().optional(),
  service_id: z.string().optional().nullable(),
  subscription_id: z.string().optional().nullable(),
  credit_card_id: z.string().optional().nullable(),
  debit_card_id: z.string().optional().nullable(),
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
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues ? {
      account_id: defaultValues.account_id,
      credit_card_id: defaultValues.credit_card_id,
      amount: defaultValues.amount,
      currency_code: defaultValues.currency_code,
      description: defaultValues.description,
      effective_date: defaultValues.effective_date || '',
      category_id: defaultValues.category_id,
      notes: defaultValues.notes || '',
      source: defaultValues.source || 'manual',
      priority: defaultValues.priority || 'normal',
      save_as_template: false,
    } : {
      currency_code: 'DOP',
      effective_date: new Date().toISOString().split('T')[0],
      source: 'manual',
      priority: 'normal',
      save_as_template: false,
    },
  })

  const priority = watch('priority')
  const saveAsTemplate = watch('save_as_template')

  const { data: templatesData, isLoading: templatesLoading } = useTemplates()
  const templates = templatesData?.templates || (Array.isArray(templatesData) ? templatesData : [])
  const { data: servicesData, isLoading: servicesLoading } = useServices()
  const services = Array.isArray(servicesData) ? servicesData : servicesData?.services || []
  const { data: subscriptionsData, isLoading: subsLoading } = useSubscriptions()
  const subscriptions = subscriptionsData?.subscriptions || []
  const { data: categoriesData } = useCategories()
  const categories = categoriesData?.categories || []
  const createTemplate = useCreateTemplate()

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
    const currentId = selectedOption?.id || null
    if (currentId && currentId !== prevTemplateIdRef.current) {
      prevTemplateIdRef.current = currentId
      if (mode === 'create' && selectedOption) {
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
  }, [selectedOption, mode, setValue])

  const submit = async (data: FormData) => {
    if (mode === 'create' && data.save_as_template) {
      const templateName = data.new_template_name?.trim() || data.description?.trim()
      if (templateName) {
        createTemplate.mutate({
          name: templateName,
          description: data.description || templateName,
          default_amount: data.amount ? parseFloat(data.amount) : null,
          default_account_id: data.account_id || null,
          default_category_id: data.category_id || null,
          default_notes: data.notes || null,
          default_currency: data.currency_code || 'DOP',
        })
      }
    }
    await onSubmit({
      ...data,
      account_id: data.account_id || null,
      credit_card_id: data.credit_card_id || null,
      debit_card_id: data.debit_card_id || null,
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

        {mode === 'create' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Plantilla (opcional)
            </label>
            <TemplatePicker
              value={watch('expense_template_id') || ''}
              onChange={(id) => setValue('expense_template_id', id)}
              options={combinedOptions}
              isLoading={isCombinedLoading}
              placeholder="Seleccionar plantilla, servicio o suscripcion..."
            />
          </div>
        )}

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
            Origen del Gasto <span className="text-red-400">*</span>
          </label>
          <FundingSourcePicker
            value={{
              account_id: watch('account_id') || undefined,
              credit_card_id: watch('credit_card_id') || undefined,
              debit_card_id: watch('debit_card_id') || undefined,
            }}
            onChange={(source) => {
              setValue('account_id', source.account_id || null)
              setValue('credit_card_id', source.credit_card_id || null)
              setValue('debit_card_id', source.debit_card_id || null)
            }}
          />
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

        {mode === 'create' && (
          <div className="space-y-3 rounded-xl border border-dashed border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10 p-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('save_as_template')}
                className="rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500/30"
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Save className="h-3.5 w-3.5" />
                Guardar como plantilla
              </span>
            </label>
            {saveAsTemplate && (
              <div className="animate-fade-in space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Nombre de la plantilla
                </label>
                <input
                  {...register('new_template_name')}
                  placeholder="Ej: Supermercado mensual"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm backdrop-blur-sm dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-400">Si no se especifica, se usara la descripcion</p>
              </div>
            )}
          </div>
        )}

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
