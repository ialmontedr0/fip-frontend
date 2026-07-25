import { cn } from '@/lib/utils'

interface Props {
  used: number
  limit: number
  className?: string
}

export default function UtilizationGauge({ used, limit, className }: Props) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (percentage >= 90) return { stroke: '#ef4444', bg: '#fecaca' }
    if (percentage >= 70) return { stroke: '#f59e0b', bg: '#fde68a' }
    return { stroke: '#10b981', bg: '#a7f3d0' }
  }

  const color = getColor()

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke={color.bg} strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn('text-lg font-bold', {
          'text-red-500': percentage >= 90,
          'text-amber-500': percentage >= 70 && percentage < 90,
          'text-emerald-500': percentage < 70,
        })}>
          {percentage.toFixed(1)}%
        </span>
        <span className="text-[10px] text-gray-400">utilizado</span>
      </div>
    </div>
  )
}
