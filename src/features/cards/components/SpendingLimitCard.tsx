import { motion } from 'framer-motion'
import { Sun, Calendar, CalendarDays, Tags, Edit3, Trash2, TrendingUp, AlertTriangle } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import type { SpendingLimitResponse } from '@/types/cards'

interface SpendingLimitCardProps {
  limit: SpendingLimitResponse
  onEdit?: () => void
  onDelete?: () => void
  currencyCode?: string
  index?: number
}

const TYPE_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; gradient: string; label: string }> = {
  daily: { icon: Sun, gradient: 'from-amber-500 to-orange-500', label: 'Diario' },
  weekly: { icon: Calendar, gradient: 'from-blue-500 to-indigo-500', label: 'Semanal' },
  monthly: { icon: CalendarDays, gradient: 'from-violet-500 to-purple-500', label: 'Mensual' },
  category: { icon: Tags, gradient: 'from-emerald-500 to-teal-500', label: 'Categoria' },
}

export default function SpendingLimitCard({ limit, onEdit, onDelete, currencyCode, index = 0 }: SpendingLimitCardProps) {
  const type = TYPE_CONFIG[limit.limit_type] || TYPE_CONFIG.monthly
  const Icon = type.icon
  const pctUsed = limit.pct_used ?? (
    parseFloat(limit.limit_amount) > 0
      ? (parseFloat(limit.spent_amount) / parseFloat(limit.limit_amount)) * 100
      : 0
  )
  const clampedPct = Math.min(Math.max(pctUsed, 0), 100)
  const isExceeded = clampedPct >= 100
  const isWarning = clampedPct >= 80 && clampedPct < 100

  const barColor = isExceeded
    ? 'from-red-500 to-rose-500'
    : isWarning
      ? 'from-amber-500 to-orange-500'
      : 'from-emerald-500 to-green-500'

  const glowColor = isExceeded
    ? 'shadow-red-500/20'
    : isWarning
      ? 'shadow-amber-500/20'
      : 'shadow-emerald-500/20'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.06)', transition: { duration: 0.2 } }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl shadow-sm transition-all duration-300',
        glowColor,
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 + 0.1 }}
            className="flex items-center gap-2.5"
          >
            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm',
              type.gradient,
            )}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{type.label}</p>
              {limit.description && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{limit.description}</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.06 + 0.15 }}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold',
              isExceeded
                ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                : isWarning
                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            )}
          >
            {isExceeded ? <AlertTriangle className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
            {clampedPct.toFixed(isExceeded ? 0 : 1)}%
          </motion.div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatCurrency(limit.spent_amount, currencyCode)}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatCurrency(limit.limit_amount, currencyCode)}
            </span>
          </div>
          <div className="relative h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${clampedPct}%` }}
              transition={{ delay: index * 0.06 + 0.2, duration: 0.8, ease: 'easeOut' }}
              className={cn('h-full rounded-full bg-gradient-to-r shadow-sm', barColor)}
            />
            {clampedPct > 0 && clampedPct < 100 && (
              <motion.div
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ clipPath: `inset(0 ${100 - clampedPct}% 0 0)` }}
              />
            )}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">Gastado</span>
            <span className="text-[10px] text-gray-400">Limite</span>
          </div>
        </div>

        <div className="hidden group-hover:flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/30 transition-all duration-300">
          {onEdit && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onEdit() }}
                className="rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600">
                <Edit3 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          )}
          {onDelete && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onDelete() }}
                className="rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
