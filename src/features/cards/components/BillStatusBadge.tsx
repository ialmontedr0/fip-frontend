import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BillStatusBadgeProps {
  status: string
}

const STATUS_CONFIG: Record<string, { gradient: string; text: string; label: string; dot: string }> = {
  pending: { gradient: 'from-amber-400 to-orange-500', text: 'text-white', label: 'Pendiente', dot: 'bg-amber-400' },
  partial: { gradient: 'from-blue-400 to-indigo-500', text: 'text-white', label: 'Parcial', dot: 'bg-blue-400' },
  paid: { gradient: 'from-emerald-400 to-green-500', text: 'text-white', label: 'Pagado', dot: 'bg-emerald-400' },
  overdue: { gradient: 'from-red-400 to-rose-500', text: 'text-white', label: 'Vencido', dot: 'bg-red-400' },
  waived: { gradient: 'from-gray-400 to-gray-500', text: 'text-white', label: 'Condolido', dot: 'bg-gray-400' },
}

export default function BillStatusBadge({ status }: BillStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  if (!config) return null

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm',
        config.gradient,
        config.text,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </motion.span>
  )
}
