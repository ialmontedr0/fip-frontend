import type { HabitAnalysis } from '@/types/ai'
import { cn } from '@/lib/utils'

interface HabitRadarChartProps {
  habits: HabitAnalysis | undefined
  categoryNames?: Record<string, string>
  className?: string
}

function HabitRadarChart({ habits, categoryNames = {}, className }: HabitRadarChartProps) {
  if (!habits || !habits.spending_frequency) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-sm text-gray-400', className)}>
        Sin datos de frecuencia
      </div>
    )
  }

  const categories = Object.entries(habits.spending_frequency)
    .sort(([, a], [, b]) => b.frequency_score - a.frequency_score)
    .slice(0, 8)

  if (categories.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-sm text-gray-400', className)}>
        Sin categorias para mostrar
      </div>
    )
  }

  const centerX = 120
  const centerY = 120
  const radius = 90
  const levels = 5

  const angleStep = (2 * Math.PI) / categories.length

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  }

  const gridPoints = Array.from({ length: levels }, (_, level) => {
    const r = ((level + 1) / levels) * radius
    return categories.map((_, i) => {
      const angle = angleStep * i - Math.PI / 2
      return { x: centerX + r * Math.cos(angle), y: centerY + r * Math.sin(angle) }
    })
  })

  const dataPoints = categories.map(([, freq], i) => getPoint(i, freq.frequency_score * 100))

  const getName = (id: string) => categoryNames[id] || id

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg width="240" height="240" viewBox="0 0 240 240">
        <defs>
          <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="radarDotGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#7c3aed" />
          </radialGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridPoints.map((points, level) => (
          <polygon
            key={level}
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="3,3"
            className="text-gray-200 dark:text-gray-600"
          />
        ))}

        {categories.map(([id], i) => {
          const end = getPoint(i, 100)
          return (
            <line
              key={id}
              x1={centerX}
              y1={centerY}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="2,4"
              className="text-gray-200 dark:text-gray-600"
            />
          )
        })}

        <polygon
          points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="url(#radarFillGrad)"
          stroke="url(#radarDotGrad)"
          strokeWidth="2"
          filter="url(#radarGlow)"
          className="transition-all duration-700 ease-out"
        />

        {dataPoints.map((p, i) => (
          <g key={i} className="group">
            <circle cx={p.x} cy={p.y} r="9" fill="url(#radarDotGrad)" className="transition-all duration-300 opacity-0 group-hover:opacity-20" />
            <circle cx={p.x} cy={p.y} r="4" fill="url(#radarDotGrad)" className="transition-all duration-300 group-hover:scale-150" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
          </g>
        ))}
      </svg>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3">
        {categories.map(([id, freq]) => (
          <div key={id} className="group flex items-center gap-2 cursor-default transition-all duration-200 hover:-translate-y-0.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 shadow-sm transition-transform duration-200 group-hover:scale-150" />
            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">{getName(id)}</span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">{Math.round(freq.frequency_score * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HabitRadarChart
