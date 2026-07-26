import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, CreditCard, Search, ToggleLeft, ToggleRight,
  DollarSign, Activity, FileText, Bell,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useCardSummary, useCardList } from '../hooks/useCards'
import CardCard from '../components/CardCard'
import type { CardSummaryResponse } from '@/types/cards'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const statCardHover = {
  whileHover: { scale: 1.02, y: -2, transition: { duration: 0.3, ease: "easeOut" as const } },
}

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

export default function CardListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  const filters = { is_active: showInactive ? undefined : true }
  const { data, isLoading } = useCardList(filters)
  const { data: summary } = useCardSummary()

  const cards = data?.cards || []

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return cards
    const q = searchQuery.toLowerCase()
    return cards.filter((c) => c.name.toLowerCase().includes(q))
  }, [cards, searchQuery])

  const summaryData = summary as CardSummaryResponse | undefined

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative space-y-6 pb-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/3 h-60 w-60 rounded-full bg-pink-500/5 blur-3xl dark:bg-pink-500/10"
        />
      </div>

      {summaryData && !isLoading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          <motion.div
            whileHover={statCardHover}
            variants={fadeUp}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500" />
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
              <CreditCard className="h-4 w-4 text-violet-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{summaryData.total_cards}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Tarjetas</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={statCardHover}
            variants={fadeUp}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{formatCurrency(parseFloat(summaryData.total_credit_limit))}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Limite total</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={statCardHover}
            variants={fadeUp}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <Activity className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{parseFloat(summaryData.average_utilization_pct).toFixed(1)}%</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Uso promedio</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={statCardHover}
            variants={fadeUp}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-rose-500" />
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
              <FileText className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{summaryData.unpaid_bills}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Facturas pend.</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={statCardHover}
            variants={fadeUp}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <Bell className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{summaryData.unread_alerts}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Alertas</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div variants={fadeUp} className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20 ring-1 ring-white/10"
            >
              <CreditCard className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Tarjetas de Credito</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data?.total != null ? `${data.total} tarjeta${data.total !== 1 ? 's' : ''}` : 'Gestiona tus tarjetas'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={() => setShowInactive(!showInactive)}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  showInactive
                    ? 'border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400'
                    : 'border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
                )}
              >
                {showInactive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                Inactivas
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={() => navigate('/cards/new')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Nueva Tarjeta
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="relative" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <motion.input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tarjetas..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all"
            whileFocus={{ scale: 1.005 }}
          />
          {searchQuery && (
            <motion.button
              type="button"
              onClick={() => setSearchQuery('')}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </motion.button>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
        style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
      >
        {isLoading ? (
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} variants={skeletonVariants} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse" />
                  </div>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                <div className="flex gap-2 mt-3">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : filtered.length > 0 ? (
          <>
            {searchQuery && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-gray-500 dark:text-gray-400 mb-3"
              >
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{searchQuery}"
              </motion.p>
            )}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((card, idx) => (
                <CardCard key={card.id} card={card} index={idx} onClick={() => navigate(`/cards/${card.id}`)} />
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4"
            >
              <CreditCard className="h-8 w-8 text-gray-400" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
            >
              {searchQuery ? `Sin resultados para "${searchQuery}"` : 'No tienes tarjetas aun'}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md"
            >
              {searchQuery ? 'Intenta con otros terminos de busqueda' : 'Agrega tu primera tarjeta de credito para comenzar a gestionar tus finanzas'}
            </motion.p>
            {!searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="button"
                  onClick={() => navigate('/cards/new')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Nueva Tarjeta
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}