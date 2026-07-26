import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Edit3, Trash2, RefreshCw, Zap,
  TrendingUp, Calendar, Target, PiggyBank,
  AlertTriangle, CheckCircle2, Clock, DollarSign,
  BarChart3, Info, Activity, History, ChevronRight,
} from 'lucide-react'
import { useGoal, useDeleteGoal, useUpdateGoal, useRefreshGoal, useRefreshPrediction } from '../hooks/useGoals'
import ProgressRing from '../components/ProgressRing'
import GoalTypeBadge from '../components/GoalTypeBadge'
import GoalStatusBadge from '../components/GoalStatusBadge'
import PrioritySelector from '../components/PrioritySelector'
import ProgressBar from '../components/ProgressBar'
import AutoContributeToggle from '../components/AutoContributeToggle'
import { formatCurrency, GOAL_TYPE_CONFIG } from '../constants'
import { cn } from '@/lib/utils'
import type { GoalType, GoalProgress, GoalPrediction, GoalMilestone } from '@/types/goals'

type Tab = 'overview' | 'timeline' | 'simulations'

function DetailRow({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors px-2 -mx-2 rounded-lg">
      <div className="flex items-center gap-2.5">
        <Icon className={cn('h-4 w-4', color || 'text-gray-400')} />
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
        {value}
      </div>
    </div>
  )
}

function MilestoneTimeline({ milestones }: { milestones?: GoalMilestone[] }) {
  if (!milestones || milestones.length === 0) return null

  const eventLabels: Record<string, { label: string; icon: React.ElementType; color: string; gradient: string }> = {
    goal_created: { label: 'Meta creada', icon: Target, color: 'text-violet-500', gradient: 'from-violet-500 to-purple-600' },
    milestone_25: { label: '25% completado', icon: Clock, color: 'text-blue-500', gradient: 'from-blue-400 to-blue-600' },
    milestone_50: { label: '50% completado', icon: Clock, color: 'text-emerald-500', gradient: 'from-emerald-400 to-emerald-600' },
    milestone_75: { label: '75% completado', icon: Clock, color: 'text-amber-500', gradient: 'from-amber-400 to-amber-600' },
    milestone_90: { label: '90% completado', icon: TrendingUp, color: 'text-orange-500', gradient: 'from-orange-400 to-orange-600' },
    goal_completed: { label: 'Meta completada!', icon: CheckCircle2, color: 'text-emerald-500', gradient: 'from-emerald-400 to-emerald-600' },
    prediction_update: { label: 'Prediccion actualizada', icon: Zap, color: 'text-purple-500', gradient: 'from-purple-400 to-purple-600' },
  }

  return (
    <div className="space-y-0 relative">
      {milestones.map((m, idx) => {
        const cfg = eventLabels[m.event_type] || { label: m.event_type, icon: Clock, color: 'text-gray-400', gradient: 'from-gray-400 to-gray-500' }
        const Icon = cfg.icon
        const isLast = idx === milestones.length - 1
        return (
          <div key={m.id} className="relative flex gap-4 group" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300',
                'bg-gradient-to-br shadow-sm',
                cfg.gradient,
                'group-hover:scale-110 group-hover:shadow-md',
              )}>
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 dark:from-gray-700 to-gray-100 dark:to-gray-800 mt-1.5" />}
            </div>
            <div className={cn('pb-6 flex-1', isLast ? 'pb-0' : '')}>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{cfg.label}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span>{m.created_at ? new Date(m.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                {m.pct_complete && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span className="font-medium text-violet-500">{parseFloat(m.pct_complete).toFixed(0)}% completado</span>
                  </>
                )}
              </div>
              {m.notes && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">&quot;{m.notes}&quot;</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TabButton({ tab, active, label, icon: Icon }: { tab: Tab; active: Tab; label: string; icon: React.ElementType; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {}}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
        active === tab
          ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: goal, isLoading } = useGoal(id)
  const deleteMutation = useDeleteGoal()
  const updateMutation = useUpdateGoal()
  const refreshMutation = useRefreshGoal()
  const predictMutation = useRefreshPrediction()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        setIsScrolled(rect.top < 0)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
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

  const progress = goal.progress as GoalProgress | undefined
  const prediction = goal.prediction as GoalPrediction | undefined
  const typeConfig = GOAL_TYPE_CONFIG[goal.goal_type as GoalType]
  const TypeIcon = typeConfig?.icon || Target
  const behind = progress?.behind_schedule || false
  const pct = progress?.pct_complete ?? 0

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar la meta "${goal.name}"?`)) return
    await deleteMutation.mutateAsync(goal.id)
    navigate('/goals')
  }

  return (
    <div className="relative space-y-6 pb-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
      </div>

      {/* Sticky Action Bar */}
      <div
        ref={headerRef}
        className={cn(
          'sticky top-0 z-30 transition-all duration-300 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8',
          isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-700/50' : '',
        )}
      >
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/goals')}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Volver"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {TypeIcon && <TypeIcon className={cn('h-5 w-5 hidden sm:block', typeConfig?.color)} />}
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none">{goal.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => refreshMutation.mutateAsync(goal.id)}
              disabled={refreshMutation.isPending}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors disabled:opacity-50"
              title="Recalcular progreso"
            >
              <RefreshCw className={cn('h-4 w-4', refreshMutation.isPending && 'animate-spin')} />
            </button>
            <button
              type="button"
              onClick={() => predictMutation.mutateAsync(goal.id)}
              disabled={predictMutation.isPending}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors disabled:opacity-50"
              title="Predecir"
            >
              <Zap className={cn('h-4 w-4', predictMutation.isPending && 'animate-pulse')} />
            </button>
            <button
              type="button"
              onClick={() => navigate(`/goals/${goal.id}/edit`)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Editar"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg', typeConfig?.bgColor || 'bg-gray-100 dark:bg-gray-700')}>
              <TypeIcon className={cn('h-7 w-7', typeConfig?.color || 'text-gray-500')} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{goal.name}</h1>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <GoalTypeBadge type={goal.goal_type} />
                <GoalStatusBadge status={goal.status} />
                <PrioritySelector value={goal.priority} readonly size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative flex items-center gap-2 border-b border-gray-100 dark:border-gray-700/50 pb-3 overflow-x-auto">
        <TabButton tab="overview" active={activeTab} label="Resumen" icon={Info} onClick={() => setActiveTab('overview')} />
        <TabButton tab="timeline" active={activeTab} label="Historial" icon={History} onClick={() => setActiveTab('timeline')} />
        <TabButton tab="simulations" active={activeTab} label="Simulaciones" icon={Activity} onClick={() => setActiveTab('simulations')} />
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Hero */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="transition-transform duration-500 hover:scale-105">
                  <ProgressRing progress={pct} size={140} strokeWidth={10} behindSchedule={behind}>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pct.toFixed(0)}%</span>
                      <p className="text-[10px] text-gray-500">completado</p>
                    </div>
                  </ProgressRing>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Objetivo</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(goal.target_amount)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Actual</p>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(goal.current_amount)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                      <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Falta</p>
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{progress ? formatCurrency(progress.remaining) : '$0'}</p>
                    </div>
                    <div className={cn('p-3 rounded-xl border', behind ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20')}>
                      <p className={cn('text-xs mb-1', behind ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>Estado</p>
                      <div className="flex items-center gap-1.5">
                        {behind ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-3 w-3" />
                            Atrasada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            En camino
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <ProgressBar current={goal.current_amount} target={goal.target_amount} pct={pct} size="lg" behindSchedule={behind} />
              </div>

              {progress && (
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <Calendar className="h-3.5 w-3.5" />
                    {progress.days_left} dias restantes ({progress.months_left} meses)
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <Clock className="h-3.5 w-3.5" />
                    Tiempo: {progress.time_pct}%
                  </span>
                  {progress.monthly_needed && (
                    <span className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium', behind ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500')}>
                      <DollarSign className="h-3.5 w-3.5" />
                      Necesario/mes: {formatCurrency(progress.monthly_needed)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Prediction Card */}
            {prediction && (
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 shadow-md">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Prediccion IA</h3>
                  <button
                    type="button"
                    onClick={() => predictMutation.mutateAsync(goal.id)}
                    className="ml-auto text-xs font-medium text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className={cn('h-3 w-3', predictMutation.isPending && 'animate-spin')} />
                    Actualizar
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10 border border-purple-100 dark:border-purple-500/20">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Completada</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {prediction.predicted_completion_date
                        ? new Date(prediction.predicted_completion_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' })
                        : '—'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 border border-emerald-100 dark:border-emerald-500/20">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Probabilidad</p>
                    <p className={cn('text-lg font-bold', prediction.predicted_probability != null && prediction.predicted_probability >= 0.7 ? 'text-emerald-600 dark:text-emerald-400' : prediction.predicted_probability != null && prediction.predicted_probability >= 0.4 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400')}>
                      {prediction.predicted_probability != null ? `${(prediction.predicted_probability * 100).toFixed(0)}%` : '—'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-100 dark:border-blue-500/20">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recomendado/mes</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {prediction.recommended_monthly ? formatCurrency(prediction.recommended_monthly) : '—'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700/30 dark:to-gray-800/30 border border-gray-100 dark:border-gray-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Actual/mes</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {goal.monthly_contribution ? formatCurrency(goal.monthly_contribution) : '—'}
                    </p>
                  </div>
                </div>
                {prediction.recommended_monthly && goal.monthly_contribution && (
                  <div className="mt-3">
                    {Number(prediction.recommended_monthly) > Number(goal.monthly_contribution) ? (
                      <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        Considera aumentar tu contribucion a {formatCurrency(prediction.recommended_monthly)}/mes para mejorar la probabilidad
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        Tu contribucion actual es suficiente segun la prediccion
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(`/goals/${goal.id}/simulate`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
              >
                <TrendingUp className="h-4 w-4" />
                Simular Meta
              </button>
              <button
                type="button"
                onClick={() => navigate(`/goals/${goal.id}/simulations`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                Ver Simulaciones
              </button>
            </div>
          </div>

          {/* Right Column: Details & Settings */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-violet-500" />
                Informacion
              </h3>
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                <DetailRow icon={Target} label="Tipo" value={typeConfig?.label || goal.goal_type} color={typeConfig?.color} />
                <DetailRow icon={PiggyBank} label="Objetivo" value={formatCurrency(goal.target_amount)} />
                <DetailRow icon={DollarSign} label="Actual" value={formatCurrency(goal.current_amount)} />
                {goal.monthly_contribution && <DetailRow icon={TrendingUp} label="Contribucion/mes" value={formatCurrency(goal.monthly_contribution)} />}
                <DetailRow icon={Calendar} label="Inicio" value={new Date(goal.start_date).toLocaleDateString('es-MX')} />
                <DetailRow icon={Calendar} label="Completar" value={new Date(goal.target_date).toLocaleDateString('es-MX')} />
                {goal.completed_date && <DetailRow icon={CheckCircle2} label="Completada" value={new Date(goal.completed_date).toLocaleDateString('es-MX')} />}
                {goal.interest_rate && <DetailRow icon={TrendingUp} label="Interes" value={`${goal.interest_rate}%`} />}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
              <AutoContributeToggle
                value={goal.auto_contribute}
                onChange={(v) => updateMutation.mutateAsync({ id: goal.id, data: { auto_contribute: v } })}
              />
            </div>

            {goal.description && (
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-violet-500" />
                  Descripcion
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{goal.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="animate-fade-in">
          {goal.milestones && goal.milestones.length > 0 ? (
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 max-w-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
                  <History className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Linea de Tiempo</h3>
                <span className="text-xs text-gray-400">({goal.milestones.length} eventos)</span>
              </div>
              <MilestoneTimeline milestones={goal.milestones} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <History className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Sin historial aun</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">Los hitos apareceran aqui a medida que avances en tu meta</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'simulations' && (
        <div className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <Activity className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Simulaciones</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Explora diferentes escenarios financieros para tu meta
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(`/goals/${goal.id}/simulate`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
              >
                <TrendingUp className="h-4 w-4" />
                Nueva Simulacion
              </button>
              <button
                type="button"
                onClick={() => navigate(`/goals/${goal.id}/simulations`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Ver guardadas
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
