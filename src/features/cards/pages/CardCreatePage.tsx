import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, CreditCard as DebitCardIcon } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useCreateCard } from '../hooks/useCards'
import { useCreateDebitCard } from '@/features/debitCards/hooks/useDebitCards'
import CardForm from '../components/CardForm'
import DebitCardForm from '@/features/debitCards/components/DebitCardForm'
import type { CreateCardRequest } from '@/types/cards'
import type { CreateDebitCardRequest } from '@/types/debitCards'

type CardType = 'credit' | 'debit'

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

const TYPE_OPTIONS: { value: CardType; label: string; desc: string; icon: typeof CreditCard }[] = [
  { value: 'credit', label: 'Credito', desc: 'Linea de credito con limite', icon: CreditCard },
  { value: 'debit', label: 'Debito', desc: 'Vinculada a una cuenta de banco', icon: DebitCardIcon },
]

export default function CardCreatePage() {
  const navigate = useNavigate()
  const [cardType, setCardType] = useState<CardType>('credit')
  const createCreditMutation = useCreateCard()
  const createDebitMutation = useCreateDebitCard()

  const handleCreditSubmit = async (data: CreateCardRequest) => {
    try {
      const result = await createCreditMutation.mutateAsync(data)
      toast.success('Tarjeta de credito creada exitosamente')
      navigate(`/cards/${result.id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear tarjeta'
      toast.error(message)
    }
  }

  const handleDebitSubmit = async (data: CreateDebitCardRequest) => {
    try {
      const result = await createDebitMutation.mutateAsync(data)
      toast.success('Tarjeta de debito creada exitosamente')
      navigate(`/accounts/${result.account_id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear tarjeta'
      toast.error(message)
    }
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
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20 ring-1 ring-white/10">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              Nueva Tarjeta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {cardType === 'credit'
                ? 'Agrega una nueva tarjeta de credito'
                : 'Vincula una tarjeta de debito a una cuenta'}
            </p>
          </div>
        </motion.div>

        {/* Card type selector */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const isSelected = cardType === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCardType(opt.value)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 p-4 transition-all',
                    isSelected
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                  )}
                >
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    isSelected ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400',
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className={cn(
                      'text-sm font-semibold',
                      isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300',
                    )}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6">
          {cardType === 'credit' ? (
            <CardForm onSubmit={handleCreditSubmit} loading={createCreditMutation.isPending} onCancel={() => navigate(-1)} />
          ) : (
            <DebitCardForm onSubmit={handleDebitSubmit} loading={createDebitMutation.isPending} onCancel={() => navigate(-1)} />
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
