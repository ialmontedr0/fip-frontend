import { ArrowRightLeft, DollarSign, Percent, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import type { TransferActionParams, AmountType } from '@/types/automations'

interface Props {
  value: TransferActionParams | null
  onChange: (params: TransferActionParams) => void
}

const amountTypeOptions: { value: AmountType; label: string; icon: typeof DollarSign }[] = [
  { value: 'fixed', label: 'Fijo', icon: DollarSign },
  { value: 'percent_of_balance', label: '% Saldo', icon: Percent },
  { value: 'percent_of_surplus', label: '% Excedente', icon: Percent },
]

export default function TransferActionParams({ value, onChange }: Props) {
  const { data: accountsData } = useAccounts()
  const accounts = accountsData?.accounts ?? []
  const amountType = value?.amount_type ?? 'fixed'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
        <div className="group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Origen</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/20">
              <Wallet className="h-3 w-3 text-white" />
            </div>
            <select
              value={value?.source_account_id ?? ''}
              onChange={(e) => onChange({ ...value, source_account_id: e.target.value } as TransferActionParams)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
            >
              <option value="">Seleccionar...</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-center pb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 shadow-lg shadow-purple-500/20 animate-pulse">
            <ArrowRightLeft className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Destino</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <Wallet className="h-3 w-3 text-white" />
            </div>
            <select
              value={value?.target_account_id ?? ''}
              onChange={(e) => onChange({ ...value, target_account_id: e.target.value } as TransferActionParams)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all appearance-none"
            >
              <option value="">Seleccionar...</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Monto</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 shadow-lg shadow-violet-500/20">
            <DollarSign className="h-3 w-3 text-white" />
          </div>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value?.amount ?? ''}
            onChange={(e) => onChange({ ...value, amount: Number(e.target.value) } as TransferActionParams)}
            placeholder="0.00"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Tipo de monto</label>
        <div className="flex gap-2">
          {amountTypeOptions.map((opt) => {
            const Icon = opt.icon
            const isActive = amountType === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...value, amount_type: opt.value } as TransferActionParams)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95',
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/80 dark:bg-gray-800/80 border border-gray-100/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 hover:border-purple-200/50 dark:hover:border-purple-500/30',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
