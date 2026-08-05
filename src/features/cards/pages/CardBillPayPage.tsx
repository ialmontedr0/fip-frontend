import { useState, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, DollarSign, CreditCard, CheckCircle, Calendar, AlertTriangle } from 'lucide-react'
import { cn, formatCurrency, formatISODate, parseISODate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useCard } from '../hooks/useCards'
import { useBillList, usePayBill } from '../hooks/useBills'
import { Button } from '@/components/ui'
import type { BillResponse, CardPaymentMethod } from '@/types/cards'

const PAYMENT_METHODS: { value: CardPaymentMethod; label: string; desc: string }[] = [
  { value: 'manual', label: 'Manual', desc: 'Pago realizado por transferencia o deposito' },
  { value: 'auto', label: 'Automatico', desc: 'Debito automatico desde cuenta bancaria' },
  { value: 'transfer', label: 'Transferencia', desc: 'Transferencia electronica de fondos' },
  { value: 'cash', label: 'Efectivo', desc: 'Pago en efectivo en sucursal' },
]

const fadeSlideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } },
}

export default function CardBillPayPage() {
  const { cardId, billId } = useParams<{ cardId: string; billId: string }>()
  const navigate = useNavigate()
  const { data: card } = useCard(cardId!)
  const { data: billsData, isLoading } = useBillList(cardId!)
  const payMutation = usePayBill(cardId!)
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  const bill = useMemo(() => {
    if (!billsData?.bills) return null
    return (billsData.bills as BillResponse[]).find((b) => b.id === billId) || null
  }, [billsData, billId])

  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<CardPaymentMethod>('manual')
  const [submitting, setSubmitting] = useState(false)

  const isOverdue = bill?.payment_status === 'pending' && bill?.due_date && parseISODate(bill.due_date) < new Date()

  const quickAmounts = useMemo(() => {
    if (!bill) return []
    const amounts: { label: string; value: string }[] = []
    if (bill.minimum_payment) {
      amounts.push({ label: 'Pagar Minimo', value: bill.minimum_payment })
    }
    amounts.push({ label: 'Pagar Total', value: bill.total_amount })
    return amounts
  }, [bill])

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast.error('El monto debe ser mayor a 0')
      return
    }
    if (bill && numAmount > parseFloat(bill.total_amount)) {
      toast.error('El monto no puede exceder el total de la factura')
      return
    }

    setSubmitting(true)
    try {
      await payMutation.mutateAsync({
        billId: billId!,
        data: { amount: numAmount, payment_method: paymentMethod },
      })
      toast.success('Pago registrado exitosamente')
      navigate(`/cards/${cardId}/bills`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al procesar el pago')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    )
  }

  if (!bill) {
    return (
      <motion.div {...fadeSlideUp} className="flex flex-col items-center justify-center py-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
          <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Factura no encontrada</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">La factura que buscas no existe</p>
        <button type="button" onClick={() => navigate(`/cards/${cardId}/bills`)} className="text-sm text-violet-500 hover:underline">
          Volver a facturas
        </button>
      </motion.div>
    )
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/20" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/20" />
        <div className="absolute left-1/3 bottom-0 h-60 w-60 rounded-full bg-fuchsia-500/5 blur-3xl dark:bg-fuchsia-500/10" />
      </div>

      <motion.div {...fadeSlideUp} className="relative">
        <button
          type="button"
          onClick={() => navigate(`/cards/${cardId}/bills`)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Facturas
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Pagar Factura
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {card?.name || 'Tarjeta'} — {bill.statement_date ? formatISODate(bill.statement_date, 'long') : ''}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500" />

            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-violet-500" />
              Detalles del Pago
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Monto a Pagar</label>
                <div className="relative mt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
                  <input
                    ref={inputRef}
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={parseFloat(bill.total_amount)}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="0.00"
                    className={cn(
                      'w-full pl-8 pr-4 py-3 rounded-xl border text-lg font-bold transition-all',
                      'bg-white/70 dark:bg-gray-800/70',
                      'text-gray-900 dark:text-gray-100',
                      focused
                        ? 'border-violet-500 ring-2 ring-violet-500/20 dark:ring-violet-500/30'
                        : 'border-gray-200 dark:border-gray-700',
                    )}
                  />
                </div>
              </div>

              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="flex gap-2"
              >
                {quickAmounts.map((qa) => (
                  <motion.button
                    key={qa.label}
                    variants={{
                      initial: { opacity: 0, scale: 0.95 },
                      animate: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setAmount(qa.value)}
                    className={cn(
                      'flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-all relative overflow-hidden',
                      amount === qa.value
                        ? 'border-violet-200 dark:border-violet-500/30 text-white'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
                    )}
                  >
                    {amount === qa.value && (
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600" />
                    )}
                    <span className="relative z-10">
                      {qa.label}: {formatCurrency(parseFloat(qa.value), card?.currency_code)}
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Metodo de Pago</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <motion.button
                      key={pm.value}
                      type="button"
                      whileHover={{ y: -1, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod(pm.value)}
                      className={cn(
                        'relative overflow-hidden rounded-xl border p-3 text-left transition-all',
                        paymentMethod === pm.value
                          ? 'border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10'
                          : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/30',
                      )}
                    >
                      {paymentMethod === pm.value && (
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5" />
                      )}
                      <div className="relative z-10">
                        <p className={cn(
                          'text-sm font-semibold',
                          paymentMethod === pm.value
                            ? 'text-violet-700 dark:text-violet-300'
                            : 'text-gray-700 dark:text-gray-300',
                        )}>
                          {pm.label}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{pm.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Button
                  onClick={handleSubmit}
                  isLoading={submitting}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full rounded-xl h-12 text-base gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
                >
                  <DollarSign className="h-5 w-5" />
                  Pagar {amount ? formatCurrency(parseFloat(amount), card?.currency_code) : ''}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500" />

            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-violet-500" />
              Resumen
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700/50">
                <span className="text-sm text-gray-500">Total a Pagar</span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(bill.total_amount), card?.currency_code)}</span>
              </div>
              {bill.minimum_payment && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700/50">
                  <span className="text-sm text-gray-500">Pago Minimo</span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(parseFloat(bill.minimum_payment), card?.currency_code)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700/50">
                <span className="text-sm text-gray-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  Vencimiento
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {bill.due_date ? formatISODate(bill.due_date) : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500 flex items-center gap-1.5">
                  {isOverdue ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  ) : (
                    <CheckCircle className="h-3.5 w-3.5 text-gray-400" />
                  )}
                  Estado
                </span>
                <span className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
                  isOverdue ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : bill.payment_status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
                )}>
                  {isOverdue ? 'Vencida' : bill.payment_status === 'paid' ? 'Pagada' : 'Pendiente'}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-5"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500" />

            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-violet-500" />
              Tarjeta
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-md">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{card?.name || '—'}</p>
                {card?.last_four_digits && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">**** {card.last_four_digits}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
