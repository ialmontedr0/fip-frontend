import { cn, formatCurrency } from '@/lib/utils'
import { CARD_NETWORK_CONFIG } from '../constants'
import { CreditCard, Edit3, Trash2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { CreditCardResponse } from '@/types/expenses'

interface Props {
  card: CreditCardResponse
  onEdit: (card: CreditCardResponse) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
  className?: string
}

export default function CreditCardCard({ card, onEdit, onDelete, className }: Props) {
  const [showNumber, setShowNumber] = useState(false)
  const networkConfig = card.card_network ? CARD_NETWORK_CONFIG[card.card_network as keyof typeof CARD_NETWORK_CONFIG] : undefined

  return (
    <div
      className={cn(
        'rounded-2xl p-5 text-white relative overflow-hidden transition-all duration-300 hover:shadow-xl group',
        card.color || 'bg-gradient-to-br from-gray-800 to-gray-900',
        className,
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-white/80" />
            {networkConfig && (
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">{networkConfig.label}</span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(card)} className="rounded-lg p-1 hover:bg-white/10 transition-colors">
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => onDelete(card.id)} className="rounded-lg p-1 hover:bg-white/10 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="text-lg font-bold tracking-wider mb-1">
          {card.name}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <p className="font-mono text-sm tracking-[3px] text-white/70">
            {showNumber && card.last_four_digits
              ? `**** **** **** ${card.last_four_digits}`
              : '**** **** **** ****'}
          </p>
          <button
            onClick={() => setShowNumber(!showNumber)}
            className="text-white/50 hover:text-white/80 transition-colors"
          >
            {showNumber ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-white/70">
          <div>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Limite</span>
            <p className="font-semibold text-white/90">{formatCurrency(card.credit_limit)}</p>
          </div>
          {card.available_credit && (
            <div className="text-right">
              <span className="text-[10px] text-white/50 uppercase tracking-wider">Disponible</span>
              <p className="font-semibold text-white/90">{formatCurrency(card.available_credit)}</p>
            </div>
          )}
        </div>

        {(card.statement_day || card.payment_due_day) && (
          <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-white/50">
            {card.statement_day && <>Corte dia {card.statement_day}</>}
            {card.statement_day && card.payment_due_day && <> | </>}
            {card.payment_due_day && <>Vence dia {card.payment_due_day}</>}
          </div>
        )}
      </div>
    </div>
  )
}
