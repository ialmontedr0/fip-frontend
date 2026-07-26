import { getProgressColor } from '../constants'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  children?: React.ReactNode
  behindSchedule?: boolean
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color,
  bgColor = 'stroke-gray-200 dark:stroke-gray-700',
  children,
  behindSchedule = false,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference
  const autoColor = color || getProgressColor(progress, behindSchedule)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={bgColor}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-1000 ease-out ${autoColor}`}
          style={{ stroke: 'currentColor' }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
