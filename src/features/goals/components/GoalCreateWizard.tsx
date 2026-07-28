import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Target, CalendarIcon, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCreateGoal } from '../hooks/useGoals'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import AutoContributeToggle from './AutoContributeToggle'
import { GOAL_TYPE_OPTIONS, PRIORITY_OPTIONS, COMPOUND_OPTIONS, formatCurrency } from '../constants'
import type { GoalType, CompoundFrequency, CreateGoalRequest } from '@/types/goals'

const wizardSchema = z.object({
  goal_type: z.string().min(1, 'Selecciona un tipo de meta'),
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().max(500).optional(),
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
  start_from_zero: z.boolean().default(false),
})

type WizardData = z.infer<typeof wizardSchema>

const STEPS = [
  { id: 1, label: 'Tipo', title: 'Selecciona el tipo de meta' },
  { id: 2, label: 'Detalles', title: 'Informacion basica' },
  { id: 3, label: 'Objetivo', title: 'Define tu objetivo financiero' },
  { id: 4, label: 'Configuracion', title: 'Configuracion y preferencias' },
]

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
              currentStep > step.id ? 'bg-emerald-500 text-white' :
              currentStep === step.id ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30' :
              'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
            )}>
              {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <span className={cn(
              'text-xs font-medium hidden sm:inline',
              currentStep >= step.id ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500',
            )}>
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={cn(
              'h-0.5 w-8 sm:w-12 mx-1 rounded transition-colors duration-300',
              currentStep > step.id ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-gray-700',
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function GoalCreateWizard() {
  const navigate = useNavigate()
  const createMutation = useCreateGoal()
  const { data: accountsData } = useAccounts()
  const [step, setStep] = useState(1)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const form = useForm<WizardData>({
    resolver: zodResolver(wizardSchema) as any,
    defaultValues: {
      goal_type: '',
      name: '',
      description: '',
      target_amount: '',
      start_date: today,
      target_date: '',
      monthly_contribution: '',
      interest_rate: '',
      compound_frequency: '',
      account_id: '',
      category_id: '',
      priority: 3,
      auto_contribute: false,
      start_from_zero: false,
    },
  })

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = form
  const goalType = watch('goal_type')
  const priority = watch('priority')
  const autoContribute = watch('auto_contribute')
  const name = watch('name')
  const targetAmount = watch('target_amount')
  const monthlyContribution = watch('monthly_contribution')
  const startDate = watch('start_date')
  const targetDate = watch('target_date')

  const selectedTypeConfig = GOAL_TYPE_OPTIONS.find((o) => o.value === goalType)

  const estimatedMonths = useMemo(() => {
    if (!monthlyContribution || !targetAmount) return null
    const target = Number(targetAmount)
    const monthly = Number(monthlyContribution)
    if (monthly <= 0 || target <= 0) return null
    return Math.ceil(target / monthly)
  }, [monthlyContribution, targetAmount])

  const canNext = async () => {
    if (step === 1) {
      const valid = await trigger('goal_type')
      return valid
    }
    if (step === 2) {
      const valid = await trigger(['name'])
      return valid
    }
    if (step === 3) {
      const valid = await trigger(['target_amount'])
      return valid
    }
    return true
  }

  const handleNext = async () => {
    if (await canNext()) setStep(step + 1)
  }

  const handleBack = () => setStep(step - 1)

  const onSubmit = async (data: WizardData) => {
    const payload = {
      name: data.name,
      description: data.description || null,
      target_amount: data.target_amount,
      current_amount: data.start_from_zero ? '0' : null,
      goal_type: data.goal_type as GoalType,
      start_date: data.start_date,
      target_date: data.target_date,
      monthly_contribution: data.monthly_contribution || null,
      interest_rate: data.interest_rate || null,
      compound_frequency: (data.compound_frequency || null) as CompoundFrequency | null,
      account_id: data.account_id || null,
      category_id: data.category_id || null,
      priority: data.priority,
      auto_contribute: data.auto_contribute,
    } as CreateGoalRequest
    const result = await createMutation.mutateAsync(payload)
    navigate(`/goals/${result.data.id}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepIndicator currentStep={step} />

      <div className="min-h-[360px]">
        {/* Step 1: Goal Type */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {STEPS[0].title}
            </p>
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
                    {isSelected && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-500" />}
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', isSelected ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500')}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={cn('text-xs font-semibold', isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300')}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight">{opt.description}</span>
                  </button>
                )
              })}
            </div>
            {errors.goal_type && <p className="text-xs text-red-500">{errors.goal_type.message}</p>}
          </div>
        )}

        {/* Step 2: Basic Details */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{STEPS[1].title}</p>
            {selectedTypeConfig && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
                <Target className="h-4 w-4 text-violet-500" />
                <span className="text-sm text-violet-700 dark:text-violet-300">
                  Tipo: <strong>{selectedTypeConfig.label}</strong> — {selectedTypeConfig.description}
                </span>
                <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-violet-500 hover:underline">
                  Cambiar
                </button>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Nombre de la Meta <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                placeholder="ej: Viaje a Japon, Fondo de emergencia..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                autoFocus
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
        )}

        {/* Step 3: Financial Target */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{STEPS[2].title}</p>
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
                  autoFocus
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
                {estimatedMonths != null && (
                  <p className="text-xs text-gray-400 mt-1">
                    ~{estimatedMonths} meses ({Math.ceil(estimatedMonths / 12)} anos) para completar
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 p-3">
              <input
                type="checkbox"
                id="start_from_zero"
                {...register('start_from_zero')}
                className="rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-500/30"
              />
              <label htmlFor="start_from_zero" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-amber-500" />
                <div>
                  <span className="font-semibold">Empezar desde 0</span>
                  <p className="text-xs text-gray-400">No incluir mis activos actuales en el progreso inicial de la meta</p>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
        )}

        {/* Step 4: Configuration & Review */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{STEPS[3].title}</p>

            {/* Priority */}
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
                    <span className={cn('text-lg font-bold', priority === opt.value ? 'text-violet-600' : 'text-gray-400')}>{opt.value}</span>
                    <span className="text-[10px] text-gray-500 leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <AutoContributeToggle value={autoContribute} onChange={(v) => setValue('auto_contribute', v)} />

            {/* Advanced */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span>Configuracion Avanzada</span>
                <ChevronLeft className={cn('h-4 w-4 transition-transform', showAdvanced && '-rotate-90')} />
              </button>
              {showAdvanced && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tasa de Interes %</label>
                      <input {...register('interest_rate')} type="number" step="0.01" placeholder="5.0" className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Compound</label>
                      <select {...register('compound_frequency')} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-sm">
                        <option value="">Seleccionar...</option>
                        {COMPOUND_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Cuenta</label>
                      <select {...register('account_id')} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-sm">
                        <option value="">Sin cuenta</option>
                        {accountsData?.accounts?.map((acc) => (
                          <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Icono (URL)</label>
                      <input {...register('category_id')} placeholder="Opcional" className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-sm" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/5 dark:to-purple-500/5 border border-violet-200 dark:border-violet-500/20 p-4 space-y-2">
              <h4 className="text-sm font-semibold text-violet-700 dark:text-violet-300">Resumen de tu Meta</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500 dark:text-gray-400">Nombre:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{name || '—'}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Tipo:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{selectedTypeConfig?.label || '—'}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Objetivo:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{targetAmount ? formatCurrency(targetAmount) : '—'}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Mensual:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{monthlyContribution ? formatCurrency(monthlyContribution) : '—'}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Inicio:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{startDate ? new Date(startDate).toLocaleDateString('es-MX') : '—'}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Completar:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{targetDate ? new Date(targetDate).toLocaleDateString('es-MX') : '—'}</span></div>
              </div>
              {estimatedMonths != null && (
                <p className="text-xs text-violet-600 dark:text-violet-400 pt-1">
                  {estimatedMonths <= 1 ? 'Meta completada en 1 mes' : `Completaras tu meta en aproximadamente ${estimatedMonths} meses (${Math.ceil(estimatedMonths / 12)} anos)`}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={step === 1 ? () => navigate('/goals') : handleBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {step === 1 ? 'Cancelar' : 'Anterior'}
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {createMutation.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Creando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Crear Meta
              </>
            )}
          </button>
        )}
      </div>
    </form>
  )
}
