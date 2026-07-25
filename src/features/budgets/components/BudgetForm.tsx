import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import BudgetTypeSelector from './BudgetTypeSelector'
import PeriodSelector from './PeriodSelector'
import BudgetStrategySelector from './BudgetStrategySelector'
import AlertThresholdSlider from './AlertThresholdSlider'
import RolloverToggle from './RolloverToggle'
import type { CreateBudgetRequest } from '@/types/budgets'
import AccountPicker from '@/features/accounts/components/AccountPicker'
import CategoryPicker from '@/features/categories/components/CategoryPicker'

const budgetSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200),
  amount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'El monto debe ser mayor a 0'),
  budget_type: z.enum(['total', 'category', 'account']),
  period: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  category_id: z.string().nullable().optional(),
  account_id: z.string().nullable().optional(),
  alert_threshold: z.coerce.number().min(1).max(100),
  alert_enabled: z.boolean(),
  auto_adjust: z.boolean(),
  rollover: z.boolean(),
  strategy: z.enum(['zero_based', '50_30_20', 'envelope', 'custom']).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
})

interface BudgetFormProps {
  defaultValues?: Partial<Record<string, unknown>>
  mode: 'create' | 'edit'
  onSubmit: (data: CreateBudgetRequest) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export default function BudgetForm({ defaultValues, mode, onSubmit, onCancel, isLoading }: BudgetFormProps) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: '',
      amount: '',
      budget_type: 'total',
      period: 'monthly',
      alert_threshold: 80,
      alert_enabled: true,
      auto_adjust: false,
      rollover: false,
      strategy: null,
      description: '',
      start_date: '',
      end_date: '',
      category_id: null,
      account_id: null,
      icon: null,
      color: null,
      ...defaultValues,
    },
  })

  const budgetType = watch('budget_type')

  const handleFormSubmit = useCallback(async (data: Record<string, unknown>) => {
    const payload: CreateBudgetRequest = {
      name: String(data.name ?? ''),
      amount: String(data.amount ?? '0'),
      budget_type: (data.budget_type as CreateBudgetRequest['budget_type']) ?? 'total',
      period: (data.period as CreateBudgetRequest['period']) ?? 'monthly',
      alert_threshold: Number(data.alert_threshold ?? 80),
      alert_enabled: Boolean(data.alert_enabled ?? true),
      auto_adjust: Boolean(data.auto_adjust ?? false),
      rollover: Boolean(data.rollover ?? false),
      category_id: (data.category_id as string) || null,
      account_id: (data.account_id as string) || null,
      strategy: (data.strategy as CreateBudgetRequest['strategy']) || null,
      description: (data.description as string) || null,
      start_date: (data.start_date as string) || null,
      end_date: (data.end_date as string) || null,
      icon: (data.icon as string) || null,
      color: (data.color as string) || null,
    }
    await onSubmit(payload)
  }, [onSubmit])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => onCancel?.() ?? navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {mode === 'create' ? 'Nuevo Presupuesto' : 'Editar Presupuesto'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mode === 'create' ? 'Define un limite de gasto para controlar tus finanzas' : 'Modifica los detalles de tu presupuesto'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Tipo de presupuesto */}
        <section className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Tipo de Presupuesto</h2>
          <Controller
            control={control}
            name="budget_type"
            render={({ field }) => (
              <BudgetTypeSelector value={field.value} onChange={field.onChange} />
            )}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informacion basica */}
          <section className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Informacion</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                placeholder="Ej: Presupuesto mensual"
                className={`w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors focus:ring-2 focus:ring-violet-500 ${
                  errors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Descripcion
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Descripcion opcional..."
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors focus:ring-2 focus:ring-violet-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Periodo <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="period"
                render={({ field }) => (
                  <PeriodSelector value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  {...register('start_date')}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 outline-none transition-colors focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Fecha fin
                </label>
                <input
                  type="date"
                  {...register('end_date')}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 outline-none transition-colors focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {budgetType === 'category' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="category_id"
                  render={({ field }) => (
                    <CategoryPicker
                      value={field.value ?? ''}
                      onChange={(id) => field.onChange(id || null)}
                      filterType="expense"
                    />
                  )}
                />
              </div>
            )}

            {budgetType === 'account' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Cuenta <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="account_id"
                  render={({ field }) => (
                    <AccountPicker
                      value={field.value ?? ''}
                      onChange={(id) => field.onChange(id || null)}
                    />
                  )}
                />
              </div>
            )}
          </section>

          {/* Monto y configuracion */}
          <section className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Configuracion</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Monto limite <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 font-medium">$</span>
                <input
                  {...register('amount')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={`w-full pl-8 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors focus:ring-2 focus:ring-violet-500 ${
                    errors.amount ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
              </div>
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
            </div>

            <Controller
              control={control}
              name="alert_threshold"
              render={({ field }) => (
                <AlertThresholdSlider value={Number(field.value) ?? 80} onChange={(v) => field.onChange(v)} />
              )}
            />

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('alert_enabled')}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-violet-500 focus:ring-violet-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Alertas habilitadas
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('auto_adjust')}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-violet-500 focus:ring-violet-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto-ajuste
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ajustar automaticamente el monto basado en gastos historicos
                </p>
              </div>
            </label>

            <Controller
              control={control}
              name="rollover"
              render={({ field }) => (
                <RolloverToggle value={field.value} onChange={field.onChange} />
              )}
            />

            <Controller
              control={control}
              name="strategy"
              render={({ field }) => (
                <BudgetStrategySelector value={field.value} onChange={(v) => field.onChange(v)} />
              )}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Color
              </label>
              <Controller
                control={control}
                name="color"
                render={({ field }) => (
                  <div className="flex gap-2 flex-wrap">
                    {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => field.onChange(field.value === c ? null : c)}
                        className={`w-8 h-8 rounded-xl border-2 transition-all duration-200 ${
                          field.value === c ? 'border-gray-900 dark:border-gray-100 scale-110 shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                        aria-label={`Color ${c}`}
                      />
                    ))}
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => field.onChange(null)}
                        className="w-8 h-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
          </section>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => onCancel?.() ?? navigate(-1)}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {mode === 'create' ? 'Crear presupuesto' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
