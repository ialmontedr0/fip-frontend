import { Bot, CheckCircle, Play, Activity } from 'lucide-react'
import type { AutomationSummary } from '@/types/automations'

interface AutomationSummaryCardsProps {
  summary: AutomationSummary | undefined
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent shimmer" />
      <div className="flex items-start gap-3 relative">
        <div className="h-9 w-9 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  )
}

function AnimatedValue({ value }: { value: string }) {
  return (
    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 transition-all duration-700 ease-out">
      {value}
    </span>
  )
}

export default function AutomationSummaryCards({ summary }: AutomationSummaryCardsProps) {
  if (!summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const cards = [
    {
      label: 'Total reglas',
      value: summary.total_rules.toString(),
      subtext: 'reglas configuradas',
      icon: Bot,
      gradient: 'from-purple-500 to-indigo-600',
      progress: 100,
    },
    {
      label: 'Activas',
      value: summary.active_rules.toString(),
      subtext: `de ${summary.total_rules} reglas activas`,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      progress: summary.total_rules > 0 ? Math.round((summary.active_rules / summary.total_rules) * 100) : 0,
    },
    {
      label: 'Ejecuciones',
      value: summary.total_executions.toString(),
      subtext: 'ejecuciones totales',
      icon: Play,
      gradient: 'from-blue-500 to-cyan-600',
      progress: 100,
    },
    {
      label: 'Logs recientes',
      value: `${summary.recent_logs.success + summary.recent_logs.failed}`,
      subtext: `${summary.recent_logs.success} exitosos, ${summary.recent_logs.failed} fallidos`,
      icon: Activity,
      gradient: 'from-amber-500 to-orange-600',
      progress: summary.recent_logs.success + summary.recent_logs.failed > 0
        ? Math.round((summary.recent_logs.success / (summary.recent_logs.success + summary.recent_logs.failed)) * 100)
        : 0,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="relative overflow-hidden group rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-purple-200/50 dark:hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg shadow-${card.gradient.split(' ')[0].replace('from-', '')}-500/20 mb-3 relative`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider relative">
              {card.label}
            </p>
            <AnimatedValue value={card.value} />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 relative">
              {card.subtext}
            </p>
            {card.progress < 100 && (
              <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 ease-out"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
