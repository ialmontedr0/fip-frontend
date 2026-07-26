import { motion } from 'framer-motion'
import { AlertTriangle, AlertOctagon, Clock, Check, X, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import type { CardAlertResponse } from '@/types/cards'

interface CardAlertItemProps {
  alert: CardAlertResponse
  onMarkRead?: () => void
  onDismiss?: () => void
  index?: number
}

const SEVERITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  warning: AlertTriangle,
  critical: AlertOctagon,
}

const SEVERITY_GRADIENTS: Record<string, string> = {
  warning: 'from-amber-500/20 to-yellow-500/5 border-amber-200/50 dark:border-amber-700/30',
  critical: 'from-red-500/20 to-rose-500/5 border-red-200/50 dark:border-red-700/30',
}

const SEVERITY_ICON_COLORS: Record<string, string> = {
  warning: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700/30',
  critical: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700/30',
}

export default function CardAlertItem({ alert, onMarkRead, onDismiss, index = 0 }: CardAlertItemProps) {
  const SeverityIcon = SEVERITY_ICONS[alert.severity] || AlertTriangle
  const severityGradient = SEVERITY_GRADIENTS[alert.severity] || 'border-gray-200'
  const iconColors = SEVERITY_ICON_COLORS[alert.severity] || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 backdrop-blur-xl transition-shadow duration-300',
        alert.is_read
          ? 'from-gray-50/60 to-gray-100/30 dark:from-gray-800/30 dark:to-gray-900/20 border-gray-100 dark:border-gray-700/30 opacity-70'
          : `${severityGradient} bg-white/90 dark:bg-gray-800/60 shadow-sm hover:shadow-lg hover:shadow-${alert.severity === 'critical' ? 'red' : 'amber'}-500/10`,
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none">
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-current" />
      </div>

      <div className="flex items-start gap-3">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
            iconColors,
          )}
        >
          <SeverityIcon className="h-5 w-5" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {!alert.is_read && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-violet-500 shrink-0"
                  />
                )}
                <p className={cn(
                  'text-sm font-bold tracking-tight',
                  alert.is_read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100',
                )}>
                  {alert.title}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{alert.message}</p>
            </div>
            {alert.severity === 'critical' && (
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="shrink-0"
              >
                <Sparkles className="h-4 w-4 text-red-400" />
              </motion.span>
            )}
          </div>

          {alert.triggered_at && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 mt-2"
            >
              <Clock className="h-3 w-3" />
              {format(new Date(alert.triggered_at), "d 'de' MMM yyyy, HH:mm", { locale: es })}
            </motion.p>
          )}

          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/30">
            {!alert.is_read && onMarkRead && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onMarkRead() }}
                  className="rounded-lg text-xs gap-1.5 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400">
                  <Check className="h-3.5 w-3.5" />
                  Marcar leido
                </Button>
              </motion.div>
            )}
            {onDismiss && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onDismiss() }}
                  className="rounded-lg text-xs gap-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400">
                  <X className="h-3.5 w-3.5" />
                  Descartar
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
