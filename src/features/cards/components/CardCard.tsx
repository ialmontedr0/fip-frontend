import { motion } from 'framer-motion'
import { CreditCard, CalendarDays, Calendar, TrendingUp, ArrowUpRight } from 'lucide-react'
import UtilizationGauge from './UtilizationGauge'
import CardNetworkBadge from './CardNetworkBadge'
import { formatCurrency } from '@/lib/utils'
import type { CardListItem } from '@/types/cards'

interface CardCardProps {
  card: CardListItem
  onClick?: () => void
  index?: number
}

export default function CardCard({ card, onClick, index = 0 }: CardCardProps) {
  const used = (Number(card.credit_limit) || 0) - (Number(card.available_credit) || 0)
  const utilPct = card.credit_limit && Number(card.credit_limit) > 0
    ? Math.min((used / Number(card.credit_limit)) * 100, 100)
    : 0

  const status = utilPct > 80 ? 'danger' : utilPct > 50 ? 'warning' : 'healthy'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.3 } }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.() }}
      className="group relative cursor-pointer"
    >
      <div className="relative bg-white/80 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/30">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-500 blur-3xl" />
        </div>

        <div className="relative p-5">
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <UtilizationGauge
                percentage={utilPct}
                size={80}
                status={status}
                animate={false}
              />
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <CreditCard className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{card.name}</h3>
                {!card.is_active && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shrink-0">
                    Inactiva
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2.5">
                <CardNetworkBadge network={card.card_network} />
                {card.last_four_digits && (
                  <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                    **** {card.last_four_digits}
                  </span>
                )}
              </div>

              {card.credit_limit && (
                <div className="flex items-center gap-1.5 text-xs">
                  <TrendingUp className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">Limite:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(card.credit_limit, card.currency_code)}
                  </span>
                </div>
              )}
            </div>

            <motion.div
              whileHover={{ x: 3, opacity: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ArrowUpRight className="h-5 w-5 text-violet-500" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.07 + 0.2 }}
            className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/30"
          >
            {card.statement_day && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <CalendarDays className="h-3 w-3" />
                Corte dia {card.statement_day}
              </span>
            )}
            {card.payment_due_day && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                Pago dia {card.payment_due_day}
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
