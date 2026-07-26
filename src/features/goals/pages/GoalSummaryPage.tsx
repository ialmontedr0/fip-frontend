import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, Plus, ArrowRight, TrendingUp, CircleDot, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react'
import { useGoalSummary, useGoals } from '../hooks/useGoals'
import GoalCard from '../components/GoalCard'
import EmptyGoalState from '../components/EmptyGoalState'
import { formatCurrency } from '../constants'
import { cn } from '@/lib/utils'

function AnimatedNumber({ value, suffix = '', duration = 1500 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return
    const startTime = Date.now()
    const startVal = 0
    const endVal = value
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(startVal + (endVal - startVal) * eased))
      if (progress < 1) requestAnimationFrame(animate)
      else setHasAnimated(true)
    }
    requestAnimationFrame(animate)
  }, [value, duration, hasAnimated])

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString('es-MX')}{suffix}
    </span>
  )
}

export default function GoalSummaryPage() {
  const navigate = useNavigate()
  const { data: summary, isLoading: summaryLoading } = useGoalSummary()
  const { data: goalsData, isLoading: goalsLoading } = useGoals({ status: 'active' })

  const isLoading = summaryLoading || goalsLoading
  const activeGoals = goalsData?.goals || []

  if (isLoading) {
    return (
      <div className="relative space-y-6 pb-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const totalTarget = summary ? Number(summary.total_target_amount) : 0
  const totalCurrent = summary ? Number(summary.total_current_amount) : 0
  const overallPct = summary?.overall_progress_pct ?? 0

  const goalHealth = [
    {
      label: 'En camino',
      count: summary?.on_track_count ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      borderColor: 'border-emerald-200 dark:border-emerald-500/20',
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      label: 'Atrasadas',
      count: summary?.behind_schedule_count ?? 0,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-500/10',
      borderColor: 'border-red-200 dark:border-red-500/20',
      gradient: 'from-red-500 to-rose-600',
    },
    {
      label: 'Activas',
      count: summary?.active_goals ?? 0,
      icon: CircleDot,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      borderColor: 'border-blue-200 dark:border-blue-500/20',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      label: 'Completadas',
      count: summary?.completed_goals ?? 0,
      icon: CheckCircle2,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10',
      borderColor: 'border-violet-200 dark:border-violet-500/20',
      gradient: 'from-violet-500 to-purple-600',
    },
  ]

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
      </div>

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Progreso de Metas</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Panorama general de tus metas financieras</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/goals')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Ver todas <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/goals/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Nueva Meta
            </button>
          </div>
        </div>
      </div>

      {/* Mega Stats */}
      {summary && (
        <div className="relative animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {goalHealth.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className={cn(
                    'relative rounded-2xl border p-4 overflow-hidden transition-all duration-300 hover:shadow-lg group',
                    item.bgColor, item.borderColor,
                  )}
                >
                  <div className={cn(
                    'absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none',
                    `bg-gradient-to-br ${item.gradient}`,
                  )} />
                  <div className="relative">
                    <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl mb-2', item.bgColor)}>
                      <Icon className={cn('h-5 w-5', item.color)} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                      <AnimatedNumber value={item.count} />
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Overall Progress & Financial Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Progreso General</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{summary.total_goals} metas en total</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - Math.min(overallPct, 100) / 100)}`}
                      className="transition-all duration-1000 ease-out"
                      style={{
                        stroke: overallPct >= 80 ? '#10b981' : overallPct >= 50 ? '#f59e0b' : overallPct >= 25 ? '#8b5cf6' : '#ef4444',
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{overallPct.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-600 transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(overallPct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Ahorrado: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(totalCurrent)}</strong>
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Total: <strong className="text-gray-900 dark:text-gray-100">{formatCurrency(totalTarget)}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-gray-600 dark:text-gray-400">{summary.on_track_count} en camino</span>
                    </div>
                    {summary.behind_schedule_count > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {summary.behind_schedule_count} atrasada{summary.behind_schedule_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Resumen Financiero</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Progreso de ahorro</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total metas</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100"><AnimatedNumber value={summary.total_goals} /></p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Ahorrado</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalCurrent)}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Falta</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatCurrency(totalTarget - totalCurrent)}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 border border-violet-100 dark:border-violet-500/20">
                  <p className="text-xs text-violet-600 dark:text-violet-400 mb-1">Completadas</p>
                  <p className="text-lg font-bold text-violet-600 dark:text-violet-400"><AnimatedNumber value={summary.completed_goals} suffix="" /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Goals */}
      <div className="relative animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
        {activeGoals.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-400" />
              <h2 className="text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                Metas Activas ({activeGoals.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGoals.map((goal, idx) => (
                <GoalCard key={goal.id} goal={goal} index={idx} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyGoalState
            message="No tienes metas activas"
            subtitle="Crea una meta para empezar a seguir tu progreso"
            onCreateClick={() => navigate('/goals/new')}
          />
        )}
      </div>
    </div>
  )
}
