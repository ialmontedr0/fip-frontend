import { CreditCard, Wallet, DollarSign, PiggyBank, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCardList } from '@/features/cards/hooks/useCards'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import type { PayCreditCardActionParams, PaymentType } from '@/types/automations'

interface Props {
  value: PayCreditCardActionParams | null
  onChange: (params: PayCreditCardActionParams) => void
}

const paymentTypeOptions: { value: PaymentType; label: string; icon: typeof DollarSign; desc: string }[] = [
  { value: 'full', label: 'Pago total', icon: PiggyBank, desc: 'Saldo completo' },
  { value: 'minimum', label: 'Pago mínimo', icon: Sparkles, desc: 'Pago mínimo requerido' },
  { value: 'custom', label: 'Personalizado', icon: DollarSign, desc: 'Monto específico' },
]

export default function PayCreditCardActionParams({ value, onChange }: Props) {
  const { data: cardsData } = useCardList()
  const { data: accountsData } = useAccounts()
  const paymentType = value?.payment_type ?? 'full'

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
            onChange={(e) => onChange({ ...value, card_id: e.target.value } as PayCreditCardActionParams)}
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
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Cuenta de pago</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <Wallet className="h-3 w-3 text-white" />
          </div>
          <select
            value={value?.payment_account_id ?? ''}
            onChange={(e) => onChange({ ...value, payment_account_id: e.target.value } as PayCreditCardActionParams)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
          >
            <option value="">Seleccionar cuenta...</option>
            {accountsData?.accounts?.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Tipo de pago</label>
        <div className="grid grid-cols-3 gap-2">
          {paymentTypeOptions.map((opt) => {
            const Icon = opt.icon
            const isActive = paymentType === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...value, payment_type: opt.value } as PayCreditCardActionParams)}
                className={cn(
                  'flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95',
                  isActive
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/80 dark:bg-gray-800/80 border border-gray-100/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 hover:border-purple-200/50 dark:hover:border-purple-500/30',
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-gray-400')} />
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      {paymentType === 'custom' && (
        <div className="animate-slide-up">
          <div className="group">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Monto personalizado</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/20">
                <DollarSign className="h-3 w-3 text-white" />
              </div>
              <input
                type="number"
                min={0}
                step="0.01"
                value={value?.custom_amount ?? ''}
                onChange={(e) => onChange({ ...value, custom_amount: Number(e.target.value) } as PayCreditCardActionParams)}
                placeholder="0.00"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
