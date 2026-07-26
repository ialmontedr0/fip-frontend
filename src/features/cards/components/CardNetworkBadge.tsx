import { motion } from 'framer-motion'

interface CardNetworkBadgeProps {
  network: string | null
}

const NETWORK_STYLES: Record<string, { gradient: string; text: string; label: string; icon: string }> = {
  visa: { gradient: 'from-[#1A1F71] to-[#2A2F91]', text: 'text-white', label: 'Visa', icon: '💳' },
  mastercard: { gradient: 'from-[#EB001B] to-orange-500', text: 'text-white', label: 'Mastercard', icon: '💳' },
  amex: { gradient: 'from-[#2E77BC] to-[#4A97DC]', text: 'text-white', label: 'Amex', icon: '🏦' },
}

export default function CardNetworkBadge({ network }: CardNetworkBadgeProps) {
  const config = network ? NETWORK_STYLES[network.toLowerCase()] : null

  if (!config) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
        —
      </span>
    )
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${config.gradient} ${config.text} px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase shadow-sm`}
    >
      <span className="opacity-80">{config.icon}</span>
      {config.label}
    </motion.span>
  )
}
