import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCard, useUpdateCard } from '../hooks/useCards'
import CardForm from '../components/CardForm'
import type { CreateCardRequest } from '@/types/cards'

const stagger: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function CardEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: card, isLoading } = useCard(id!)
  const updateMutation = useUpdateCard()

  const handleSubmit = async (data: CreateCardRequest) => {
    if (!id) return
    try {
      await updateMutation.mutateAsync({ id, data })
      toast.success('Tarjeta actualizada exitosamente')
      navigate(`/cards/${id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar tarjeta'
      toast.error(message)
    }
  }

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative space-y-6 pb-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
          <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl dark:bg-purple-500/10" />
        </div>
        <div className="relative space-y-4 animate-pulse">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <div className="p-6 space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!card) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <CreditCard className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          Tarjeta no encontrada
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 dark:text-gray-400 mb-4"
        >
          La tarjeta que buscas no existe o ha sido eliminada
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button type="button" onClick={() => navigate('/cards')} className="text-sm text-violet-500 hover:underline">
            Volver a tarjetas
          </button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div initial="initial" animate="animate" variants={stagger} className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/20"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/20"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/3 h-60 w-60 rounded-full bg-pink-500/5 blur-3xl dark:bg-pink-500/10"
        />
      </div>

      <div className="relative">
        <motion.div variants={fadeUp}>
          <button
            type="button"
            onClick={() => navigate(`/cards/${id}`)}
            className="group inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver a Detalle
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20 ring-1 ring-white/10">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              Editar Tarjeta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {card.name}
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
          <CardForm
            onSubmit={handleSubmit}
            loading={updateMutation.isPending}
            initialData={card}
            onCancel={() => navigate(`/cards/${id}`)}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
