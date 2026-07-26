import { useState, useEffect } from 'react'
import type { ProjectionMonth } from '@/types/ai'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProjectionChartProps {
  projections: ProjectionMonth[]
  className?: string
}

function ProjectionChart({ projections, className }: ProjectionChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!projections || projections.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm', className)}>
        <p className="text-sm text-gray-400">Sin datos de proyeccion</p>
      </div>
    )
  }

  const maxBalance = Math.max(...projections.map((p) => p.balance), 1)
  const height = 200
  const width = 100
  const padding = 8

  const points = projections.map((p, i) => {
    const x = padding + (i / Math.max(projections.length - 1, 1)) * (width - 2 * padding)
    const y = height - padding - (p.balance / maxBalance) * (height - 2 * padding)
    return { x, y, ...p }
  })

  const areaPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
    ` L${points[points.length - 1].x.toFixed(1)},${(height - padding).toFixed(1)}` +
    ` L${points[0].x.toFixed(1)},${(height - padding).toFixed(1)} Z`

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  const lastPoint = points[points.length - 1]

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const mouseX = ((e.clientX - rect.left) / rect.width) * width
    let nearest = 0
    let minDist = Infinity
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - mouseX)
      if (dist < minDist) {
        minDist = dist
        nearest = i
      }
    })
    setHoverIndex(nearest)
  }

  const handleMouseLeave = () => setHoverIndex(null)

  return (
    <div className={cn(
      'rounded-2xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300',
      'hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200/80',
      className,
    )}>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-br from-emerald-400/20 to-green-500/20 p-1.5 rounded-lg shadow-lg shadow-emerald-500/10">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Proyeccion</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }}>
        <defs>
          <linearGradient id="projectionAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#22c55e" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
          </linearGradient>
          <filter id="projectionLineGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0.25, 0.5, 0.75].map((ratio) => {
          const y = height - padding - ratio * (height - 2 * padding)
          return (
            <line key={ratio} x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" strokeWidth="0.3" strokeDasharray="1,3" className="text-gray-200 dark:text-gray-700" />
          )
        })}

        <path d={areaPath} fill="url(#projectionAreaGrad)" className="transition-all duration-500" />
        <path d={linePath} fill="none" stroke="#22c55e" strokeWidth="1.5" filter="url(#projectionLineGlow)" className="transition-all duration-500" />

        {points.map((p, i) => {
          const isLast = i === points.length - 1
          const isHovered = hoverIndex === i
          return (
            <circle
              key={i}
              cx={p.x} cy={p.y}
              r={isLast ? 3 : 2}
              fill="#22c55e"
              stroke={isLast ? 'white' : 'none'}
              strokeWidth={isLast ? 1 : 0}
              className="transition-all duration-300"
              opacity={isLast ? 1 : (hoverIndex === null ? (mounted ? 0.5 : 0) : (isHovered ? 1 : 0.2))}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          )
        })}

        {lastPoint && (
          <text x={lastPoint.x} y={lastPoint.y - 5} textAnchor="middle" fontSize="2.5" fontWeight="bold" fill="#374151" className="dark:fill-gray-200">
            {formatCurrency(lastPoint.balance)}
          </text>
        )}

        {hoverIndex !== null && (
          <>
            <line x1={points[hoverIndex].x} y1={padding} x2={points[hoverIndex].x} y2={height - padding} stroke="#22c55e" strokeWidth="0.4" strokeDasharray="1.5,2" opacity="0.4" />
            <rect x={points[hoverIndex].x - 10} y={Math.max(points[hoverIndex].y - 10, padding)} width="20" height="6" rx="1.5" fill="white" stroke="#e5e7eb" strokeWidth="0.3" opacity="0.95" />
            <text x={points[hoverIndex].x} y={Math.max(points[hoverIndex].y - 6, padding + 0.5)} textAnchor="middle" fontSize="2.5" fill="#374151" fontWeight="bold">
              {formatCurrency(points[hoverIndex].balance)}
            </text>
          </>
        )}
      </svg>

      <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
        <span>Mes 1</span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span>Mes {projections.length}</span>
      </div>
    </div>
  )
}

export default ProjectionChart
