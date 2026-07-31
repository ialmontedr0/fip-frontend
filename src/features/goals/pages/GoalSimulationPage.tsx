import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Target, TrendingUp, Calendar, CheckCircle2, DollarSign,
  PiggyBank, Brain, ChevronDown, ChevronUp, Wallet, Receipt, Sparkles, Save, Trash2, Loader2, History, Eye,
} from 'lucide-react'
import { useGoal } from '../hooks/useGoals'
import { useSimulations, useDeleteSimulation, useSimulation } from '../hooks/useSimulations'
import SimulationForm, { type SimulationFormHandle } from '../components/simulationForm'
import ProjectionChart from '../components/ProjectionChart'
import MonteCarloChart from '../components/MonteCarloChart'
import RecommendationCard from '../components/RecommendationCard'
import { formatCurrency } from '../constants'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import type { SimulationResponse } from '@/types/goals'
const FREQUENCY_LABELS: Record<string, string> = {
  monthly: '/mes',
  quarterly: '/trimestre',
  quadrimestral: '/cuatrimestre',
  yearly: '/año',
  one_time: '/único',
}

function ResultCard({ icon: Icon, label, value, color = 'text-gray-900 dark:text-gray-100' }: {
  icon: LucideIcon
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 hover:shadow-md transition-shadow hover:-translate-y-0.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className={cn('h-3.5 w-3.5', color)} />
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className={cn('text-sm font-bold', color)}>{value}</p>
    </div>
  )
}

function IncomeSummary({ incomes }: { incomes: SimulationResponse['income_sources'] }) {
  if (!incomes || incomes.length === 0) return null
  const totalMonthly = incomes.reduce((sum, e) => {
    const amount = Number(e.amount) || 0
    if (e.frequency === 'monthly') return sum + amount
    if (e.frequency === 'quarterly') return sum + amount / 3
    if (e.frequency === 'quadrimestral') return sum + amount / 4
    if (e.frequency === 'yearly') return sum + amount / 12
    return sum
  }, 0)
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-500">
          <Wallet className="h-3 w-3 text-white" />
        </div>
        <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Ingresos incluidos</h4>
      </div>
      <div className="space-y-1.5">
        {incomes.map((inc, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-0.5">
            <span className="text-gray-600 dark:text-gray-400">{inc.name}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(inc.amount)}
              {FREQUENCY_LABELS[inc.frequency] || ''}
              {inc.growth_rate ? ` +${inc.growth_rate}%` : ''}
            </span>
          </div>
        ))}
        {totalMonthly > 0 && (
          <div className="flex items-center justify-between text-xs pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-700/50">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Equivalente mensual</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalMonthly)}/mes</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ExpenseSummary({ expenses }: { expenses: SimulationResponse['expenses'] }) {
  if (!expenses || expenses.length === 0) return null
  const totalMonthly = expenses.reduce((sum, e) => {
    const amount = Number(e.amount) || 0
    if (e.frequency === 'monthly') return sum + amount
    if (e.frequency === 'quarterly') return sum + amount / 3
    if (e.frequency === 'quadrimestral') return sum + amount / 4
    if (e.frequency === 'yearly') return sum + amount / 12
    return sum
  }, 0)
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-rose-500">
          <Receipt className="h-3 w-3 text-white" />
        </div>
        <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Gastos proyectados</h4>
      </div>
      <div className="space-y-1.5">
        {expenses.map((exp, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-0.5">
            <span className="text-gray-600 dark:text-gray-400">{exp.name}</span>
            <span className="font-medium text-red-600 dark:text-red-400">
              -{formatCurrency(exp.amount)}
              {FREQUENCY_LABELS[exp.frequency] || ''}
            </span>
          </div>
        ))}
        {totalMonthly > 0 && (
          <div className="flex items-center justify-between text-xs pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-700/50">
            <span className="font-semibold text-red-600 dark:text-red-400">Equivalente mensual</span>
            <span className="font-semibold text-red-600 dark:text-red-400">-{formatCurrency(totalMonthly)}/mes</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GoalSimulationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: goal, isLoading } = useGoal(id)
  const formRef = useRef<SimulationFormHandle>(null)

  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null)
  const [showDetails, setShowDetails] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [loadingSaved, setLoadingSaved] = useState(false)
  const [selectedSimId, setSelectedSimId] = useState<string | null>(null)

  const { data: savedList } = useSimulations(id)
  const deleteSimulation = useDeleteSimulation(id!)
  const { data: selectedSim } = useSimulation(id, selectedSimId ?? undefined)

  const loadSaved = useCallback(async (simId: string) => {
    setSelectedSimId(simId)
  }, [])

  useEffect(() => {
    if (!selectedSim) return
    const frame = requestAnimationFrame(() => {
      setSimulationResult(selectedSim)
      setShowResults(true)
      setLoadingSaved(false)
    })
    return () => cancelAnimationFrame(frame)
  }, [selectedSim])

  const handlePreview = useCallback((result: SimulationResponse) => {
    setSelectedSimId(null)
    setSimulationResult(result)
    setShowResults(true)
    setTimeout(() => {
      document.getElementById('simulation-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])

  const handleSaved = useCallback((result: SimulationResponse) => {
    setSimulationResult(result)
    setShowResults(true)
  }, [])

  const handleSaveClick = async () => {
    setLoadingSaved(true)
    try {
      await formRef.current?.save()
    } catch {
      // error handled inside form
    } finally {
      setLoadingSaved(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Target className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Meta no encontrada</h2>
        <button type="button" onClick={() => navigate('/goals')} className="mt-4 text-sm text-violet-500 hover:underline">
          Volver a metas
        </button>
      </div>
    )
  }

  const targetAmount = Number(goal.target_amount)
  const currentAmount = Number(goal.current_amount) || 0
  const remaining = Math.max(targetAmount - currentAmount, 0)
  const result = simulationResult

  const hasMonteCarlo = result?.monte_carlo && result.monte_carlo.length > 0
  const hasRecommendations = result?.recommendations && result.recommendations.length > 0
  const hasIncome = result?.income_sources && result.income_sources.length > 0
  const hasExpenses = result?.expenses && result.expenses.length > 0
  const isSaved = !!result?.saved || !!result?.id

  const totalAccumulated = (() => {
    const last = result?.projection?.[result.projection.length - 1]
    if (last) return last.cumulative
    return currentAmount
      + (Number(result?.total_contributions) || 0)
      + (Number(result?.total_interest) || 0)
  })()

  const savedSimulations = savedList?.simulations || []

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => navigate(`/goals/${id}`)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver a Detalle
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Simular: {goal.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Incluye ingresos futuros, inflacion, escalamiento y mas
            </p>
          </div>
        </div>

        {/* Goal Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Objetivo</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(targetAmount)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-emerald-100 dark:border-emerald-500/20 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Patrimonio actual</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(currentAmount)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-amber-100 dark:border-amber-500/20 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Falta</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatCurrency(remaining)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fecha Limite</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {new Date(goal.target_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simulation Form */}
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
            <SimulationForm
              ref={formRef}
              goalId={goal.id}
              goalName={goal.name}
              goalStartDate={goal.start_date}
              defaultContribution={goal.monthly_contribution || undefined}
              defaultInterestRate={goal.interest_rate || undefined}
              onPreview={handlePreview}
              onSaved={handleSaved}
            />
          </div>

          {/* Results */}
          <div className="space-y-4" id="simulation-results">
            {result ? (
              <div className={cn(
                'space-y-4 transition-all duration-500',
                showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}>
                {/* Save bar for previews */}
                {!isSaved && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-500/15 dark:to-purple-500/15 border border-violet-200 dark:border-violet-500/30">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        <Eye className="h-4 w-4 text-violet-500" />
                        Vista previa del escenario
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Este resultado aun no se ha guardado. Guardalo para consultarlo despues.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveClick}
                      disabled={loadingSaved}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loadingSaved ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Guardar Simulacion
                    </button>
                  </div>
                )}

                {/* Projection Chart */}
                <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                      <TrendingUp className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Proyeccion</h3>
                    <span className="text-[10px] text-gray-400 ml-auto">{result.name}</span>
                    {isSaved && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        Guardada
                      </span>
                    )}
                  </div>
                  <ProjectionChart
                    projection={result.projection}
                    targetAmount={targetAmount}
                    showIncome={hasIncome}
                    showInflationTarget={!!result.inflation_rate}
                  />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <ResultCard icon={Calendar} label="Completada" value={
                    result.predicted_completion_date
                      ? new Date(result.predicted_completion_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' })
                      : '—'
                  } color="text-violet-500" />
                  <ResultCard icon={CheckCircle2} label="Probabilidad" value={
                    result.predicted_probability != null ? `${(result.predicted_probability * 100).toFixed(0)}%` : '—'
                  } color="text-emerald-500" />
                  <ResultCard icon={TrendingUp} label="Meses" value={`${result.months_to_complete ?? '—'} meses`} />
                  <ResultCard icon={PiggyBank} label="Patrimonio inicial" value={formatCurrency(currentAmount)} color="text-emerald-500" />
                  <ResultCard icon={DollarSign} label="Aportes nuevos" value={formatCurrency(result.total_contributions)} color="text-blue-500" />
                  <ResultCard icon={Target} label="Total acumulado" value={formatCurrency(totalAccumulated)} color="text-violet-500" />
                </div>

                {/* Income & Expense Detail */}
                {(hasIncome || hasExpenses) && (
                  <button
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Detalle de ingresos y gastos
                    </span>
                    {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                )}
                {showDetails && (
                  <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300')}>
                    <IncomeSummary incomes={result.income_sources} />
                    <ExpenseSummary expenses={result.expenses} />
                  </div>
                )}

                {/* Monte Carlo */}
                {hasMonteCarlo && (
                  <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <MonteCarloChart data={result.monte_carlo!} targetAmount={targetAmount} />
                  </div>
                )}

                {/* Recommendations */}
                {hasRecommendations && result.monthly_contribution && (
                  <RecommendationCard
                    recommendations={result.recommendations!}
                    currentContribution={Number(result.monthly_contribution)}
                    targetAmount={targetAmount}
                  />
                )}

                {/* Parameters */}
                <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                      <TrendingUp className="h-3 w-3 text-gray-500" />
                    </div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Parametros de la simulacion</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                      <span className="text-gray-400">Aportacion:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{formatCurrency(result.monthly_contribution)}/mes</span>
                    </div>
                    {result.interest_rate && <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"><span className="text-gray-400">Interes:</span> <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{result.interest_rate}%</span></div>}
                    {result.increase_pct && <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"><span className="text-gray-400">Escalamiento:</span> <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{result.increase_pct}%/ano</span></div>}
                    {result.inflation_rate && <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"><span className="text-gray-400">Inflacion:</span> <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{result.inflation_rate}%/ano</span></div>}
                    {result.lump_sum && <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"><span className="text-gray-400">Lump sum:</span> <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{formatCurrency(result.lump_sum)}</span></div>}
                    {hasMonteCarlo && <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-500/10"><span className="text-gray-400">Monte Carlo:</span> <span className="font-medium text-violet-600 dark:text-violet-400 ml-1">Activado</span></div>}
                  </div>
                </div>

                {/* New Simulation */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setSimulationResult(null); setShowResults(false); setSelectedSimId(null) }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hover:shadow-md"
                  >
                    <Sparkles className="h-4 w-4" />
                    Nueva Simulacion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
                <Brain className="h-24 w-24 mb-6 opacity-10" />
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  <p className="text-base font-semibold text-gray-500 dark:text-gray-400">Completa el formulario</p>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-sm leading-relaxed">
                  Ajusta los parametros, agrega ingresos futuros, inflacion, escalamiento y mas. Luego ejecuta la simulacion para ver una proyeccion completa con graficos, metricas y recomendaciones.
                </p>
              </div>
            )}

            {/* Saved simulations */}
            {savedSimulations.length > 0 && (
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-500">
                    <History className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Simulaciones guardadas</h4>
                </div>
                <div className="space-y-2">
                  {savedSimulations.map((sim) => (
                    <div
                      key={sim.id}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-xl border transition-colors',
                        selectedSimId === sim.id ? 'border-violet-300 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-500/10' : 'border-gray-200 dark:border-gray-700/50 hover:border-violet-200 dark:hover:border-violet-500/30',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => { setLoadingSaved(true); loadSaved(sim.id) }}
                        className="flex-1 text-left min-w-0"
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{sim.name}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {sim.monthly_contribution && `${formatCurrency(sim.monthly_contribution)}/mes · `}
                          {sim.predicted_probability != null && `${(sim.predicted_probability * 100).toFixed(0)}% · `}
                          {sim.created_at && new Date(sim.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSimulation.mutate(sim.id)}
                        disabled={deleteSimulation.isPending}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        aria-label="Eliminar simulacion"
                      >
                        {deleteSimulation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
