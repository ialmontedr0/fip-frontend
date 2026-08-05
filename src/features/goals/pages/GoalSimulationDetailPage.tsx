import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Target, TrendingUp, Calendar, CheckCircle2, DollarSign, PiggyBank,
  Brain, ChevronDown, ChevronUp, Wallet, Receipt, Loader2,
  Info,
} from 'lucide-react'
import { useGoal } from '../hooks/useGoals'
import { useSimulation } from '../hooks/useSimulations'
import ProjectionChart from '../components/ProjectionChart'
import MonteCarloChart from '../components/MonteCarloChart'
import RecommendationCard from '../components/RecommendationCard'
import { formatCurrency } from '../constants'
import { cn, formatISODate } from '@/lib/utils'

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

function IncomeSummary({ incomes }: { incomes: Array<{ name: string; amount: number; frequency: string; growth_rate?: number }> }) {
  if (!incomes || incomes.length === 0) return null
  const totalMonthly = incomes.filter((s) => s.frequency === 'monthly').reduce((sum, s) => sum + s.amount, 0)
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

function ExpenseSummary({ expenses }: { expenses: Array<{ name: string; amount: number; frequency: string; growth_rate?: number }> }) {
  if (!expenses || expenses.length === 0) return null
  const totalMonthly = expenses.filter((e) => e.frequency === 'monthly').reduce((sum, e) => sum + e.amount, 0)
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

export default function GoalSimulationDetailPage() {
  const { id, simId } = useParams<{ id: string; simId: string }>()
  const navigate = useNavigate()
  const { data: goal, isLoading: goalLoading } = useGoal(id)
  const { data: result, isLoading: simLoading } = useSimulation(id, simId)
  const [showDetails, setShowDetails] = useState(true)

  const isLoading = goalLoading || simLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Cargando simulacion...</p>
        </div>
      </div>
    )
  }

  if (!goal || !result) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Target className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Simulacion no encontrada</h2>
        <button type="button" onClick={() => navigate(`/goals/${id}/simulations`)} className="mt-4 text-sm text-violet-500 hover:underline">
          Volver a simulaciones
        </button>
      </div>
    )
  }

  const targetAmount = Number(goal.target_amount)
  const startingAmount = Number(result.starting_amount ?? goal.current_amount) || 0
  const lastPoint = result.projection?.[result.projection.length - 1]
  const totalAccumulated = lastPoint
    ? lastPoint.cumulative
    : startingAmount + (Number(result.total_contributions) || 0) + (Number(result.total_interest) || 0)
  const hasMonteCarlo = result?.monte_carlo && result.monte_carlo.length > 0
  const hasRecommendations = result?.recommendations && result.recommendations.length > 0
  const hasIncome = result?.income_sources && result.income_sources.length > 0
  const hasExpenses = result?.expenses && result.expenses.length > 0
  const prob = result.predicted_probability != null ? (result.predicted_probability * 100) : null

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
      </div>

      <div className="relative">
        {/* Back + Title */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <button
            type="button"
            onClick={() => navigate(`/goals/${id}/simulations`)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Volver a Simulaciones
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Creada: {result.created_at ? new Date(result.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{result.name}</h1>
              {prob != null && (
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  prob >= 80 ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  prob >= 50 ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                  'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400',
                )}>
                  {prob.toFixed(0)}% prob.
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>{goal.name}</span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span>{formatCurrency(result.monthly_contribution)}/mes</span>
              {result.months_to_complete && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span>{result.months_to_complete} meses</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Projection Chart */}
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 mb-6 hover:shadow-md transition-shadow animate-fade-in">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
          <ResultCard icon={Calendar} label="Completada" value={
            result.predicted_completion_date
              ? formatISODate(result.predicted_completion_date, 'short', 'es-MX')
              : '—'
          } color="text-violet-500" />
          <ResultCard icon={CheckCircle2} label="Probabilidad" value={prob != null ? `${prob.toFixed(0)}%` : '—'} color={prob != null && prob >= 80 ? 'text-emerald-500 text-emerald-500' : prob != null && prob >= 50 ? 'text-amber-500' : 'text-red-500'} />
          <ResultCard icon={TrendingUp} label="Meses" value={`${result.months_to_complete ?? '—'} meses`} />
          <ResultCard icon={PiggyBank} label="Patrimonio inicial" value={formatCurrency(startingAmount)} color="text-emerald-500" />
          <ResultCard icon={DollarSign} label="Contribuciones" value={formatCurrency(result.total_contributions)} color="text-blue-500" />
          <ResultCard icon={Target} label="Total acumulado" value={formatCurrency(totalAccumulated)} color="text-violet-500" />
        </div>

        {/* Income & Expense */}
        {(hasIncome || hasExpenses) && (
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-4"
          >
            <span className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Detalle de ingresos y gastos
            </span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-in">
            <IncomeSummary incomes={result.income_sources || []} />
            <ExpenseSummary expenses={result.expenses || []} />
          </div>
        )}

        {/* Monte Carlo */}
        {hasMonteCarlo && (
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 mb-6 hover:shadow-md transition-shadow animate-fade-in">
            <MonteCarloChart data={result.monte_carlo!} targetAmount={targetAmount} />
          </div>
        )}

        {/* Recommendations */}
        {hasRecommendations && result.monthly_contribution && (
          <div className="mb-6 animate-fade-in">
            <RecommendationCard
              recommendations={result.recommendations!}
              currentContribution={Number(result.monthly_contribution)}
              targetAmount={targetAmount}
            />
          </div>
        )}

        {/* Parameters */}
        <div className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 hover:shadow-md transition-shadow animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
              <Info className="h-3 w-3 text-gray-500" />
            </div>
            <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Parametros de la simulacion</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"><span className="text-gray-400">Aportacion:</span> <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{formatCurrency(result.monthly_contribution)}/mes</span></div>
            {result.interest_rate && <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"><span className="text-gray-400">Interes:</span> <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{result.interest_rate}%</span></div>}
            {result.increase_pct && <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"><span className="text-gray-400">Escalamiento:</span> <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{result.increase_pct}%/ano</span></div>}
            {result.inflation_rate && <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"><span className="text-gray-400">Inflacion:</span> <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{result.inflation_rate}%/ano</span></div>}
            {result.lump_sum && <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"><span className="text-gray-400">Lump sum:</span> <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">{formatCurrency(result.lump_sum)}</span></div>}
            {hasMonteCarlo && <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-500/10"><span className="text-gray-400">Monte Carlo:</span> <span className="font-medium text-violet-600 dark:text-violet-400 ml-1">Activado</span></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
