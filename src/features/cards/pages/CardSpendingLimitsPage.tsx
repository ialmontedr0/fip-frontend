import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet, Plus, Edit3, Trash2, Bell, Target, TrendingDown } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useCard } from '../hooks/useCards'
import {
  useSpendingLimitList,
  useCreateSpendingLimit,
  useUpdateSpendingLimit,
  useDeleteSpendingLimit,
} from '../hooks/useLimits'
import { Button, Skeleton, EmptyState, Modal } from '@/components/ui'
import type { SpendingLimitResponse, CreateSpendingLimitRequest } from '@/types/cards'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

export default function CardSpendingLimitsPage() {
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const { data: card } = useCard(cardId!)
  const { data: limitsData, isLoading } = useSpendingLimitList(cardId!)
  const createMutation = useCreateSpendingLimit(cardId!)
  const updateMutation = useUpdateSpendingLimit(cardId!)
  const deleteMutation = useDeleteSpendingLimit(cardId!)
  const [showModal, setShowModal] = useState(false)
  const [editingLimit, setEditingLimit] = useState<SpendingLimitResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    limit_type: 'monthly' as string,
    limit_amount: '',
    category_id: '',
    alert_threshold: 80,
    alert_enabled: true,
    description: '',
  })

  const limits = (limitsData?.limits || []) as SpendingLimitResponse[]

  const totalLimit = limits.reduce((sum, l) => sum + parseFloat(l.limit_amount), 0)
  const totalSpent = limits.reduce((sum, l) => sum + parseFloat(l.spent_amount), 0)
  const overallPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0

  const openCreate = () => {
    setEditingLimit(null)
    setFormData({ limit_type: 'monthly', limit_amount: '', category_id: '', alert_threshold: 80, alert_enabled: true, description: '' })
    setShowModal(true)
  }

  const openEdit = (limit: SpendingLimitResponse) => {
    setEditingLimit(limit)
    setFormData({
      limit_type: limit.limit_type,
      limit_amount: limit.limit_amount,
      category_id: limit.category_id || '',
      alert_threshold: limit.alert_threshold,
      alert_enabled: limit.alert_enabled,
      description: limit.description || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      if (editingLimit) {
        await updateMutation.mutateAsync({
          limitId: editingLimit.id,
          data: {
            limit_amount: formData.limit_amount,
            alert_threshold: formData.alert_threshold,
            alert_enabled: formData.alert_enabled,
            description: formData.description || null,
          },
        })
        toast.success('Limite actualizado exitosamente')
      } else {
        await createMutation.mutateAsync({
          limit_type: formData.limit_type as CreateSpendingLimitRequest['limit_type'],
          limit_amount: formData.limit_amount,
          category_id: formData.category_id || null,
          alert_threshold: formData.alert_threshold,
          alert_enabled: formData.alert_enabled,
          description: formData.description || null,
        })
        toast.success('Limite creado exitosamente')
      }
      setShowModal(false)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar limite')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (limitId: string) => {
    if (!window.confirm('Eliminar este limite de gasto?')) return
    try {
      await deleteMutation.mutateAsync(limitId)
      toast.success('Limite eliminado')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar limite')
    }
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/20" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/20" />
        <div className="absolute left-1/4 bottom-10 h-60 w-60 rounded-full bg-fuchsia-500/5 blur-3xl dark:bg-fuchsia-500/10" />
      </div>

      <motion.div
        className="relative"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <button
          type="button"
          onClick={() => navigate(`/cards/${cardId}`)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {card?.name ? `Volver a ${card.name}` : 'Volver'}
        </button>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Limites de Gasto {card?.name ? `- ${card.name}` : ''}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {limits.length} limite{limits.length !== 1 ? 's' : ''} configurado{limits.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <motion.div whileHover={{ y: -2, transition: { duration: 0.2 } }}>
            <Button onClick={openCreate} className="rounded-xl gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Limite
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {limits.length > 0 && (
        <motion.div
          className="relative"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4"
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Target className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Total Limites</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalLimit, card?.currency_code)}
              </p>
            </motion.div>
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4"
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Total Gastado</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalSpent, card?.currency_code)}
              </p>
            </motion.div>
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4"
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Bell className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Uso General</span>
              </div>
              <p className={cn(
                'text-xl font-bold',
                overallPct >= 100 ? 'text-red-500' : overallPct >= 80 ? 'text-amber-500' : 'text-emerald-500',
              )}>
                {overallPct.toFixed(0)}%
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      <div className="relative">
        {isLoading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Skeleton className="h-40 rounded-2xl" />
              </motion.div>
            ))}
          </motion.div>
        ) : limits.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {limits.map((limit) => {
              const pct = limit.pct_used ?? 0
              const statusColor = pct >= 100 ? 'text-red-500' : pct >= 80 ? 'text-amber-500' : 'text-emerald-500'
              const barColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
              return (
                <motion.div
                  key={limit.id}
                  variants={itemVariants}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5 transition-shadow hover:shadow-md group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {limit.limit_type}
                      </span>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1.5">
                        {limit.description || `Limite ${limit.limit_type}`}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(limit)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(limit.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(parseFloat(limit.limit_amount), card?.currency_code)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Gastado: {formatCurrency(parseFloat(limit.spent_amount), card?.currency_code)}
                      </p>
                    </div>
                    <span className={`text-xl font-bold ${statusColor}`}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  {limit.alert_enabled && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-400">
                      <Bell className="h-3 w-3" />
                      Alerta activada en {limit.alert_threshold}% de utilizacion
                    </div>
                  )}
                  {limit.remaining && (
                    <div className="mt-1 text-[10px] text-gray-400">
                      Restante: {formatCurrency(parseFloat(limit.remaining), card?.currency_code)}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <EmptyState
              title="No hay limites de gasto configurados"
              description="Configura limites diarios, semanales, mensuales o por categoria para controlar tus gastos"
              actionLabel="Nuevo Limite"
              onAction={openCreate}
            />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingLimit ? 'Editar Limite' : 'Nuevo Limite'} size="lg">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tipo de Limite</label>
                  <select
                    value={formData.limit_type}
                    onChange={(e) => setFormData({ ...formData, limit_type: e.target.value })}
                    disabled={!!editingLimit}
                    className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200 disabled:opacity-50"
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="category">Categoria</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto Limite</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.limit_amount}
                    onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
                    className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200"
                    required
                  />
                </div>

                {formData.limit_type === 'category' && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">ID de Categoria</label>
                    <input
                      type="text"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      placeholder="Ingresa el ID de la categoria"
                      className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Umbral de Alerta: <span className="text-violet-500">{formData.alert_threshold}%</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={formData.alert_threshold}
                    onChange={(e) => setFormData({ ...formData, alert_threshold: Number(e.target.value) })}
                    className="w-full mt-1 accent-violet-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>1%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.alert_enabled}
                    onChange={(e) => setFormData({ ...formData, alert_enabled: e.target.checked })}
                    className="rounded border-gray-300 text-violet-500 focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Activar alertas para este limite</span>
                </label>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Descripcion</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Describe el proposito de este limite..."
                    className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSubmit} isLoading={submitting} className="flex-1 rounded-xl">
                    {editingLimit ? 'Actualizar Limite' : 'Crear Limite'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowModal(false)} className="rounded-xl">
                    Cancelar
                  </Button>
                </div>
              </div>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
