import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Target, TrendingUp, Calendar, CheckCircle2, DollarSign, PiggyBank,
  Brain, ChevronDown, ChevronUp, Wallet, Receipt,
  Sparkles, Save,
} from 'lucide-react'
import { useGoal } from '../hooks/useGoals'
import SimulationForm from '../components/simulationForm'
import ProjectionChart from '../components/ProjectionChart'
import MonteCarloChart from '../components/MonteCarloChart'
import RecommendationCard from '../components/RecommendationCard'
import { formatCurrency } from '../constants'
import { cn } from '@/lib/utils'
import type { SimulationResponse } from '@/types/goals'

function ResultCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color?: string }) {
  return (
    <div className={cn(
      'bg-white dark:bg-gray-800/80 rounded-xl border p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
      'border-gray-100 dark:border-gray-700/50',
    )}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={cn('h-3.5 w-3.5', color || 'text-gray-400')} />
        <p className="text-[10px] text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className={cn('text-sm font-semibold', color || 'text-gray-900 dark:text-gray-100')}>{value}</p>
    </div>
  )
}

function IncomeSummary({ incomes }: { incomes: SimulationResponse['income_sources'] }) {
  if (!incomes || incomes.length === 0) return null
  const totalMonthly = incomes
    .filter((s) => s.frequency === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0)
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
              {inc.frequency === 'monthly' ? '/mes' : inc.frequency === 'yearly' ? '/ano' : ''}
              {inc.growth_rate ? ` +${inc.growth_rate}%` : ''}
            </span>
          </div>
        ))}
        {totalMonthly > 0 && (
          <div className="flex items-center justify-between text-xs pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-700/50">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Total mensual</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalMonthly)}/mes</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ExpenseSummary({ expenses }: { expenses: SimulationResponse['expenses'] }) {
  if (!expenses || expenses.length === 0) return null
  const totalMonthly = expenses
    .filter((e) => e.frequency === 'monthly')
    .reduce((sum, e) => sum + e.amount, 0)
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
              {exp.frequency === 'monthly' ? '/mes' : exp.frequency === 'yearly' ? '/ano' : ''}
            </span>
          </div>
        ))}
        {totalMonthly > 0 && (
          <div className="flex items-center justify-between text-xs pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-700/50">
            <span className="font-semibold text-red-600 dark:text-red-400">Total mensual</span>
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
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null)
  const [showDetails, setShowDetails] = useState(true)
  const [showResults, setShowResults] = useState(false)

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
  const remaining = Math.max(targetAmount - Number(goal.current_amount), 0)
  const result = simulationResult

  const hasMonteCarlo = result?.monte_carlo && result.monte_carlo.length > 0
  const hasRecommendations = result?.recommendations && result.recommendations.length > 0
  const hasIncome = result?.income_sources && result.income_sources.length > 0
  const hasExpenses = result?.expenses && result.expenses.length > 0

  const handleSuccess = (res: SimulationResponse) => {
    setSimulationResult(res)
    setShowResults(true)
    setTimeout(() => {
      document.getElementById('simulation-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

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
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Actual</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(goal.current_amount)}</p>
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
              goalId={goal.id}
              goalName={goal.name}
              defaultContribution={goal.monthly_contribution || undefined}
              defaultInterestRate={goal.interest_rate || undefined}
              onSuccess={handleSuccess}
            />
          </div>

          {/* Results */}
          <div className="space-y-4" id="simulation-results">
            {result ? (
              <div className={cn(
                'space-y-4 transition-all duration-500',
                showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}>
                {/* Projection Chart */}
                <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                      <TrendingUp className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Proyeccion</h3>
                    <span className="text-[10px] text-gray-400 ml-auto">{result.name}</span>
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
                  <ResultCard icon={DollarSign} label="Contribuciones" value={formatCurrency(result.total_contributions)} color="text-blue-500" />
                  <ResultCard icon={PiggyBank} label="Interes" value={formatCurrency(result.total_interest)} color="text-emerald-500" />
                  <ResultCard icon={Target} label="Total acumulado" value={formatCurrency(Number(result.total_contributions) + Number(result.total_interest))} color="text-violet-500" />
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
                    onClick={() => { setSimulationResult(null); setShowResults(false) }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hover:shadow-md"
                  >
                    <Save className="h-4 w-4" />
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
          </div>
        </div>
      </div>
    </div>
  )
}
