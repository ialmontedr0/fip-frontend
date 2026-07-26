import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Bell, AlertTriangle, CheckCircle2, Trash2, CreditCard,
  ArrowLeft, RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useCardList } from '../hooks/useCards'
import {
  useCardAlerts,
  useMarkAlertRead,
  useCheckAlerts,
  useDismissAlert,
} from '../hooks/useAlerts'
import { Button, Skeleton, EmptyState } from '@/components/ui'
import type { CardAlertsFilters, CardAlertResponse, AlertSeverity } from '@/types/cards'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function CardAlertsPage() {
  const navigate = useNavigate()
  const { data: cardsData } = useCardList({ is_active: true })
  const [filters, setFilters] = useState<CardAlertsFilters>({})
  const { data, isLoading } = useCardAlerts(filters)
  const markRead = useMarkAlertRead()
  const checkAlerts = useCheckAlerts()
  const dismissAlert = useDismissAlert()

  const alerts = (data?.alerts || []) as CardAlertResponse[]
  const unreadCount = alerts.filter((a) => !a.is_read).length

  const cards = cardsData?.cards || []

  const handleMarkAllRead = async () => {
    try {
      await markRead.mutateAsync({ mark_all: true })
      toast.success('Todas las alertas marcadas como leidas')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al marcar alertas')
    }
  }

  const handleCheckNow = async () => {
    try {
      const result = await checkAlerts.mutateAsync()
      if (result.new_alerts > 0) {
        toast.success(`${result.new_alerts} nueva${result.new_alerts !== 1 ? 's' : ''} alerta${result.new_alerts !== 1 ? 's' : ''} generada${result.new_alerts !== 1 ? 's' : ''}`)
      } else {
        toast.success('No se encontraron nuevas alertas')
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al verificar alertas')
    }
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/20" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/20" />
        <div className="absolute left-1/3 bottom-0 h-60 w-60 rounded-full bg-fuchsia-500/5 blur-3xl dark:bg-fuchsia-500/10" />
      </div>

      <motion.div
        className="relative"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <button
          type="button"
          onClick={() => navigate('/cards')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Tarjetas
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Alertas</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data?.total != null ? `${data.total} alerta${data.total !== 1 ? 's' : ''}` : 'Gestiona las alertas de tus tarjetas'}
              {unreadCount > 0 && (
                <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  {unreadCount} no leida{unreadCount !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="relative"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <motion.div
              className="relative"
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={filters.credit_card_id || ''}
                onChange={(e) => setFilters({ ...filters, credit_card_id: e.target.value || undefined })}
                className="pl-9 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-sm dark:text-gray-200 appearance-none cursor-pointer"
              >
                <option value="">Todas las tarjetas</option>
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </motion.div>
            <motion.div
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <select
                value={filters.severity || ''}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value as AlertSeverity | undefined || undefined })}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-sm dark:text-gray-200 appearance-none cursor-pointer"
              >
                <option value="">Todas las severidades</option>
                <option value="warning">Advertencia</option>
                <option value="critical">Critico</option>
              </select>
            </motion.div>
            <motion.div
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <select
                value={filters.is_read === undefined ? '' : filters.is_read ? 'read' : 'unread'}
                onChange={(e) => {
                  const val = e.target.value
                  setFilters({ ...filters, is_read: val === '' ? undefined : val === 'read' ? true : false })
                }}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-sm dark:text-gray-200 appearance-none cursor-pointer"
              >
                <option value="">Todas</option>
                <option value="unread">No leidas</option>
                <option value="read">Leidas</option>
              </select>
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCheckNow}
              isLoading={checkAlerts.isPending}
              className="rounded-xl gap-2"
            >
              <RefreshCw className={cn('h-4 w-4', checkAlerts.isPending && 'animate-spin')} />
              Check Now
            </Button>
            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              isLoading={markRead.isPending}
              className="rounded-xl gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark All Read
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="relative">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Skeleton className="h-24 rounded-2xl" />
              </motion.div>
            ))}
          </div>
        ) : alerts.length > 0 ? (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                variants={itemVariants}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className={cn(
                  'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border p-4 transition-all shadow-sm',
                  alert.severity === 'critical'
                    ? 'border-red-200 dark:border-red-700/30 border-l-4 border-l-red-500'
                    : 'border-amber-200 dark:border-amber-700/30 border-l-4 border-l-amber-500',
                  !alert.is_read && 'ring-1 ring-violet-500/20',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl shrink-0',
                      alert.severity === 'critical'
                        ? 'bg-red-50 dark:bg-red-500/10'
                        : 'bg-amber-50 dark:bg-amber-500/10',
                    )}>
                      <AlertTriangle className={cn(
                        'h-5 w-5',
                        alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500',
                      )} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{alert.title}</p>
                        {!alert.is_read && (
                          <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                        )}
                        <span className={cn(
                          'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                          alert.severity === 'critical'
                            ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                            : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
                        )}>
                          {alert.severity === 'critical' ? 'Critico' : 'Advertencia'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {alert.triggered_at && (
                          <span className="text-[10px] text-gray-400">
                            {new Date(alert.triggered_at).toLocaleDateString('es-DO', {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        )}
                        {alert.threshold_percentage != null && (
                          <span className="text-[10px] text-gray-400">
                            Umbral: {alert.threshold_percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!alert.is_read && (
                      <button
                        onClick={() => markRead.mutateAsync({ alert_id: alert.id })}
                        className="text-xs text-violet-500 hover:text-violet-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => dismissAlert.mutateAsync(alert.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors"
                      title="Descartar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <EmptyState
              title={
                filters.credit_card_id || filters.severity
                  ? 'No se encontraron alertas con estos filtros'
                  : 'No hay alertas'
              }
              description={
                filters.credit_card_id || filters.severity
                  ? 'Intenta ajustar los filtros para ver mas resultados'
                  : 'Usa el boton "Check Now" para generar alertas basadas en el estado actual de tus tarjetas'
              }
              actionLabel={!filters.credit_card_id && !filters.severity ? 'Check Now' : undefined}
              onAction={!filters.credit_card_id && !filters.severity ? handleCheckNow : undefined}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}
