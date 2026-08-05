import { motion } from 'framer-motion'
import { useState } from 'react'
import { format, isPast } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Wallet, Edit3, Trash2, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react'
import BillStatusBadge from './BillStatusBadge'
import { formatCurrency, cn, parseISODate } from '@/lib/utils'
import { Button } from '@/components/ui'
import type { BillResponse } from '@/types/cards'

interface BillCardProps {
  bill: BillResponse
  currencyCode?: string
  onPay?: () => void
  onEdit?: () => void
  onDelete?: () => void
  index?: number
}

export default function BillCard({ bill, currencyCode, onPay, onEdit, onDelete, index = 0 }: BillCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const dueDate = parseISODate(bill.due_date)
  const isOverdue = isPast(dueDate) && bill.payment_status !== 'paid'
  const totalAmount = parseFloat(bill.total_amount)
  const amountPaid = parseFloat(bill.amount_paid)
  const pctPaid = totalAmount > 0 ? Math.min((amountPaid / totalAmount) * 100, 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-white/80 dark:bg-gray-800/70 backdrop-blur-xl shadow-sm transition-all duration-300',
        isHovered ? 'shadow-xl shadow-gray-200/50 dark:shadow-gray-900/30 border-gray-200 dark:border-gray-700/50' : 'border-gray-100 dark:border-gray-700/30',
        isOverdue && 'border-red-200 dark:border-red-800/30 bg-red-50/40 dark:bg-red-900/10',
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02] pointer-events-none">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-violet-500 blur-3xl" />
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg border',
                isOverdue
                  ? 'bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-700/30 text-red-500'
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400',
              )}
            >
              {isOverdue ? <AlertCircle className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
            </motion.div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(parseISODate(bill.statement_date), 'dd MMM', { locale: es })}
              </span>
              <span className="text-gray-300 dark:text-gray-600">→</span>
              <span className={cn('inline-flex items-center gap-1', isOverdue && 'text-red-600 dark:text-red-400 font-semibold')}>
                <CreditCard className="h-3 w-3" />
                {format(dueDate, 'dd MMM', { locale: es })}
              </span>
            </div>
          </div>
          <BillStatusBadge status={bill.payment_status} />
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              {formatCurrency(bill.total_amount, currencyCode)}
            </p>
          </div>
          {bill.minimum_payment && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Pago minimo: <span className="font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(bill.minimum_payment, currencyCode)}</span>
            </p>
          )}
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
            <span className="flex items-center gap-1">
              <CheckCircle2 className={cn('h-3 w-3', pctPaid >= 100 ? 'text-emerald-500' : 'text-gray-400')} />
              Progreso de pago
            </span>
            <span className="font-medium">{pctPaid.toFixed(0)}%</span>
          </div>
          <div className="relative h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctPaid}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.07 + 0.2 }}
              className={cn(
                'h-full rounded-full bg-gradient-to-r',
                pctPaid >= 100
                  ? 'from-emerald-400 to-green-500'
                  : pctPaid > 0
                    ? 'from-blue-400 to-indigo-500'
                    : 'from-gray-300 to-gray-400',
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {formatCurrency(bill.amount_paid, currencyCode)} de {formatCurrency(bill.total_amount, currencyCode)}
          </span>

          <div className="flex items-center gap-1">
            {bill.payment_status !== 'paid' && onPay && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="sm" variant="default" onClick={(e) => { e.stopPropagation(); onPay() }}
                  className="rounded-lg text-xs gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-sm shadow-violet-500/20">
                  <Wallet className="h-3 w-3" />
                  Pagar
                </Button>
              </motion.div>
            )}
            {onEdit && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onEdit() }}
                  className="rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600">
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            )}
            {onDelete && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onDelete() }}
                  className="rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
