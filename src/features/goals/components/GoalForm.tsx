import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon, ChevronDown, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCreateGoal, useUpdateGoal } from '../hooks/useGoals'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import AutoContributeToggle from './AutoContributeToggle'
import { GOAL_TYPE_OPTIONS, PRIORITY_OPTIONS, COMPOUND_OPTIONS, formatCurrency } from '../constants'
import type { GoalType, CompoundFrequency, GoalResponse, CreateGoalRequest, UpdateGoalRequest } from '@/types/goals'

const goalFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().max(500).optional(),
  goal_type: z.string().min(1, 'Selecciona un tipo'),
  target_amount: z.string().min(1, 'El monto objetivo es requerido').refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Debe ser un monto valido'),
  start_date: z.string().min(1, 'La fecha de inicio es requerida'),
  target_date: z.string().min(1, 'La fecha objetivo es requerida'),
  monthly_contribution: z.string().optional(),
  interest_rate: z.string().optional(),
  compound_frequency: z.string().optional(),
  account_id: z.string().optional(),
  category_id: z.string().optional(),
  priority: z.number().min(1).max(5).default(3),
  auto_contribute: z.boolean().default(false),
})

type GoalFormData = z.infer<typeof goalFormSchema>

interface GoalFormProps {
  defaultValues?: GoalResponse
  mode?: 'create' | 'edit'
}

export default function GoalForm({ defaultValues, mode = 'create' }: GoalFormProps) {
  const navigate = useNavigate()
  const createMutation = useCreateGoal()
  const updateMutation = useUpdateGoal()
  const { data: accountsData } = useAccounts()
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const today = new Date().toISOString().split('T')[0]

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema) as any,
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      goal_type: defaultValues?.goal_type || '',
      target_amount: defaultValues?.target_amount || '',
      start_date: defaultValues?.start_date || today,
      target_date: defaultValues?.target_date || '',
      monthly_contribution: defaultValues?.monthly_contribution || '',
      interest_rate: defaultValues?.interest_rate || '',
      compound_frequency: defaultValues?.compound_frequency || '',
      account_id: defaultValues?.account_id || '',
      category_id: defaultValues?.category_id || '',
      priority: defaultValues?.priority || 3,
      auto_contribute: defaultValues?.auto_contribute || false,
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form
  const goalType = watch('goal_type')
  const priority = watch('priority')
  const autoContribute = watch('auto_contribute')
  const monthlyContribution = watch('monthly_contribution')
  const targetAmount = watch('target_amount')

  const onSubmit = async (data: GoalFormData) => {
    const base = {
      ...data,
      description: data.description || null,
      monthly_contribution: data.monthly_contribution || null,
      interest_rate: data.interest_rate || null,
      account_id: data.account_id || null,
      category_id: data.category_id || null,
      goal_type: data.goal_type as GoalType,
      compound_frequency: (data.compound_frequency || null) as CompoundFrequency | null,
    }

    if (mode === 'edit' && defaultValues?.id) {
      await updateMutation.mutateAsync({ id: defaultValues.id, data: base as UpdateGoalRequest })
      navigate(`/goals/${defaultValues.id}`)
    } else {
      const result = await createMutation.mutateAsync(base as CreateGoalRequest)
      navigate(`/goals/${result.data.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Goal Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
          Tipo de Meta <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {GOAL_TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isSelected = goalType === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('goal_type', opt.value, { shouldValidate: true })}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center',
                  isSelected
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-md shadow-violet-500/10'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600',
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-500" />
                )}
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', isSelected ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400')}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn('text-xs font-semibold', isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300')}>
                  {opt.label}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                  {opt.description}
                </span>
              </button>
            )
          })}
        </div>
        {errors.goal_type && (
          <p className="text-xs text-red-500">{errors.goal_type.message}</p>
        )}
      </div>

      {/* Basic Info */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Informacion Basica</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            placeholder=" ej: Viaje a Japon, Fondo de emergencia..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descripcion</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Describe tu meta..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all resize-none"
          />
        </div>
      </div>

      {/* Financial Target */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Objetivo Financiero</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Monto Objetivo <span className="text-red-500">*</span>
            </label>
            <input
              {...register('target_amount')}
              type="number"
              step="0.01"
              min="0"
              placeholder="100000"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
            />
            {errors.target_amount && <p className="text-xs text-red-500 mt-1">{errors.target_amount.message}</p>}
            {targetAmount && !isNaN(Number(targetAmount)) && Number(targetAmount) > 0 && (
              <p className="text-xs text-gray-400 mt-1">{formatCurrency(targetAmount)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Contribucion Mensual
            </label>
            <input
              {...register('monthly_contribution')}
              type="number"
              step="0.01"
              min="0"
              placeholder="5000"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
            />
            {monthlyContribution && targetAmount && !isNaN(Number(monthlyContribution)) && Number(monthlyContribution) > 0 && Number(targetAmount) > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                ~{Math.ceil(Number(targetAmount) / Number(monthlyContribution))} meses para completar
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tiempo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Fecha de Inicio <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('start_date')}
                type="date"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Fecha Objetivo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('target_date')}
                type="date"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.target_date && <p className="text-xs text-red-500 mt-1">{errors.target_date.message}</p>}
          </div>
        </div>
      </div>

      {/* Priority & Auto-Contribute */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Configuracion</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prioridad</label>
          <div className="grid grid-cols-5 gap-2">
            {PRIORITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('priority', opt.value)}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center',
                  priority === opt.value
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                )}
              >
                <span className={cn(
                  'text-lg font-bold',
                  priority === opt.value ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500',
                )}>
                  {opt.value}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
        <AutoContributeToggle
          value={autoContribute}
          onChange={(v) => setValue('auto_contribute', v)}
        />
      </div>

      {/* Advanced Settings (Collapsible) */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Configuracion Avanzada
          </span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', showAdvanced && 'rotate-180')} />
        </button>
        {showAdvanced && (
          <div className="p-5 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tasa de Interes Anual %</label>
                <input
                  {...register('interest_rate')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="5.0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Frecuencia de Compound</label>
                <select
                  {...register('compound_frequency')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                >
                  <option value="">Seleccionar...</option>
                  {COMPOUND_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cuenta Vinculada</label>
                <select
                  {...register('account_id')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                >
                  <option value="">Sin cuenta</option>
                  {accountsData?.accounts?.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.balance ? formatCurrency(acc.balance) : ''})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Icono (URL o nombre)</label>
                <input
                  {...register('category_id')}
                  placeholder="Opcional"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              {mode === 'edit' ? 'Guardando...' : 'Creando...'}
            </>
          ) : mode === 'edit' ? 'Guardar Cambios' : 'Crear Meta'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}


