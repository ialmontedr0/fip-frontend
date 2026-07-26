import { useEffect, useRef, useState } from 'react'
import { Bell, CheckCheck, Activity, BarChart3 } from 'lucide-react'
import type { NotificationStatsResponse } from '@/types/notifications'

interface NotificationStatsProps {
  stats: NotificationStatsResponse | undefined
}

function AnimatedNumber({ value, label, subtext, icon: Icon, gradient, delay }: {
  value: number
  label: string
  subtext: string
  icon: typeof Bell
  gradient: string
  delay: number
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || animated.current) return
    animated.current = true
    const duration = 1200
    const startTime = Date.now() + delay
    const from = 0
    const step = () => {
      const elapsed = Date.now() - startTime
      if (elapsed <= 0) { requestAnimationFrame(step); return }
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    setTimeout(() => requestAnimationFrame(step), delay)
  }, [value, delay])

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl border border-gray-100/80 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-5 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 hover:border-purple-200/50 dark:hover:border-purple-500/30 overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute -inset-20 bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none" />

      {/* Icon with 3D effect */}
      <div className="relative mb-3">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/50 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className={`relative inline-flex p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
          <Icon className="h-5 w-5 text-white drop-shadow-sm" />
        </div>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      <p className="text-2xl font-black text-gray-900 dark:text-gray-100 tabular-nums tracking-tight">
        {display.toLocaleString()}
      </p>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium">{subtext}</p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100/80 dark:border-gray-700/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 shadow-sm animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-2.5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function NotificationStats({ stats }: NotificationStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const readCount = stats.total - stats.unread
  const readPct = stats.total > 0 ? Math.round((readCount / stats.total) * 100) : 0

  const cards = [
    {
      label: 'Total', value: stats.total, icon: Bell,
      gradient: 'from-purple-500 to-indigo-600',
      subtext: 'notificaciones recibidas',
    },
    {
      label: 'No leídas', value: stats.unread, icon: Activity,
      gradient: 'from-amber-500 to-orange-600',
      subtext: `${readPct}% leídas (${readCount})`,
    },
    {
      label: 'Leídas', value: readCount, icon: CheckCheck,
      gradient: 'from-emerald-500 to-green-600',
      subtext: 'notificaciones procesadas',
    },
    {
      label: 'Canales', value: Object.keys(stats.by_channel).length, icon: BarChart3,
      gradient: 'from-blue-500 to-cyan-600',
      subtext: Object.keys(stats.by_channel).join(', ') || 'Sin canales activos',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <AnimatedNumber
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          subtext={card.subtext}
          gradient={card.gradient}
          delay={idx * 100}
        />
      ))}
    </div>
  )
}
