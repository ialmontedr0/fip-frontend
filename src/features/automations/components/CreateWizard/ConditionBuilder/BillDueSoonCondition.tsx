import { CreditCard, CalendarClock } from 'lucide-react'
import { useCardList } from '@/features/cards/hooks/useCards'
import type { BillDueSoonConditions } from '@/types/automations'

interface Props {
  value: BillDueSoonConditions | null
  onChange: (conditions: BillDueSoonConditions) => void
}

export default function BillDueSoonCondition({ value, onChange }: Props) {
  const { data: cardsData } = useCardList()

  return (
    <div className="space-y-4">
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Tarjeta</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/20">
            <CreditCard className="h-3 w-3 text-white" />
          </div>
          <select
            value={value?.card_id ?? ''}
            onChange={(e) => onChange({ ...value, card_id: e.target.value } as BillDueSoonConditions)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
          >
            <option value="">Seleccionar tarjeta...</option>
            {cardsData?.cards?.map((card) => (
              <option key={card.id} value={card.id}>{card.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
          Días antes del vencimiento
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-600 shadow-lg shadow-rose-500/20">
            <CalendarClock className="h-3 w-3 text-white" />
          </div>
          <input
            type="number"
            min={1}
            max={30}
            value={value?.days_before_due ?? ''}
            onChange={(e) => onChange({ ...value, days_before_due: Number(e.target.value) } as BillDueSoonConditions)}
            placeholder="5"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
          />
        </div>
      </div>
    </div>
  )
}
