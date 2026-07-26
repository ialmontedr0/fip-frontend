import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface HealthScoreGaugeProps {
  value?: number
  size?: number
  className?: string
}

function HealthScoreGauge({ value = 0, size = 180, className }: HealthScoreGaugeProps) {
  const [animated, setAnimated] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (value === 0) {
      setAnimated(0)
      return
    }
    const duration = 800
    const steps = 30
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setAnimated(Math.min(value, 100))
        clearInterval(timer)
      } else {
        setAnimated(Math.min(current, 100))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  const radius = 75
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animated / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size} height={size} viewBox="0 0 180 180"
        className={mounted ? 'rotate-0 scale-100 opacity-100' : 'rotate-[-12deg] scale-90 opacity-0'}
        style={{ transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out' }}
      >
        <defs>
          <linearGradient id="healthGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="healthGaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="90" cy="90" r={radius} fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-100 dark:text-gray-800" transform="rotate(-90 90 90)" />

        <circle
          cx="90" cy="90" r={radius} fill="none"
          stroke="url(#healthGaugeGrad)" strokeWidth="16" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          opacity="0.1"
          className="animate-pulse transition-all duration-1000 ease-out"
          transform="rotate(-90 90 90)"
        />

        <circle
          cx="90" cy="90" r={radius} fill="none"
          stroke="url(#healthGaugeGrad)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          filter="url(#healthGaugeGlow)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-gray-900 dark:text-white tabular-nums tracking-tight">{Math.round(animated)}</span>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">Salud Financiera</span>
      </div>
    </div>
  )
}

export default HealthScoreGauge
