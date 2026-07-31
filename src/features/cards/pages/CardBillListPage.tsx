import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Plus, Trash2, Banknote, AlertCircle, Receipt, ChevronLeft } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useCard } from '../hooks/useCards'
import { useBillList, useDeleteBill, useCreateBill } from '../hooks/useBills'
import CardBillCard from '@/features/expenses/components/CardBillCard'
import { Skeleton, EmptyState } from '@/components/ui'
import type { BillResponse } from '@/types/cards'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

export default function CardBillListPage() {
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const { data: card } = useCard(cardId!)
  const { data: billsData, isLoading } = useBillList(cardId!)
  const deleteMutation = useDeleteBill(cardId!)
  const createBill = useCreateBill(cardId!)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ statement_date: '', due_date: '', total_amount: '', minimum_payment: '' })
  const [submitting, setSubmitting] = useState(false)

  const bills = (billsData?.bills || []) as BillResponse[]

  const unpaidBills = bills.filter((b) => b.payment_status === 'pending' || b.payment_status === 'overdue')
  const totalUnpaid = unpaidBills.reduce((sum, b) => sum + parseFloat(b.total_amount), 0)
  const totalMinPay = unpaidBills.reduce((sum, b) => sum + (b.minimum_payment ? parseFloat(b.minimum_payment) : 0), 0)

  const handleDelete = async (billId: string) => {
    if (!window.confirm('Eliminar esta factura?')) return
    try {
      await deleteMutation.mutateAsync(billId)
      toast.success('Factura eliminada')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar factura')
    }
  }

  const handleCreate = async () => {
    setSubmitting(true)
    try {
      await createBill.mutateAsync({
        statement_date: formData.statement_date,
        due_date: formData.due_date,
        total_amount: formData.total_amount,
        minimum_payment: formData.minimum_payment || null,
      })
      toast.success('Factura creada exitosamente')
      setShowModal(false)
      setFormData({ statement_date: '', due_date: '', total_amount: '', minimum_payment: '' })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al crear factura')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/20"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/20"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/3 bottom-0 h-60 w-60 rounded-full bg-fuchsia-500/5 blur-3xl dark:bg-fuchsia-500/10"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => navigate(`/cards/${cardId}`)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          {card?.name ? `Volver a ${card.name}` : 'Volver'}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20 ring-1 ring-white/10">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              Facturas {card?.name ? `- ${card.name}` : ''}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {bills.length} factura{bills.length !== 1 ? 's' : ''} registrada{bills.length !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {bills.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative"
        >
          <motion.div
            variants={statVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm px-4 py-3"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                <Receipt className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Facturas</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{bills.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={statVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm px-4 py-3"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pendientes</p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{unpaidBills.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={statVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm px-4 py-3"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-rose-500" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                <Banknote className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Adeudado</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(totalUnpaid, card?.currency_code)}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {unpaidBills.length > 0 && `Pago minimo total: ${formatCurrency(totalMinPay, card?.currency_code)}`}
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Nueva Factura
        </motion.button>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : bills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bills.map((bill) => (
              <motion.div
                key={bill.id}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.06)', transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/50 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
                <CardBillCard
                  bill={bill}
                  currencyCode={card?.currency_code}
                  onPay={() => navigate(`/cards/${cardId}/bills/${bill.id}/pay`)}
                />
                <button
                  onClick={() => handleDelete(bill.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500"
                  title="Eliminar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <EmptyState
              title="No hay facturas registradas"
              description="Genera un estado de cuenta o crea una factura manualmente"
              actionLabel="Nueva Factura"
              onAction={() => setShowModal(true)}
            />
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Nueva Factura</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha de Corte</label>
                  <input type="date" value={formData.statement_date} onChange={(e) => setFormData({ ...formData, statement_date: e.target.value })}
                    className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha de Vencimiento</label>
                  <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto Total</label>
                  <input type="number" step="0.01" value={formData.total_amount} onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                    className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pago Minimo</label>
                  <input type="number" step="0.01" value={formData.minimum_payment} onChange={(e) => setFormData({ ...formData, minimum_payment: e.target.value })}
                    className="w-full mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 text-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all" />
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={submitting}
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Creando...' : 'Crear Factura'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}