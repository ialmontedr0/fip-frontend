import { useState, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  TrendingUp, Plus, Trash2, ChevronDown,
  DollarSign, Percent, Settings2, Brain, Database, Loader2, Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchExistingIncomes, fetchExistingExpenses } from '../api/simulations'
import { useCreateSimulation } from '../hooks/useSimulations'
import { formatCurrency } from '../constants'
import type { SimulationResponse } from '@/types/goals'

const sourceSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  amount: z.string().min(1, 'Monto requerido').refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Monto invalido'),
  frequency: z.enum(['monthly', 'quarterly', 'quadrimestral', 'yearly', 'one_time']),
  start_month: z.string().optional(),
  end_month: z.string().optional(),
  growth_rate: z.string().optional(),
})

const simulationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  monthly_contribution: z.string().min(1, 'La contribucion mensual es requerida').refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Monto invalido'),
  lump_sum: z.string().optional(),
  lump_sum_date: z.string().optional(),
  interest_rate: z.string().optional(),
  increase_pct: z.string().optional(),
  inflation_rate: z.string().optional(),
  enable_monte_carlo: z.boolean().default(false),
  income_sources: z.array(sourceSchema).default([]),
  expenses: z.array(sourceSchema).default([]),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof simulationSchema>

function IncomeSourceRow({
  index, register, errors: fieldErrors, onRemove,
}: {
  index: number
  register: any
  errors: any
  onRemove: () => void
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/20 border border-gray-200 dark:border-gray-700/50 space-y-3 relative">
      <button type="button" onClick={onRemove} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre</label>
          <input {...register(`income_sources.${index}.name`)} placeholder="Salario" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
          {fieldErrors?.name && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Monto</label>
          <input {...register(`income_sources.${index}.amount`)} type="number" min="0" step="0.01" placeholder="15000" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
          {fieldErrors?.amount && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.amount.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Frecuencia</label>
          <select {...register(`income_sources.${index}.frequency`)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30">
            <option value="monthly">Mensual</option>
            <option value="quarterly">Trimestral</option>
            <option value="quadrimestral">Cuatrimestral</option>
            <option value="yearly">Anual</option>
            <option value="one_time">Unico</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mes inicio</label>
          <input {...register(`income_sources.${index}.start_month`)} type="number" min="1" placeholder="1" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mes fin</label>
          <input {...register(`income_sources.${index}.end_month`)} type="number" min="1" placeholder="60" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Crecimiento anual %</label>
          <input {...register(`income_sources.${index}.growth_rate`)} type="number" min="0" step="0.1" placeholder="3.0" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
        </div>
      </div>
    </div>
  )
}

function ExpenseRow({
  index, register, errors: fieldErrors, onRemove,
}: {
  index: number
  register: any
  errors: any
  onRemove: () => void
}) {
  return (
    <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 space-y-3 relative">
      <button type="button" onClick={onRemove} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre</label>
          <input {...register(`expenses.${index}.name`)} placeholder="Renta" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
          {fieldErrors?.name && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Monto</label>
          <input {...register(`expenses.${index}.amount`)} type="number" min="0" step="0.01" placeholder="8000" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
          {fieldErrors?.amount && <p className="text-xs text-red-500 mt-0.5">{fieldErrors.amount.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Frecuencia</label>
          <select {...register(`expenses.${index}.frequency`)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30">
            <option value="monthly">Mensual</option>
            <option value="quarterly">Trimestral</option>
            <option value="quadrimestral">Cuatrimestral</option>
            <option value="yearly">Anual</option>
            <option value="one_time">Unico</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mes inicio</label>
          <input {...register(`expenses.${index}.start_month`)} type="number" min="1" placeholder="1" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mes fin</label>
          <input {...register(`expenses.${index}.end_month`)} type="number" min="1" placeholder="60" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Incremento anual %</label>
          <input {...register(`expenses.${index}.growth_rate`)} type="number" min="0" step="0.1" placeholder="3.0" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
        </div>
      </div>
    </div>
  )
}

  interface SimulationFormProps {
  goalId: string
  goalName: string
  defaultContribution?: string
  defaultInterestRate?: string
  onSuccess: (result: SimulationResponse) => void
}

export default function SimulationForm({
  goalId, goalName, defaultContribution, defaultInterestRate, onSuccess,
}: SimulationFormProps) {
  const createSimulation = useCreateSimulation(goalId)

  const form = useForm<FormData>({
    resolver: zodResolver(simulationSchema) as any,
    defaultValues: {
      name: `Simulacion - ${new Date().toLocaleDateString('es-MX')}`,
      monthly_contribution: defaultContribution || '5000',
      lump_sum: '',
      lump_sum_date: '',
      interest_rate: defaultInterestRate || '',
      increase_pct: '',
      inflation_rate: '',
      enable_monte_carlo: false,
      income_sources: [],
      expenses: [],
      notes: '',
    },
  })

  const { register, handleSubmit, watch, control, formState: { errors } } = form
  const incomeSources = useFieldArray({ control, name: 'income_sources' })
  const expenses = useFieldArray({ control, name: 'expenses' })

  const [sections, setSections] = useState({
    basic: true,
    income: false,
    escalation: false,
    expenses: false,
    advanced: false,
  })

  // Load from existing records
  const [loadingSource, setLoadingSource] = useState<'income' | 'expense' | null>(null)
  const [existingRecords, setExistingRecords] = useState<any[]>([])
  const [showExistingSelector, setShowExistingSelector] = useState<'income' | 'expense' | null>(null)
  const [existingSearch, setExistingSearch] = useState('')

  const loadExisting = useCallback(async (type: 'income' | 'expense') => {
    setLoadingSource(type)
    try {
      let records: any[] = []
      if (type === 'income') {
        const res = await fetchExistingIncomes()
        records = res.data.sources || []
      } else {
        const res = await fetchExistingExpenses()
        records = res.data.templates || []
      }
      setExistingRecords(records)
      setShowExistingSelector(type)
      setExistingSearch('')
    } catch {
      setExistingRecords([])
    } finally {
      setLoadingSource(null)
    }
  }, [])

  const addFromExisting = useCallback((record: any, type: 'income' | 'expense') => {
    const append_fn = type === 'income' ? incomeSources.append : expenses.append
    if (type === 'income') {
      append_fn({
        name: record.name || '',
        amount: String(Number(record.expected_amount) || 0),
        frequency: record.frequency === 'monthly' || record.frequency === 'quarterly' || record.frequency === 'quadrimestral' || record.frequency === 'yearly' || record.frequency === 'one_time' ? record.frequency : 'monthly',
        start_month: '',
        end_month: '',
        growth_rate: '',
      } as any)
    } else {
      append_fn({
        name: record.name || '',
        amount: String(Number(record.default_amount) || 0),
        frequency: 'monthly',
        start_month: '',
        end_month: '',
        growth_rate: '',
      } as any)
    }
  }, [])

  const filteredRecords = existingRecords.filter((r: any) => {
    if (!existingSearch) return true
    const q = existingSearch.toLowerCase()
    return (r.description || r.name || '').toLowerCase().includes(q)
  })

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const monthlyContribution = watch('monthly_contribution')
  const enableMonteCarlo = watch('enable_monte_carlo')
  const incomeSourceValues = watch('income_sources')
  const totalMonthlyIncome = (incomeSourceValues || [])
    .filter((s: any) => s.frequency === 'monthly')
    .reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0)

  const onSubmit = async (data: FormData) => {
    const payload = {
      name: data.name,
      monthly_contribution: data.monthly_contribution,
      lump_sum: data.lump_sum || null,
      lump_sum_date: data.lump_sum_date || null,
      interest_rate: data.interest_rate || null,
      increase_pct: data.increase_pct || null,
      inflation_rate: data.inflation_rate || null,
      enable_monte_carlo: data.enable_monte_carlo,
      income_sources: (data.income_sources || []).map((s) => ({
        name: s.name,
        amount: Number(s.amount),
        frequency: s.frequency,
        start_month: s.start_month ? Number(s.start_month) : undefined,
        end_month: s.end_month ? Number(s.end_month) : undefined,
        growth_rate: s.growth_rate ? Number(s.growth_rate) : undefined,
      })),
      expenses: (data.expenses || []).map((e) => ({
        name: e.name,
        amount: Number(e.amount),
        frequency: e.frequency,
        start_month: e.start_month ? Number(e.start_month) : undefined,
        end_month: e.end_month ? Number(e.end_month) : undefined,
        growth_rate: e.growth_rate ? Number(e.growth_rate) : undefined,
      })),
      notes: data.notes || null,
    }

    try {
      const result = await createSimulation.mutateAsync(payload as any)
      onSuccess(result.data)
    } catch {
      // error handled by mutation
    }
  }

  const sectionBtn = (key: keyof typeof sections, label: string, icon: React.ReactNode, isOpen: boolean) => (
    <button
      type="button"
      onClick={() => toggleSection(key)}
      className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-xl"
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
    </button>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Simular: {goalName}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">Proyecta diferentes escenarios para tu meta</p>
        </div>
      </div>

      {/* BASIC */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {sectionBtn('basic', 'Parametros basicos', <Settings2 className="h-4 w-4 text-gray-400" />, sections.basic)}
        {sections.basic && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre <span className="text-red-500">*</span></label>
              <input {...register('name')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-sm" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Aportacion mensual <span className="text-red-500">*</span></label>
                <input {...register('monthly_contribution')} type="number" step="0.01" min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-sm" />
                {errors.monthly_contribution && <p className="text-xs text-red-500 mt-1">{errors.monthly_contribution.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tasa de interes anual %</label>
                <input {...register('interest_rate')} type="number" step="0.01" min="0" placeholder="5.0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Deposito unico (Lump Sum)</label>
                <input {...register('lump_sum')} type="number" step="0.01" min="0" placeholder="50000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mes del deposito</label>
                <input {...register('lump_sum_date')} type="number" min="1" placeholder="1" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-sm" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INCOME SOURCES */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {sectionBtn('income', 'Ingresos futuros', <DollarSign className="h-4 w-4 text-gray-400" />, sections.income)}
        {sections.income && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Agrega fuentes de ingreso futuro como salarios, bonus, freelance, etc. Estos ingresos incrementaran tu capacidad de ahorro.
            </p>
            {incomeSources.fields.map((field, idx) => (
              <IncomeSourceRow
                key={field.id}
                index={idx}
                register={register}
                errors={(errors as any)?.income_sources?.[idx]}
                onRemove={() => incomeSources.remove(idx)}
              />
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => incomeSources.append({ name: '', amount: '', frequency: 'monthly', start_month: '', end_month: '', growth_rate: '' } as any)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar ingreso
              </button>
              <button
                type="button"
                onClick={() => loadExisting('income')}
                disabled={loadingSource === 'income'}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
              >
                {loadingSource === 'income' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
                Cargar desde fuentes de ingreso
              </button>
            </div>
            {totalMonthlyIncome > 0 && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  <span className="font-semibold">Ingreso mensual total: ${totalMonthlyIncome.toLocaleString('es-MX')}</span>
                  {monthlyContribution && Number(monthlyContribution) > 0 && (
                    <> — Capacidad total de ahorro: ${(totalMonthlyIncome + Number(monthlyContribution)).toLocaleString('es-MX')}/mes</>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ESCALATION & INFLATION */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {sectionBtn('escalation', 'Escalamiento e inflacion', <Percent className="h-4 w-4 text-gray-400" />, sections.escalation)}
        {sections.escalation && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Ajusta como cambiaran tus aportaciones y el valor de tu meta con el tiempo.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Incremento anual de aportacion %</label>
                <input {...register('increase_pct')} type="number" step="0.1" min="0" placeholder="3.0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-sm" />
                <p className="text-xs text-gray-400 mt-1">Ej: 3% = aumentas tu ahorro 3% cada ano</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Inflacion anual %</label>
                <input {...register('inflation_rate')} type="number" step="0.1" min="0" placeholder="4.0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-sm" />
                <p className="text-xs text-gray-400 mt-1">Ajusta la meta por inflacion (ej: 4% anual)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EXPENSES */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {sectionBtn('expenses', 'Gastos proyectados', <DollarSign className="h-4 w-4 text-gray-400" />, sections.expenses)}
        {sections.expenses && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Proyecta gastos futuros que reduciran tu capacidad de ahorro (renta, colegiatura, etc.).
            </p>
            {expenses.fields.map((field, idx) => (
              <ExpenseRow
                key={field.id}
                index={idx}
                register={register}
                errors={(errors as any)?.expenses?.[idx]}
                onRemove={() => expenses.remove(idx)}
              />
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => expenses.append({ name: '', amount: '', frequency: 'monthly', start_month: '', end_month: '', growth_rate: '' } as any)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar gasto
              </button>
              <button
                type="button"
                onClick={() => loadExisting('expense')}
                disabled={loadingSource === 'expense'}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
              >
                {loadingSource === 'expense' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
                Cargar desde plantillas de gasto
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADVANCED */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {sectionBtn('advanced', 'Opciones avanzadas', <Brain className="h-4 w-4 text-gray-400" />, sections.advanced)}
        {sections.advanced && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700/50">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Simulacion Monte Carlo</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ejecuta cientos de escenarios aleatorios para ver la distribucion de probabilidad</p>
              </div>
              <button
                type="button"
                onClick={() => form.setValue('enable_monte_carlo', !enableMonteCarlo)}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
                  enableMonteCarlo ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600',
                )}
                role="switch"
                aria-checked={enableMonteCarlo}
              >
                <span className={cn('pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200', enableMonteCarlo ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notas</label>
              <textarea {...register('notes')} rows={2} placeholder="Notas opcionales..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all text-sm resize-none" />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={createSimulation.isPending}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {createSimulation.isPending ? (
          <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Simulando...</>
        ) : (
          <><TrendingUp className="h-4 w-4" />Ejecutar Simulacion</>
        )}
      </button>

      {/* Existing Records Selector Modal */}
      {showExistingSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowExistingSelector(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {showExistingSelector === 'income' ? 'Seleccionar fuente de ingreso' : 'Seleccionar plantilla de gasto'}
              </h3>
              <button type="button" onClick={() => setShowExistingSelector(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={existingSearch}
                  onChange={(e) => setExistingSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                  <Database className="h-10 w-10 mb-2 opacity-40" />
                  <p className="text-sm">No se encontraron registros</p>
                </div>
              ) : (
                filteredRecords.map((rec: any) => (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => {
                      addFromExisting(rec, showExistingSelector)
                      setShowExistingSelector(null)
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {rec.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {showExistingSelector === 'income' ? (rec.frequency || '') : ''}
                        {showExistingSelector === 'expense' ? 'Gasto recurrente' : ''}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 ml-4 shrink-0">
                      +{formatCurrency(showExistingSelector === 'income' ? rec.expected_amount : rec.default_amount)}
                    </p>
                  </button>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowExistingSelector(null)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
