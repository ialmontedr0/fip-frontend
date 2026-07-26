import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ScoreGaugeProps {
  value?: number
  label?: string
  size?: number
  className?: string
  strokeWidth?: number
}

function ScoreGauge({ value = 0, label = '', size = 120, className, strokeWidth = 8 }: ScoreGaugeProps) {
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
        setAnimated(value)
        clearInterval(timer)
      } else {
        setAnimated(current)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animated / 100) * circumference
  const gradientId = animated >= 70 ? 'scoreGaugeGreen' : animated >= 40 ? 'scoreGaugeAmber' : 'scoreGaugeRed'

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size} height={size} viewBox="0 0 100 100"
        className={mounted ? 'rotate-0 scale-100 opacity-100' : 'rotate-[-12deg] scale-90 opacity-0'}
        style={{ transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out' }}
      >
        <defs>
          <linearGradient id="scoreGaugeGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="scoreGaugeAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="scoreGaugeRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <filter id="scoreGaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-gray-100 dark:text-gray-800" transform="rotate(-90 50 50)" />

        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={`url(#${gradientId})`} strokeWidth={strokeWidth + 4} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          opacity="0.12"
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000 ease-out"
        />

        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={`url(#${gradientId})`} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          filter="url(#scoreGaugeGlow)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums tracking-tight">{Math.round(animated)}</span>
        {label && <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">{label}</span>}
      </div>
    </div>
  )
}

export default ScoreGauge
