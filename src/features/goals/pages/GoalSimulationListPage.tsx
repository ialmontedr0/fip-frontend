import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, TrendingUp, Plus, Trash2, ChevronDown, ChevronUp, Target as TargetIcon,
  ExternalLink, Award, BarChart3,
} from 'lucide-react'
import { useGoal } from '../hooks/useGoals'
import { useSimulations, useDeleteSimulation } from '../hooks/useSimulations'
import { formatCurrency } from '../constants'
import type { SimulationListItem } from '@/types/goals'
import { cn, formatISODate } from '@/lib/utils'

function SimulationCard({ simulation, goalId, isBest }: { simulation: SimulationListItem; goalId: string; isBest: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const deleteSim = useDeleteSimulation(goalId)
  const navigate = useNavigate()
  const prob = simulation.predicted_probability != null ? simulation.predicted_probability * 100 : null

  return (
    <div
      className={cn(
        'group bg-white dark:bg-gray-800/80 rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg',
        isBest
          ? 'border-emerald-200 dark:border-emerald-500/30 ring-2 ring-emerald-500/20 dark:ring-emerald-500/10'
          : 'border-gray-100 dark:border-gray-700/50 hover:border-violet-200 dark:hover:border-violet-500/30',
      )}
    >
      {isBest && (
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[10px] font-semibold tracking-wider uppercase">
          <Award className="h-3 w-3" />
          Mejor probabilidad
        </div>
      )}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
            isBest ? 'bg-gradient-to-br from-emerald-400 to-green-600' : 'bg-gradient-to-br from-violet-500 to-purple-600',
          )}>
            {isBest ? <Award className="h-5 w-5 text-white" /> : <TrendingUp className="h-5 w-5 text-white" />}
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{simulation.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatCurrency(simulation.monthly_contribution)}/mes
              {simulation.months_to_complete ? ` · ${simulation.months_to_complete} meses` : ''}
              {prob != null ? (
                <span className={cn('ml-1', prob >= 80 ? 'text-emerald-500' : prob >= 50 ? 'text-amber-500' : 'text-red-500')}>
                  · {prob.toFixed(0)}% prob.
                </span>
              ) : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {simulation.predicted_completion_date && (
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
              {formatISODate(simulation.predicted_completion_date, 'short', 'es-MX')}
            </span>
          )}
          {prob != null && (
            <div className={cn(
              'flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold',
              prob >= 80 ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
              prob >= 50 ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
              'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400',
            )}>
              {prob.toFixed(0)}
            </div>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/goals/${goalId}/simulations/${simulation.id}`)
            }}
            className="p-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 text-gray-400 hover:text-violet-500 transition-colors"
            title="Ver detalle"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm(`Eliminar simulacion "${simulation.name}"?`)) {
                deleteSim.mutateAsync(simulation.id)
              }
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700/50 pt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Contribucion/mes</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(simulation.monthly_contribution)}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Total</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {simulation.total_contributions ? formatCurrency(simulation.total_contributions) : '—'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Probabilidad</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {prob != null ? `${prob.toFixed(0)}%` : '—'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Completada</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {simulation.predicted_completion_date
                  ? formatISODate(simulation.predicted_completion_date, 'short', 'es-MX')
                  : '—'}
              </p>
            </div>
          </div>

          {simulation.interest_rate && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tasa de interes: {simulation.interest_rate}%
              {simulation.increase_pct ? ` · Incremento anual: ${simulation.increase_pct}%` : ''}
            </p>
          )}

          {simulation.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              Notas: {simulation.notes}
            </p>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/goals/${goalId}/simulations/${simulation.id}`)
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Ver detalle completo
          </button>
        </div>
      )}
    </div>
  )
}

export default function GoalSimulationListPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: goal, isLoading: goalLoading } = useGoal(id)
  const { data: simulationsData, isLoading: simsLoading } = useSimulations(id)

  const isLoading = goalLoading || simsLoading

  const simulations = simulationsData?.simulations || []

  const bestSim = useMemo(() => {
    if (simulations.length === 0) return null
    return simulations.reduce((best, s) => {
      const bestProb = best.predicted_probability ?? 0
      const sProb = s.predicted_probability ?? 0
      return sProb > bestProb ? s : best
    })
  }, [simulations])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <TargetIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Meta no encontrada</h2>
        <button type="button" onClick={() => navigate('/goals')} className="mt-4 text-sm text-violet-500 hover:underline">
          Volver a metas
        </button>
      </div>
    )
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
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Detalle
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Simulaciones: {goal.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {simulations.length} simulacion{simulations.length !== 1 ? 'es' : ''} guardada{simulations.length !== 1 ? 's' : ''}
                {simulations.length > 1 && bestSim && (
                  <span className="ml-1">· Mejor prob: {(bestSim.predicted_probability! * 100).toFixed(0)}%</span>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/goals/${id}/simulate`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Nueva Simulacion
          </button>
        </div>

        {simulations.length > 0 ? (
          <div className="space-y-4">
            {simulations.map((sim) => (
              <SimulationCard
                key={sim.id}
                simulation={sim}
                goalId={goal.id}
                isBest={bestSim?.id === sim.id && sim.predicted_probability != null && sim.predicted_probability >= 0.8}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <TrendingUp className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No hay simulaciones
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Crea una simulacion para proyectar diferentes escenarios y encontrar la mejor estrategia para tu meta
            </p>
            <button
              type="button"
              onClick={() => navigate(`/goals/${id}/simulate`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
            >
              <TrendingUp className="h-4 w-4" />
              Crear Simulacion
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
