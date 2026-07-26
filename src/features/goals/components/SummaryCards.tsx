import { Target, TrendingUp, CheckCircle2, AlertTriangle, CircleDot, Clock } from 'lucide-react'
import ProgressRing from './ProgressRing'
import { formatCurrency } from '../constants'
import type { GoalSummaryResponse } from '@/types/goals'

interface SummaryCardsProps {
  summary?: GoalSummaryResponse
  loading?: boolean
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 animate-pulse">
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

export default function SummaryCards({ summary, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!summary) return null

  const cards = [
    {
      label: 'Total Metas',
      value: summary.total_goals,
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'Activas',
      value: summary.active_goals,
      icon: CircleDot,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Completadas',
      value: summary.completed_goals,
      icon: CheckCircle2,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10',
    },
    {
      label: 'En Progreso',
      value: `${summary.on_track_count}/${summary.active_goals}`,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Atrasadas',
      value: summary.behind_schedule_count,
      icon: AlertTriangle,
      color: summary.behind_schedule_count > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400',
      bgColor: summary.behind_schedule_count > 0 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-gray-700/50',
    },
    {
      label: 'Progreso Global',
      value: `${summary.overall_progress_pct.toFixed(1)}%`,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] dark:opacity-[0.06] pointer-events-none bg-current" />
            <div className="relative">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${card.bgColor}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {card.label}
              </p>
            </div>
          </div>
        )
      })}

      {/* Overall Progress Ring */}
      <div className="lg:col-span-6 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
        <div className="flex items-center gap-6">
          <ProgressRing progress={summary.overall_progress_pct} size={100} strokeWidth={8}>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {summary.overall_progress_pct.toFixed(0)}%
            </span>
          </ProgressRing>
          <div className="flex-1 space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Progreso General</h4>
            <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-600 transition-all duration-700"
                style={{ width: `${Math.min(summary.overall_progress_pct, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Total ahorrado: {formatCurrency(summary.total_current_amount)}</span>
              <span>Objetivo total: {formatCurrency(summary.total_target_amount)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {summary.on_track_count} en camino
              </span>
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
  )
}
