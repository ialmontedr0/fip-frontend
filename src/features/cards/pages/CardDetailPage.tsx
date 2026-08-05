import { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  ArrowLeft, Edit3, Trash2, FileText, CreditCard,
  Info, DollarSign, Calendar, Percent, Wallet,
  AlertTriangle, CheckCircle2, Bell, PieChart,
  History,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatISODate } from '@/lib/utils'
import toast from 'react-hot-toast'
import {
  useCard, useDeleteCard, useCardUtilization,
} from '../hooks/useCards'
import { useBillList, useCreateBill, useGenerateStatement } from '../hooks/useBills'
import { useSpendingLimitList, useCreateSpendingLimit, useUpdateSpendingLimit, useDeleteSpendingLimit } from '../hooks/useLimits'
import { useCardAlerts, useMarkAlertRead, useCheckAlerts, useDismissAlert } from '../hooks/useAlerts'
import { useUtilizationHistory, useSpendingByCategory } from '../hooks/useCards'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import CardNetworkBadge from '../components/CardNetworkBadge'
import UtilizationGauge from '../components/UtilizationGauge'
import { Modal, Button, Skeleton, EmptyState } from '@/components/ui'
import CardBillCard from '@/features/expenses/components/CardBillCard'
import type {
  CardResponse, CardUtilization, UtilizationHistoryResponse,
  SpendingByCategoryResponse, BillResponse, SpendingLimitResponse,
  CardAlertsFilters, CardAlertResponse,
} from '@/types/cards'
import type { TransactionListItem } from '@/types/transactions'

type Tab = 'overview' | 'bills' | 'limits' | 'history' | 'spending' | 'payments' | 'alerts'

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Resumen', icon: Info },
  { key: 'bills', label: 'Facturas', icon: FileText },
  { key: 'limits', label: 'Limites', icon: Wallet },
  { key: 'history', label: 'Historial', icon: History },
  { key: 'spending', label: 'Gastos', icon: PieChart },
  { key: 'payments', label: 'Pagos', icon: DollarSign },
  { key: 'alerts', label: 'Alertas', icon: Bell },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

const tabVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.15 },
  },
}

function DetailRow({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: React.ReactNode; color?: string }) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors px-2 -mx-2 rounded-lg"
    >
      <div className="flex items-center gap-2.5">
        <Icon className={cn('h-4 w-4', color || 'text-gray-400')} />
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
        {value}
      </div>
    </motion.div>
  )
}

function CreateBillModal({ cardId, isOpen, onClose }: { cardId: string; isOpen: boolean; onClose: () => void }) {
  const createBill = useCreateBill(cardId)
  const [formData, setFormData] = useState({ statement_date: '', due_date: '', total_amount: '', minimum_payment: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await createBill.mutateAsync({
        statement_date: formData.statement_date,
        due_date: formData.due_date,
        total_amount: formData.total_amount,
        minimum_payment: formData.minimum_payment || null,
      })
      toast.success('Factura creada exitosamente')
      onClose()
      setFormData({ statement_date: '', due_date: '', total_amount: '', minimum_payment: '' })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al crear factura')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Factura" size="md">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha de Corte</label>
          <input type="date" value={formData.statement_date} onChange={(e) => setFormData({ ...formData, statement_date: e.target.value })}
            className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha de Vencimiento</label>
          <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto Total</label>
          <input type="number" step="0.01" value={formData.total_amount} onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
            className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pago Minimo</label>
          <input type="number" step="0.01" value={formData.minimum_payment} onChange={(e) => setFormData({ ...formData, minimum_payment: e.target.value })}
            className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSubmit} isLoading={submitting} className="flex-1 rounded-xl">Crear Factura</Button>
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancelar</Button>
        </div>
      </div>
    </Modal>
  )
}

function SpendingLimitModal({
  cardId, isOpen, onClose, initialData, limitId,
}: {
  cardId: string; isOpen: boolean; onClose: () => void
  initialData?: SpendingLimitResponse | null; limitId?: string
}) {
  const createMutation = useCreateSpendingLimit(cardId)
  const updateMutation = useUpdateSpendingLimit(cardId)
  const [formData, setFormData] = useState<{
    limit_type: 'daily' | 'weekly' | 'monthly' | 'category'
    limit_amount: string
    category_id: string
    alert_threshold: number
    alert_enabled: boolean
    description: string
  }>({
    limit_type: (initialData?.limit_type as 'daily' | 'weekly' | 'monthly' | 'category') || 'monthly',
    limit_amount: initialData?.limit_amount || '',
    category_id: initialData?.category_id || '',
    alert_threshold: initialData?.alert_threshold ?? 80,
    alert_enabled: initialData?.alert_enabled ?? true,
    description: initialData?.description || '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      if (limitId) {
        await updateMutation.mutateAsync({ limitId, data: { limit_amount: formData.limit_amount, alert_threshold: formData.alert_threshold, alert_enabled: formData.alert_enabled, description: formData.description || null } })
        toast.success('Limite actualizado')
      } else {
        await createMutation.mutateAsync({
          limit_type: formData.limit_type,
          limit_amount: formData.limit_amount,
          category_id: formData.category_id || null,
          alert_threshold: formData.alert_threshold,
          alert_enabled: formData.alert_enabled,
          description: formData.description || null,
        })
        toast.success('Limite creado exitosamente')
      }
      onClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar limite')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={limitId ? 'Editar Limite' : 'Nuevo Limite'} size="md">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tipo de Limite</label>
          <select value={formData.limit_type} onChange={(e) => setFormData({ ...formData, limit_type: e.target.value as 'daily' | 'weekly' | 'monthly' | 'category' })}
            className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200">
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
            <option value="category">Categoria</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto Limite</label>
          <input type="number" step="0.01" value={formData.limit_amount} onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
            className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200" />
        </div>
        {formData.limit_type === 'category' && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Categoria</label>
            <input type="text" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              placeholder="ID de categoria"
              className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200" />
          </div>
        )}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Umbral de Alerta: {formData.alert_threshold}%
          </label>
          <input type="range" min="1" max="100" value={formData.alert_threshold} onChange={(e) => setFormData({ ...formData, alert_threshold: Number(e.target.value) })}
            className="w-full mt-1 accent-violet-500" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.alert_enabled} onChange={(e) => setFormData({ ...formData, alert_enabled: e.target.checked })}
            className="rounded border-gray-300 text-violet-500 focus:ring-violet-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Alertas activadas</span>
        </label>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Descripcion</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}
            className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSubmit} isLoading={submitting} className="flex-1 rounded-xl">
            {limitId ? 'Actualizar' : 'Crear Limite'}
          </Button>
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancelar</Button>
        </div>
      </div>
    </Modal>
  )
}

function OverviewTab({ card, utilization }: { card: CardResponse; utilization?: CardUtilization }) {
  const navigate = useNavigate()
  const deleteMutation = useDeleteCard()
  const generateStatement = useGenerateStatement(card.id)
  const util = utilization || card.utilization
  const pct = util ? parseFloat(util.utilization_percentage) : 0

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar la tarjeta "${card.name}"?`)) return
    try {
      await deleteMutation.mutateAsync(card.id)
      toast.success('Tarjeta eliminada')
      navigate('/cards')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar tarjeta')
    }
  }

  const handleGenerateStatement = async () => {
    try {
      await generateStatement.mutateAsync()
      toast.success('Estado de cuenta generado')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al generar estado de cuenta')
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-2 space-y-6">
        <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
          <div className="flex flex-col items-center sm:flex-row gap-6">
            {util && (
              <UtilizationGauge
                percentage={pct}
                size={200}
                status={util.status}
                creditLimit={util.credit_limit}
                usedCredit={util.used_credit}
                label="utilizacion"
              />
            )}
            <div className="flex-1 w-full grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:shadow-md transition-all duration-200"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Limite de Credito</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(card.credit_limit || '0'), card.currency_code)}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 hover:shadow-md transition-all duration-200"
              >
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Credito Disponible</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(parseFloat(card.available_credit || '0'), card.currency_code)}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 hover:shadow-md transition-all duration-200"
              >
                <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Dia de Corte</p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{card.statement_day || '—'}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 hover:shadow-md transition-all duration-200"
              >
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Dia de Vencimiento</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{card.payment_due_day || '—'}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button onClick={() => navigate(`/cards/${card.id}/edit`)} variant="outline" className="rounded-xl gap-2">
              <Edit3 className="h-4 w-4" />
              Editar
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button onClick={handleDelete} variant="destructive" className="rounded-xl gap-2" isLoading={deleteMutation.isPending}>
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button onClick={handleGenerateStatement} variant="secondary" className="rounded-xl gap-2" isLoading={generateStatement.isPending}>
              <FileText className="h-4 w-4" />
              Generar Statement
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="space-y-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-violet-500" />
            Informacion
          </h3>
          <motion.div variants={containerVariants} className="divide-y divide-gray-100 dark:divide-gray-700/50">
            <DetailRow icon={CreditCard} label="Nombre" value={card.name} />
            <DetailRow icon={CreditCard} label="Red" value={card.card_network ? <CardNetworkBadge network={card.card_network} /> : '—'} />
            <DetailRow icon={CreditCard} label="Ultimos 4" value={card.last_four_digits || '—'} />
            <DetailRow icon={DollarSign} label="Limite" value={formatCurrency(parseFloat(card.credit_limit || '0'), card.currency_code)} />
            <DetailRow icon={DollarSign} label="Disponible" value={formatCurrency(parseFloat(card.available_credit || '0'), card.currency_code)} />
            <DetailRow icon={Calendar} label="Corte" value={card.statement_day ? `Dia ${card.statement_day}` : '—'} />
            <DetailRow icon={Calendar} label="Vencimiento" value={card.payment_due_day ? `Dia ${card.payment_due_day}` : '—'} />
            {card.interest_rate && (
              <DetailRow icon={Percent} label="Interes" value={`${card.interest_rate}%`} />
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function BillsTab({ cardId, currencyCode }: { cardId: string; currencyCode: string }) {
  const { data, isLoading } = useBillList(cardId)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const bills = (data?.bills || []) as BillResponse[]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{bills.length} factura{bills.length !== 1 ? 's' : ''}</p>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button onClick={() => setShowModal(true)} className="rounded-xl gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0 shadow-lg shadow-violet-500/25">
            <FileText className="h-4 w-4" />
            Nueva Factura
          </Button>
        </motion.div>
      </motion.div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : bills.length > 0 ? (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {bills.map((bill) => (
            <motion.div key={bill.id} variants={itemVariants}>
              <CardBillCard
                bill={bill}
                currencyCode={currencyCode}
                onPay={() => navigate(`/cards/${cardId}/bills/${bill.id}/pay`)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <EmptyState
            title="No hay facturas registradas"
            description="Las facturas apareceran aqui cuando generes estados de cuenta"
            actionLabel="Nueva Factura"
            onAction={() => setShowModal(true)}
          />
        </motion.div>
      )}
      <CreateBillModal cardId={cardId} isOpen={showModal} onClose={() => setShowModal(false)} />
    </motion.div>
  )
}

function LimitsTab({ cardId, currencyCode }: { cardId: string; currencyCode: string }) {
  const { data, isLoading } = useSpendingLimitList(cardId)
  const deleteMutation = useDeleteSpendingLimit(cardId)
  const [showModal, setShowModal] = useState(false)
  const [editingLimit, setEditingLimit] = useState<SpendingLimitResponse | null>(null)

  const limits = (data?.limits || []) as SpendingLimitResponse[]

  const handleDelete = async (limitId: string) => {
    if (!window.confirm('Eliminar este limite de gasto?')) return
    try {
      await deleteMutation.mutateAsync(limitId)
      toast.success('Limite eliminado')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar limite')
    }
  }

  function LimitCard({ limit }: { limit: SpendingLimitResponse }) {
    const cc = currencyCode
    const pct = limit.pct_used ?? 0
    const statusColor = pct >= 100 ? 'text-red-500' : pct >= 80 ? 'text-amber-500' : 'text-emerald-500'

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-4 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{limit.limit_type}</span>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{limit.description || `Limite ${limit.limit_type}`}</p>
          </div>
          <div className="flex gap-1">
            <button onClick={() => { setEditingLimit(limit); setShowModal(true) }}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => handleDelete(limit.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(limit.limit_amount), cc)}</p>
            <p className="text-xs text-gray-500">Gastado: {formatCurrency(parseFloat(limit.spent_amount), cc)}</p>
          </div>
          <span className={`text-lg font-bold ${statusColor}`}>{pct.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        {limit.alert_enabled && (
          <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
            <Bell className="h-3 w-3" />
            Alerta en {limit.alert_threshold}%
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{limits.length} limite{limits.length !== 1 ? 's' : ''}</p>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button onClick={() => { setEditingLimit(null); setShowModal(true) }} className="rounded-xl gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0 shadow-lg shadow-violet-500/25">
            <Wallet className="h-4 w-4" />
            Nuevo Limite
          </Button>
        </motion.div>
      </motion.div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : limits.length > 0 ? (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {limits.map((limit) => (
            <LimitCard key={limit.id} limit={limit} />
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <EmptyState
            title="No hay limites de gasto configurados"
            description="Configura limites para controlar tus gastos por periodo o categoria"
            actionLabel="Nuevo Limite"
            onAction={() => { setEditingLimit(null); setShowModal(true) }}
          />
        </motion.div>
      )}
      <SpendingLimitModal
        cardId={cardId}
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingLimit(null) }}
        initialData={editingLimit}
        limitId={editingLimit?.id}
      />
    </motion.div>
  )
}

function HistoryTab({ cardId, currencyCode }: { cardId: string; currencyCode: string }) {
  const [months, setMonths] = useState(6)
  const { data, isLoading } = useUtilizationHistory(cardId, months)
  const history = data as UtilizationHistoryResponse | undefined

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {history?.history?.length || 0} meses de datos
        </p>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {[3, 6, 12, 24].map((m) => (
            <motion.button
              key={m}
              type="button"
              onClick={() => setMonths(m)}
              whileTap={{ scale: 0.93 }}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-all relative',
                months === m
                  ? 'text-violet-600'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
              )}
            >
              {months === m && (
                <motion.div
                  layoutId="activeMonth"
                  className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{m}m</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
      {isLoading ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : history?.history && history.history.length > 0 ? (
        <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
          <div className="h-64 relative">
            <svg viewBox="0 0 600 200" className="w-full h-full">
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              {history.history.map((entry, i) => {
                const pct = parseFloat(entry.utilization_pct)
                const x = 30 + (i / Math.max(history.history.length - 1, 1)) * 540
                const y = 180 - (pct / 100) * 150
                return (
                  <g key={entry.month}>
                    {i > 0 && (() => {
                      const prevPct = parseFloat(history.history[i - 1].utilization_pct)
                      const prevX = 30 + ((i - 1) / Math.max(history.history.length - 1, 1)) * 540
                      const prevY = 180 - (prevPct / 100) * 150
                      return <line x1={prevX} y1={prevY} x2={x} y2={y} stroke="#8b5cf6" strokeWidth="2" />
                    })()}
                    <circle cx={x} cy={y} r={4} fill="#8b5cf6">
                      <title>{entry.month}: {pct.toFixed(1)}%</title>
                    </circle>
                  </g>
                )
              })}
            </svg>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <th className="text-left py-2 text-gray-500 font-medium">Mes</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Gastado</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Limite</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Utilizacion</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {history.history.map((entry) => (
                  <motion.tr
                    key={entry.month}
                    variants={itemVariants}
                    className="border-b border-gray-50 dark:border-gray-700/20 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="py-2 text-gray-900 dark:text-gray-100 font-medium">{entry.month}</td>
                    <td className="py-2 text-right text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(entry.spent), currencyCode)}</td>
                    <td className="py-2 text-right text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(entry.credit_limit), currencyCode)}</td>
                    <td className="py-2 text-right">
                      <span className={cn(
                        'font-semibold',
                        entry.status === 'danger' ? 'text-red-500' : entry.status === 'warning' ? 'text-amber-500' : 'text-emerald-500',
                      )}>
                        {parseFloat(entry.utilization_pct).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <span className={cn(
                        'inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium',
                        entry.status === 'danger' ? 'bg-red-100 text-red-600' : entry.status === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600',
                      )}>
                        {entry.status === 'danger' ? 'Critico' : entry.status === 'warning' ? 'Alerta' : 'Saludable'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <EmptyState
            title="No hay datos historicos disponibles"
            description="Los datos historicos de utilizacion apareceran a medida que uses tu tarjeta"
          />
        </motion.div>
      )}
    </motion.div>
  )
}

function SpendingTab({ cardId, currencyCode }: { cardId: string; currencyCode: string }) {
  const { data, isLoading } = useSpendingByCategory(cardId)
  const spending = data as SpendingByCategoryResponse | undefined
  const { data: txData, isLoading: txLoading } = useTransactions({ credit_card_id: cardId, page_size: 50 })
  const transactions = (txData?.transactions || []) as TransactionListItem[]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {isLoading ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : spending?.categories && spending.categories.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Distribucion por Categoria</h3>
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-48 h-48">
                {(() => {
                  const total = spending.categories.reduce((sum, c) => sum + parseFloat(c.total), 0)
                  let currentAngle = 0
                  const colors = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1']
                  return spending.categories.map((cat, i) => {
                    const value = parseFloat(cat.total)
                    const angle = (value / total) * 360
                    const startAngle = currentAngle
                    currentAngle += angle
                    const startRad = ((startAngle - 90) * Math.PI) / 180
                    const endRad = ((startAngle + angle - 90) * Math.PI) / 180
                    const x1 = 100 + 80 * Math.cos(startRad)
                    const y1 = 100 + 80 * Math.sin(startRad)
                    const x2 = 100 + 80 * Math.cos(endRad)
                    const y2 = 100 + 80 * Math.sin(endRad)
                    const largeArc = angle > 180 ? 1 : 0
                    return (
                      <path key={i}
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={colors[i % colors.length]}
                        stroke="white"
                        strokeWidth="2"
                      >
                        <title>{cat.category_name || cat.category_id || 'Sin categoria'}: {formatCurrency(value, currencyCode)}</title>
                      </path>
                    )
                  })
                })()}
              </svg>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Total: <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(spending.total_spent), currencyCode)}</span>
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="space-y-2"
          >
            {spending.categories.map((cat, i) => {
              const colors = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1']
              const pct = (parseFloat(cat.total) / parseFloat(spending.total_spent)) * 100
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-100 dark:border-gray-700/50 p-3 flex items-center gap-3 transition-all"
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{cat.category_name || cat.category_id || 'Sin categoria'}</p>
                    <p className="text-xs text-gray-500">{cat.transaction_count} transaccion{cat.transaction_count !== 1 ? 'es' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(cat.total), currencyCode)}</p>
                    <p className="text-xs text-gray-500">{pct.toFixed(1)}%</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      ) : (
        <motion.div variants={itemVariants}>
          <EmptyState
            title="No hay gastos en este periodo"
            description="Los gastos categorizados apareceran aqui cuando realices transacciones con esta tarjeta"
          />
        </motion.div>
      )}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Transacciones recientes</h3>
        {txLoading ? (
          <Skeleton className="h-40 rounded-xl" />
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <th className="text-left py-2 text-gray-500 font-medium">Fecha</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Descripcion</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Monto</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 20).map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-50 dark:border-gray-700/20 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="py-2 text-gray-500 whitespace-nowrap">{tx.effective_date ? formatISODate(tx.effective_date) : '—'}</td>
                    <td className="py-2 text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{tx.description}</td>
                    <td className="py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
                      {tx.transaction_type === 'expense' ? '-' : '+'}
                      {formatCurrency(parseFloat(tx.amount), currencyCode)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay transacciones registradas para esta tarjeta</p>
        )}
      </motion.div>
    </motion.div>
  )
}

function PaymentsTab({ cardId, currencyCode }: { cardId: string; currencyCode: string }) {
  const { data, isLoading } = useBillList(cardId)
  const bills = (data?.bills || []) as BillResponse[]
  const payments = bills
    .filter((b) => b.paid_at)
    .sort((a, b) => new Date(b.paid_at!).getTime() - new Date(a.paid_at!).getTime())

  const totalPaid = payments.reduce((sum, b) => sum + parseFloat(b.amount_paid), 0)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">{payments.length} pago{payments.length !== 1 ? 's' : ''}</p>
        {payments.length > 0 && (
          <span className="text-sm font-semibold text-emerald-600">
            Total pagado: {formatCurrency(totalPaid, currencyCode)}
          </span>
        )}
      </motion.div>
      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : payments.length > 0 ? (
        <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700/50">
                  <th className="text-left py-2 text-gray-500 font-medium">Fecha de pago</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Estado de cuenta</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Vencimiento</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Total</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Pagado</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((bill) => (
                  <motion.tr
                    key={bill.id}
                    variants={itemVariants}
                    className="border-b border-gray-50 dark:border-gray-700/20 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="py-2 text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {bill.paid_at ? new Date(bill.paid_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-2 text-gray-500 whitespace-nowrap">
                      {formatISODate(bill.statement_date)}
                    </td>
                    <td className="py-2 text-gray-500 whitespace-nowrap">
                      {formatISODate(bill.due_date)}
                    </td>
                    <td className="py-2 text-right text-gray-900 dark:text-gray-100">
                      {formatCurrency(parseFloat(bill.total_amount), currencyCode)}
                    </td>
                    <td className="py-2 text-right font-semibold text-emerald-600">
                      {formatCurrency(parseFloat(bill.amount_paid), currencyCode)}
                    </td>
                    <td className="py-2 text-right">
                      <span className={cn(
                        'inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium',
                        bill.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-amber-100 text-amber-600',
                      )}>
                        {bill.payment_status === 'paid' ? 'Pagado' : 'Parcial'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <EmptyState
            title="No hay pagos registrados"
            description="Los pagos de tus facturas apareceran aqui cuando los registres"
          />
        </motion.div>
      )}
    </motion.div>
  )
}

function AlertsTab({ cardId }: { cardId: string }) {
  const [filters, setFilters] = useState<CardAlertsFilters>({ credit_card_id: cardId })
  const { data, isLoading } = useCardAlerts(filters)
  const markRead = useMarkAlertRead()
  const checkAlerts = useCheckAlerts()
  const dismissAlert = useDismissAlert()

  const alerts = (data?.alerts || []) as CardAlertResponse[]

  const handleMarkAllRead = async () => {
    try {
      await markRead.mutateAsync({ mark_all: true })
      toast.success('Alertas marcadas como leidas')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error')
    }
  }

  const handleCheckNow = async () => {
    try {
      const result = await checkAlerts.mutateAsync()
      toast.success(`${result.new_alerts} nueva${result.new_alerts !== 1 ? 's' : ''} alerta${result.new_alerts !== 1 ? 's' : ''} generada${result.new_alerts !== 1 ? 's' : ''}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al verificar alertas')
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">{data?.total || 0} alertas</p>
          <span className="text-xs text-gray-400">|</span>
          <p className="text-sm text-gray-500 dark:text-gray-400">{alerts.filter((a) => !a.is_read).length} no leidas</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 items-center">
            <select
              value={filters.severity || ''}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value as CardAlertsFilters['severity'] || undefined })}
              className="text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-2 py-1 dark:text-gray-200 transition-all duration-200"
            >
              <option value="">Todas</option>
              <option value="warning">Advertencia</option>
              <option value="critical">Critico</option>
            </select>
            <select
              value={filters.is_read === undefined ? '' : filters.is_read ? 'read' : 'unread'}
              onChange={(e) => setFilters({ ...filters, is_read: e.target.value === '' ? undefined : e.target.value === 'read' ? true : false })}
              className="text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-2 py-1 dark:text-gray-200 transition-all duration-200"
            >
              <option value="">Todas</option>
              <option value="unread">No leidas</option>
              <option value="read">Leidas</option>
            </select>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button variant="outline" size="sm" onClick={handleCheckNow} isLoading={checkAlerts.isPending} className="rounded-lg gap-1">
              <Bell className="h-3.5 w-3.5" />
              Check Now
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} isLoading={markRead.isPending} className="rounded-lg gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark All Read
            </Button>
          </motion.div>
        </div>
      </motion.div>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : alerts.length > 0 ? (
        <motion.div
          variants={containerVariants}
          className="space-y-3"
        >
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              variants={itemVariants}
              whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.06)' }}
              className={cn(
                'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border p-4 transition-all',
                alert.severity === 'critical'
                  ? 'border-red-200 dark:border-red-700/30'
                  : 'border-gray-100 dark:border-gray-700/50',
                !alert.is_read && 'ring-1 ring-violet-500/20',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                    alert.severity === 'critical' ? 'bg-red-50 dark:bg-red-500/10' : 'bg-amber-50 dark:bg-amber-500/10',
                  )}>
                    <AlertTriangle className={cn('h-4 w-4', alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500')} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.title}</p>
                      {!alert.is_read && (
                        <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{alert.message}</p>
                    {alert.triggered_at && (
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(alert.triggered_at).toLocaleDateString('es-DO')}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {alert.is_read ? (
                    <span className="text-[10px] text-gray-400 px-2">Leida</span>
                  ) : (
                    <button
                      onClick={() => markRead.mutateAsync({ alert_id: alert.id })}
                      className="text-[10px] text-violet-500 hover:text-violet-700 font-medium px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert.mutateAsync(alert.id)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <EmptyState
            title="No hay alertas"
            description="No se han generado alertas para esta tarjeta. Usa 'Check Now' para verificar."
          />
        </motion.div>
      )}
    </motion.div>
  )
}

export default function CardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) || 'overview'
  const setTab = (tab: Tab) => setSearchParams({ tab })

  const { data: card, isLoading } = useCard(id!)
  const { data: utilizationData } = useCardUtilization(id!)

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </motion.div>
    )
  }

  if (!card) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <CreditCard className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tarjeta no encontrada</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">La tarjeta que buscas no existe o ha sido eliminada</p>
        <button type="button" onClick={() => navigate('/cards')} className="text-sm text-violet-500 hover:underline">
          Volver a tarjetas
        </button>
      </motion.div>
    )
  }

  const utilization = (utilizationData || card.utilization) as CardUtilization | undefined

  return (
    <div className="relative space-y-6 pb-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10"
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/3 top-1/4 h-60 w-60 rounded-full bg-pink-500/5 blur-3xl dark:bg-pink-500/10"
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.button
              variants={itemVariants}
              type="button"
              onClick={() => navigate('/cards')}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Volver"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: -3 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
              style={{ background: card.color || 'linear-gradient(135deg, #1e293b, #334155)' }}
            >
              <CreditCard className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <motion.h1 variants={itemVariants} className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{card.name}</motion.h1>
              <motion.div variants={itemVariants} className="flex items-center gap-2 mt-1">
                <CardNetworkBadge network={card.card_network} />
                {!card.is_active && (
                  <span className="inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                    Inactiva
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-2 pb-3 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap relative',
                activeTab === key
                  ? 'text-white shadow-lg shadow-violet-500/25'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50',
              )}
            >
              {activeTab === key && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4 relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {activeTab === 'overview' && <OverviewTab card={card} utilization={utilization} />}
          {activeTab === 'bills' && <BillsTab cardId={card.id} currencyCode={card.currency_code} />}
          {activeTab === 'limits' && <LimitsTab cardId={card.id} currencyCode={card.currency_code} />}
          {activeTab === 'history' && <HistoryTab cardId={card.id} currencyCode={card.currency_code} />}
          {activeTab === 'spending' && <SpendingTab cardId={card.id} currencyCode={card.currency_code} />}
          {activeTab === 'payments' && <PaymentsTab cardId={card.id} currencyCode={card.currency_code} />}
          {activeTab === 'alerts' && <AlertsTab cardId={card.id} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
