import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'

interface UtilizationGaugeProps {
  percentage: number
  size?: number
  status: string
  creditLimit?: string
  usedCredit?: string
  label?: string
  animate?: boolean
}

const STATUS_GRADIENTS: Record<string, { from: string; to: string; glow: string }> = {
  healthy: { from: '#22c55e', to: '#16a34a', glow: 'rgba(34,197,94,0.3)' },
  warning: { from: '#eab308', to: '#d97706', glow: 'rgba(234,179,8,0.3)' },
  danger: { from: '#ef4444', to: '#dc2626', glow: 'rgba(239,68,68,0.3)' },
}

export default function UtilizationGauge({
  percentage,
  size = 200,
  status,
  creditLimit,
  usedCredit,
  label,
  animate = true,
}: UtilizationGaugeProps) {
  const [animatedPct, setAnimatedPct] = useState(0)
  const strokeWidth = size * 0.06
  const radius = (size - strokeWidth) / 2
  const circumference = Math.PI * radius
  const clampedPct = Math.min(Math.max(percentage, 0), 100)
  const offset = circumference * (1 - animatedPct / 100)
  const colors = STATUS_GRADIENTS[status] || STATUS_GRADIENTS.healthy
  const center = size / 2
  const gaugeHeight = size / 2 + size * 0.1

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimatedPct(clampedPct), 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedPct(clampedPct)
    }
  }, [clampedPct, animate])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative">
        <svg width={size} height={gaugeHeight} viewBox={`0 0 ${size} ${gaugeHeight}`} className="drop-shadow-sm">
          <defs>
            <linearGradient id={`gauge-grad-${status}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
            <filter id={`gauge-glow-${status}`}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <path
            d={`M ${strokeWidth},${center} A ${radius},${radius} 0 0,1 ${size - strokeWidth},${center}`}
            fill="none"
            stroke="#e5e7eb"
            className="dark:stroke-gray-600"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          <motion.path
            d={`M ${strokeWidth},${center} A ${radius},${radius} 0 0,1 ${size - strokeWidth},${center}`}
            fill="none"
            stroke={`url(#gauge-grad-${status})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={`url(#gauge-glow-${status})`}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          />

          <motion.circle
            cx={center + radius * Math.cos(Math.PI * (1 - animatedPct / 100))}
            cy={center + radius * Math.sin(Math.PI * (1 - animatedPct / 100))}
            r={strokeWidth * 0.6}
            fill={colors.from}
            filter="url(#gauge-glow)"
            style={{ filter: `drop-shadow(0 0 4px ${colors.glow})` }}
          />

          <text
            x={center}
            y={center - 6}
            textAnchor="middle"
            fontSize={size * 0.13}
            fontWeight="900"
            fill="#1f2937"
            className="dark:fill-gray-100"
          >
            {animatedPct.toFixed(0)}%
          </text>

          {label && (
            <text
              x={center}
              y={center + 16}
              textAnchor="middle"
              fontSize={size * 0.065}
              fill="#6b7280"
              className="dark:fill-gray-400"
            >
              {label}
            </text>
          )}
        </svg>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(circle at 50% 100%, ${colors.from} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />
      </div>

      {(creditLimit || usedCredit) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4 text-[11px]"
        >
          {usedCredit && (
            <div className="text-center">
              <span className="text-gray-400 dark:text-gray-500">Usado</span>
              <p className="font-bold text-gray-700 dark:text-gray-300">{formatCurrency(usedCredit)}</p>
            </div>
          )}
          {creditLimit && (
            <div className="text-center">
              <span className="text-gray-400 dark:text-gray-500">Limite</span>
              <p className="font-bold text-gray-700 dark:text-gray-300">{formatCurrency(creditLimit)}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
